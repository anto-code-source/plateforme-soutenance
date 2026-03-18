<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creneaux', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->restrictOnDelete();
            $table->foreignId('agence_id')
                  ->constrained('agences')
                  ->restrictOnDelete();
            $table->foreignId('manager_id')
                  ->constrained('utilisateurs')
                  ->restrictOnDelete();
            $table->dateTime('heure_debut');
            $table->dateTime('heure_fin');
            $table->integer('capacite_max');
            $table->integer('capacite_actuelle')->default(0);
            $table->boolean('est_disponible')->default(true);
            $table->enum('statut', ['ouvert', 'complet', 'fermé', 'terminé'])
                  ->default('ouvert');
            $table->timestamps();
        });

        Schema::table('agences', function (Blueprint $table) {
            $table->time('heure_ouverture')->default('08:00:00');
            $table->time('heure_fermeture')->default('18:00:00');
            $table->integer('duree_creneau_minutes')->default(20);
        });

        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->foreignId('creneau_id')
                  ->nullable()
                  ->constrained('creneaux')
                  ->nullOnDelete();
            $table->dateTime('heure_souhaitee')->nullable();
            $table->dateTime('heure_reelle')->nullable();
            $table->integer('decalage_minutes')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('rendez_vous', function (Blueprint $table) {
            $table->dropForeign(['creneau_id']);
            $table->dropColumn([
                'creneau_id',
                'heure_souhaitee',
                'heure_reelle',
                'decalage_minutes'
            ]);
        });

        Schema::table('agences', function (Blueprint $table) {
            $table->dropColumn([
                'heure_ouverture',
                'heure_fermeture',
                'duree_creneau_minutes'
            ]);
        });

        Schema::dropIfExists('creneaux');
    }
};