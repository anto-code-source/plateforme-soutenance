<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agence;

class AgenceController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES AGENCES
    // ══════════════════════════════════════════════════════
    public function index()
    {
        $agences = Agence::all();

        return response()->json(['agences' => $agences], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉER UNE AGENCE
    // ══════════════════════════════════════════════════════
    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:100',
            'adresse'   => 'nullable|string|max:200',
            'ville'     => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'email'     => 'nullable|email',
        ]);

        $agence = Agence::create($request->all());

        return response()->json([
            'message' => 'Agence créée avec succès.',
            'agence'  => $agence
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UNE AGENCE
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $agence = Agence::with('utilisateurs')->findOrFail($id);

        return response()->json(['agence' => $agence], 200);
    }

    // ══════════════════════════════════════════════════════
    // MODIFIER UNE AGENCE
    // ══════════════════════════════════════════════════════
    public function update(Request $request, $id)
    {
        $agence = Agence::findOrFail($id);

        $request->validate([
            'nom'       => 'sometimes|string|max:100',
            'adresse'   => 'nullable|string|max:200',
            'ville'     => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:20',
            'email'     => 'nullable|email',
            'statut'    => 'sometimes|in:active,inactive',
        ]);

        $agence->update($request->all());

        return response()->json([
            'message' => 'Agence modifiée avec succès.',
            'agence'  => $agence
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UNE AGENCE
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $agence = Agence::findOrFail($id);
        $agence->delete();

        return response()->json([
            'message' => 'Agence supprimée avec succès.'
        ], 200);
    }
}