//

import {Component, Template} from 'ng2in1';
import angular from 'angular';

// Get all the page.
var HTML_ELEMENT = angular.element(document.body.parentElement);
var COMPONENT_SELECTOR = 'ui-slider-thumb';

@Component({
  link: uiSliderThumbLink,
  require: ['^uiSlider', 'ngModel'],
  scope: { start: '@', end: '@' },
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

  formatValue(val) {
    return _formatValue(val, this.min, this.max, this.step);
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

  uiSliderNgModel(ngModelCtrl, { $element: iElement, uiSliderThumbCtrl });

  _observeUiSliderThumbAttributes(iAttrs, uiSliderThumbCtrl);

}

function _setupAttrsObservers($element, $swipe, $scope, {uiSliderCtrl, uiSliderThumbCtrl, ngModelCtrl}) {

  var hasMultipleThumb = 1 < $element.parent()[0].querySelectorAll(COMPONENT_SELECTOR).length;

  // Bind the click on the bar then you can move it all over the page.
  $swipe.bind(uiSliderCtrl.element, { start: onClickOnTrack });

  function onClickOnTrack(coord, event) {
    if (hasMultipleThumb && event.target !== $element[0]) {
      return;
    }

    if (!hasMultipleThumb) {
      // Handle simple click
      _projectCoordToModel(coord);
      HTML_ELEMENT.triggerHandler('touchstart mousedown', event);
    }

    hookTheAllDocument(coord, event);

  }

  function hookTheAllDocument() {

    $swipe.bind(HTML_ELEMENT, {
      start: function (coord, event) {
        event.stopPropagation();
        event.preventDefault();
      },
      move: _projectCoordToModel,
      end: function () {
        // Don't preventDefault and stopPropagation
        // The html element needs to be free of doing anything !
        HTML_ELEMENT.unbind();
      }
    });

  }

  function _projectCoordToModel(coord) {
    const thumbValue = uiSliderThumbCtrl.updateThumbPosition(coord);
    ngModelCtrl.$setViewValue(thumbValue);
    if (!$scope.$root.$$phase) {
      $scope.$root.$apply();
    }
    ngModelCtrl.$render();
  }
}


function _formatValue(value, min = 0, max = 100, step = 1 / 100000) {
  let formattedValue = value;
  if (min > max) return max;
  formattedValue = Math.floor(formattedValue / step) * step;
  formattedValue = Math.max(Math.min(formattedValue, max), min);
  return formattedValue;
}

function uiSliderNgModel(ngModelCtrl, {$element, uiSliderThumbCtrl}) {
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
    var thumbLeftPosition = (ngModelCtrl.$viewValue - uiSliderThumbCtrl.min )
      / (uiSliderThumbCtrl.max - uiSliderThumbCtrl.min) * 100;
    $element.css('left', thumbLeftPosition + '%');
  }

  ////////////////////////////////////////////////////////////////////
  // FORMATTING
  ////////////////////////////////////////////////////////////////////
  // Final view format
  ngModelCtrl.$formatters.push(value => value && +value);

  // Checks that it's on the step
  ngModelCtrl.$parsers.push(function stepParser(value) {
    ngModelCtrl.$setValidity('step', true);
    return Math.floor(value / uiSliderThumbCtrl.step) * uiSliderThumbCtrl.step;
  });
  ngModelCtrl.$formatters.push(function stepValidator(value) {
    if (!ngModelCtrl.$isEmpty(value) && value !== Math.floor(value / uiSliderThumbCtrl.step) * uiSliderThumbCtrl.step) {
      ngModelCtrl.$setValidity('step', false);
      return undefined;
    } else {
      ngModelCtrl.$setValidity('step', true);
      return value;
    }
  });
  ////


  // Checks that it's less then the maximum
  ngModelCtrl.$parsers.push(function maxParser(value) {
    ngModelCtrl.$setValidity('max', true);
    return Math.min(value, uiSliderThumbCtrl.max);
  });
  ngModelCtrl.$formatters.push(function maxValidator(value) {
    if (!ngModelCtrl.$isEmpty(value) && value > uiSliderThumbCtrl.max) {
      ngModelCtrl.$setValidity('max', false);
      return undefined;
    } else {
      ngModelCtrl.$setValidity('max', true);
      return value;
    }
  });

  // Checks that it's more then the minimum
  ngModelCtrl.$parsers.push(function minParser(value) {
    ngModelCtrl.$setValidity('min', true);
    return Math.max(value, uiSliderThumbCtrl.min);
  });
  ngModelCtrl.$formatters.push(function minValidator(value) {
    if (!ngModelCtrl.$isEmpty(value) && value < uiSliderThumbCtrl.min) {
      ngModelCtrl.$setValidity('min', false);
      return undefined;
    } else {
      ngModelCtrl.$setValidity('min', true);
      return value;
    }
  });

  // First check that a number is used
  ngModelCtrl.$formatters.push(function numberValidator(value) {
    if (ngModelCtrl.$isEmpty(value) || angular.isNumber(value)) {
      ngModelCtrl.$setValidity('number', true);
      return value;
    } else {
      ngModelCtrl.$setValidity('number', false);
      return void 0;
    }
  });
}

function hasChangedValue(newVal, oldVal) {
  return !angular.isUndefined(newVal)
    && !isNaN(newVal) && oldVal !== newVal;
}


//

function _observeUiSliderThumbAttributes(iAttrs, uiSliderThumbCtrl) {

  // TODO(douglasduteil): [REFACTO] unify observed attrs with change event broadcast
  const OBBSERVED_ATTRS = {
    max: (newValue) => {
      if (isNaN(+newValue) || newValue === '') { return; }
      uiSliderThumbCtrl.max = +newValue;
    },
    min: (newValue) => {
      if (isNaN(+newValue) || newValue === '') { return; }
      uiSliderThumbCtrl.min = +newValue;
    },
    step: (newValue) => {
      if (isNaN(+newValue) || newValue === '') { return; }
      uiSliderThumbCtrl.step = +newValue;
    }
  };

  Object
    .keys(OBBSERVED_ATTRS)
    .map((attrName) => [OBBSERVED_ATTRS[attrName], attrName])
    .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))

}
