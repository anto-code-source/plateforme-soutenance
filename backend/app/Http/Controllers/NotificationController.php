<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // ══════════════════════════════════════════════════════
    // MES NOTIFICATIONS
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $notifications = Notification::where('utilisateur_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['notifications' => $notifications], 200);
    }

    // ══════════════════════════════════════════════════════
    // MARQUER COMME LUE
    // ══════════════════════════════════════════════════════
    public function marquerLue($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['statut' => 'lue']);

        return response()->json([
            'message' => 'Notification marquée comme lue.'
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // MARQUER TOUTES COMME LUES
    // ══════════════════════════════════════════════════════
    public function marquerToutesLues(Request $request)
    {
        Notification::where('utilisateur_id', $request->user()->id)
            ->where('statut', 'non_lue')
            ->update(['statut' => 'lue']);

        return response()->json([
            'message' => 'Toutes les notifications ont été marquées comme lues.'
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UNE NOTIFICATION
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json([
            'message' => 'Notification supprimée.'
        ], 200);
    }
}