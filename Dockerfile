FROM php:8.2-apache
RUN a2enmod rewrite
RUN rm -rf /var/www/html/*
COPY . /var/www/html/
