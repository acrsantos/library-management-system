<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Genre;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GenreController extends Controller
{
    public function show($id) {
        $books = Genre::find($id)->books()->paginate(10);
        $genre = Genre::find($id)->name;
        return Inertia::render('genre', [
            'books' => Inertia::deepMerge($books),
            'genre' => $genre,
        ]);
    }
}
