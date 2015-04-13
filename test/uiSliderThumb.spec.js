//

import angular from 'angular';
import 'angular-mocks';

import {uiSliderModule} from '../index';

describe('uiSliderThumb', function () {

  beforeEach(function () {
    var suite = this;
    angular.mock.module(uiSliderModule.name);

    angular.mock.inject(function () {
      suite.$compile = this.$injector.get('$compile');
      suite.$rootScope = this.$injector.get('$rootScope');
    });

    suite.compileSliderContent = function compileSliderContent(template) {
      return suite.$compile(`<ui-slider>${template}</ui-slider>`);
    };
  });


  describe('restrictions', function () {

    it('should throw because no ui-slider parent', function () {
      expect(() => this.$compile('<ui-slider-thumb ng-model="_"></ui-slider-thumb>')(this.$rootScope))
        .to.throw(Error, /Controller 'uiSlider', required by directive/);
    });

    it('should throw because no ng-model attribute', function () {
      expect(() => this.compileSliderContent('<ui-slider-thumb></ui-slider-thumb>')(this.$rootScope))
        .to.throw(Error, /Controller 'ngModel', required by directive/);
    });

    it('should work as an element', function () {
      const uiSliderElement = this.compileSliderContent(
        '<ui-slider-thumb ng-model="_"></ui-slider-thumb>'
      )(this.$rootScope);
      const element = uiSliderElement.children(0);
      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderThumbCtrl).not.to.be.ok;
      expect(element.isolateScope()).to.be.ok;
      expect(element.isolateScope().uiSliderThumbCtrl).to.be.ok;
    });

    it('should not work as an attribute', function () {
      const uiSliderElement = this.compileSliderContent(
        '<div ui-slider-thumb></div>'
      )(this.$rootScope);
      const element = uiSliderElement.children(0);

      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderThumbCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
    });

    it('should not work as an class', function () {
      const uiSliderElement = this.compileSliderContent(
        '<div class="ui-slider-thumb"></div>'
      )(this.$rootScope);
      const element = uiSliderElement.children(0)
      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderThumbCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
    });

  });

});
