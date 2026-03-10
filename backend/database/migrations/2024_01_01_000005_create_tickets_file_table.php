<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets_file', function (Blueprint $table) {
            $table->id();
            $table->string('numero_ticket', 50)->unique();
            $table->foreignId('client_id')
                  ->constrained('utilisateurs')
                  ->cascadeOnDelete();
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->restrictOnDelete();
            $table->foreignId('agence_id')
                  ->constrained('agences')
                  ->restrictOnDelete();
            $table->integer('position')->default(0);
            $table->enum('statut', ['en_attente', 'appelé', 'en_cours', 'terminé', 'annulé'])
                  ->default('en_attente');
            $table->dateTime('heure_appel')->nullable()
                  ->comment('Heure à laquelle le client a été appelé');
            $table->dateTime('heure_fin')->nullable()
                  ->comment('Heure de fin du service');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets_file');
    }
};
