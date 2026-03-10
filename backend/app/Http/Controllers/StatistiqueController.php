<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tache;
use App\Models\TicketFile;
use App\Models\Utilisateur;
use App\Models\HistoriqueOperation;
use Illuminate\Support\Facades\DB;

class StatistiqueController extends Controller
{
    // ══════════════════════════════════════════════════════
    // STATISTIQUES GLOBALES (DIRECTEUR)
    // ══════════════════════════════════════════════════════
    public function global(Request $request)
    {
        $agence_id = $request->agence_id;

        $stats = [
            'total_clients'   => Utilisateur::where('role', 'client')->count(),
            'total_agents'    => Utilisateur::where('role', 'agent')->count(),
            'total_tickets'   => TicketFile::when($agence_id, fn($q) => $q->where('agence_id', $agence_id))->count(),
            'tickets_aujourd_hui' => TicketFile::when($agence_id, fn($q) => $q->where('agence_id', $agence_id))
                ->whereDate('created_at', today())->count(),
            'taches_en_cours' => Tache::where('statut', 'en_cours')->count(),
            'taches_terminees' => Tache::where('statut', 'terminé')->count(),
        ];

        return response()->json(['statistiques' => $stats], 200);
    }

    // ══════════════════════════════════════════════════════
    // PERFORMANCE DES AGENTS
    // ══════════════════════════════════════════════════════
    public function performanceAgents(Request $request)
    {
        $agents = Utilisateur::where('role', 'agent')
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->withCount([
                'tachesAgent as taches_total',
                'tachesAgent as taches_terminees' => fn($q) => $q->where('statut', 'terminé'),
                'tachesAgent as taches_en_cours'  => fn($q) => $q->where('statut', 'en_cours'),
            ])
            ->get()
            ->map(function ($agent) {
                // Calculer le temps moyen de traitement
                $tempsMoyen = Tache::where('agent_id', $agent->id)
                    ->where('statut', 'terminé')
                    ->whereNotNull('date_fin')
                    ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, date_fin)) as temps_moyen')
                    ->value('temps_moyen');

                $agent->temps_moyen_minutes = round($tempsMoyen ?? 0, 1);
                return $agent;
            });

        return response()->json(['agents' => $agents], 200);
    }

    // ══════════════════════════════════════════════════════
    // STATISTIQUES FILE D'ATTENTE
    // ══════════════════════════════════════════════════════
    public function fileAttente(Request $request)
    {
        $request->validate([
            'agence_id' => 'required|exists:agences,id',
        ]);

        $stats = [
            'en_attente' => TicketFile::where('agence_id', $request->agence_id)
                ->where('statut', 'en_attente')->count(),
            'en_cours'   => TicketFile::where('agence_id', $request->agence_id)
                ->where('statut', 'en_cours')->count(),
            'termines_aujourd_hui' => TicketFile::where('agence_id', $request->agence_id)
                ->where('statut', 'terminé')
                ->whereDate('updated_at', today())->count(),
            'temps_moyen_attente' => TicketFile::where('agence_id', $request->agence_id)
                ->where('statut', 'terminé')
                ->whereNotNull('heure_appel')
                ->selectRaw('AVG(TIMESTAMPDIFF(MINUTE, created_at, heure_appel)) as temps_moyen')
                ->value('temps_moyen'),
        ];

        return response()->json(['statistiques' => $stats], 200);
    }

    // ══════════════════════════════════════════════════════
    // AFFLUENCE PAR HEURE (POUR GRAPHIQUE)
    // ══════════════════════════════════════════════════════
    public function affluenceParHeure(Request $request)
    {
        $request->validate([
            'agence_id' => 'required|exists:agences,id',
        ]);

        $affluence = TicketFile::where('agence_id', $request->agence_id)
            ->whereDate('created_at', today())
            ->selectRaw('HOUR(created_at) as heure, COUNT(*) as total')
            ->groupBy('heure')
            ->orderBy('heure')
            ->get();

        return response()->json(['affluence' => $affluence], 200);
    }
}