const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');
const fileInclude = require('gulp-file-include');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

// HTML
gulp.task('include', function (callback) {
    return gulp.src('./src/html/*.html')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'HTML include',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(fileInclude({
            prefix: '@@'
        }))
        .pipe(gulp.dest('./dist/'));
    callback();
});

// SASS
gulp.task('sass', function (callback) {
    return gulp.src('./src/sass/main.sass')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            overrideBrowserlist: ['last 5 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.reload({stream: true}));
    callback();
});

// Copy images
gulp.task('copy:img', function () {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('./dist/images/'))
        .pipe(browserSync.reload({stream: true}));
});

// JS babel
gulp.task('js', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(browserSync.reload({stream: true}));
});


// BrowserSync
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    })
});


// Watch
gulp.task('watch', function () {
    watch(['./dist/*.html', './dist/css/**/*.css'], gulp.parallel(browserSync.reload));
    watch('./src/sass/**/*.sass', function () {
        setTimeout(gulp.parallel('sass'), 1000)
    });
    watch('./src/html/**/*.html', gulp.parallel('include'));

    watch('./src/images/**/*.*', gulp.parallel('copy:img'));

    watch('./src/js/**/*.js', gulp.parallel('js'));
});

// Default run all
gulp.task(
    'default',
    gulp.series(
        gulp.parallel('sass', 'include', 'copy:img', 'js'),
        gulp.parallel('server', 'watch')
    ));