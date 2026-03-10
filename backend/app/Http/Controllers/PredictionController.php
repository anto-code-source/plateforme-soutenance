<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Prediction;
use App\Models\TicketFile;
use App\Models\Alerte;

class PredictionController extends Controller
{
    // URL du microservice Python
    private $pythonUrl = 'http://localhost:8000';

    // ══════════════════════════════════════════════════════
    // PRÉDIRE L'AFFLUENCE
    // ══════════════════════════════════════════════════════
    public function predireAffluence(Request $request)
    {
        $request->validate([
            'agence_id'  => 'required|exists:agences,id',
            'date_cible' => 'required|date',
        ]);

        // Récupérer l'historique des 30 derniers jours
        $historique = TicketFile::where('agence_id', $request->agence_id)
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total')
            ->toArray();

        // Envoyer au microservice Python
        $response = Http::post($this->pythonUrl . '/predict/affluence', [
            'agence_id'   => $request->agence_id,
            'historique'  => $historique,
            'date_cible'  => $request->date_cible,
        ]);

        $resultat = $response->json();

        // Stocker la prédiction en base
        $prediction = Prediction::create([
            'type_prediction'  => 'affluence',
            'agence_id'        => $request->agence_id,
            'valeur'           => $resultat['affluence_prevue'],
            'unite'            => 'clients',
            'date_prediction'  => $request->date_cible,
            'precision_modele' => $resultat['precision_modele'] ?? null,
        ]);

        // Créer une alerte si affluence élevée
        if ($resultat['affluence_prevue'] > 100) {
            Alerte::create([
                'type_alerte' => 'pic_affluence',
                'agence_id'   => $request->agence_id,
                'message'     => 'Affluence élevée prévue le ' . $request->date_cible . ' : ' . $resultat['affluence_prevue'] . ' clients attendus.',
                'niveau'      => 'warning',
                'statut'      => 'non_lue',
            ]);
        }

        return response()->json([
            'message'    => 'Prédiction générée avec succès.',
            'prediction' => $resultat,
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // PRÉDIRE LA CHARGE DE TRAVAIL
    // ══════════════════════════════════════════════════════
    public function predireCharge(Request $request)
    {
        $request->validate([
            'agence_id'  => 'required|exists:agences,id',
            'date_cible' => 'required|date',
        ]);

        $response = Http::post($this->pythonUrl . '/predict/charge', [
            'agence_id'  => $request->agence_id,
            'date_cible' => $request->date_cible,
        ]);

        $resultat = $response->json();

        Prediction::create([
            'type_prediction' => 'charge_travail',
            'agence_id'       => $request->agence_id,
            'valeur'          => $resultat['charge_prevue'],
            'unite'           => 'tâches',
            'date_prediction' => $request->date_cible,
        ]);

        return response()->json([
            'message'    => 'Prédiction de charge générée.',
            'prediction' => $resultat,
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // RECOMMANDER LA RÉPARTITION DES TÂCHES
    // ══════════════════════════════════════════════════════
    public function recommanderRepartition(Request $request)
    {
        $request->validate([
            'agence_id' => 'required|exists:agences,id',
        ]);

        $response = Http::post($this->pythonUrl . '/predict/repartition', [
            'agence_id' => $request->agence_id,
        ]);

        $resultat = $response->json();

        return response()->json([
            'message'         => 'Recommandations générées.',
            'recommandations' => $resultat,
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // HISTORIQUE DES PRÉDICTIONS
    // ══════════════════════════════════════════════════════
    public function historique(Request $request)
    {
        $predictions = Prediction::with('agence')
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->type,      fn($q) => $q->where('type_prediction', $request->type))
            ->orderBy('date_prediction', 'desc')
            ->get();

        return response()->json(['predictions' => $predictions], 200);
    }
}