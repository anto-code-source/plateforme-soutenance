<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alerte;

class AlerteController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES ALERTES
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $alertes = Alerte::with('agence')
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->niveau,    fn($q) => $q->where('niveau', $request->niveau))
            ->when($request->statut,    fn($q) => $q->where('statut', $request->statut))
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['alertes' => $alertes], 200);
    }

    // ══════════════════════════════════════════════════════
    // MARQUER ALERTE COMME TRAITÉE
    // ══════════════════════════════════════════════════════
    public function traiter($id)
    {
        $alerte = Alerte::findOrFail($id);
        $alerte->update(['statut' => 'traitée']);

        return response()->json([
            'message' => 'Alerte marquée comme traitée.',
            'alerte'  => $alerte
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UNE ALERTE
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $alerte = Alerte::findOrFail($id);
        $alerte->delete();

        return response()->json([
            'message' => 'Alerte supprimée.'
        ], 200);
    }
}