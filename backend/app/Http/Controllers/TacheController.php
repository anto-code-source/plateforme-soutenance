<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tache;
use App\Models\Notification;
use App\Models\Alerte;

class TacheController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES TÂCHES
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $taches = Tache::with(['service', 'agent', 'client'])
            ->when($request->agent_id,  fn($q) => $q->where('agent_id', $request->agent_id))
            ->when($request->statut,    fn($q) => $q->where('statut', $request->statut))
            ->when($request->priorite,  fn($q) => $q->where('priorite', $request->priorite))
            ->orderByRaw("FIELD(priorite, 'haute', 'normale', 'basse')")
            ->get();

        return response()->json(['taches' => $taches], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉER UNE TÂCHE
    // ══════════════════════════════════════════════════════
    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'agent_id'   => 'required|exists:utilisateurs,id',
            'client_id'  => 'required|exists:utilisateurs,id',
            'priorite'   => 'required|in:haute,normale,basse',
            'notes'      => 'nullable|string',
        ]);

        $tache = Tache::create([
            'service_id' => $request->service_id,
            'agent_id'   => $request->agent_id,
            'client_id'  => $request->client_id,
            'priorite'   => $request->priorite,
            'statut'     => 'en_attente',
            'notes'      => $request->notes,
        ]);

        // Notifier l'agent
        Notification::create([
            'utilisateur_id' => $request->agent_id,
            'message'        => 'Une nouvelle tâche vous a été assignée avec priorité : ' . $request->priorite,
            'type'           => 'alerte',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message' => 'Tâche créée avec succès.',
            'tache'   => $tache->load(['service', 'agent', 'client'])
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UNE TÂCHE
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $tache = Tache::with(['service', 'agent', 'client'])->findOrFail($id);

        return response()->json(['tache' => $tache], 200);
    }

    // ══════════════════════════════════════════════════════
    // MODIFIER STATUT TÂCHE
    // ══════════════════════════════════════════════════════
    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:en_attente,en_cours,terminé,annulé',
        ]);

        $tache = Tache::findOrFail($id);

        $data = ['statut' => $request->statut];

        // Si terminé, enregistrer la date de fin
        if ($request->statut === 'terminé') {
            $data['date_fin'] = now();
        }

        $tache->update($data);

        return response()->json([
            'message' => 'Statut de la tâche mis à jour.',
            'tache'   => $tache
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // ASSIGNER UNE TÂCHE À UN AGENT
    // ══════════════════════════════════════════════════════
    public function assigner(Request $request, $id)
    {
        $request->validate([
            'agent_id' => 'required|exists:utilisateurs,id',
        ]);

        $tache = Tache::findOrFail($id);
        $tache->update(['agent_id' => $request->agent_id]);

        // Notifier le nouvel agent
        Notification::create([
            'utilisateur_id' => $request->agent_id,
            'message'        => 'Une tâche vous a été assignée.',
            'type'           => 'info',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message' => 'Tâche assignée avec succès.',
            'tache'   => $tache->load(['service', 'agent', 'client'])
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // MES TÂCHES (AGENT CONNECTÉ)
    // ══════════════════════════════════════════════════════
    public function mesTaches(Request $request)
    {
        $taches = Tache::with(['service', 'client'])
            ->where('agent_id', $request->user()->id)
            ->whereIn('statut', ['en_attente', 'en_cours'])
            ->orderByRaw("FIELD(priorite, 'haute', 'normale', 'basse')")
            ->get();

        return response()->json(['taches' => $taches], 200);
    }
}