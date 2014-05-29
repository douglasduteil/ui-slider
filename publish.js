/* jshint node:true */

'use strict';

var fs = require('fs');

module.exports = function() {

  return {
    humaName : 'UI.Slider',
    repoName : 'ui-slider',
    inlineHTML : fs.readFileSync(__dirname + '/demo/index.html'),
    inlineJS : 'angular.module(\'doc.ui-slider\', [\'ui.slider\', \'prettifyDirective\', \'ui.bootstrap\', \'plunker\' ]);',
    css : ['dist/ui-slider.css'],
    js : ['dist/ui-slider.js']
  };
};
