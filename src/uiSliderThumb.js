//

import {Component, Template} from 'ng2in1';
import angular from 'angular';

// Get all the page.
var HTML_ELEMENT = angular.element(document.body.parentElement);
var COMPONENT_SELECTOR = 'ui-slider-thumb';

@Component({
  link: uiSliderThumbLink,
  require: ['^uiSlider', 'ngModel'],
  scope: {start: '@', end: '@'},
  selector: COMPONENT_SELECTOR
})
export default class uiSliderThumb {
  constructor($element, $attrs, $scope, $swipe) {

    this.$element = $element;

    this._lastPos = NaN;
    // TODO(douglasduteil): use window.performance.now();
    this._time = +new Date();

    this.setupAttrsObservers = _setupAttrsObservers.bind(this, $element, $swipe, $scope)
  }

  updateThumbPosition(coord) {

    this._updateTrackLayoutData();

    // TODO(douglasduteil): use a composition flow
    // @see https://lodash.com/docs#flow
    this._lastPos = coord.x;
    const normalizedPos =
      (this._lastPos - this._trackOrigine) / this._trackSize;
    const projectedValue = this.min + normalizedPos * (this.max - this.min);
    const formatedValue = _formatValue(projectedValue, this.min, this.max, this.step);
    return parseFloat(formatedValue.toFixed(5));

  }

  _updateTrackLayoutData() {

    // TODO(douglasduteil): use window.performance.now();
    if (this._time && +new Date() < this._time + 1000) {
      return;
    } // after ~60 frames

    // track bounding box
    const track_bb = this.$element.parent()[0].getBoundingClientRect();

    // TODO(douglasduteil): use window.performance.now();
    this._time = +new Date();
    this._trackOrigine = track_bb.left;
    this._trackSize = track_bb.width;
  }
}

function uiSliderThumbLink(scope, iElement, iAttrs, [uiSliderCtrl, ngModelCtrl]) {
  const uiSliderThumbCtrl = iElement.controller(uiSliderThumb.name);

  // initialize controller data with parent controller settings
  Object.assign(uiSliderThumbCtrl, {
    max: uiSliderCtrl.max,
    min: uiSliderCtrl.min,
    step: uiSliderCtrl.step
  });

  uiSliderThumbCtrl.setupAttrsObservers({
    uiSliderCtrl,
    uiSliderThumbCtrl,
    ngModelCtrl
  });

  uiSliderNgModel(ngModelCtrl, {$element: iElement, uiSliderCtrl});


}

function _setupAttrsObservers($element, $swipe, $scope, {uiSliderCtrl, uiSliderThumbCtrl, ngModelCtrl}) {

  var hasMultipleThumb = 1 < $element.parent()[0].querySelectorAll(COMPONENT_SELECTOR).length;

  // Bind the click on the bar then you can move it all over the page.
  $swipe.bind(uiSliderCtrl.element, {start: onClickOnTrack});

  function onClickOnTrack(coord, event) {
    if (hasMultipleThumb && event.target !== $element[0]) {
      return;
    }

    hookTheAllDocument();
  }

  function hookTheAllDocument() {

    $swipe.bind(HTML_ELEMENT, {
      start: function (coord, event) {
        event.stopPropagation();
        event.preventDefault();
      },
      move: (coord) => {
        const tumbValue = uiSliderThumbCtrl.updateThumbPosition(coord);
        ngModelCtrl.$setViewValue(tumbValue);
        if (!$scope.$root.$$phase) {
          $scope.$root.$apply();
        }
        ngModelCtrl.$render();
      },
      end: function () {
        // Don't preventDefault and stopPropagation
        // The html element needs to be free of doing anything !
        HTML_ELEMENT.unbind();
      }
    });

    if (!hasMultipleThumb) {
      // Handle simple click
      //_handleMouseEvent(coord);
      //HTML_ELEMENT.triggerHandler('touchstart mousedown', event);
    }

  }
}


function _formatValue(value, min = 0, max = 100, step = 1 / 100000) {
  let formattedValue = value;
  if (min > max) return max;
  formattedValue = Math.floor(formattedValue / step) * step;
  formattedValue = Math.max(Math.min(formattedValue, max), min);
  return formattedValue;
}

function uiSliderNgModel(ngModelCtrl, {$element, uiSliderCtrl}) {
  ngModelCtrl.$render = uiSliderNgModelRender;

  ////

  uiSliderNgModelRender.animationFrameRequested = 0;
  function uiSliderNgModelRender() {
    // Cancel previous rAF call
    if (uiSliderNgModelRender.animationFrameRequested) {
      window.cancelAnimationFrame(uiSliderNgModelRender.animationFrameRequested);
    }

    // Animate the page outside the event
    uiSliderNgModelRender.animationFrameRequested = window.requestAnimationFrame(drawFromTheModelValue);
  }

  function drawFromTheModelValue() {
    var thumbLeftPosition = _formatValue(ngModelCtrl.$viewValue, uiSliderCtrl.min, uiSliderCtrl.max, 1);
    $element.css('left', thumbLeftPosition + '%');
  }
}
