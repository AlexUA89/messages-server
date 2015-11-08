var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function (mix) {

 mix

     .styles([
         'bower_components/bootstrap/dist/css/bootstrap.min.css',
         'public/css/custom.css'
     ], 'public/css/all.css', './')

     .scripts([
         'bower_components/jquery/dist/jquery.min.js',
         'bower_components/bootstrap/dist/js/bootstrap.min.js',
         'public/js/custom.js'
     ], 'public/js/all.js', './')

    .copy('bower_components/bootstrap/dist/fonts', 'public/fonts')
 ;

});
