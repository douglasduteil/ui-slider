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
      const element = uiSliderElement.children(0);
      expect(element.scope()).to.be.ok;
      expect(element.scope().uiSliderThumbCtrl).not.to.be.ok;
      expect(element.isolateScope()).not.to.be.ok;
    });

  });

  describe('attributes observation', function () {

    beforeEach(function () {
      const uiSliderElement = this.compileSliderContent(
        '<ui-slider-thumb ' +
        ' ng-model="_" ' +
        ' min="{{ _min }}" max="{{ _max}}" step="{{ _step}}">' +
        '</ui-slider-thumb>'
      )(this.$rootScope);
      this.element = uiSliderElement.children(0);
      this.uiSliderThumbCtrl = this.element.isolateScope().uiSliderThumbCtrl;
    });

    it('should initialize with min 0, max 100, step 1', function () {
      expect(this.uiSliderThumbCtrl.min).to.equal(0);
      expect(this.uiSliderThumbCtrl.max).to.equal(100);
      expect(this.uiSliderThumbCtrl.step).to.equal(1);
    });

    it('should stay with min 0, max 100, step 1', function () {
      this.$rootScope.$digest();
      expect(this.uiSliderThumbCtrl.min).to.equal(0);
      expect(this.uiSliderThumbCtrl.max).to.equal(100);
      expect(this.uiSliderThumbCtrl.step).to.equal(1);
    });

    it('should change to min -10, max 10, step 5', function () {
      this.$rootScope._min = -10;
      this.$rootScope._max = 10;
      this.$rootScope._step = 5;
      this.$rootScope.$digest();
      expect(this.uiSliderThumbCtrl.min).to.equal(-10);
      expect(this.uiSliderThumbCtrl.max).to.equal(10);
      expect(this.uiSliderThumbCtrl.step).to.equal(5);
    });
  });

  describe('ngModel', function () {
    before(function () {
      this.raf = sinon.stub(window, "requestAnimationFrame", (fn) => fn());
    });

    describe('when changing', function () {
      beforeEach(function () {
        const uiSliderElement = this.compileSliderContent(
          '<ui-slider-thumb ng-model="foo"></ui-slider-thumb>'
        )(this.$rootScope);
        this.element = uiSliderElement.children(0);
        this.uiSliderThumbCtrl = this.element.isolateScope().uiSliderThumbCtrl;
      });

      it('should render at 0 if 50', function () {

        expect(this.element.css('left')).to.equal('');

        this.$rootScope.foo = 50;
        this.$rootScope.$digest();

        expect(this.raf).to.have.been.called;
        expect(this.element.css('left')).to.equal('50%');
      });

      it('should render at 0 if null', function () {

        expect(this.element.css('left')).to.equal('');

        this.$rootScope.foo = null;
        this.$rootScope.$digest();

        expect(this.raf).to.have.been.called;

        expect(this.element.css('left')).to.equal('0%');
      });
    });

    describe('with dynamic thumb limitations', function () {
      beforeEach(function () {
        const uiSliderElement = this.compileSliderContent(
          '<ui-slider-thumb' +
          ' name="fooName "' +
          ' ng-model="foo"' +
          ' min="{{ _min }}" max="{{ _max}}" step="{{ _step}}">' +
          '</ui-slider-thumb>'
        )(this.$rootScope);
        this.$rootScope.$digest();
        this.element = uiSliderElement.children(0);
        this.uiSliderThumbCtrl = this.element.isolateScope().uiSliderThumbCtrl;
        this.ngCtrl = this.element.data('$ngModelController');
      });

      it('should initialize a ngModelController', function () {
        expect(this.ngCtrl).to.be.ok;

        expect(this.element).to.be.pristine.and.to.be.valid;

        expect(this.ngCtrl.$viewValue, '$viewValue').to.be.undefined;
        expect(this.ngCtrl.$modelValue, '$modelValue').to.be.undefined;

        expect(this.ngCtrl.$name).to.be.equal('fooName');
      });

      it('should define model values at 0', function () {
        this.$rootScope.foo = 0;
        this.$rootScope.$digest();

        expect(this.element).to.be.pristine.and.to.be.valid;
        expect(this.ngCtrl.$viewValue, '$viewValue').to.equal(0);
        expect(this.ngCtrl.$modelValue, '$modelValue').to.equal(0);
      });

      describe('default invalid states', function(){
        it('should be invalid \'cause not a number', function () {
          this.$rootScope.foo = '1';
          this.$rootScope.$digest();

          expect(this.element).to.be.pristine.and.to.be.invalid;
          expect(this.element).to.have.class('ng-invalid-number');
        });

        it('should be invalid \'cause below the min', function () {
          this.$rootScope.foo = -1;
          this.$rootScope.$digest();

          expect(this.element).to.be.pristine.and.to.be.invalid;
          expect(this.element).to.have.class('ng-invalid-min');
        });

        it('should be invalid \'cause above the max', function () {
          this.$rootScope.foo = 101;
          this.$rootScope.$digest();

          expect(this.element).to.be.pristine.and.to.be.invalid;
          expect(this.element).to.have.class('ng-invalid-max');
        });

        it('should be invalid \'cause wrong the step', function () {
          this.$rootScope.foo = 1.1;
          this.$rootScope.$digest();

          expect(this.element).to.be.pristine.and.to.be.invalid;
          expect(this.element).to.have.class('ng-invalid-step');
        });
      });


      describe('custom invalid states', function(){

        beforeEach(function () {
          this.$rootScope.min = 10;
          this.$rootScope.max = 20;
          this.$rootScope.step = 1;
          this.$rootScope.$digest();
        });

        it('should be invalid \'cause below the min', function () {
          this.$rootScope.foo = 0;
          this.$rootScope.$digest();

          expect(this.element).to.be.pristine.and.to.be.invalid;
          expect(this.element).to.have.class('ng-invalid-min');
        });
      })

    });

  })
});
