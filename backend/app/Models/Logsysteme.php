<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogSysteme extends Model
{
    use HasFactory;

    protected $table = 'logs_systeme';

    protected $fillable = [
        'utilisateur_id',
        'action',
        'ip_adresse',
    ];

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }
}