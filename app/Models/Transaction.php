<?php

namespace App\Models;

use App\Models\BookBorrow;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'processed_by',
        'processed_at',

    ];

    public function book_borrows() {
        return $this->hasMany(BookBorrow::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
