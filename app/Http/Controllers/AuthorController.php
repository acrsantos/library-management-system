<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function show($id) {
        $author = Author::find($id)->name;
        $books = Author::find($id)->books()->paginate(10);
        return Inertia::render('author', [
            'books' => Inertia::deepMerge($books),
            'author' => $author
        ]);
    }
}
