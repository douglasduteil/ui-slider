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

function uiSliderCompile(tElement) {
  _fillUpElementIfEmpty(tElement);

  return function (scope, iElement, iAttrs, uiSliderCtrl) {
    _observeUiSliderAttributes(iAttrs, uiSliderCtrl);
  }
}

//

function _fillUpElementIfEmpty(tElement) {
  if (tElement.children().length > 0) {
    return;
  }

  // Create a default slider for design purpose.
  if (!tElement.attr('class') && tElement.attr('class') !== '') {
    tElement.addClass('ui-slider--default');
  }

  tElement.append(_getDefaultEmptySliderHtmlTemple());
}

function _getDefaultEmptySliderHtmlTemple() {
  return `
  <ui-slider-thumb
   ng-model="__${Math.random().toString(36).substring(7)}">
  </ui-slider-thumb>
  `;
}

//

function _observeUiSliderAttributes(iAttrs, uiSliderCtrl) {

  // TODO(douglasduteil): [REFACTO] unify observed attrs with change event broadcast
  const OBSERVED_ATTRS = {
    max: (newValue) => {
      if (isNaN(+newValue) || newValue === '') return;
      uiSliderCtrl.max = +newValue;
    },
    min: (newValue) => {
      if (isNaN(+newValue) || newValue === '') return;
      newValue = +newValue;
      uiSliderCtrl.min = +newValue;
    },
    step: (newValue) => {
      if (isNaN(+newValue) || newValue === '') return;
      uiSliderCtrl.step = +newValue;
    }
  };

  Object
    .keys(OBSERVED_ATTRS)
    .map((attrName) => [OBSERVED_ATTRS[attrName], attrName])
    .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))
  ;
}
