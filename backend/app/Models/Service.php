<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $table = 'services';

    protected $fillable = [
        'nom_service',
        'description',
        'duree_moy_min',
        'statut',
    ];

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'service_id');
    }

    public function tickets()
    {
        return $this->hasMany(TicketFile::class, 'service_id');
    }

    public function taches()
    {
        return $this->hasMany(Tache::class, 'service_id');
    }
}
