//gulp variables
var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify-es').default,
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    replace = require('gulp-replace-task'),
    strip = require('gulp-strip-comments'),
    through2 = require('through2'),
    runSequence = require('run-sequence'),
    replaceBatch = require('gulp-batch-replace'),
    config = require('./config.json'),
    js = config.js;
//compile javascript
gulp.task('compile_js', function(callback) {
  runSequence(
    ['service_worker', 'bundle_js'],
    callback);
});
//function to help compile all javascript files through iteration
function synchro(done) {
  return through2.obj(function (data, enc, cb) {
    cb();
  },
  function (cb) {
    cb();
    done();
  });
}
//transpile and minify servce worker
gulp.task('service_worker', () => {
  var cacheFiles = config.sw_files;
  var replaceThis = [
    ['_APP_CACHE_FILES_', cacheFiles]
  ];
  return gulp.src([config.service_worker])
    .pipe(replaceBatch(replaceThis))
    .pipe(strip())
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify())
    .pipe(gulp.dest(global.production_folder));
});
//function to compile styles
gulp.task('bundle_js', function(done){
  var filenames = Object.keys(config.js);
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter >= filenames.length) {
      done();
    }
  }
  for (var i = 0; i < filenames.length; ++i) {
    var filename = filenames[i];
    var files = config.js[filename];
    var output_file=filename+".min.js";
    gulp.src(files)
      .pipe(sourcemaps.init())
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(concat(filename+'.min.js'))
      .pipe(sourcemaps.write())
      .pipe(replace({
        patterns: [{
           match: /_SCOPE_/g,
           replacement: config.app_params.scope
        },
        {
           match: /_START_URL_/g,
           replacement: config.app_params.start_url
        },
        {
           match: /_MAPBOX_API_KEY_/g,
           replacement: config.app_params.mapboxkey
        },
        {
           match: /_RESTAURANTS_URL_/g,
           replacement: config.app_params.endpoints.restaurants
        },
        {
           match: /_REVIEWS_URL_/g,
           replacement: config.app_params.endpoints.reviews
        }
      ]
      }))
      .pipe(strip())
      .pipe(gulp.dest(global.production_folder+"/js"))
      .pipe(synchro(incDoneCounter));
  }
});
