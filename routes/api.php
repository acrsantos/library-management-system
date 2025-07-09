<?php

use App\Http\Controllers\BookBorrowController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth');


Route::group([], function () {
    Route::post('/borrow/approve-borrow', [BookBorrowController::class, 'approve_borrow']);
    Route::post('/borrow/reject-borrow', [BookBorrowController::class, 'reject_borrow']);

    Route::post('/borrow/approve-return', [BookBorrowController::class, 'approve_return']);
    Route::post('/borrow/reject-return', [BookBorrowController::class, 'reject_return']);
    Route::post('/borrow/cancel-request', [BookBorrowController::class, 'cancel_request']);

    Route::post('/user/ban', [UserController::class, 'ban_user']);
    Route::post('/user/unban', [UserController::class, 'unban_user']);

});

