<?php

namespace App\Models;

use App\Models\Transaction;
use App\Models\Book;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookBorrow extends Model
{
    /** @use HasFactory<\Database\Factories\BookBorrowFactory> */
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'book_id',
        'start_date',
        'due_date',
        'returned_at',
        'status',
        'type'
    ];

    public function transaction() {
        return $this->belongsTo(Transaction::class);
    }

    public function book() {
        return $this->belongsTo(Book::class);
    }
}
