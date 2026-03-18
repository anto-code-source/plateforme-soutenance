<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Creneau extends Model
{
    use HasFactory;

    protected $table = 'creneaux';

    protected $fillable = [
        'service_id',
        'agence_id',
        'manager_id',
        'heure_debut',
        'heure_fin',
        'capacite_max',
        'capacite_actuelle',
        'est_disponible',
        'statut',
    ];

    protected $casts = [
        'heure_debut'       => 'datetime',
        'heure_fin'         => 'datetime',
        'est_disponible'    => 'boolean',
        'capacite_max'      => 'integer',
        'capacite_actuelle' => 'integer',
    ];

    // ══════════════════════════════════════════════════════
    // RELATIONS
    // ══════════════════════════════════════════════════════

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class);
    }

    public function manager()
    {
        return $this->belongsTo(Utilisateur::class, 'manager_id');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class);
    }

    // ══════════════════════════════════════════════════════
    // MÉTHODES MÉTIER
    // ══════════════════════════════════════════════════════

    // Vérifie si le créneau est encore disponible
    public function estDisponible(): bool
    {
        return $this->est_disponible
            && $this->capacite_actuelle < $this->capacite_max
            && $this->statut === 'ouvert';
    }

    // Réserve une place dans le créneau
    public function reserver(): bool
    {
        if (!$this->estDisponible()) {
            return false;
        }

        $this->increment('capacite_actuelle');

        // Si le créneau est maintenant plein → marquer complet
        if ($this->capacite_actuelle >= $this->capacite_max) {
            $this->update([
                'est_disponible' => false,
                'statut'         => 'complet',
            ]);
        }

        return true;
    }

    // Libère une place (en cas d'annulation)
    public function liberer(): void
    {
        if ($this->capacite_actuelle > 0) {
            $this->decrement('capacite_actuelle');

            // Réouvrir le créneau si des places sont libérées
            if ($this->statut === 'complet') {
                $this->update([
                    'est_disponible' => true,
                    'statut'         => 'ouvert',
                ]);
            }
        }
    }

    // ══════════════════════════════════════════════════════
    // SCOPES
    // ══════════════════════════════════════════════════════

    // Créneaux disponibles uniquement
    public function scopeDisponibles($query)
    {
        return $query->where('est_disponible', true)
                     ->where('statut', 'ouvert');
    }

    // Créneaux d'une agence et d'un service donnés
    public function scopePourAgenceEtService($query, $agenceId, $serviceId)
    {
        return $query->where('agence_id', $agenceId)
                     ->where('service_id', $serviceId);
    }

    // Créneaux à partir d'une heure donnée (avant 18h)
    public function scopeApresHeure($query, $heure)
    {
        return $query->where('heure_debut', '>=', $heure);
    }
}