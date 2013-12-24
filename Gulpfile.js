/* global  node : true */

'use strict';

var gulp = require('gulp');
var cm = require('./lib/common');

// More libs !
var tasks = require('gulp-load-tasks')();
var karma = require('node-karma-wrapper');
var changelogWrapper = require('conventional-changelog-wrapper');
var ngmin = require('ngmin');

//////////////////////////////////////////////////////////////////////////////
// UTILS
//////////////////////////////////////////////////////////////////////////////

require('gulp-load-tasks')(gulp);


var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %> - <%= today("yyyy-mm-dd") %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');




//////////////////////////////////////////////////////////////////////////////
// BUILD
//////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function() {
  gulp.src('./dist/**').pipe(gulp.rimraf());
});

gulp.task('build', ['uglifySrc'], function(cb){

  // copy css
  gulp.src('./src/*.css')
    .pipe(gulp.dest('./dist/'))
    .on('end', cb);

});

gulp.task('uglifySrc', ['ngmin'], function(cb){

  // copy and minify js
  gulp.src('./dist/*.js')
    .pipe(tasks.uglify())
    .pipe(tasks.rename({ext: '.min.js'}))
    //.pipe(gulp.header.fromFile('./head.tmp', {Ø : cm}))
    .pipe(tasks.header(banner, cm))
    .pipe(gulp.dest('./dist/'))
    .on('end', cb);
});

gulp.task('ngmin', function(cb){
  gulp.src('./src/*.js')
    .pipe(cm.applyOnFileContent(ngmin.annotate))
    .pipe(gulp.dest('./dist'))
    .on('end', cb);
});

gulp.task('copy', function(){
  gulp.src('./head.tmp')
    .pipe(cm.processTemplateFile())
    .pipe(tasks.rename({ext : '.js'}))
    .pipe(gulp.dest('./dist/'));
});




gulp.task('changelog', function(){
  changelogWrapper.generate()
    //.pipe(process.stdout)
    .pipe(
      cm.es.map(function fakeFile(content, cb){
        return cb(null, new cm.File({
          path: './CHANGELOG.md', cwd: './', base: './',
          contents: new Buffer(content)
        }));
      })
    )
    .pipe(tasks.header('# UI.Slider - CHANGELOG'))
    .pipe(gulp.dest('./'));
});






//////////////////////////////////////////////////////////////////////////////
// TESTS
//////////////////////////////////////////////////////////////////////////////

gulp.task('jshintSources', function(){
  gulp.src('./src/*.js')
    .pipe(tasks.jshint('.jshintrc'))
    .pipe(tasks.jshint.reporter(require(require('jshint-stylish'))));
});

gulp.task('jshintTests', function(){
  gulp.src('./test/*.spec.js')
    .pipe(tasks.jshint('./test/.jshintrc'))
    .pipe(tasks.jshint.reporter(require(require('jshint-stylish'))));
});
gulp.task('jshint', ['jshintSources', 'jshintTests'], cm.noop);






function getTestFiles(jquery){
  ///////////////

  var mainFiles = [
    'test/helpers/matchers.js',
    'test/helpers/browserTrigger.js',

    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/*',
    'test/*.spec.js'
  ];

  ///////////////

  var files = ['bower_components/jquery/jquery.js'];
  files = (jquery) ? files.concat(['test/helpers/jquery_alias.js']) : files.concat(['test/helpers/jquery_remove.js']);
  files = files.concat(mainFiles);

  return files;
}

function testConfig(configFile, customOptions){
  var options = { configFile: configFile };
  var travisOptions = process.env.TRAVIS && { browsers: [ 'Firefox', 'PhantomJS'], reporters: ['dots'], singleRun: true  };
  return cm.assign(options, customOptions, travisOptions);
}

var kwjQuery = karma( testConfig('./test/karma.conf.js', { files : getTestFiles(true) } ));
var kwjQlite = karma( testConfig( './test/karma.conf.js', { files : getTestFiles(false) } ));

gulp.task('test', function(cb){
  var done = cm.after(2, cb);

  kwjQuery.simpleRun(done);
  kwjQlite.simpleRun(done);
});


//////////////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['jshint', 'test', 'build'], cm.noop);

gulp.task('serve', function(){
  kwjQuery.inBackground();
  kwjQlite.inBackground();

  gulp.task('continuous testing', function(cb){
    var done = cm.after(2, cb);
    kwjQuery.run(done);
    kwjQlite.run(done);
  });

  // watch the tests
  gulp.watch('./test/**', function(){
    gulp.run('jshintTests', 'continuous testing');
  });

  gulp.watch('./src/**', function(){
    gulp.run('jshintSources', 'continuous testing');
  });

});


