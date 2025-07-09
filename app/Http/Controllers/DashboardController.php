<?php

namespace App\Http\Controllers;

use App\Models\BookBorrow;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'librarian') {
            return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
        }
        $pending_borrow = BookBorrow::with(['transaction.user', 'book'])->where('type', 'borrow')->where('status', 'pending')->orderBy('created_at', 'desc')->get();
        $pending_borrow->concat(BookBorrow::with(['transaction.user', 'book'])->where('type', 'reserve')->where('status', 'approved')->where('start_date', '=', today())->get());
        $pending_return = BookBorrow::with(['transaction.user', 'book'])->where('type', 'return')->where('status', 'pending')->orderBy('created_at', 'desc')->get();
        $pending_reserve = BookBorrow::with(['transaction.user', 'book'])->where('type', 'reserve')->where('status', 'pending')->orderBy('created_at', 'desc')->get();
        $pending_reserve_borrow = BookBorrow::with(['transaction.user', 'book'])->where('type', 'reserve')->where('status', 'approved')->where('start_date', '!=', today())->orderBy('created_at', 'desc')->get();
        $pending_reserve_today = BookBorrow::with(['transaction.user', 'book'])->where('type', 'reserve')->where('status', 'approved')->where('start_date', '=', today())->orderBy('created_at', 'desc')->get();
        $borrowed_books = BookBorrow::with(['transaction.user', 'book'])
            ->where('type', 'borrow')
            ->where('status', 'approved')
            ->whereNull('returned_at')
            ->orderBy('created_at', 'desc')
            ->get();
        $history = BookBorrow::with(['transaction.user', 'book'])->where('status', '!=', 'pending')->orderBy('created_at', 'desc')->get();
        $overdue_books = BookBorrow::with(['transaction.user', 'book'])
            ->where('type', 'borrow')
            ->where('status', 'approved')
            ->whereNull('returned_at')
            ->where('due_date', '<', today())
            ->orderBy('created_at', 'desc')
            ->get();

        $pending_borrow = $pending_borrow->concat($pending_reserve_today);


        return inertia('dashboard', [
            'pending_borrow' => $pending_borrow,
            'pending_return' => $pending_return,
            'pending_reserve' => $pending_reserve,
            'pending_reserve_borrow' => $pending_reserve_borrow,
            'borrowed_books' => $borrowed_books,
            'history' => $history,
            'overdue_books' => $overdue_books,
        ]);
    }

    public function users(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'librarian') {
            return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
        }
        $users = User::simplePaginate(10);

        return Inertia::render('userSearch', ['users' => Inertia::deepMerge($users)]);
    }

    public function user_search(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'librarian') {
            return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
        }

        $search_key = strtolower(trim($request->input('key')));
        $users = User::whereRaw('LOWER(name) like ?', ["%$search_key%"])->simplePaginate(10);
        return Inertia::render('userSearch', ['users' => Inertia::deepMerge($users)]);
    }

    public function show(Request $request, $id) {
        $userId = $id;
        $user = $request->user();
        if ($user->role !== 'librarian') {
            return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
        }

        $user = User::find($userId);
        $pending_borrow = BookBorrow::with(['transaction.user', 'book'])->where('type', 'borrow')->where('status', 'pending')->whereHas('transaction', function ($query) use ($userId) {$query->where('user_id', $userId);})->get();
        $pending_return = BookBorrow::with(['transaction.user', 'book'])->where('type', 'return')->where('status', 'pending')->whereHas('transaction', function ($query) use ($userId) {$query->where('user_id', $userId);})->get();
        $pending_reserve = BookBorrow::with(['transaction.user', 'book'])->where('type', 'reserve')->where('status', 'pending')->whereHas('transaction', function ($query) use ($userId) {$query->where('user_id', $userId);})->get();
        $history = BookBorrow::with(['transaction.user', 'book'])->where('status', '!=', 'pending')->whereHas('transaction', function ($query) use ($userId) {$query->where('user_id', $userId);})->get();

        $borrowed_books = BookBorrow::with(['transaction.user', 'book'])
            ->where('type', 'borrow')
            ->where('status', 'approved')
            ->whereNull('returned_at')
            ->whereHas('transaction', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->get();
        $reserved_books = BookBorrow::with(['transaction.user', 'book'])
            ->where('type', 'reserve')
            ->where('status', 'approved')
            ->whereHas('transaction', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->get();

        // Return the dashboard view with user data
        return inertia('user', [
            'borrowed_books' => $borrowed_books,
            'reserved_books' => $reserved_books,
            'pending_borrow' => $pending_borrow,
            'pending_return' => $pending_return,
            'pending_reserve' => $pending_reserve,
            'history' => $history,
            'user' => $user,
        ]);
    }
}
