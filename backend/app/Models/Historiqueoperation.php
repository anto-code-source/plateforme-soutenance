<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueOperation extends Model
{
    use HasFactory;

    protected $table = 'historique_operations';

    protected $fillable = [
        'agent_id',
        'client_id',
        'agence_id',
        'type_operation',
        'montant',
        'statut',
        'notes',
    ];

    public function agent()
    {
        return $this->belongsTo(Utilisateur::class, 'agent_id');
    }

    public function client()
    {
        return $this->belongsTo(Utilisateur::class, 'client_id');
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }
}