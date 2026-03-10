<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agences', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('adresse', 200)->nullable();
            $table->string('ville', 100)->nullable();
            $table->string('telephone', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->enum('statut', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agences');
    }
};
