<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Affectation extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'tache_id',
        'date_affectation',
        'motif',
        'est_automatique',
    ];

    // Relation vers Agent
    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    // Relation vers Tache
    public function tache()
    {
        return $this->belongsTo(Tache::class);
    }
}