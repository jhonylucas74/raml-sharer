  var gulp   = require('gulp');
  var concat = require('gulp-concat');
  var run    = require('gulp-run');

  gulp.task('default', ['concatControllers','concatCSS','electron']);

  // Concat js controllers files
  gulp.task('concatControllers', function() {
    return gulp.src('./src/js/controllers/*.js')
      .pipe(concat('controllers.js'))
      .pipe(gulp.dest('./public/js/build/'));
  });


  // Concat css files
  gulp.task('concatCSS', function() {
    return gulp.src('./src/css/*.css')
      .pipe(concat('layout.js'))
      .pipe(gulp.dest('./public/css/build/'));
  });

  // Run electron
  gulp.task('electron', function () {
    run('npm start').exec();
  });
