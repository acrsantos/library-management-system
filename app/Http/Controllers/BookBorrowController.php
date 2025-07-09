<?php

namespace App\Http\Controllers;

use App\Models\BookBorrow;
use App\Models\User;
use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BookBorrowController extends Controller
{
    public function borrow(Request $request){
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'type' => 'required|in:borrow,reserve',
        ]);
        try {
            $book = Book::findOrFail($request->bookId);
            if ($book->copies_available <= 0) {
                return response()->json('No copies available for this book', 400);
            }

            if (!$this->hasAvailableCopies($request->book_id, $request->start_date, $request->due_date)) {
                return redirect()->back()->withErrors(['message' => 'No available copies for the selected dates']);
            }


            $user = User::findOrFail($request->user()->id);
            $transaction = new Transaction();
            $transaction->user()->associate($user);

            // $borrow = BookBorrow::create($request->only(['book_id']));
            if ($request->type === 'reserve') {
                $borrow = new BookBorrow([
                    'type' => 'reserve',
                    'status' => 'pending',
                    'start_date' => $request->start_date ?? now(),
                    'due_date' => $request->due_date ?? now()->addDays(7),
                ]);
            } else if ($request->type === 'borrow') {
                $borrow = new BookBorrow([
                    'type' => 'borrow',
                    'status' => 'pending',
                    'start_date' => now(),
                    'due_date' => $request->due_date ?? now()->addDays(7),
                ]);
                Log::info('User borrowing book', [
                    'Book' => $borrow,
                ]);
            }

            $transaction->save();
            $borrow->transaction()->associate($transaction);
            $borrow->book()->associate($book);

            $borrow->save();

            return redirect()->back()->with('message', 'Book borrow request submitted successfully');
        } catch (\Exception $e) {
            Log::error('Error borrowing book', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->id,
                'book_id' => $request->book_id,
            ]);
        }
    }

    public function return(Request $request) {
        try {
            $borrow = BookBorrow::findOrFail($request->borrowId)->update(['status' => 'pending', 'type' => 'return']);
        } catch (\Exception $e) {
            Log::error('Error updating borrow status', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->borrowId,
            ]);
            return response()->json("Error: failed to return the book", 500);
        }

        return redirect()->back()->with('message', 'Book return request submitted successfully');
    }

    public function cancel(Request $request) {
        try {
            $borrow = BookBorrow::findOrFail($request->borrowId)->update(['status' => 'cancelled']);
        } catch (\Exception $e) {
            Log::error('Error cancelling borrow', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->borrowId,
            ]);
            return response()->json('Error cancelling borrow', 500);
        }

        return redirect()->back()->with('message', 'Book borrow request cancelled successfully');
    }

    public function approve_borrow(Request $request) {
        $book = Book::findOrFail($request->book_id);

        if ($book->copies_available <= 0) {
            return response()->json($book, 400);
        }
        try {
            $book->update(['copies_available' => $book->copies_available - 1]);
        } catch (\Exception $e) {
            Log::error('Error updating book copies', [
                'error' => $e->getMessage(),
                'book_id' => $request->id,
            ]);
            return response()->json('Error updating book copies', 500);
        }

        try {
        $borrow = BookBorrow::findOrFail($request->id)->update(['status' => 'approved']);
        } catch (\Exception $e) {
            Log::error('Error updating borrow status', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->id,
            ]);
            return response()->json($request->id, 500);
        }

        return redirect()->back()->with('message', 'Book borrow request approved successfully');
    }


    public function approve_return(Request $request) {
        $book = Book::findOrFail($request->book_id);
        if ($book->copies_available >= $book->copies_total) {
            return response()->json($book, 400);
        }
        try {
            $borrow = BookBorrow::findOrFail($request->id);
            $borrow->update(['status' => 'approved','type' => 'return', 'returned_at' => now()]);
        } catch (\Exception $e) {
            Log::error('Error approving return', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->id,
            ]);
            return response()->json('Error approving return', 500);
        }
        try {
            $book->update(['copies_available' => $book->copies_available + 1]);
        } catch (\Exception $e) {
            Log::error('Error updating book copies', [
                'error' => $e->getMessage(),
                'book_id' => $request->id,
            ]);
            return response()->json('Error updating book copies', 500);
        }

        return redirect()->back()->with('message', 'Book borrow request approved successfully');
    }

    public function reject_borrow(Request $request) {
        try {
            $borrow = BookBorrow::findOrFail($request->id)->update(['status' => 'rejected']);
        } catch (\Exception $e) {
            Log::error('Error rejecting borrow', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->id,
            ]);
            return response()->json('Error rejecting borrow', 500);
        }

        return redirect()->back()->with('message', 'Book borrow request rejected successfully');
    }

    public function reject_return(Request $request) {
        try {
            $borrow = BookBorrow::findOrFail($request->id)->update(['status' => 'rejected']);
        } catch (\Exception $e) {
            Log::error('Error rejecting return', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->id,
            ]);
            return response()->json('Error rejecting return', 500);
        }

        return redirect()->back()->with('message', 'Book return request rejected successfully');
    }

    public function hasAvailableCopies($bookId, $startDate, $endDate) {
        Log::info("Arguments for hasAvailableCopies", [
            'book_id' => $bookId,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
        $book = Book::findOrFail($bookId);
        $overlaps = BookBorrow::where('book_id', $bookId)
            ->whereIn('status', ['approved', 'pending'])
            ->where('type', 'borrow')
            ->where(function ($query) use ($startDate, $endDate) { $query->where('start_date', '<=', $endDate)->where('due_date', '>=', $startDate);})
            ->count();

        Log::info('Checking available copies for book', [
            'book_id' => $bookId,
            'overlaps' => $overlaps,
            'copies_available' => $book->copies_available,
        ]);
        return ($book->copies_total - $overlaps) > 0;
    }

    public function cancel_request(Request $request) {
        try {
            $borrow = BookBorrow::findOrFail($request->id)->update(['status' => 'cancelled']);
        } catch (\Exception $e) {
            Log::error('Error rejecting return', [
                'error' => $e->getMessage(),
                'borrow_id' => $request->id,
            ]);
            return response()->json('Error rejecting return', 500);
        }

        return redirect()->back()->with('message', 'Book request cancelled successfully');
    }

}
