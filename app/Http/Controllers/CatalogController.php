<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CatalogController extends Controller
{
    public function index()
    {
        $books = Book::inRandomOrder()->simplePaginate(10);
        return Inertia::render('catalog', ['books' => Inertia::deepMerge($books)]);
    }

    public function search(Request $request) {
        $search_key = strtolower(trim($request->input('key')));
        $books = Book::whereRaw('LOWER(title) like ?', ["%$search_key%"])->simplePaginate(10);
        return Inertia::render('catalog', ['books' => Inertia::deepMerge($books)]);
    }
}
