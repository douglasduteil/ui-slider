//

import {Component, Template} from 'ng2in1';
import angular from 'angular';

// Get all the page.
var HTML_ELEMENT = angular.element(document.body.parentElement);
var COMPONENT_SELECTOR = 'ui-slider-thumb';

@Component({
  link: uiSliderRangeLink,
  require: ['^uiSlider'],
  scope: {min: '@', max: '@'},
  selector: 'ui-slider-range'
})
export default class uiSliderRange {
  constructor($element) {

    this.$element = $element;


  }

}

function uiSliderRangeLink(scope, iElement, iAttrs, [uiSliderCtrl]) {

  const uiSliderRangeCtrl = iElement.controller(uiSliderRange.name);


  ////////////////////////////////////////////////////////////////////
  // OBSERVERS
  ////////////////////////////////////////////////////////////////////

  const OBBSERVED_ATTRS = {
    max: _onUpdateMaxValue,
    min: _onUpdateMinValue
  };

  Object
    .keys(OBBSERVED_ATTRS)
    .map((attrName) => [OBBSERVED_ATTRS[attrName], attrName])
    .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))
  ;


  //

  function _onUpdateMaxValue(newVal) {
    let displayed = angular.isDefined(iAttrs.start) || angular.isDefined(iAttrs.end);
    let val = !isNaN(+newVal) ? +newVal : displayed ? 100 : 0;
    val = (val - uiSliderCtrl.min ) / (uiSliderCtrl.max - uiSliderCtrl.min) * 100;
    // TODO add half of th width of the targeted thumb ([ng-model='+ iAttrs.$attr.end + '])
    // TODO force width 0 if (left + right === 100 )
    iElement.css('right', (100 - val) + '%');
  }

  function _onUpdateMinValue(newVal) {
    let val = !isNaN(+newVal) ? +newVal : 0;
    val = (val - uiSliderCtrl.min ) / (uiSliderCtrl.max - uiSliderCtrl.min) * 100;
    // TODO add half of th width of the targeted thumb ([ng-model='+ iAttrs.$attr.start + '])
    // TODO force width 0 if (left + right === 100 )
    iElement.css('left', val + '%');
  }

/*
  // Observe the start attr (default 0%)
  iAttrs.$observe('min', function (newVal) {
    var val = !isNaN(+newVal) ? +newVal : 0;
    val = (val - uiSliderCtrl.min ) / (uiSliderCtrl.max - uiSliderCtrl.min) * 100;
    // TODO add half of th width of the targeted thumb ([ng-model='+ iAttrs.$attr.start + '])
    // TODO force width 0 if (left + right === 100 )
    iElement.css('left', val + '%');
  });

  // Observe the min attr (default 100%)
  iAttrs.$observe('max', function (newVal) {
    // Don't display the range if no attr are specified
    var displayed = angular.isDefined(iAttrs.start) || angular.isDefined(iAttrs.end);
    var val = !isNaN(+newVal) ? +newVal : displayed ? 100 : 0;
    val = (val - uiSliderCtrl.min ) / (uiSliderCtrl.max - uiSliderCtrl.min) * 100;
    // TODO add half of th width of the targeted thumb ([ng-model='+ iAttrs.$attr.end + '])
    // TODO force width 0 if (left + right === 100 )
    iElement.css('right', (100 - val) + '%');
  });*/
}
