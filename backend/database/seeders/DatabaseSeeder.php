<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Agences ─────────────────────────────────────────
        DB::table('agences')->insert([
            ['nom' => 'Agence Centrale Cotonou', 'adresse' => 'Avenue Jean-Paul II', 'ville' => 'Cotonou',     'telephone' => '+22921000001', 'email' => 'centrale@banque.bj', 'statut' => 'active',   'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Agence Akpakpa',          'adresse' => 'Rue des Jardins',     'ville' => 'Cotonou',     'telephone' => '+22921000002', 'email' => 'akpakpa@banque.bj',  'statut' => 'active',   'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Agence Porto-Novo',       'adresse' => 'Boulevard Lagunaire', 'ville' => 'Porto-Novo',  'telephone' => '+22921000003', 'email' => 'porto@banque.bj',    'statut' => 'active',   'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── 2. Services ────────────────────────────────────────
        DB::table('services')->insert([
            ['nom_service' => 'Dépôt',            'description' => 'Dépôt d\'argent sur un compte',          'duree_moy_min' => 10, 'statut' => 'actif', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Retrait',           'description' => 'Retrait d\'argent depuis un compte',     'duree_moy_min' => 10, 'statut' => 'actif', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Crédit',            'description' => 'Demande et traitement d\'un crédit',     'duree_moy_min' => 30, 'statut' => 'actif', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Ouverture compte',  'description' => 'Ouverture d\'un nouveau compte',         'duree_moy_min' => 45, 'statut' => 'actif', 'created_at' => now(), 'updated_at' => now()],
            ['nom_service' => 'Virement',          'description' => 'Virement inter-compte ou inter-banque',  'duree_moy_min' => 15, 'statut' => 'actif', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // ── 3. Utilisateurs ────────────────────────────────────
        DB::table('utilisateurs')->insert([
            [
                'nom' => 'Doe', 'prenom' => 'Admin',
                'email' => 'admin@banque.bj', 'telephone' => '+22997000001',
                'mot_de_passe' => Hash::make('Admin@1234'),
                'role' => 'admin', 'agence_id' => 1, 'statut' => 'actif',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'nom' => 'Gbeto', 'prenom' => 'Marc',
                'email' => 'manager@banque.bj', 'telephone' => '+22997000002',
                'mot_de_passe' => Hash::make('Manager@1234'),
                'role' => 'manager', 'agence_id' => 1, 'statut' => 'actif',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'nom' => 'Hounto', 'prenom' => 'Sylvie',
                'email' => 'agent1@banque.bj', 'telephone' => '+22997000003',
                'mot_de_passe' => Hash::make('Agent@1234'),
                'role' => 'agent', 'agence_id' => 1, 'statut' => 'actif',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'nom' => 'Kpade', 'prenom' => 'Directeur',
                'email' => 'dg@banque.bj', 'telephone' => '+22997000004',
                'mot_de_passe' => Hash::make('Directeur@1234'),
                'role' => 'directeur', 'agence_id' => 1, 'statut' => 'actif',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'nom' => 'Agossa', 'prenom' => 'Jean',
                'email' => 'client@gmail.com', 'telephone' => '+22997000005',
                'mot_de_passe' => Hash::make('Client@1234'),
                'role' => 'client', 'agence_id' => null, 'statut' => 'actif',
                'created_at' => now(), 'updated_at' => now()
            ],
        ]);
    }
}
