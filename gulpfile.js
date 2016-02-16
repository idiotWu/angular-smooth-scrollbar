var gulp = require('gulp');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var wrapUMD = require('gulp-wrap-umd');
var browserSync = require('browser-sync').create();
var friendlyFormatter = require("eslint-friendly-formatter");

gulp.task('compile', function() {
    return gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(wrapUMD({
            exports: 'undefined', // export nothing
            namespace: 'undefined',
            deps: [{
                name: 'angular',
                globalName: 'angular',
                paramName: 'angular'
            }, {
                name: 'smooth-scrollbar',
                globalName: 'Scrollbar',
                paramName: 'Scrollbar'
            }]
        }))
        .pipe(rename({
            basename: 'angular-smooth-scrollbar'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
});

gulp.task('lint', function() {
    return gulp.src('index.js')
        .pipe(eslint())
        .pipe(eslint.format(friendlyFormatter));
});

gulp.task('serve', ['compile', 'lint'], function() {
    browserSync.init({
        server: ['./test', '.']
    });

    gulp.watch('index.js', ['compile', 'lint']);
    gulp.watch('test/*.*').on('change', browserSync.reload);
});

gulp.task('release', ['compile']);

gulp.task('default', ['serve']);
