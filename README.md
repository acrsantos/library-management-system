# Initial Setup
```
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:models
npm install --save-dev @prettier/plugin-php
```

# Seed the database (Populating the database with data)
## With migration (setting up the initial structure of db)
```
php artisan migrate:fresh --seed
```
## Without migration (purely for seeding the database)
```
php artisan db:seed
```

# TODO:
- [x] Define database tables attributes
- [x] populate the db
- [ ] PAGES:
    - [ ] catalog
        - search
        - filter (genre, date published range)
    - [ ] user
        - profile information
        - reserved books
        - history
        - currently borrowing books
    - [ ] home
        - Welcome message
        - currently borrowing books
        - reserved books
    - [ ] book/{id}
        - Image
        - Information
            - Name
            - Description
            - Author
            - Genre
            - Total page
            - Date published
            - Overall Rating and total number of ratings
            - Individual Star Rating (5 - 1)
            - Copies available
            - Request to borrow/reserve button
    - [ ] dashboard (librarian)
        - Pending approval borrow requests
        - currently borrowed books
        - Reservation requests (once approved, the book will be reserved for the user)
        - View users transactions
        - View overdue borrow date
        - Ban users

        - Accept/Reject borrow request
        - View user transaction
        - Book transaction history
        - Edit Borrow/Reservation request (tentative)

Book UI & Catalog UI
- Link to author
AUTHOR UI

Book (USER):
    - If the book is already borrowed by the user, they can only return it.
    - If the book has no available copies, the user can only reserve it.
    - Add date

Flash message

Publisher
Author
Genre

Borrow
View overdue borrow date
View due
Borrow

Dashboard
reserve cancel
