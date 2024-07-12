# Use the official PHP image with PHP 8.2
# Stage 1: Build the PHP application
FROM php:8.2-fpm as php-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl

# Configure PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd pdo pdo_mysql

# Copy existing application directory contents
COPY . /var/www

# Set the working directory inside the container
WORKDIR /var/www

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Install npm dependencies and run the build
RUN npm install && npm run production && npm run build

## Start the application
#CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]


# Stage 2: Nginx for serving static files
FROM nginx:latest

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files from the PHP build stage
COPY --from=php-fpm /var/www/storage/app/static /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
#CMD ["nginx", "-g", "daemon off;"]
