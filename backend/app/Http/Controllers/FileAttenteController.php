<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TicketFile;
use App\Models\Notification;
use App\Models\Alerte;

class FileAttenteController extends Controller
{
    // ══════════════════════════════════════════════════════
    // AFFICHER LA FILE D'ATTENTE
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $tickets = TicketFile::with(['client', 'service', 'agence'])
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->service_id, fn($q) => $q->where('service_id', $request->service_id))
            ->whereIn('statut', ['en_attente', 'appelé', 'en_cours'])
            ->orderBy('position', 'asc')
            ->get();

        return response()->json(['tickets' => $tickets], 200);
    }

    // ══════════════════════════════════════════════════════
    // GÉNÉRER UN TICKET
    // ══════════════════════════════════════════════════════
    public function genererTicket(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'agence_id'  => 'required|exists:agences,id',
        ]);

        // Calculer la position dans la file
        $position = TicketFile::where('agence_id', $request->agence_id)
            ->where('service_id', $request->service_id)
            ->whereIn('statut', ['en_attente', 'en_cours'])
            ->count() + 1;

        // Générer un numéro de ticket unique
        $numero = 'TK-' . strtoupper(substr(md5(uniqid()), 0, 6));

        $ticket = TicketFile::create([
            'numero_ticket' => $numero,
            'client_id'     => $request->user()->id,
            'service_id'    => $request->service_id,
            'agence_id'     => $request->agence_id,
            'position'      => $position,
            'statut'        => 'en_attente',
        ]);

        // Notifier le client
        Notification::create([
            'utilisateur_id' => $request->user()->id,
            'message'        => 'Votre ticket ' . $numero . ' a été généré. Vous êtes en position ' . $position,
            'type'           => 'confirmation',
            'statut'         => 'non_lue',
        ]);

        // Alerte si file trop longue (plus de 10 personnes)
        if ($position > 10) {
            Alerte::create([
                'type_alerte' => 'file_longue',
                'agence_id'   => $request->agence_id,
                'message'     => 'La file d\'attente dépasse 10 personnes pour le service ' . $ticket->service->nom_service,
                'niveau'      => 'warning',
                'statut'      => 'non_lue',
            ]);
        }

        return response()->json([
            'message' => 'Ticket généré avec succès.',
            'ticket'  => $ticket->load(['client', 'service', 'agence'])
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // APPELER LE CLIENT SUIVANT
    // ══════════════════════════════════════════════════════
    public function appelerSuivant(Request $request)
    {
        $request->validate([
            'agence_id'  => 'required|exists:agences,id',
            'service_id' => 'required|exists:services,id',
        ]);

        // Trouver le prochain ticket en attente
        $ticket = TicketFile::where('agence_id', $request->agence_id)
            ->where('service_id', $request->service_id)
            ->where('statut', 'en_attente')
            ->orderBy('position', 'asc')
            ->first();

        if (!$ticket) {
            return response()->json([
                'message' => 'Aucun client en attente.'
            ], 404);
        }

        // Mettre à jour le statut
        $ticket->update([
            'statut'      => 'appelé',
            'heure_appel' => now(),
        ]);

        // Notifier le client
        Notification::create([
            'utilisateur_id' => $ticket->client_id,
            'message'        => 'C\'est votre tour ! Présentez-vous au guichet avec votre ticket ' . $ticket->numero_ticket,
            'type'           => 'alerte',
            'statut'         => 'non_lue',
        ]);

        return response()->json([
            'message' => 'Client appelé avec succès.',
            'ticket'  => $ticket->load(['client', 'service'])
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // TERMINER UN TICKET
    // ══════════════════════════════════════════════════════
    public function terminerTicket(Request $request, $id)
    {
        $ticket = TicketFile::findOrFail($id);

        $ticket->update([
            'statut'    => 'terminé',
            'heure_fin' => now(),
        ]);

        return response()->json([
            'message' => 'Ticket terminé avec succès.',
            'ticket'  => $ticket
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // VOIR SON TICKET (CLIENT)
    // ══════════════════════════════════════════════════════
    public function monTicket(Request $request)
    {
        $ticket = TicketFile::with(['service', 'agence'])
            ->where('client_id', $request->user()->id)
            ->whereIn('statut', ['en_attente', 'appelé', 'en_cours'])
            ->latest()
            ->first();

        if (!$ticket) {
            return response()->json([
                'message' => 'Aucun ticket actif.'
            ], 404);
        }

        return response()->json(['ticket' => $ticket], 200);
    }
}