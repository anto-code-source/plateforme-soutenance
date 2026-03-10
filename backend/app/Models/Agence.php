<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agence extends Model
{
    use HasFactory;

    protected $table = 'agences';

    protected $fillable = [
        'nom',
        'adresse',
        'ville',
        'telephone',
        'email',
        'statut',
    ];

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'agence_id');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'agence_id');
    }

    public function tickets()
    {
        return $this->hasMany(TicketFile::class, 'agence_id');
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class, 'agence_id');
    }

    public function predictions()
    {
        return $this->hasMany(Prediction::class, 'agence_id');
    }
}
