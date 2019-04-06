//gulp variables
var gulp = require('gulp'),
    json_modify = require('gulp-json-modify'),
    runSequence = require('run-sequence'),
    del = require('del'),
    requireDir = require('require-dir')('./gulp_tasks'),
    config = require('./gulp_tasks/config.json'),
    folders=config.folders;
gulp.task('default', function () {
  global.production_folder = folders.dist;
  gulp.start('build_app');
});
//function to build app
gulp.task('build_app', function(callback) {
  runSequence(
    'build_clean',
    ['compile_html', 'copy_browserconfig', 'change_manifest_starturl', 'optimize_images', 'compile_styles', 'compile_js'],
    callback);
});

//delete folders for production
gulp.task('build_clean', function() {
  var folders = [global.production_folder];
  return del.sync(folders);
});
//copy browserconfig.xml
gulp.task('copy_browserconfig', function() {
  return gulp.src(config.browserconfig)
  .pipe(gulp.dest(global.production_folder))
});
//change start url in manifest
gulp.task('change_manifest_starturl', function () {
  return gulp.src([config.manifest])
    .pipe(json_modify({
      key: 'start_url',
      value: config.app_params.start_url
    }))
    .pipe(gulp.dest(global.production_folder));
});
