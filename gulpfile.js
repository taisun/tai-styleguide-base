'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')();

gulp.task('serve', function() {
  gulp.src('./')
    .pipe($.webserver({
      livereload: true,
      port: 9000,
    }));
});

gulp.task('sass', function () {
    var sassOption = {
        style: 'expanded'
    };
    return $.rubySass('_src/sass/styles.scss', sassOption)
            .on('error', function (err) {
                $.notify.onError('Error: <%= err.message %>');
            })
            .pipe($.plumber({
                 errorHandler: $.notify.onError("Error: <%= error.message %>")
            }))
            .pipe(gulp.dest('_dest/css'));
});

gulp.task('cssconcat', function () {
    var files = [
        '_dest/css/styles.css'
    ];
    return gulp.src(files)
        .pipe($.concat('main.css'))
        .pipe(gulp.dest('./htdocs/css/'));
});

gulp.task('cssmin', function () {
    return gulp.src('./css/main.css')
        .pipe($.autoprefixer( {browser: ['last 3 version', 'ie >= 8', 'Android 4.0']}))
        .pipe($.minifyCss({keepBreaks:true}))
        .pipe(gulp.dest('./htdocs/css/'))
        .pipe($.notify("Compilation checking finish cssmin."));
});

gulp.task('styleguide', function(){
    return gulp.src('config.yml')
        .pipe($.hologram())
        .pipe(reload({stream:true}));
});
gulp.task('csstest', function(){
    return gulp.src('dest/css/*.css')
        .pipe($.csslint())
        .pipe($.csslintReport({'filename': 'csslint-report.html', 'directory': './cssreport/'}));
});

gulp.task('watch', ['serve', 'styles', 'build', 'scripts'], function () {
    var server = $.livereload();

    gulp.watch('_src/sass/**/*.scss', ['styles']);
    gulp.watch('_dest/css/style.css', ['hologram']);
    gulp.watch([
        '_dest/css/*.css',
        '_src/sass/**/*.scss',
    ]).on('change', function (file) {
        server.changed(file.path);
    });

});
