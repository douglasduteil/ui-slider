'use strict';

var path = require('path');

var cm = module.exports = {};

// External libs.
cm.noop = function () {};
cm.date = require('dateformat');
cm.es = require('event-stream');
cm.assign = require('lodash.assign');
cm.after = require('lodash.after');
cm.template = require('lodash.template');
cm.pkg = require(path.resolve(process.cwd(), './package.json'));
cm.gutil = require('gulp-util');


/**
  * Apply a function on each file
  */
cm.applyOnFile = function(fct){
  var args = Array.prototype.slice.call(arguments, 1);
  return cm.es.map(function (file, cb) {
    file.contents = fct.apply(null, [file].concat(args));
    cb(null, file);
  });
}

cm.processTemplateFile = function(options){
  return cm.applyOnFile(function(file){
    return new Buffer(cm.gutil.template(file.contents , cm.assign({file : file}, cm, options) ));
  })
};

/**
  * Apply a function on the content of each files
  */
cm.applyOnFileContent = function(fct){
  var args = Array.prototype.slice.call(arguments, 1);
  return cm.es.map(function (file, cb) {
    file.contents = fct.apply(null, [file.contents].concat(args));
    cb(null, file);
  });
}

cm.today = function(format) {
  return cm.date(new Date(), format);
};

cm.templateFile = function (options) {
  return cm.es.map(function (file, cb) {
    file.contents = new Buffer(cm.template(file.contents, cm.assign({file : file}, cm, options)));
    cb(null, file);
  });
};

