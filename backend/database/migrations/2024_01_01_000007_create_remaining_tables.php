<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Historique des opérations ──────────────────────────
        Schema::create('historique_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')
                  ->constrained('utilisateurs')->restrictOnDelete();
            $table->foreignId('client_id')
                  ->constrained('utilisateurs')->cascadeOnDelete();
            $table->foreignId('agence_id')
                  ->constrained('agences')->restrictOnDelete();
            $table->string('type_operation', 100);
            $table->decimal('montant', 15, 2)->nullable();
            $table->enum('statut', ['terminé', 'annulé', 'en_attente'])->default('terminé');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ── Notifications ──────────────────────────────────────
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')
                  ->constrained('utilisateurs')->cascadeOnDelete();
            $table->text('message');
            $table->enum('type', ['info', 'alerte', 'rappel', 'confirmation'])->default('info');
            $table->enum('statut', ['non_lue', 'lue'])->default('non_lue');
            $table->timestamps();
        });

        // ── Alertes ────────────────────────────────────────────
        Schema::create('alertes', function (Blueprint $table) {
            $table->id();
            $table->string('type_alerte', 100);
            $table->foreignId('agence_id')
                  ->constrained('agences')->cascadeOnDelete();
            $table->text('message');
            $table->enum('niveau', ['info', 'warning', 'critique'])->default('info');
            $table->enum('statut', ['non_lue', 'lue', 'traitée'])->default('non_lue');
            $table->timestamps();
        });

        // ── Prédictions ────────────────────────────────────────
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->string('type_prediction', 100);
            $table->foreignId('agence_id')
                  ->constrained('agences')->cascadeOnDelete();
            $table->float('valeur');
            $table->string('unite', 50)->nullable();
            $table->dateTime('date_prediction');
            $table->float('valeur_reelle')->nullable();
            $table->float('precision_modele')->nullable();
            $table->timestamps();
        });

        // ── Logs système ───────────────────────────────────────
        Schema::create('logs_systeme', function (Blueprint $table) {
            $table->id();
            $table->foreignId('utilisateur_id')
                  ->nullable()
                  ->constrained('utilisateurs')
                  ->nullOnDelete();
            $table->text('action');
            $table->string('ip_adresse', 50)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs_systeme');
        Schema::dropIfExists('predictions');
        Schema::dropIfExists('alertes');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('historique_operations');
    }
};
