'use strict';

var extend = require('util')._extend;

// No Karma options are passed after the double dash option (`--`)
// Example : karma start --single-run -- --polyfill
//        >> { _: [], polyfill: true }

var _argv = process.argv;
var argv = require('minimist')(_argv.slice(_argv.indexOf('--') + 1));

var options = extend({
  travis: process.env.TRAVIS,
  coverage: false
}, argv);

module.exports = function (config) {

  config.set({
    frameworks: ['mocha', 'chai', 'jspm'],
    files: ['node_modules/babel-core/browser-polyfill.js'],
    reporters: ['mocha'],
    preprocessors: {
      'src/**/*.js': ['babel'],
      'test/**/*.js': ['babel']
    },
    browsers: ['Chrome', 'Firefox'],
    jspm: {
      config: 'jspm.config.js',
      serveFiles: ['index.*', 'src/**/*.js'],
      loadFiles: ['test/**/*.spec.js']
    }
  });

  if (options.travis) {
    // TRAVIS config overwrite
    config.set({
      singleRun: true,
      reporters: ['dots'],
      customLaunchers: {
        'TR_Chrome': {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },
      browsers: ['TR_Chrome', 'Firefox']
    });
  }

  if (options.coverage) {
    config.set({

      reporters: config.reporters.concat(['coverage']),
      preprocessors: {
        'src/**/*.js': ['coverage'],
        'index.js': ['coverage'],
        'test/**/*.js': ['babel']
      },
      coverageReporter: {
        // configure the reporter to use isparta for JavaScript coverage
        instrumenters: {isparta: require('isparta')},
        instrumenter: {
            '**/*.js': 'isparta'
        },

        reporters: [
          { type: 'lcov', subdir: 'report-lcov' },
          { type: 'html', subdir: normalizationBrowserName }
        ]
      },
      browsers: config.browsers.slice(0,1)
    });
  }

};

////

function normalizationBrowserName(browser) {
  return browser.toLowerCase().split(/[ /-]/)[0];
}
