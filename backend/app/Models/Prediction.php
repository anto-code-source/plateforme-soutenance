<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use HasFactory;

    protected $table = 'predictions';

    protected $fillable = [
        'type_prediction',
        'agence_id',
        'valeur',
        'unite',
        'date_prediction',
        'valeur_reelle',
        'precision_modele',
    ];

    protected $casts = [
        'date_prediction' => 'datetime',
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }
}