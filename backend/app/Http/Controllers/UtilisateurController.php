<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Utilisateur;
use App\Models\LogSysteme;

class UtilisateurController extends Controller
{
    // ══════════════════════════════════════════════════════
    // LISTE TOUS LES UTILISATEURS
    // ══════════════════════════════════════════════════════
    public function index(Request $request)
    {
        $utilisateurs = Utilisateur::with('agence')
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->when($request->agence_id, fn($q) => $q->where('agence_id', $request->agence_id))
            ->when($request->statut, fn($q) => $q->where('statut', $request->statut))
            ->get();

        return response()->json(['utilisateurs' => $utilisateurs], 200);
    }

    // ══════════════════════════════════════════════════════
    // CRÉER UN UTILISATEUR
    // ══════════════════════════════════════════════════════
    public function store(Request $request)
    {
        $request->validate([
            'nom'          => 'required|string|max:100',
            'prenom'       => 'required|string|max:100',
            'email'        => 'required|email|unique:utilisateurs,email',
            'telephone'    => 'nullable|string|max:20',
            'mot_de_passe' => 'required|string|min:8',
            'role'         => 'required|in:admin,manager,agent,directeur,client',
            'agence_id'    => 'nullable|exists:agences,id',
        ]);

        $utilisateur = Utilisateur::create([
            'nom'          => $request->nom,
            'prenom'       => $request->prenom,
            'email'        => $request->email,
            'telephone'    => $request->telephone,
            'mot_de_passe' => Hash::make($request->mot_de_passe),
            'role'         => $request->role,
            'agence_id'    => $request->agence_id,
            'statut'       => 'actif',
        ]);

        LogSysteme::create([
            'utilisateur_id' => $request->user()->id,
            'action'         => 'Création utilisateur : ' . $utilisateur->email,
            'ip_adresse'     => $request->ip(),
        ]);

        return response()->json([
            'message'      => 'Utilisateur créé avec succès.',
            'utilisateur'  => $utilisateur
        ], 201);
    }

    // ══════════════════════════════════════════════════════
    // VOIR UN UTILISATEUR
    // ══════════════════════════════════════════════════════
    public function show($id)
    {
        $utilisateur = Utilisateur::with('agence')->findOrFail($id);

        return response()->json(['utilisateur' => $utilisateur], 200);
    }

    // ══════════════════════════════════════════════════════
    // MODIFIER UN UTILISATEUR
    // ══════════════════════════════════════════════════════
    public function update(Request $request, $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);

        $request->validate([
            'nom'       => 'sometimes|string|max:100',
            'prenom'    => 'sometimes|string|max:100',
            'email'     => 'sometimes|email|unique:utilisateurs,email,' . $id,
            'telephone' => 'nullable|string|max:20',
            'role'      => 'sometimes|in:admin,manager,agent,directeur,client',
            'agence_id' => 'nullable|exists:agences,id',
            'statut'    => 'sometimes|in:actif,inactif,suspendu',
        ]);

        $utilisateur->update($request->only([
            'nom', 'prenom', 'email', 'telephone',
            'role', 'agence_id', 'statut'
        ]));

        LogSysteme::create([
            'utilisateur_id' => $request->user()->id,
            'action'         => 'Modification utilisateur : ' . $utilisateur->email,
            'ip_adresse'     => $request->ip(),
        ]);

        return response()->json([
            'message'     => 'Utilisateur modifié avec succès.',
            'utilisateur' => $utilisateur
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // SUPPRIMER UN UTILISATEUR
    // ══════════════════════════════════════════════════════
    public function destroy(Request $request, $id)
    {
        $utilisateur = Utilisateur::findOrFail($id);
        $email       = $utilisateur->email;
        $utilisateur->delete();

        LogSysteme::create([
            'utilisateur_id' => $request->user()->id,
            'action'         => 'Suppression utilisateur : ' . $email,
            'ip_adresse'     => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.'
        ], 200);
    }
}