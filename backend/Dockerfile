FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev unzip git curl \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000