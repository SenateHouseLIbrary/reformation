var gulp = require('gulp');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglifyjs');
var compass = require('gulp-compass');

gulp.task('compass', function() {
  gulp.src('sass/**/*.scss').pipe(
    compass({
      config_file: './config.rb',
      css: 'css',
      sass: 'sass'
    })
  );
});

gulp.task('uglify', function() {
  gulp
    .src('lib/*.js')
    .pipe(uglify('main.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch('sass/**/*.scss', ['compass']);
  gulp.watch('lib/*.js', ['uglify']);
  gulp.watch(['css/*.css', 'js/*.js'], function(files) {
    livereload.changed(files);
  });
});
