<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->restrictOnDelete();
            $table->foreignId('agent_id')
                  ->constrained('utilisateurs')
                  ->restrictOnDelete();
            $table->foreignId('client_id')
                  ->constrained('utilisateurs')
                  ->cascadeOnDelete();
            $table->enum('priorite', ['haute', 'normale', 'basse'])->default('normale');
            $table->enum('statut', ['en_attente', 'en_cours', 'terminé', 'annulé'])
                  ->default('en_attente');
            $table->dateTime('date_fin')->nullable()
                  ->comment('Date et heure de fin réelle');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taches');
    }
};
