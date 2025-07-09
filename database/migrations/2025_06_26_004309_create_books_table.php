<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publisher_id');
            $table->string('title');
            $table->float('rating');
            $table->longText('description');
            $table->string('language');
            $table->integer('total_page');
            $table->date('date_published')->nullable();
            $table->integer('num_ratings');
            $table->json('star_ratings');
            $table->string('cover_img');
            $table->integer('copies_available');
            $table->integer('copies_total');
        });
        Schema::create('book_genre', function (Blueprint $table) {
            $table->foreignId('genre_id');
            $table->foreignId('book_id');
            // $table->primary(['book_id', 'genre_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_genre');
        Schema::dropIfExists('books');
    }
};
