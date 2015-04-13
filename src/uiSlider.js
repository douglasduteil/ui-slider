//

import {Component, Template} from 'ng2in1';
import uiSliderThumb from './uiSliderThumb';
import uiSliderRange from './uiSliderRange';

@Component({
  selector: 'ui-slider',
  compile: uiSliderCompile
})
@Template({
  directives: [uiSliderThumb, uiSliderRange]
})
export default class uiSlider {
  constructor($element) {
    this.element = $element;
    this.min = 0;
    this.max = 100;
    this.step = 1;
  }
}

////

function uiSliderCompile(tElement, tAttrs, transclude) {
  fillUpElementIfEmpty(tElement);

  return function (scope, iElement, iAttrs, uiSliderCtrl){

    ////////////////////////////////////////////////////////////////////
    // OBSERVERS
    ////////////////////////////////////////////////////////////////////

    const OBBSERVED_ATTRS = {
      max: (newValue) => {
        newValue = +newValue;
        const maxVal = !isNaN(newValue) ? newValue: uiSliderCtrl.max;
        if (hasChangedValue(maxVal, uiSliderCtrl.max)) {
          uiSliderCtrl.max = maxVal;
          //scope.$emit('uiSliderCtrl.max', maxVal);
        }
      },
      min: (newValue) => {
        newValue = +newValue;
        const minVal = !isNaN(newValue) ? newValue: uiSliderCtrl.mi;
        if (hasChangedValue(minVal, uiSliderCtrl.min)) {
          uiSliderCtrl.min = minVal;
          //scope.$emit('uiSliderCtrl.min', minVal);
        }
      },
      step: (newValue) => {
        newValue = +newValue;
        const stepVal = !isNaN(newValue) ? newValue: uiSliderCtrl.step;
        if (hasChangedValue(stepVal, uiSliderCtrl.step)) {
          uiSliderCtrl.step = stepVal;
          //scope.$emit('uiSliderCtrl.step', stepVal);
        }
      }
    };

    Object
      .keys(OBBSERVED_ATTRS)
      .map((attrName) => [OBBSERVED_ATTRS[attrName], attrName])
      .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))
    ;
  }
}

function fillUpElementIfEmpty(tElement) {
  if (tElement.children().length > 0) {
    return;
  }

  // Create a default slider for design purpose.
  if (!tElement.attr('class') && tElement.attr('class') !== '') {
    tElement.addClass('ui-slider--default');
  }

  tElement.append(getDefaultEmptySliderHtmlYTemple());
}

function getDefaultEmptySliderHtmlYTemple() {
  return `
  <ui-slider-thumb
   ng-model="__${Math.random().toString(36).substring(7)}">
  </ui-slider-thumb>
  `;
}

function hasChangedValue(newVal, oldVal){
  return !angular.isUndefined(newVal)
    && !isNaN(newVal) && oldVal !== newVal;
}
