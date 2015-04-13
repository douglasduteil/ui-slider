//

import angular from 'angular';
import 'angular-mocks';

import {uiSliderModule} from '../index';

describe('uiSlider', function () {

  beforeEach(function () {
    var suite = this;
    angular.mock.module(uiSliderModule.name);

    angular.mock.inject(function () {
      suite.$compile = this.$injector.get('$compile');
      suite.$rootScope = this.$injector.get('$rootScope');
    });
  });


  describe('restrictions', function () {

    it('should work as an element', function () {
      const element = this.$compile('<ui-slider></ui-slider>')(this.$rootScope);
      expect(element.scope().uiSliderCtrl).to.be.ok;
    });

    it('should not work as an attribute', function () {
      const element = this.$compile('<div ui-slider></div>')(this.$rootScope);
      expect(element.scope().uiSliderCtrl).not.to.be.ok;
    });

    it('should not work as an class', function () {
      const element = this.$compile('<div class="ui-slider"></div>')(this.$rootScope);
      expect(element.scope().uiSliderCtrl).not.to.be.ok;
    });

  });

  describe('default version', function () {

    it('should use the "default theme"', function () {
      const element = this.$compile('<ui-slider></ui-slider>')(this.$rootScope);
      expect(element[0]).to.has.class('ui-slider--default');
    });

    it('should auto fill itself with a thumb', function () {
      const element = this.$compile('<ui-slider></ui-slider>')(this.$rootScope);
      const elementChildren = element.children();
      expect(elementChildren.length).to.equal(1);

      const thumbElement = elementChildren[0];
      expect(thumbElement).to.be.ok;
      expect(thumbElement).to.has.property('tagName', 'UI-SLIDER-THUMB');
    });

  });

});
