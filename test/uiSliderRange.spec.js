//

import angular from 'angular';
import 'angular-mocks';

import {uiSliderModule} from '../index';

describe('uiSliderRange', function () {

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
      expect(() => this.$compile('<ui-slider-range></ui-slider-range>')(this.$rootScope))
        .to.throw(Error, /Controller 'uiSlider', required by directive/);
    });

    it('should work as an element', function () {
      const uiSliderElement = this.compileSliderContent('<ui-slider-range></ui-slider-range>')(this.$rootScope);
      const element = uiSliderElement.children(0);
      expect(element.scope(), 'Has a scope').to.be.ok;
      expect(element.scope().uiSliderRangeCtrl,
        'Has no on the scope "uiSliderRangeCtrl"'
      ).not.to.be.ok;
      expect(element.isolateScope(),
        'Has an isolateScope'
      ).to.be.ok;
      expect(element.isolateScope().uiSliderRangeCtrl,
        'Has an "uiSliderRangeCtrl" on the isolateScope'
      ).to.be.ok;
    });

    it('should not work as an attribute', function () {
      const uiSliderElement = this.compileSliderContent('<div ui-slider-range></div>')(this.$rootScope);
      const element = uiSliderElement.children(0);

      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderThumbCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
    });

    it('should not work as an class', function () {
      const uiSliderElement = this.compileSliderContent('<div class="ui-slider-range"></div>')(this.$rootScope);
      const element = uiSliderElement.children(0);

      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderThumbCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
    });

  });

  describe('attributes observation', function () {

    beforeEach(function () {
      const uiSliderElement = this.compileSliderContent(
        '<ui-slider-range min="{{ _min }}" max="{{ _max}}"></ui-slider-range>'
      )(this.$rootScope);
      this.element = uiSliderElement.children(0);
      this.uiSliderRangeCtrl = this.element.isolateScope().uiSliderRangeCtrl;
    });

    it('should initialize with min 0, max 100', function () {
      expect(this.uiSliderRangeCtrl.min).to.be.undefined;
      expect(this.uiSliderRangeCtrl.max).to.be.undefined;
    });

    it('should stay with min 0, max 100', function () {
      this.$rootScope.$digest();
      expect(this.uiSliderRangeCtrl.min).to.be.undefined;
      expect(this.uiSliderRangeCtrl.max).to.be.undefined;
    });

    it('should change to min -10, max 10', function () {
      this.$rootScope._min = -10;
      this.$rootScope._max = 10;
      this.$rootScope.$digest();
      expect(this.uiSliderRangeCtrl.min).to.equal(-10);
      expect(this.uiSliderRangeCtrl.max).to.equal(10);
    });
  });


  describe('rendering', function () {

    describe('between 0 and 100', function () {
      beforeEach(function () {
        const uiSliderElement = this.compileSliderContent(
          '<ui-slider-range min="{{ _min }}" max="{{ _max}}"></ui-slider-range>'
        )(this.$rootScope);
        this.element = uiSliderElement.children(0);
        this.uiSliderRangeCtrl = this.element.isolateScope().uiSliderRangeCtrl;
        this.$rootScope.$digest();
      });

      it('should should render from "left : 0%" to "right: 0%"' +
      ' when undefined', function () {
        expect(this.uiSliderRangeCtrl.min).to.be.undefined;
        expect(this.uiSliderRangeCtrl.max).to.be.undefined;

        expect(this.element.css('left'),
          'Element left').to.equal('0%');
        expect(this.element.css('right'),
          'Element right').to.equal('0%');
      });

      it('should should render from "left : 25%" to "right: 0%"' +
      ' when { min : 25 }', function () {
        this.uiSliderRangeCtrl.min = 25;

        this.uiSliderRangeCtrl.renderRangeChange();

        expect(this.element.css('left'),
          'Element left').to.equal('25%');
        expect(this.element.css('right'),
          'Element right').to.equal('0%');
      });

      it('should should render from "left : 0%" to "right: 25%"' +
      ' when { max : 75 }', function () {
        this.uiSliderRangeCtrl.max = 75;

        this.uiSliderRangeCtrl.renderRangeChange();

        expect(this.element.css('left'),
          'Element left').to.equal('0%');
        expect(this.element.css('right'),
          'Element right').to.equal('25%');
      });

      it('should should render from "left : 25%" to "right: 25%"' +
      ' when { min : 25, max : 75 }', function () {
        this.uiSliderRangeCtrl.min = 25;
        this.uiSliderRangeCtrl.max = 75;

        this.uiSliderRangeCtrl.renderRangeChange();

        expect(this.element.css('left'),
          'Element left').to.equal('25%');
        expect(this.element.css('right'),
          'Element right').to.equal('25%');
      });
    });

    describe('between -50 and 50', function () {
      beforeEach(function () {
        const uiSliderElement = this.$compile(
          `<ui-slider min="-50" max="50">
             <ui-slider-range min="{{ _min }}" max="{{ _max}}"></ui-slider-range>
           </ui-slider>`)(this.$rootScope);
        this.element = uiSliderElement.children(0);
        this.uiSliderRangeCtrl = this.element.isolateScope().uiSliderRangeCtrl;
        this.$rootScope.$digest();
      });

      it('should should render from "left : 0%" to "right: 0%"' +
      ' when undefined', function () {
        expect(this.uiSliderRangeCtrl.min).to.be.undefined;
        expect(this.uiSliderRangeCtrl.max).to.be.undefined;

        expect(this.element.css('left'),
          'Element left').to.equal('0%');
        expect(this.element.css('right'),
          'Element right').to.equal('0%');
      });

      it('should should render from "left : 25%" to "right: 0%"' +
      ' when { min : -25 }', function () {
        this.uiSliderRangeCtrl.min = -25;

        this.uiSliderRangeCtrl.renderRangeChange();

        expect(this.element.css('left'),
          'Element left').to.equal('25%');
        expect(this.element.css('right'),
          'Element right').to.equal('0%');
      });

      it('should should render from "left : 0%" to "right: 25%"' +
      ' when { max : 25 }', function () {
        this.uiSliderRangeCtrl.max = 25;

        this.uiSliderRangeCtrl.renderRangeChange();

        expect(this.element.css('left'),
          'Element left').to.equal('0%');
        expect(this.element.css('right'),
          'Element right').to.equal('25%');
      });

      it('should should render from "left : 25%" to "right: 25%"' +
      ' when { min : -25, max : 25 }', function () {
        this.uiSliderRangeCtrl.min = -25;
        this.uiSliderRangeCtrl.max = 25;

        this.uiSliderRangeCtrl.renderRangeChange();

        expect(this.element.css('left'),
          'Element left').to.equal('25%');
        expect(this.element.css('right'),
          'Element right').to.equal('25%');
      });
    });
  });

});
