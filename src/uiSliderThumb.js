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
  constructor($injector, $element, $attrs, $scope, $swipe) {

    this.$injector = $injector;
    this.$element = $element;

    this._lastPos = NaN;
    // TODO(douglasduteil): use window.performance.now();
    this._time = +new Date();

    this.setupAttrsObservers = _setupMouseEvent.bind(this, $element, $swipe, $scope)
  }

  updateThumbPosition(coord) {

    this._updateTrackLayoutData();

    // TODO(douglasduteil): use a composition flow
    // @see https://lodash.com/docs#flow
    this._lastPos = coord.x;
    const normalizedPos =
      (this._lastPos - this._trackOrigine) / this._trackSize;
    //const projectedValue = this.min + normalizedPos * (this.max - this.min);
    //const formatedValue = _formatValue(projectedValue, this.min, this.max, this.step);
    return parseFloat(normalizedPos.toFixed(5));

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

  uiSliderThumbCtrl.setupAttrsObservers({
    uiSliderCtrl,
    uiSliderThumbCtrl,
    ngModelCtrl
  });

  uiSliderNgModel(ngModelCtrl, {
    $element: iElement,
    uiSliderCtrl,
    uiSliderThumbCtrl
  });

  _observeUiSliderThumbAttributes({
    iAttrs,
    ngModelCtrl,
    uiSliderThumbCtrl
  });
  _formatNgModelToNumberType({
    iAttrs,
    uiSliderCtrl,
    uiSliderThumbCtrl
  })(ngModelCtrl)
}

function _setupMouseEvent($element, $swipe, $scope, {uiSliderCtrl, uiSliderThumbCtrl, ngModelCtrl}) {

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
    const min = uiSliderCtrl.min;
    const max = uiSliderCtrl.max;
    const projectedValue = min + thumbValue * (max - min);
    ngModelCtrl.$setViewValue(projectedValue);
    //ngModelCtrl.$commitViewValue();

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

function uiSliderNgModel(ngModelCtrl, {$element, uiSliderCtrl, uiSliderThumbCtrl}) {
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
    if (ngModelCtrl.$isEmpty(ngModelCtrl.$viewValue)) { return; }
    let value = ngModelCtrl.$viewValue;
    const min = uiSliderCtrl.min;
    const max = uiSliderCtrl.max;
    const step =  angular.isDefined(uiSliderThumbCtrl.step) ? uiSliderThumbCtrl.step : uiSliderCtrl.step;
    value = angular.isDefined(uiSliderThumbCtrl.min) ? Math.max(value, uiSliderThumbCtrl.min) : value;
    value = angular.isDefined(uiSliderThumbCtrl.max) ? Math.min(value, uiSliderThumbCtrl.max) : value;
    let thumbLeftPosition = (value - min) / (max - min) * 100;
    thumbLeftPosition = _formatValue(thumbLeftPosition, 0, 100, step);
    $element.css('left', thumbLeftPosition + '%');
  }

}

function hasChangedValue(newVal, oldVal) {
  return !angular.isUndefined(newVal)
    && !isNaN(newVal) && oldVal !== newVal;
}


//

function _observeUiSliderThumbAttributes({
  iAttrs,
  ngModelCtrl,
  uiSliderThumbCtrl
  }) {

  // TODO(douglasduteil): [REFACTO] unify observed attrs with change event broadcast
  const OBBSERVED_ATTRS = {
    max: (val) => {
      dump('booooo', val)
      if (angular.isDefined(val) && !angular.isNumber(val)) {
        val = parseFloat(val, 10);
      }
      uiSliderThumbCtrl.max =
        angular.isNumber(val)
        && !isNaN(val) ? val : undefined;
      ngModelCtrl.$validate();
    },
    min: (val) => {
      dump('booooo', val)
      if (angular.isDefined(val) && !angular.isNumber(val)) {
        val = parseFloat(val, 10);
      }
      uiSliderThumbCtrl.min =
        angular.isNumber(val)
        && !isNaN(val) ? val : undefined;
      ngModelCtrl.$validate();
    },
    step: (val) => {
      if (angular.isDefined(val) && !angular.isNumber(val)) {
        val = parseFloat(val, 10);
      }
      uiSliderThumbCtrl.step =
        angular.isNumber(val)
        && !isNaN(val) ? val : undefined;
      ngModelCtrl.$validate();
    }
  };

  Object
    .keys(OBBSERVED_ATTRS)
    .map((attrName) => [OBBSERVED_ATTRS[attrName], attrName])
    .forEach(([attrAction, attrName]) => iAttrs.$observe(attrName, attrAction))

}

function _formatNgModelToNumberType({
  iAttrs,
  uiSliderCtrl,
  uiSliderThumbCtrl
  }) {
  return function ngModelFormatters(ngModelCtrl) {

    ngModelCtrl.$parsers.push(function parseAsNumber(value) {
      if (ngModelCtrl.$isEmpty(value)) { return null; }
      //console.log('parseAsNumber', value);
      if (angular.isNumber(value)) {return parseFloat(value);}
      return undefined;
    });

    ngModelCtrl.$formatters.push(function (value) {
      if (!ngModelCtrl.$isEmpty(value)) {
        if (!angular.isNumber(value)) {
          // TODO(douglasduteil): use the angular $ngModelMinErr
          // throw $ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);

          throw new TypeError(`Expected "${value}" to be a number`);
        }
        value = Number(value);
      }
      return value;
    });

    //

    ngModelCtrl.$parsers.push(function parseWithParentMin(value) {
      if (ngModelCtrl.$isEmpty(value)) { return value; }
      //console.log('parseWithParentMin', value);
      return Math.max(value, uiSliderCtrl.min);
    });

    ngModelCtrl.$formatters.push(function parseWithParentMin(value) {
      if (ngModelCtrl.$isEmpty(value)) { return value; }
      //console.log('parseWithParentMin', value);
      return Math.max(value, uiSliderCtrl.min);
    });

    if (angular.isDefined(iAttrs.min) || iAttrs.ngMin) {

      ngModelCtrl.$parsers.push(function parseWithMin(value) {
        if (ngModelCtrl.$isEmpty(value) || angular.isUndefined(uiSliderThumbCtrl.min)) { return value; }
        //console.log('parseWithParentMin', value);
        return Math.max(value, uiSliderThumbCtrl.min);
      });

      ngModelCtrl.$formatters.push(function parseWithMin(value) {
        if (ngModelCtrl.$isEmpty(value) || angular.isUndefined(uiSliderThumbCtrl.min)) { return value; }
        //console.log('parseWithParentMin', value);
        return Math.max(value, uiSliderThumbCtrl.min);
      });

      ngModelCtrl.$validators.min = function minValidator(value) {
        return ngModelCtrl.$isEmpty(value)
          || angular.isUndefined(uiSliderThumbCtrl.min)
          || value >= uiSliderThumbCtrl.min;
      };
    }

    //

    ngModelCtrl.$parsers.push(function parseWithParentMax(value) {
      if (ngModelCtrl.$isEmpty(value)) { return value; }
      //console.log('parseWithParentMin', value);
      return Math.min(value, uiSliderCtrl.max);
    });

    ngModelCtrl.$formatters.push(function parseWithParentMax(value) {
      if (ngModelCtrl.$isEmpty(value)) { return value; }
      //console.log('parseWithParentMin', value);
      return Math.min(value, uiSliderCtrl.max);
    });

    if (angular.isDefined(iAttrs.max) || iAttrs.ngMax) {

      ngModelCtrl.$parsers.push(function parseWithMax(value) {
        if (ngModelCtrl.$isEmpty(value) || angular.isUndefined(uiSliderThumbCtrl.max)) { return value; }
        //console.log('parseWithParentMin', value);
        return Math.min(value, uiSliderThumbCtrl.max);
      });

      ngModelCtrl.$formatters.push(function parseWithMax(value) {
        if (ngModelCtrl.$isEmpty(value) || angular.isUndefined(uiSliderThumbCtrl.max)) { return value; }
        //console.log('parseWithParentMin', value);
        return Math.min(value, uiSliderThumbCtrl.max);
      });

      ngModelCtrl.$validators.max = function maxValidator(value) {
        return ngModelCtrl.$isEmpty(value)
          || angular.isUndefined(uiSliderThumbCtrl.max)
          || value <= uiSliderThumbCtrl.max;
      };
    }

    if (angular.isDefined(iAttrs.step)) {
      ngModelCtrl.$validators.step = function stepValidator(value) {
        const step = uiSliderThumbCtrl.step;
        return ngModelCtrl.$isEmpty(value)
          || angular.isUndefined(step)
          || value === Math.floor(value / step) * step
      };
    }

  }
}
