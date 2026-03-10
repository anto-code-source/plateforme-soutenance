<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE DES SERVICES
    // ══════════════════════════════════════════════════════
    public function index()
    {
        $services = Service::where('statut', 'actif')->get();

        return response()->json(['services' => $services], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉER UN SERVICE
    // ══════════════════════════════════════════════════════
    public function store(Request $request)
    {
        $request->validate([
            'nom_service'   => 'required|string|max:100',
            'description'   => 'nullable|string',
            'duree_moy_min' => 'nullable|integer|min:1',
        ]);

        $service = Service::create($request->all());

        return response()->json([
            'message' => 'Service créé avec succès.',
            'service' => $service
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UN SERVICE
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $service = Service::findOrFail($id);

        return response()->json(['service' => $service], 200);
    }

    // ══════════════════════════════════════════════════════
    // MODIFIER UN SERVICE
    // ══════════════════════════════════════════════════════
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'nom_service'   => 'sometimes|string|max:100',
            'description'   => 'nullable|string',
            'duree_moy_min' => 'nullable|integer|min:1',
            'statut'        => 'sometimes|in:actif,inactif',
        ]);

        $service->update($request->all());

        return response()->json([
            'message' => 'Service modifié avec succès.',
            'service' => $service
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UN SERVICE
    // ══════════════════════════════════════════════════════
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'message' => 'Service supprimé avec succès.'
        ], 200);
    }
}