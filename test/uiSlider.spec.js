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
      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderCtrl).not.to.be.ok;
      expect(element.isolateScope()).to.be.ok;
      expect(element.isolateScope().uiSliderCtrl).to.be.ok;
    });

    it('should not work as an attribute', function () {
      const element = this.$compile('<div ui-slider></div>')(this.$rootScope);
      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
    });

    it('should not work as an class', function () {
      const element = this.$compile('<div class="ui-slider"></div>')(this.$rootScope);
      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
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

    it('should not use the "default theme"' +
    ' when a class is already specified', function () {
      const element = this.$compile(
        '<ui-slider class="my-ui-slider--theme"></ui-slider>'
      )(this.$rootScope);
      expect(element[0]).not.to.has.class('ui-slider--default');
      expect(element[0]).to.has.class('my-ui-slider--theme');
    });

  });

  describe('attributes observation', function () {

    beforeEach(function () {
      this.element = this.$compile(
        '<ui-slider min="{{ _min }}" max="{{ _max}}" step="{{ _step}}">' +
        '</ui-slider>'
      )(this.$rootScope);
      this.uiSliderCtrl = this.element.isolateScope().uiSliderCtrl;
    });

    it('should initialize with min 0, max 100, step 1', function () {
      expect(this.uiSliderCtrl.min).to.equal(0);
      expect(this.uiSliderCtrl.max).to.equal(100);
      expect(this.uiSliderCtrl.step).to.equal(1);
    });

    it('should stay with min 0, max 100, step 1', function () {
      this.$rootScope.$digest();
      expect(this.uiSliderCtrl.min).to.equal(0);
      expect(this.uiSliderCtrl.max).to.equal(100);
      expect(this.uiSliderCtrl.step).to.equal(1);
    });

    it('should change to min -10, max 10, step 5', function () {
      this.$rootScope._min = -10;
      this.$rootScope._max = 10;
      this.$rootScope._step = 5;
      this.$rootScope.$digest();
      expect(this.uiSliderCtrl.min).to.equal(-10);
      expect(this.uiSliderCtrl.max).to.equal(10);
      expect(this.uiSliderCtrl.step).to.equal(5);
    });
  })

});
