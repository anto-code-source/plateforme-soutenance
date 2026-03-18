<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Creneau;
use App\Models\Agence;
use App\Models\Agent;
use Carbon\Carbon;

class CreneauController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES CRÉNEAUX
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $creneaux = Creneau::with(['service', 'agence', 'manager'])
            ->when($request->agence_id,  fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->service_id, fn($q) => $q->where('service_id', $request->service_id))
            ->when($request->statut,     fn($q) => $q->where('statut', $request->statut))
            ->when($request->date,       fn($q) => $q->whereDate('heure_debut', $request->date))
            ->orderBy('heure_debut', 'asc')
            ->get();

        return response()->json(['creneaux' => $creneaux], 200);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UN CRÉNEAU
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $creneau = Creneau::with(['service', 'agence', 'manager', 'rendezVous'])
            ->findOrFail($id);

        return response()->json(['creneau' => $creneau], 200);
    }

    // ══════════════════════════════════════════════════════
    // GÉNÉRER LES CRÉNEAUX DU JOUR (Manager)
    // ══════════════════════════════════════════════════════
    public function generer(Request $request)
    {
        $request->validate([
            'agence_id'  => 'required|exists:agences,id',
            'service_id' => 'required|exists:services,id',
            'date'       => 'required|date|after_or_equal:today',
        ]);

        $agence = Agence::findOrFail($request->agence_id);

        // Heure d'ouverture et fermeture de l'agence
        $heureOuverture = Carbon::parse($request->date . ' ' . $agence->heure_ouverture);
        $heureFermeture = Carbon::parse($request->date . ' ' . $agence->heure_fermeture);
        $duree          = $agence->duree_creneau_minutes;

        // Compter les agents disponibles sur ce service
        $nbAgentsDisponibles = Agent::where('agence_id', $request->agence_id)
            ->where('service_id', $request->service_id)
            ->where('disponible', true)
            ->count();

        if ($nbAgentsDisponibles === 0) {
            return response()->json([
                'message' => 'Aucun agent disponible pour ce service. Impossible de générer les créneaux.',
            ], 422);
        }

        // Supprimer les anciens créneaux du même jour si déjà générés
        Creneau::where('agence_id', $request->agence_id)
            ->where('service_id', $request->service_id)
            ->whereDate('heure_debut', $request->date)
            ->delete();

        // Générer les créneaux de heure_ouverture à heure_fermeture
        $creneaux      = [];
        $heureActuelle = $heureOuverture->copy();

        while ($heureActuelle->lessThan($heureFermeture)) {
            $heureFin = $heureActuelle->copy()->addMinutes($duree);

            // Ne pas dépasser l'heure de fermeture
            if ($heureFin->greaterThan($heureFermeture)) {
                break;
            }

            $creneau = Creneau::create([
                'agence_id'         => $request->agence_id,
                'service_id'        => $request->service_id,
                'manager_id'        => $request->user()->id,
                'heure_debut'       => $heureActuelle,
                'heure_fin'         => $heureFin,
                'capacite_max'      => $nbAgentsDisponibles,
                'capacite_actuelle' => 0,
                'est_disponible'    => true,
                'statut'            => 'ouvert',
            ]);

            $creneaux[] = $creneau;

            // Passer au créneau suivant
            $heureActuelle->addMinutes($duree);
        }

        return response()->json([
            'message'          => count($creneaux) . ' créneau(x) générés avec succès.',
            'creneaux'         => $creneaux,
            'agents_dispo'     => $nbAgentsDisponibles,
            'heure_ouverture'  => $agence->heure_ouverture,
            'heure_fermeture'  => $agence->heure_fermeture,
            'duree_creneau'    => $duree . ' min',
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // MODIFIER STATUT D'UN CRÉNEAU (Manager)
    // ══════════════════════════════════════════════════════
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:ouvert,complet,fermé,terminé',
        ]);

        $creneau = Creneau::findOrFail($id);

        $creneau->update([
            'statut'        => $request->statut,
            'est_disponible' => $request->statut === 'ouvert',
        ]);

        return response()->json([
            'message' => 'Statut du créneau mis à jour.',
            'creneau' => $creneau,
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UN CRÉNEAU (Manager)
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $creneau = Creneau::findOrFail($id);

        // Vérifier qu'aucun rendez-vous n'est lié à ce créneau
        if ($creneau->rendezVous()->count() > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer ce créneau : des rendez-vous y sont liés.',
            ], 422);
        }

        $creneau->delete();

        return response()->json([
            'message' => 'Créneau supprimé avec succès.',
        ], 200);
    }
}