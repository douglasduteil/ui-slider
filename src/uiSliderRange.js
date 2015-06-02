//

import {Component, Template} from 'ng2in1';
import angular from 'angular';

// Get all the page.
var HTML_ELEMENT = angular.element(document.body.parentElement);
var COMPONENT_SELECTOR = 'ui-slider-thumb';

@Component({
  link: uiSliderRangeLink,
  require: ['^uiSlider'],
  selector: 'ui-slider-range'
})
export default class uiSliderRange {
  static get moduleAnnotation() {
    return {
      factoryName: 'uiSliderRange'
    };
  }

  // @ngInject
  constructor($element, $attrs) {

    this.$element = $element;
    this.$attrs = $attrs;

  }

  renderRangeChange() {
    // TODO(douglasduteil): use lodash partial...
    const projectOnSliderCtrlLimits = (val) => {
      return _projectToMinMaxSpace(
          val, this.uiSliderCtrl.min, this.uiSliderCtrl.max
        ) * 100;
    };

    // TODO(douglasduteil): [REFACTO]
    const min = angular.isDefined(this.min) && angular.isDefined(this.$attrs.min)
      ? this.min : this.uiSliderCtrl.min;
    const max = angular.isDefined(this.max) && angular.isDefined(this.$attrs.max)
      // HACK: the max is initialized at the min value too here...
      ? this.max : this.uiSliderCtrl.max;
    const left = projectOnSliderCtrlLimits(min);
    const right = 100 - projectOnSliderCtrlLimits(max);

    this.$element.css('left', left + '%');
    this.$element.css('right', right + '%');
  }

}

uiSliderRange.$inject = ['$element', '$attrs'];

function uiSliderRangeLink(scope, iElement, iAttrs, [uiSliderCtrl]) {

  const uiSliderRangeCtrl = iElement.controller('uiSliderRange');

  // REQUIRED ! (Lazy injecting...)
  uiSliderRangeCtrl.uiSliderCtrl = uiSliderCtrl;

  ////////////////////////////////////////////////////////////////////
  // OBSERVERS
  ////////////////////////////////////////////////////////////////////

  const OBBSERVED_ATTRS = {
    max: (val) => {
      if (angular.isDefined(val) && !angular.isNumber(val)) {
        val = parseFloat(val, 10);
      }
      uiSliderRangeCtrl.max =
        angular.isNumber(val) && !isNaN(val)
          ? val : undefined;

      uiSliderRangeCtrl.renderRangeChange();
    },
    min: (val) => {
      if (angular.isDefined(val) && !angular.isNumber(val)) {
        val = parseFloat(val, 10);
      }
      uiSliderRangeCtrl.min =
        angular.isNumber(val) && !isNaN(val)
          ? val : undefined;

      uiSliderRangeCtrl.renderRangeChange();
    }
  };

  Object
    .keys(OBBSERVED_ATTRS)
    .map((attrName) => [OBBSERVED_ATTRS[attrName], attrName])
    .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))
  ;

}

function _projectToMinMaxSpace(val, min, max) {
  return (val - min ) / (max - min);
}

