<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookBorrow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookController extends Controller
{
    public function show($id) {
        $user = User::find(request()->user()->id);
        $bookItem = Book::find($id);
        $bookItem->load(['authors', 'genres']);
        $userHasBorrowed = $bookItem->book_borrows()->where('returned_at', null)->whereIn('status', ['approved', 'pending', 'rejected'])->whereHas('transaction', function ($query) {
            $query->where('user_id', request()->user()->id);
        })->orderBy('created_at', 'desc')->first();
        $userBorrowId = $userHasBorrowed ? $userHasBorrowed->id : null;
        $userBorrowStatus = $userHasBorrowed ? $userHasBorrowed->status : null;
        $userBorrowType = $userHasBorrowed ? $userHasBorrowed->type : null;
        $userBanned = $user ? $user->is_banned : null;
        $bookHistory = BookBorrow::with(['transaction.user', 'book'])
            ->where('book_id', $id)
            ->where('status', '!=', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
        Log::info('User has borrowed book: ' . $userHasBorrowed);
        Log::info('User has borrowed book status: ' . $userBorrowStatus);
        $bookActive = BookBorrow::with(['transaction.user', 'book'])->where('book_id', $id)
            ->where('status', 'approved')
            ->whereNull('returned_at')
            ->get();

        $authorBooks = $bookItem->authors->flatMap(function ($author) use ($bookItem) {
            Log::info('Author: ' . $author->name);
            return $author->books()->where('id', '!=', $bookItem->id)->get();
        })->unique('id')->values();

        // Log::info('Author books: ' . json_encode($authorBooks));

        return Inertia::render('book', [
            'bookItem' => $bookItem,
            'userBorrowId' => $userBorrowId,
            'userBorrowStatus' => $userBorrowStatus,
            'userBorrowType' => $userBorrowType,
            'userBanned' => $userBanned,
            'user' => $user,
            'bookHistory' => $bookHistory,
            'bookActive' => $bookActive,
            'authorBooks' => $authorBooks,
        ]);
    }
}
