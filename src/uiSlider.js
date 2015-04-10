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
  constructor($element){
    this.element = $element;
    this.min = 0;
    this.max = 100;
    this.step = 1;
  }
}

////

const DEFAULT_EMPTY_SLIDER_HTML_CONTENT = `
<ui-slider-thumb
  ng-model="__${Math.random().toString(36).substring(7)}">
</ui-slider-thumb>
`;

function uiSliderCompile(tElement, tAttrs, transclude){
  fillUpElementIfEmpty(tElement);
}

function fillUpElementIfEmpty(tElement){
  if (tElement.children().length > 0) {
    return;
  }

  // Create a default slider for design purpose.
  if (!tElement.attr('class') && tElement.attr('class') !== '') {
    tElement.addClass('ui-slider--default');
  }

  tElement.append(DEFAULT_EMPTY_SLIDER_HTML_CONTENT);
}
