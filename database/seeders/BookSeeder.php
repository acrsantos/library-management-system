<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Publisher;
use App\Models\Genre;
use App\Models\Author;

use DateTime;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use League\Csv\Reader;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $csv = Reader::createFromPath(database_path('seeders/books_dataset.csv'), 'r');
        $csv->setHeaderOffset(0);

        foreach($csv->getRecords() as $row) {
            $publisher = Publisher::firstOrCreate([
                'name' => trim($row['publisher'])
            ]);
            $date = DateTime::createFromFormat('m/d/y', trim($row['publishDate']));
            $book = Book::create([
                'title' => trim($row['title']),
                'rating' => (float)$row['rating'],
                'description' => $row['description'],
                'language' => $row['language'],
                'publisher_id' => $publisher->id,
                'total_page' => (int) $row['pages'],
                'date_published' => $date ? $date->format('Y-m-d') : null,
                'num_ratings' => (int) $row['numRatings'],
                'star_ratings' => json_decode($row['ratingsByStars']),
                'cover_img' => $row['coverImg'],
                'copies_available' => 3,
                'copies_total' => 3
            ]);
            $authors = array_map(function ($a) {
                return trim(preg_replace('/\s*\(.*?\)/', '', $a));
            }, explode(',', $row['author']));
            // $authors = explode(',', $row['author']);
            foreach ($authors as $author_name) {
                $author = Author::firstOrCreate([
                    'name' => $author_name
                ]);
                $book->authors()->attach($author->id);
            }

            $genres = json_decode($row['genres']);
            foreach ($genres as $genre_name) {
                $genre = Genre::firstOrCreate([
                    'name' => trim($genre_name)
                ]);
                $book->genres()->attach($genre->id);
            }
        }

    }
}
