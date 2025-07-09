<?php

use App\Http\Controllers\GenreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookBorrowController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;

Route::get('/', function () {
    return redirect()->route('home');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/users', [DashboardController::class, 'users'])->name('dashboard.user');
    Route::get('dashboard/users/search', [DashboardController::class, 'user_search'])->name('dashboard.user.search');
    Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog');
    Route::get('/catalog/search', [CatalogController::class, 'search'])->name('catalog.search');
    Route::get('/book/{id}', [BookController::class, 'show'])->name('book.show');


    Route::get('/genre/{id}', [GenreController::class, 'show'])->name('genre.show');

    Route::get('/author/{id}', [AuthorController::class, 'show'])->name('author.show');
    Route::get('/home', [UserController::class, 'show'])->name('home');
    Route::get('/user/{id}', [DashboardController::class, 'show'])->name('user');

    Route::post('/book/borrow/{bookId}', [BookBorrowController::class, 'borrow'])->name('book.borrow');
    Route::post('/book/return/{borrowId}', [BookBorrowController::class, 'return'])->name('book.return');
    Route::post('/book/cancel/{borrowId}', [BookBorrowController::class, 'cancel'])->name('book.cancel');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

