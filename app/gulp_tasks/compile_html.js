//gulp variables
var gulp = require('gulp'),
    minifyhtml = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    through2 = require('through2'),
    inject = require('gulp-inject'),
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
            src: config.app_params.path + 'js/app.min.js',
            tpl: '<script src="%s" charset="utf-8" type="application/javascript"></script>'
          },
          css: {
            src: config.app_params.path +'css/critical.min.css',
            tpl: '<link href="%s" rel="stylesheet" charset="utf-8" type="text/css">'
          },
          favicon: {
            src: config.app_params.path + 'favicon.ico',
            tpl: '<link rel="shortcut icon" type="image/x-icon" href="%s">'
          },
          manifest: {
            src: config.app_params.path + 'manifest.json',
            tpl: '<link rel="manifest" href="%s">'
          },
          browserconfig: {
            src: config.app_params.path + 'browserconfig.xml',
            tpl: '<meta name="msapplication-config" content="%s">'
          },
          tileImage: {
            src: config.app_params.path + 'mstile-150x150.png',
            tpl: '<meta name="msapplication-TileImage" content="%s">'
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
          }
        }))
      .pipe(inject(gulp.src(config.head_icons, {read: false}),
          {starttag: '<!-- inject:head_icons -->',
            transform : function (filePath) {
              var rawFileName = filePath.split("/img/").pop();
              if (rawFileName.startsWith("safari")) {
                return `<link rel="mask-icon" size="any" href="${config.app_params.path}img/${rawFileName}" color="${config.app_params.theme_color}">`;
              }
              else if (rawFileName.startsWith("android-chrome")) {
                var size = rawFileName.split("android-chrome-").pop().split(".")[0];
                var rel = "icon";
                if(size === "256x256") {
                  rel = "apple-touch-startup-image";
                }
                return `<link rel="${rel}" type="image/png" sizes="${size}" href="${config.app_params.path}img/${rawFileName}">`;
              } else if (rawFileName.startsWith("apple-touch")) {
                var size = rawFileName.split("apple-touch-icon-").pop().split(".")[0];
                if(rawFileName === rawFileName.split("apple-touch-icon-").pop()){
                  size = "180x180";
                }
                return `<link rel="apple-touch-icon" type="image/png" sizes="${size}" href="${config.app_params.path}img/${rawFileName}">`;
              }
          }
        }))
      .pipe(minifyhtml({collapseWhitespace: true, caseSensitive: true, removeComments: true}))
      .pipe(gulp.dest(global.production_folder))
      .pipe(synchro(incDoneCounter));
  }
});
