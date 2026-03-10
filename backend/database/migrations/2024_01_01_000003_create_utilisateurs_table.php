<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('email', 150)->unique();
            $table->string('telephone', 20)->nullable();
            $table->string('mot_de_passe', 255)
                  ->comment('Hashé avec bcrypt - jamais en clair');
            $table->enum('role', ['admin', 'manager', 'agent', 'directeur', 'client']);
            $table->foreignId('agence_id')
                  ->nullable()
                  ->constrained('agences')
                  ->nullOnDelete();
            $table->enum('statut', ['actif', 'inactif', 'suspendu'])->default('actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};
