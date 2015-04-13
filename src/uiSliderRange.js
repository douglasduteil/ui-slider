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
  constructor($element, $attrs) {

    this.$element = $element;
    this.$attrs = $attrs;

  }

  formatMaxValue(newVal){
    let displayed = angular.isDefined(this.$attrs.start) || angular.isDefined(this.$attrs.end);
    let val = !isNaN(+newVal) ? +newVal : displayed ? 100 : 0;
    val = (val - this.uiSliderCtrl.min ) / (this.uiSliderCtrl.max - this.uiSliderCtrl.min) * 100;
    return val;
    // TODO add half of th width of the targeted thumb ([ng-model='+ iAttrs.$attr.end + '])
    // TODO force width 0 if (left + right === 100 )

  }

  formatMinValue(newVal){
    let val = !isNaN(+newVal) ? +newVal : 0;
    val = (val - this.uiSliderCtrl.min ) / (this.uiSliderCtrl.max - this.uiSliderCtrl.min) * 100;
    return val;
    // TODO add half of th width of the targeted thumb ([ng-model='+ iAttrs.$attr.start + '])
    // TODO force width 0 if (left + right === 100 )
  }
}

function uiSliderRangeLink(scope, iElement, iAttrs, [uiSliderCtrl]) {

  const uiSliderRangeCtrl = iElement.controller(uiSliderRange.name);

  // REQUIRED ! (Lazy injecting...)
  uiSliderRangeCtrl.uiSliderCtrl = uiSliderCtrl;

  ////////////////////////////////////////////////////////////////////
  // OBSERVERS
  ////////////////////////////////////////////////////////////////////

  const OBBSERVED_ATTRS = {
    max: (newValue) => {
      const maxVal = uiSliderRangeCtrl.formatMaxValue(newValue);
      iElement.css('right', (100 - maxVal) + '%');
    },
    min: (newValue) => {
      const minVal = uiSliderRangeCtrl.formatMinValue(newValue);
      iElement.css('left', (minVal) + '%');
    }
  };

  Object
    .keys(OBBSERVED_ATTRS)
    .map((attrName) => [OBBSERVED_ATTRS[attrName], attrName])
    .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))
  ;

}
