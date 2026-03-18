<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    protected $table = 'agents';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'poste',
        'agence_id',
        'service_id',
        'disponible',
        'charge_actuelle',
    ];

    protected $casts = [
        'disponible' => 'boolean',
        'charge_actuelle' => 'integer',
    ];

    // ══════════════════════════════════════════════════════
    // RELATIONS
    // ══════════════════════════════════════════════════════

    // Un agent appartient à une agence
    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    // Un agent appartient à un service
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    // Un agent peut avoir plusieurs tâches via la table affectation
    public function affectations()
    {
        return $this->hasMany(Affectation::class);
    }

    public function taches()
    {
        return $this->hasManyThrough(
            Tache::class,
            Affectation::class,
            'agent_id', // clé étrangère dans Affectation
            'id',       // clé primaire dans Tache
            'id',       // clé primaire de Agent
            'tache_id'  // clé étrangère de Tache dans Affectation
        );
    }

    // ══════════════════════════════════════════════════════
    // MÉTHODES MÉTIER
    // ══════════════════════════════════════════════════════

    // Vérifie si l'agent est disponible
    public function estDisponible(): bool
    {
        return $this->disponible && $this->charge_actuelle < 5; // exemple: max 5 tâches simultanées
    }

    // Augmente la charge actuelle
    public function incrementerCharge()
    {
        $this->increment('charge_actuelle');
    }

    // Diminue la charge actuelle
    public function decrementerCharge()
    {
        if ($this->charge_actuelle > 0) {
            $this->decrement('charge_actuelle');
        }
    }
}