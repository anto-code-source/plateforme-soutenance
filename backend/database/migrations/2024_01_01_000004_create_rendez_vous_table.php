<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rendez_vous', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')
                  ->constrained('utilisateurs')
                  ->cascadeOnDelete();
            $table->foreignId('service_id')
                  ->constrained('services')
                  ->restrictOnDelete();
            $table->foreignId('agence_id')
                  ->constrained('agences')
                  ->restrictOnDelete();
            $table->dateTime('date_rdv');
            $table->enum('statut', ['en_attente', 'confirmé', 'annulé', 'terminé'])
                  ->default('en_attente');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rendez_vous');
    }
};
