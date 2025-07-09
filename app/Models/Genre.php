<?php

namespace App\Models;

use App\Models\Book;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Genre extends Model
{
    /** @use HasFactory<\Database\Factories\PublisherFactory> */
    use HasFactory;

    public $timestamps = false;
    public function books(): BelongsToMany {
        return $this->belongsToMany(Book::class);
    }
}
