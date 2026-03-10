<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tache extends Model
{
    use HasFactory;

    protected $table = 'taches';

    protected $fillable = [
        'service_id',
        'agent_id',
        'client_id',
        'priorite',
        'statut',
        'date_fin',
        'notes',
    ];

    protected $casts = [
        'date_fin' => 'datetime',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function agent()
    {
        return $this->belongsTo(Utilisateur::class, 'agent_id');
    }

    public function client()
    {
        return $this->belongsTo(Utilisateur::class, 'client_id');
    }
}
