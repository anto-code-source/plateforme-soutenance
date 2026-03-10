<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alerte extends Model
{
    use HasFactory;

    protected $table = 'alertes';

    protected $fillable = [
        'type_alerte',
        'agence_id',
        'message',
        'niveau',
        'statut',
    ];

    public function agence()
    {
        return $this->belongsTo(Agence::class, 'agence_id');
    }
}
