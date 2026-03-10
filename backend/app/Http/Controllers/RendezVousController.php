<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RendezVous;
use App\Models\Notification;

class RendezVousController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $rdvs = RendezVous::with(['client', 'service', 'agence'])
            ->when($request->client_id, fn($q) => $q->where('client_id', $request->client_id))
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->statut,    fn($q) => $q->where('statut', $request->statut))
            ->orderBy('date_rdv', 'asc')
            ->get();

        return response()->json(['rendez_vous' => $rdvs], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉER UN RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'agence_id'  => 'required|exists:agences,id',
            'date_rdv'   => 'required|date|after:now',
            'notes'      => 'nullable|string',
        ]);

        $rdv = RendezVous::create([
            'client_id'  => $request->user()->id,
            'service_id' => $request->service_id,
            'agence_id'  => $request->agence_id,
            'date_rdv'   => $request->date_rdv,
            'statut'     => 'en_attente',
            'notes'      => $request->notes,
        ]);

        // Notifier le client
        Notification::create([
            'utilisateur_id' => $request->user()->id,
            'message'        => 'Votre rendez-vous a été enregistré pour le ' . $rdv->date_rdv->format('d/m/Y à H:i'),
            'type'           => 'confirmation',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message'     => 'Rendez-vous créé avec succès.',
            'rendez_vous' => $rdv->load(['client', 'service', 'agence'])
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UN RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $rdv = RendezVous::with(['client', 'service', 'agence'])->findOrFail($id);

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
        $rdv->update(['statut' => $request->statut]);

        // Notifier le client
        Notification::create([
            'utilisateur_id' => $rdv->client_id,
            'message'        => 'Votre rendez-vous du ' . $rdv->date_rdv->format('d/m/Y') . ' est maintenant : ' . $request->statut,
            'type'           => 'info',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message'     => 'Statut mis à jour.',
            'rendez_vous' => $rdv
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UN RENDEZ-VOUS
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $rdv = RendezVous::findOrFail($id);
        $rdv->delete();

        return response()->json([
            'message' => 'Rendez-vous supprimé avec succès.'
        ], 200);
    }
}