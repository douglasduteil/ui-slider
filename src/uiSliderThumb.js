//

import {Component, Template} from 'ng2in1';
import angular from 'angular';
import _ from 'lodash';

import ThumbModelController from './ThumbModelController';

import {
  optimisticNumber
  } from './util';

// Get all the page.
var HTML_ELEMENT = angular.element(document.body.parentElement);
var COMPONENT_SELECTOR = 'ui-slider-thumb';

@Component({
  link: uiSliderThumbLink,
  require: ['^uiSlider', 'ngModel'],
  selector: COMPONENT_SELECTOR
})
export default class uiSliderThumb {

  constructor($injector, $element, $attrs, $scope, $swipe) {

    this.$injector = $injector;
    this.$element = $element;

    this._lastPos = NaN;
    // TODO(douglasduteil): use window.performance.now();
    this._time = +new Date();

    this.setupAttrsObservers = _setupMouseEvent.bind(this, $element, $swipe, $scope);
  }

  getNormalizedThumbPosition(coord) {
    this._updateTrackLayoutData();

    // TODO(douglasduteil): use a composition flow
    // @see https://lodash.com/docs#flow
    this._lastPos = coord.x;
    const normalizedPos =
      (this._lastPos - this._trackOrigine) / this._trackSize;
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

}

uiSliderThumb.$inject = ['$injector', '$element', '$attrs', '$scope', '$swipe'];

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

  // Link the format model controller
  uiSliderThumbCtrl.thumbModelCtrl = new ThumbModelController(
    { // view model accessor
      get min() {
        return Math.max(uiSliderCtrl.min, uiSliderThumbCtrl.min || Number.NEGATIVE_INFINITY);
      },
      get max() {
        return Math.min(uiSliderCtrl.max, uiSliderThumbCtrl.max || Number.POSITIVE_INFINITY);
      },
      get step() {
        return uiSliderThumbCtrl.step || uiSliderCtrl.step;
      }
    }
  );
  // write the formatters on the ngModelController !
  uiSliderThumbCtrl.thumbModelCtrl.writeOnNgModel(ngModelCtrl);

  //

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
    const thumbValue = uiSliderThumbCtrl.getNormalizedThumbPosition(coord);
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
    const step = angular.isDefined(uiSliderThumbCtrl.step) ? uiSliderThumbCtrl.step : uiSliderCtrl.step;
    value = angular.isDefined(uiSliderThumbCtrl.min) ? Math.max(value, uiSliderThumbCtrl.min) : value;
    value = angular.isDefined(uiSliderThumbCtrl.max) ? Math.min(value, uiSliderThumbCtrl.max) : value;
    let thumbLeftPosition = (value - min) / (max - min) * 100;
    thumbLeftPosition = _formatValue(thumbLeftPosition, 0, 100, step);
    $element.css('left', thumbLeftPosition + '%');
  }

}

//

function _observeUiSliderThumbAttributes({
  iAttrs,
  ngModelCtrl,
  uiSliderThumbCtrl
  }) {

  const ATTRS_VM_KEYS = ['max', 'min', 'step'];

  _(ATTRS_VM_KEYS)
    .transform((observers, keyName) => {
      observers[keyName] = _.partial(attrObserver, keyName);
    }, {})
    .forEach((attrAction, attrName) => iAttrs.$observe(attrName, attrAction))
    .value()
  ;

  ////

  function attrObserver(attrName, val) {
    uiSliderThumbCtrl[attrName] = optimisticNumber(val);
    ngModelCtrl.$validate();
  }

}
