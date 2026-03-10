<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\AgenceController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\FileAttenteController;
use App\Http\Controllers\TacheController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AlerteController;
use App\Http\Controllers\StatistiqueController;
use App\Http\Controllers\PredictionController;

// ══════════════════════════════════════════════════════════
// ROUTES PUBLIQUES (sans token)
// ══════════════════════════════════════════════════════════
Route::post('/login', [AuthController::class, 'login']);

// ══════════════════════════════════════════════════════════
// ROUTES PROTÉGÉES (avec token Sanctum)
// ══════════════════════════════════════════════════════════
Route::middleware('auth:sanctum')->group(function () {

    // ── Authentification ───────────────────────────────────
    Route::post('/logout',               [AuthController::class, 'logout']);
    Route::get('/me',                    [AuthController::class, 'me']);
    Route::post('/changer-mot-de-passe', [AuthController::class, 'changerMotDePasse']);

    // ── Agences ────────────────────────────────────────────
    Route::get('/agences',          [AgenceController::class, 'index']);
    Route::get('/agences/{id}',     [AgenceController::class, 'show']);
    Route::post('/agences',         [AgenceController::class, 'store']);
    Route::put('/agences/{id}',     [AgenceController::class, 'update']);
    Route::delete('/agences/{id}',  [AgenceController::class, 'destroy']);

    // ── Services ───────────────────────────────────────────
    Route::get('/services',         [ServiceController::class, 'index']);
    Route::get('/services/{id}',    [ServiceController::class, 'show']);
    Route::post('/services',        [ServiceController::class, 'store']);
    Route::put('/services/{id}',    [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    // ── Utilisateurs ───────────────────────────────────────
    Route::get('/utilisateurs',          [UtilisateurController::class, 'index']);
    Route::get('/utilisateurs/{id}',     [UtilisateurController::class, 'show']);
    Route::post('/utilisateurs',         [UtilisateurController::class, 'store']);
    Route::put('/utilisateurs/{id}',     [UtilisateurController::class, 'update']);
    Route::delete('/utilisateurs/{id}',  [UtilisateurController::class, 'destroy']);

    // ── Rendez-vous ────────────────────────────────────────
    Route::get('/rendez-vous',                      [RendezVousController::class, 'index']);
    Route::get('/rendez-vous/{id}',                 [RendezVousController::class, 'show']);
    Route::post('/rendez-vous',                     [RendezVousController::class, 'store']);
    Route::put('/rendez-vous/{id}/statut',          [RendezVousController::class, 'updateStatut']);
    Route::delete('/rendez-vous/{id}',              [RendezVousController::class, 'destroy']);

    // ── File d'attente ─────────────────────────────────────
    Route::get('/file-attente',                     [FileAttenteController::class, 'index']);
    Route::post('/file-attente/ticket',             [FileAttenteController::class, 'genererTicket']);
    Route::get('/file-attente/mon-ticket',          [FileAttenteController::class, 'monTicket']);
    Route::post('/file-attente/appeler-suivant',    [FileAttenteController::class, 'appelerSuivant']);
    Route::put('/file-attente/{id}/terminer',       [FileAttenteController::class, 'terminerTicket']);

    // ── Tâches ─────────────────────────────────────────────
    Route::get('/taches',                   [TacheController::class, 'index']);
    Route::get('/taches/mes-taches',        [TacheController::class, 'mesTaches']);
    Route::get('/taches/{id}',              [TacheController::class, 'show']);
    Route::post('/taches',                  [TacheController::class, 'store']);
    Route::put('/taches/{id}/statut',       [TacheController::class, 'updateStatut']);
    Route::put('/taches/{id}/assigner',     [TacheController::class, 'assigner']);

    // ── Notifications ──────────────────────────────────────
    Route::get('/notifications',                    [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/lue',           [NotificationController::class, 'marquerLue']);
    Route::put('/notifications/toutes-lues',        [NotificationController::class, 'marquerToutesLues']);
    Route::delete('/notifications/{id}',            [NotificationController::class, 'destroy']);

    // ── Alertes ────────────────────────────────────────────
    Route::get('/alertes',              [AlerteController::class, 'index']);
    Route::put('/alertes/{id}/traiter', [AlerteController::class, 'traiter']);
    Route::delete('/alertes/{id}',      [AlerteController::class, 'destroy']);

    // ── Statistiques ───────────────────────────────────────
    Route::get('/statistiques/global',          [StatistiqueController::class, 'global']);
    Route::get('/statistiques/agents',          [StatistiqueController::class, 'performanceAgents']);
    Route::get('/statistiques/file-attente',    [StatistiqueController::class, 'fileAttente']);
    Route::get('/statistiques/affluence',       [StatistiqueController::class, 'affluenceParHeure']);

    // ── Prédictions ────────────────────────────────────────
    Route::post('/predictions/affluence',       [PredictionController::class, 'predireAffluence']);
    Route::post('/predictions/charge',          [PredictionController::class, 'predireCharge']);
    Route::post('/predictions/repartition',     [PredictionController::class, 'recommanderRepartition']);
    Route::get('/predictions/historique',       [PredictionController::class, 'historique']);

});