//gulp variables
var gulp = require('gulp'),
    minifyhtml = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    through2 = require('through2'),
    config = require('./config.json');
//function to help compile all html files through iteration
function synchro(done) {
    return through2.obj(function (data, enc, cb) {
        cb();
    },
    function (cb) {
        cb();
        done();
    });
}
//function to compile styles
gulp.task('compile_html', function(done){
  var pages = config.pages;
  var doneCounter = 0;
  function incDoneCounter() {
    doneCounter += 1;
    if (doneCounter > pages.length) {
      done();
    }
  }
  for (var i = 0; i < pages.length; ++i) {
      gulp.src([pages[i]])
      .pipe(htmlreplace({
          js: {
            src: 'js/app.min.js',
            tpl: '<script src="%s" charset="utf-8" type="application/javascript"></script>'
          },
          css: {
            src: 'css/critical.min.css',
            tpl: '<link href="%s" rel="stylesheet" charset="utf-8" type="text/css">'
          },
          dns: {
            src: config.app_params.path,
            tpl: '<link href="%s" rel="dns-prefetch">'
          },
          preconnect: {
            src: config.app_params.path,
            tpl: '<link href="%s" rel="preconnect">'
          },
          base: {
            src: config.app_params.path,
            tpl: '<base href="%s">'
          },
          starturl: {
            src: config.app_params.start_url,
            tpl: '<meta name="msapplication-starturl" content="%s">'
          },
        }))
      .pipe(minifyhtml({collapseWhitespace: true, caseSensitive: true, removeComments: true}))
      .pipe(gulp.dest(global.production_folder))
      .pipe(synchro(incDoneCounter));
  }
});
