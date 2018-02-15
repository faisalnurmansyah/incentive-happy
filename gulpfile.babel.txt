
'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

var sass = require('gulp-sass');
var pug = require('gulp-pug');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var onError = function(err) { // Custom error msg with beep sound and text color
    notify.onError({
      title:    "Gulp error in " + err.plugin,
      message:  err.toString()
    })(err);
    beeper(3);
    this.emit('end');
    gutil.log(gutil.colors.red(err));
};

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('sass', function () {
    gulp.src('app/styles/**/*.sass')
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'));
});

// Lint JavaScript
gulp.task('lint', () =>
gulp.src('app/scripts/**/*.js')
//.pipe($.eslint())
//.pipe($.eslint.format())
//.pipe($.if(!browserSync.active, $.eslint.failOnError()))
);

// Optimize images
gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  //.pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
})

// Copy all files at the root level (app)
gulp.task('copy', () =>
gulp.src([
    'app/*.html',
    'app/*/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
], {
    dot: true
})
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

gulp.task('plug', () =>
gulp.src([
    'app/plugins/**',
], {
    dot: true
})
    .pipe(gulp.dest('dist/plugins'))
    .pipe($.size({title: 'Plugins'}))
);

gulp.task('templates', function() {
  gulp.src('app/*.pug')
  //.pipe(plumber({ errorHandler: onError }))
  .pipe(pug({
    pretty: true 
  }))
  .pipe(plumber({ errorHandler: onError }))
  .pipe(gulp.dest('.tmp/'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
    const AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];
// For best performance, don't add Sass partials to `gulp.src`
return gulp.src([
    'app/styles/**/*.sass',
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
        precision: 10,
        outputStyle: 'compact'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'));
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () =>
gulp.src([
    // Note: Since we are not using useref in the scripts build pipeline,
    //       you need to explicitly list your scripts here in the right order
    //       to be correctly concatenated
    './app/scripts/*.js'
    // Other scripts
])
    .pipe($.newer('.tmp/scripts'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/scripts'))
    //.pipe($.concat('main.min.js'))
    //.pipe($.uglify({preserveComments: 'some'}))
    // Output files
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'))
);

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
    return gulp.src('app/**/*.+(txt|ico|json)')
        .pipe($.useref({searchPath: '{.tmp,app}'}))
        // Remove any unused CSS
        //.pipe($.if('*.css', $.uncss({
        //  html: [
        //    'app/index.html'
        //  ],
        //  // CSS Selectors for UnCSS to ignore
        //  ignore: []
        //})))

        // Concatenate and minify styles
        // In case you are still using useref build blocks
        //.pipe($.if('*.css', $.minifyCss()))

        // Minify any HTML
        //.pipe($.if('*.html', $.minifyHtml()))
        // Output files

        .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
        .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles','templates'], () => {
    browserSync({
        notify: false,
        // Customize the Browsersync console logging prefix
        logPrefix: 'ASK',
        // Allow scroll syncing across breakpoints
        scrollElementMapping: ['main', '.mdl-layout'],
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['.tmp', 'app'],
        port: 3000
    });

gulp.watch(['app/**/*.html'], reload);
gulp.watch(['app/**/*.pug', 'app/templates/**/*.pug'], ['templates',reload]);
gulp.watch(['app/styles/**/*.{scss,sass,css}'], ['styles',reload]);
gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts',reload]);
gulp.watch(['app/images/**/*'], ['images',reload]);
gulp.watch(['app/fonts/**/*'], ['fonts',reload]);
gulp.watch('app/styles/**/*.sass', ['sass']);

});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
browserSync({
    notify: false,
    logPrefix: 'ASK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001
})
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
runSequence(
    'styles',
    'images',
    'fonts',
    ['lint','templates','html','scripts','copy'],
    'plug',
    cb
)
);

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
    // Update the below URL to the public URL of your site
pagespeed('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'AIzaSyDl8kyAvMCUKvAzdscqomt9LHryWuo7Jus'
}, cb)
);

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
gulp.task('copy-sw-scripts', () => {
    return gulp.src(['node_modules/sw-toolbox/sw-toolbox.js', 'app/scripts/sw/runtime-caching.js'])
        .pipe(gulp.dest('dist/scripts/sw'));
});