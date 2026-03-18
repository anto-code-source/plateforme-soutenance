<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;
use App\Models\Creneau;
use App\Models\Agence;
use App\Models\Notification;
use Carbon\Carbon;

class RendezVousController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $rdvs = RendezVous::with(['client', 'service', 'agence', 'creneau'])
            ->when($request->client_id, fn($q) => $q->where('client_id', $request->client_id))
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->statut,    fn($q) => $q->where('statut', $request->statut))
            ->orderBy('date_rdv', 'asc')
            ->get();

        return response()->json(['rendez_vous' => $rdvs], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉER UN RENDEZ-VOUS AVEC GESTION DES CONFLITS
    // ══════════════════════════════════════════════════════
    public function store(Request $request)
    {
        $request->validate([
            'service_id'      => 'required|exists:services,id',
            'agence_id'       => 'required|exists:agences,id',
            'heure_souhaitee' => 'required|date|after:now',
            'notes'           => 'nullable|string',
        ]);

        $heureSouhaitee = Carbon::parse($request->heure_souhaitee);
        $agence         = Agence::findOrFail($request->agence_id);
        $heureFermeture = Carbon::parse(
            $heureSouhaitee->format('Y-m-d') . ' ' . $agence->heure_fermeture
        );

        // ──────────────────────────────────────────────────
        // ÉTAPE 1 : Vérifier si un créneau est disponible
        //           à l'heure souhaitée
        // ──────────────────────────────────────────────────
        $creneau = Creneau::disponibles()
            ->pourAgenceEtService($request->agence_id, $request->service_id)
            ->where('heure_debut', $heureSouhaitee)
            ->first();

        // ──────────────────────────────────────────────────
        // ÉTAPE 2 : Créneau disponible → assigner un agent
        // ──────────────────────────────────────────────────
        if ($creneau) {
            return $this->confirmerRdv(
                $request,
                $creneau,
                $heureSouhaitee,
                $heureSouhaitee,
                0
            );
        }

        // ──────────────────────────────────────────────────
        // ÉTAPE 3 : Plusieurs clients même créneau
        //           → géré par capacite_max (agents dispo)
        // ──────────────────────────────────────────────────
        $creneauMemeHeure = Creneau::pourAgenceEtService($request->agence_id, $request->service_id)
            ->where('heure_debut', $heureSouhaitee)
            ->where('statut', 'complet')
            ->first();

        if ($creneauMemeHeure) {

            // ──────────────────────────────────────────────
            // ÉTAPE 4 : Tous agents occupés → décaler de 20 min
            //           et notifier le client
            // ──────────────────────────────────────────────
            $decalage      = $agence->duree_creneau_minutes;
            $nouvelleHeure = $heureSouhaitee->copy()->addMinutes($decalage);

            // Vérifier que le créneau décalé est avant 18h
            if ($nouvelleHeure->greaterThanOrEqualTo($heureFermeture)) {

                // ──────────────────────────────────────────
                // ÉTAPE 5 : Tout plein jusqu'à 18h
                //           → proposer prochain créneau dispo
                // ──────────────────────────────────────────
                $prochainCreneau = Creneau::disponibles()
                    ->pourAgenceEtService($request->agence_id, $request->service_id)
                    ->where('heure_debut', '>', $heureFermeture)
                    ->orderBy('heure_debut', 'asc')
                    ->first();

                $message = $prochainCreneau
                    ? 'Aucun créneau disponible aujourd\'hui. Prochain créneau le ' .
                      Carbon::parse($prochainCreneau->heure_debut)->format('d/m/Y à H:i') . '.'
                    : 'Aucun créneau disponible. Veuillez contacter l\'agence.';

                Notification::create([
                    'utilisateur_id' => $request->user()->id,
                    'message'        => $message,
                    'type'           => 'proposition',
                    'statut'         => 'non_lue',
                ]);

                return response()->json([
                    'message'          => $message,
                    'prochain_creneau' => $prochainCreneau,
                ], 200);
            }

            // Chercher un créneau disponible au nouvel horaire
            $creneauDecale = Creneau::disponibles()
                ->pourAgenceEtService($request->agence_id, $request->service_id)
                ->where('heure_debut', $nouvelleHeure)
                ->first();

            if ($creneauDecale) {
                Notification::create([
                    'utilisateur_id' => $request->user()->id,
                    'message'        => 'Créneau complet. Votre RDV a été décalé de ' .
                                        $decalage . ' min → ' . $nouvelleHeure->format('H:i') . '.',
                    'type'           => 'decalage',
                    'statut'         => 'non_lue',
                ]);

                return $this->confirmerRdv(
                    $request,
                    $creneauDecale,
                    $heureSouhaitee,
                    $nouvelleHeure,
                    $decalage
                );
            }
        }

        return response()->json([
            'message' => 'Aucun créneau disponible pour ce service à cette heure.',
        ], 422);
    }

    // ══════════════════════════════════════════════════════
    // CONFIRMER LE RENDEZ-VOUS (étapes 2 et 4)
    // ══════════════════════════════════════════════════════
    private function confirmerRdv(
        Request $request,
        Creneau $creneau,
        Carbon $heureSouhaitee,
        Carbon $heureReelle,
        int $decalage
    ) {
        $creneau->reserver();

        $rdv = RendezVous::create([
            'client_id'        => $request->user()->id,
            'service_id'       => $request->service_id,
            'agence_id'        => $request->agence_id,
            'creneau_id'       => $creneau->id,
            'date_rdv'         => $heureReelle,
            'heure_souhaitee'  => $heureSouhaitee,
            'heure_reelle'     => $heureReelle,
            'decalage_minutes' => $decalage,
            'statut'           => 'en_attente',
            'notes'            => $request->notes,
        ]);

        Notification::create([
            'utilisateur_id' => $request->user()->id,
            'message'        => 'Votre rendez-vous est confirmé pour le ' .
                                 $heureReelle->format('d/m/Y à H:i') . '.',
            'type'           => 'confirmation',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message'     => 'Rendez-vous créé avec succès.',
            'rendez_vous' => $rdv->load(['client', 'service', 'agence', 'creneau']),
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UN RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $rdv = RendezVous::with(['client', 'service', 'agence', 'creneau'])->findOrFail($id);

        return response()->json(['rendez_vous' => $rdv], 200);
    }

    // ══════════════════════════════════════════════════════
    // MODIFIER STATUT RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,confirmé,annulé,terminé',
        ]);

        $rdv = RendezVous::findOrFail($id);

        // Si annulé → libérer la place dans le créneau
        if ($request->statut === 'annulé' && $rdv->creneau_id) {
            $rdv->creneau->liberer();
        }

        $rdv->update(['statut' => $request->statut]);

        Notification::create([
            'utilisateur_id' => $rdv->client_id,
            'message'        => 'Votre rendez-vous du ' . $rdv->date_rdv->format('d/m/Y') .
                                 ' est maintenant : ' . $request->statut,
            'type'           => 'info',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message'     => 'Statut mis à jour.',
            'rendez_vous' => $rdv,
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UN RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $rdv = RendezVous::findOrFail($id);

        // Libérer la place dans le créneau
        if ($rdv->creneau_id) {
            $rdv->creneau->liberer();
        }

        $rdv->delete();

        return response()->json([
            'message' => 'Rendez-vous supprimé avec succès.',
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉNEAUX DISPONIBLES (affichage côté client)
    // ══════════════════════════════════════════════════════
    public function creneauxDisponibles(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'agence_id'  => 'required|exists:agences,id',
            'date'       => 'required|date',
        ]);

        $creneaux = Creneau::disponibles()
            ->pourAgenceEtService($request->agence_id, $request->service_id)
            ->whereDate('heure_debut', $request->date)
            ->orderBy('heure_debut', 'asc')
            ->get();

        return response()->json(['creneaux' => $creneaux], 200);
    }
}