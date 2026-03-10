<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RendezVous extends Model
{
    use HasFactory;

    protected $table = 'rendez_vous';

    protected $fillable = [
        'client_id',
        'service_id',
        'agence_id',
        'date_rdv',
        'statut',
        'notes',
    ];

    protected $casts = [
        'date_rdv' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Utilisateur::class, 'client_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }
}
