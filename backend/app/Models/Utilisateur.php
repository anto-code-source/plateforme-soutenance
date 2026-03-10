<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'mot_de_passe',
        'role',
        'agence_id',
        'statut',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }

    public function rendezVous()
    {
        return $this->hasMany(RendezVous::class, 'client_id');
    }

    public function tickets()
    {
        return $this->hasMany(TicketFile::class, 'client_id');
    }

    public function tachesAgent()
    {
        return $this->hasMany(Tache::class, 'agent_id');
    }

    public function tachesClient()
    {
        return $this->hasMany(Tache::class, 'client_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'utilisateur_id');
    }

    public function isAdmin()     { return $this->role === 'admin'; }
    public function isManager()   { return $this->role === 'manager'; }
    public function isAgent()     { return $this->role === 'agent'; }
    public function isDirecteur() { return $this->role === 'directeur'; }
    public function isClient()    { return $this->role === 'client'; }
}
