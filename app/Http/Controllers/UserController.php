<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BookBorrow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index($id): Response
    {
        $user = $id;
        $borrowed_books = Book::whereHas('book_borrows', function ($query) use ($user) {
                $query->where('status', '!=', 'pending')
                      ->where('returned_at', null)
                      ->whereHas('transaction', function ($q) use ($user) {
                          $q->where('user_id', $user);
                      });
            })->get();

        $pending_books = Book::whereHas('book_borrows', function ($query) use ($user) {
                $query->where('status', 'pending')
                      ->whereHas('transaction', function ($q) use ($user) {
                          $q->where('user_id', $user);
                      });
            })->get();

        $reserved_books = Book::whereHas('book_borrows', function ($query) use ($user) {
            $query->where('status', 'approved')
                  ->where('type', 'reserve')
                  ->whereHas('transaction', function ($q) use ($user) {
                    $q->where('user_id', $user);
                });
        })->get();

        return Inertia::render('home', [
            'borrowed_books' => $borrowed_books ,
            'pending_books' => $pending_books ,
            'reserved_books' => $reserved_books ,
        ]);
    }
    public function show(Request $request) {

        $user = $request->user();
        $borrowed_books = Book::whereHas('book_borrows', function ($query) use ($user) {
                $query->where('status', 'approved')
                      ->where('type', 'borrow')
                      ->where('returned_at', null)
                      ->whereHas('transaction', function ($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            })->get();

        $rejected_return = Book::whereHas('book_borrows', function ($query) use ($user) {
                $query->where('status', 'rejected')
                      ->where('type', 'return')
                      ->whereHas('transaction', function ($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            })->get();

        $borrowed_books = $borrowed_books->concat($rejected_return);

        $pending_books = Book::whereHas('book_borrows', function ($query) use ($user) {
                $query->where('status', 'pending')
                      ->whereHas('transaction', function ($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            })->get();

        $reserved_books = Book::whereHas('book_borrows', function ($query) use ($user) {
                $query->where('status', 'approved')
                      ->where('type', 'reserve')
                      ->whereHas('transaction', function ($q) use ($user) {
                          $q->where('user_id', $user->id);
                      });
            })->get();

        return Inertia::render('home', [
            'borrowed_books' => $borrowed_books ,
            'pending_books' => $pending_books ,
            'reserved_books' => $reserved_books ,
        ]);
    }

    public function ban_user(Request $request)
    {
        $user = User::find($request->input('id'));
        Log::info('Banning user with ID: ' . $request->input('id'));
        if ($user) {
            $user->is_banned = true;
            $user->save();
            return redirect()->route('user', ['id' => $request->input('id')])->with('success', 'User banned successfully.');
        }
        return redirect()->route('user', ['id' => $request->input('id')])->with('error', 'User not found.');
    }

    public function unban_user(Request $request)
    {
        Log::info('Unbanning user with ID: ' . $request->input('id'));
        $user = User::find($request->input('id'));
        if ($user) {
            $user->is_banned = false;
            $user->save();
            return redirect()->route('user', ['id' => $request->input('id')])->with('success', 'User unbanned successfully.');
        }
        return redirect()->route('user', ['id' => $request->input('id')])->with('error', 'User not found.');
    }
}
