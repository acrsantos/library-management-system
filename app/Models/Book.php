<?php

namespace App\Models;

use App\Models\Author;
use App\Models\Genre;
use App\Models\Publisher;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;
    public $timestamps = false;

    protected $fillable = [
        'book_id',
        'title',
        'rating',
        'description',
        'language',
        'publisher_id',
        'total_page',
        'date_published',
        'num_ratings',
        'star_ratings',
        'cover_img',
        'copies_available',
        'copies_total'
    ];
    protected function casts(): array
    {
        return [
            'star_ratings' => 'array',
            'date_published' => 'date'
        ];
    }

    public function authors(): BelongsToMany {
        return $this->belongsToMany(Author::class);
    }
    public function genres(): BelongsToMany {
        return $this->belongsToMany(Genre::class);
    }
    public function publisher(): BelongsTo {
        return $this->belongsToMany(Publisher::class);
    }

    public function book_borrows(): HasMany {
        return $this->hasMany(BookBorrow::class);
    }
}
