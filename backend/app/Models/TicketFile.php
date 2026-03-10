<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketFile extends Model
{
    use HasFactory;

    protected $table = 'tickets_file';

    protected $fillable = [
        'numero_ticket',
        'client_id',
        'service_id',
        'agence_id',
        'position',
        'statut',
        'heure_appel',
        'heure_fin',
    ];

    protected $casts = [
        'heure_appel' => 'datetime',
        'heure_fin'   => 'datetime',
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
