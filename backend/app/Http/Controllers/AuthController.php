<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Utilisateur;
use App\Models\LogSysteme;

class AuthController extends Controller
{
    // ══════════════════════════════════════════════════════
    // CONNEXION
    // ══════════════════════════════════════════════════════
    public function login(Request $request)
    {
        // Validation des données envoyées
        $request->validate([
            'email'       => 'required|email',
            'mot_de_passe' => 'required|string',
        ]);

        // Chercher l'utilisateur par email
        $utilisateur = Utilisateur::where('email', $request->email)->first();

        // Vérifier si l'utilisateur existe et le mot de passe est correct
        if (!$utilisateur || !Hash::check($request->mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        // Vérifier si le compte est actif
        if ($utilisateur->statut !== 'actif') {
            return response()->json([
                'message' => 'Votre compte est suspendu ou inactif.'
            ], 403);
        }

        // Supprimer les anciens tokens
        $utilisateur->tokens()->delete();

        // Créer un nouveau token
        $token = $utilisateur->createToken('auth_token')->plainTextToken;

        // Enregistrer dans les logs
        LogSysteme::create([
            'utilisateur_id' => $utilisateur->id,
            'action'         => 'Connexion réussie',
            'ip_adresse'     => $request->ip(),
        ]);

        // Retourner la réponse
        return response()->json([
            'message'      => 'Connexion réussie.',
            'token'        => $token,
            'token_type'   => 'Bearer',
            'utilisateur'  => [
                'id'       => $utilisateur->id,
                'nom'      => $utilisateur->nom,
                'prenom'   => $utilisateur->prenom,
                'email'    => $utilisateur->email,
                'role'     => $utilisateur->role,
                'agence_id'=> $utilisateur->agence_id,
            ],
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // DÉCONNEXION
    // ══════════════════════════════════════════════════════
    public function logout(Request $request)
    {
        // Enregistrer dans les logs
        LogSysteme::create([
            'utilisateur_id' => $request->user()->id,
            'action'         => 'Déconnexion',
            'ip_adresse'     => $request->ip(),
        ]);

        // Supprimer le token actuel
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie.'
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // PROFIL UTILISATEUR CONNECTÉ
    // ══════════════════════════════════════════════════════
    public function me(Request $request)
    {
        $utilisateur = $request->user()->load('agence');

        return response()->json([
            'utilisateur' => $utilisateur
        ], 200);
    }

    // ══════════════════════════════════════════════════════
    // CHANGER MOT DE PASSE
    // ══════════════════════════════════════════════════════
    public function changerMotDePasse(Request $request)
    {
        $request->validate([
            'ancien_mot_de_passe'  => 'required|string',
            'nouveau_mot_de_passe' => 'required|string|min:8|confirmed',
        ]);

        $utilisateur = $request->user();

        // Vérifier l'ancien mot de passe
        if (!Hash::check($request->ancien_mot_de_passe, $utilisateur->mot_de_passe)) {
            return response()->json([
                'message' => 'Ancien mot de passe incorrect.'
            ], 401);
        }

        // Mettre à jour le mot de passe
        $utilisateur->update([
            'mot_de_passe' => Hash::make($request->nouveau_mot_de_passe)
        ]);

        // Enregistrer dans les logs
        LogSysteme::create([
            'utilisateur_id' => $utilisateur->id,
            'action'         => 'Changement de mot de passe',
            'ip_adresse'     => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Mot de passe changé avec succès.'
        ], 200);
    }
}