<?php

namespace App\Http\Controllers;

use App\Models\BookBorrow;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('book_borrows.book', 'user');

        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }
    public function store(Request $request) {
        $request->validate([
            'type' => 'required|in:borrow,reserve',
            'book_ids.*' => 'exists:books,id',
            'due_date' => 'required|date',
        ]);

        $transaction = Transaction::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'status' => 'pending',
        ]);

        foreach ($request->book_ids as $bookId) {
            BookBorrow::create([
                'transaction_id' => $transaction->id,
                'book_id' => $bookId,
                'due_date' => $request->due_date,
            ]);
        }

        return response()->json($transaction->load('bookBorrows.book'), 201);
    }
}
