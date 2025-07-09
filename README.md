# Library Management System

# Requirements
- PHP
- NodeJS
- Composer
- Laravel

# Setup
## Install dependencies
```
composer install
npm install
```

## Copy environment file
```
cp .env.example .env
```

## Generate application key
```
php artisan key:generate
```

## Set up the database and seed it
```
php artisan migrate --seed
```

## Run the application
```
composer run dev
```
