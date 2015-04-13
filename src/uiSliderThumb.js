//

import {Component, Template} from 'ng2in1';

import angular from 'angular';
import 'angular-touch';

import uiSlider from './uiSlider';

// Get all the page.
const HTML_ELEMENT = angular.element(document.body.parentElement);

@Component({
  selector: 'ui-slider-thumb',
  require: ['^uiSlider', 'ngModel'],
  link: uiSliderThumbLink
})
export default class uiSliderThumb {
  constructor($element, $swipe) {
    this.$element = $element;
    this.$swipe = $swipe;

  }
}

function uiSliderThumbLink(scope, iElement, iAttrs, [uiSliderCtrl, ngModel]) {
  const uiSliderThumbCtrl = iElement.controller('uiSliderThumb');

  // initialise min/max and step with parent values
  Object.assign(uiSliderThumbCtrl, {
    min: uiSliderCtrl.min,
    max: uiSliderCtrl.max,
    step: uiSliderCtrl.step
  });

}

function eventBinding({
  iElement
  }) {

  var hasMultipleThumb = 1 < iElement.parent()[0].querySelectorAll('ui-slider-thumb').length;

  // Bind the click on the bar then you can move it all over the page.
  $swipe.bind(uiSliderCtrl.element, {
    start(coord, event) {

      if (hasMultipleThumb && event.target !== iElement[0]) {
        return;
      }

      $swipe.bind(HTML_ELEMENT, {
        start(coord, event) {
          event.stopPropagation();
          event.preventDefault();
        },
        move(coord) {
          //_handleMouseEvent(coord);
        },
        end() {
          // Don't preventDefault and stopPropagation
          // The html element needs to be free of doing anything !
          HTML_ELEMENT.unbind();
        }
      });

      // Handle simple click
      //_handleMouseEvent(coord);
      //HTML_ELEMENT.triggerHandler('touchstart mousedown', event);

    }
  });
}

function _handleMouseEvent(coord) {
  // Store the mouse position for later
  _cache.lastPos = coord.x;

  _cached_layout_values();

  var the_thumb_value = uiSliderCtrl.min + (_cache.lastPos - _cache.trackOrigine) / _cache.trackSize * (uiSliderCtrl.max - uiSliderCtrl.min);
  the_thumb_value = getFormattedValue(the_thumb_value);

  ngModel.$setViewValue(parseFloat(the_thumb_value.toFixed(5)));
  if (!scope.$root.$$phase) {
    scope.$root.$apply();
  }
  ngModel.$render();
}
