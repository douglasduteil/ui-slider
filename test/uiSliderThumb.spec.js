//

import angular from 'angular';
import 'angular-mocks';

import {uiSliderModule} from '../index';

describe('uiSliderThumb', function () {

  beforeEach(function () {
    const suite = this;
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
});

describe('uiSliderThumb', function () {

  beforeEach(function () {
    const suite = this;
    angular.mock.module(uiSliderModule.name);

    angular.mock.inject(function () {
      suite.$compile = this.$injector.get('$compile');
      suite.$rootScope = this.$injector.get('$rootScope');
    });

    suite.compileSliderContent = function compileSliderContent(template) {
      return suite.$compile(`<ui-slider>${template}</ui-slider>`);
    };
  });

  describe('attributes observation', function () {

    beforeEach(function () {
      const uiSliderElement = this.compileSliderContent(`
        <ui-slider-thumb
         ng-model="_" min="{{ _min }}" max="{{ _max}}" step="{{ _step}}">
         </ui-slider-thumb>
      `)(this.$rootScope);
      this.element = uiSliderElement.children(0);
      this.uiSliderThumbCtrl = this.element.isolateScope().uiSliderThumbCtrl;
    });

    it('should initialize with no limitation', function () {
      this.$rootScope.$digest();
      expect(this.uiSliderThumbCtrl.min, 'min').to.be.equal(0);
      expect(this.uiSliderThumbCtrl.max, 'max').to.be.equal(0);
      expect(this.uiSliderThumbCtrl.step, 'step').to.be.equal(0);
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

});

describe('uiSliderThumb', function () {

  beforeEach(function () {
    const suite = this;
    angular.mock.module(uiSliderModule.name);

    angular.mock.inject(function () {
      suite.$compile = this.$injector.get('$compile');
      suite.$rootScope = this.$injector.get('$rootScope');
    });

    suite.compileSliderContent = function compileSliderContent(template) {
      return suite.$compile(`<ui-slider>${template}</ui-slider>`);
    };
  });

  describe('mouse', function () {
    beforeEach(function () {
      this.raf = sinon.stub(window, "requestAnimationFrame", (fn) => fn());
    });

    afterEach(function () {
      this.raf.restore();
    });

    it('should throw if not a number', function () {
      this.$rootScope.foo = '1';
      expect(this.$rootScope.$digest)
        .to.throw(TypeError);

    });

    describe('options', function () {

      describe('on a thumb', function () {

        beforeEach(function () {
          const uiSliderElement = this.compileSliderContent(
            '<ui-slider-thumb' +
            ' name="fooName "' +
            ' ng-model="foo"' +
            ' min="{{ _min }}" max="{{ _max}}" step="{{ _step}}">' +
            '</ui-slider-thumb>'
          )(this.$rootScope);
          this.$rootScope._step = 1;
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

        describe('default (min 0, max 100, step 1)', function () {

          it('should be valid at 0', function () {
            this.$rootScope.foo = 0;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.valid;
            expect(this.ngCtrl.$viewValue, '$viewValue').to.equal(0);
            expect(this.ngCtrl.$modelValue, '$modelValue').to.equal(0);
          });

          it('should be invalid \'cause below the parent min', function () {
            this.$rootScope.foo = -1;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-min');
          });

          it('should be invalid \'cause above the parent max', function () {
            this.$rootScope.foo = 101;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-max');
          });

          it('should be invalid \'cause wrong the parent step', function () {
            this.$rootScope.foo = 1.1;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-step');
          });
        });

        describe('min 10, max 20, step 2', function () {

          beforeEach(function () {
            this.$rootScope._min = 10;
            this.$rootScope._max = 20;
            this.$rootScope._step = 2;
            this.$rootScope.$digest();
          });

          it('should be valid at 10', function () {
            this.$rootScope.foo = 10;
            this.$rootScope.$digest();
            expect(this.element).to.be.pristine.and.to.be.valid;
            expect(this.ngCtrl.$viewValue, '$viewValue').to.equal(10);
            expect(this.ngCtrl.$modelValue, '$modelValue').to.equal(10);
          });

          it('should be invalid \'cause below the min', function () {
            this.$rootScope.foo = 0;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-min');
          });

          it('should be invalid \'cause below the max', function () {
            this.$rootScope.foo = 21;
            this.$rootScope.$apply();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-max');
          });

          it('should be invalid \'cause wrong the step', function () {
            this.$rootScope.foo = 11;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-step');
          });

        });

      });

      describe('on the parent track', function () {
        beforeEach(function () {
          const uiSliderElement = this.$compile(
            `<ui-slider
            min="{{ _parentMin }}"
            max="{{ _parentMax }}"
            step="{{ _parentStep }}">
             <ui-slider-thumb ng-model="foo"></ui-slider-thumb>
           </ui-slider>`)(this.$rootScope);
          this.element = uiSliderElement.children(0);

          this.$rootScope.$digest();
          this.element = uiSliderElement.children(0);
          this.uiSliderThumbCtrl = this.element.isolateScope().uiSliderThumbCtrl;
          this.ngCtrl = this.element.data('$ngModelController');
        });

        describe('min 10, max 20, step 2', function () {

          beforeEach(function () {
            this.$rootScope._parentMin = 10;
            this.$rootScope._parentMax = 20;
            this.$rootScope._parentStep = 2;
            this.$rootScope.$digest();
          });

          it('should be valid at 10', function () {
            this.$rootScope.foo = 10;
            this.$rootScope.$digest();
            expect(this.element).to.be.pristine.and.to.be.valid;
            expect(this.ngCtrl.$viewValue, '$viewValue').to.equal(10);
            expect(this.ngCtrl.$modelValue, '$modelValue').to.equal(10);
          });

          it('should be invalid \'cause below the parent min', function () {
            this.$rootScope.foo = 9;
            this.$rootScope.$apply();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-min');
          });

          it('should be invalid \'cause below the parent max', function () {
            this.$rootScope.foo = 21;
            this.$rootScope.$apply();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-max');
          });

          it('should be invalid \'cause wrong the parent step', function () {
            this.$rootScope.foo = 11;
            this.$rootScope.$digest();

            expect(this.element).to.be.pristine.and.to.be.invalid;
            expect(this.element).to.have.class('ng-invalid-step');
          });

        });
      });

    });

    describe('position', function () {
      beforeEach(function () {
        const uiSliderElement = this.$compile(
          `<ui-slider
            min="{{ _parentMin }}" max="{{ _parentMax }}">
             <ui-slider-thumb ng-model="foo"></ui-slider-thumb>
           </ui-slider>`)(this.$rootScope);
        this.element = uiSliderElement.children(0);
      });

      describe('between 0 and 100', function () {

        it('should render at "0%" if 0', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = 0;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('0%');
        });

        it('should render at "100%" if 0', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = 100;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('100%');
        });

        it('should render at "50%" if 50', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = 50;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('50%');
        });

        it('should render at "" if undefined', function () {

          expect(this.element.css('left')).to.equal('');

          this.$rootScope.$digest();
          expect(this.$rootScope.foo).to.be.undefined;

          expect(this.raf).to.have.been.calledOnce;

          expect(this.element.css('left')).to.equal('');
        });

        it('should render at "" if 1000', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = 1000;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('100%');
        });

        it('should render at "" if -1', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = -1;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('0%');
        });

      });

      describe('between -50 and 50', function () {
        beforeEach(function () {
          this.$rootScope._parentMin = -50;
          this.$rootScope._parentMax = 50;
        });

        it('should render at "0%" if undefined', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.$digest();
          expect(this.$rootScope.foo).to.be.undefined;
          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('');
        });

        it('should render at "0%" if -50', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = -50;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('0%');
        });

        it('should render at "100%" if 50', function () {
          expect(this.element.css('left')).to.equal('');

          this.$rootScope.foo = 50;
          this.$rootScope.$digest();

          expect(this.raf).to.have.been.calledOnce;
          expect(this.element.css('left')).to.equal('100%');
        });
      });

    });
  });

});

// Wrapper to abstract over using touch events or mouse events.
function sliderThumbUserEventTests(description, startEvent, moveEvent, endEvent) {
  describe('uiSliderThumb', function () {

    beforeEach(function () {
      const suite = this;
      angular.mock.module(uiSliderModule.name);

      angular.mock.inject(function () {
        suite.$compile = this.$injector.get('$compile');
        suite.$rootScope = this.$injector.get('$rootScope');
      });

      suite.compileSliderContent = function compileSliderContent(template) {
        return suite.$compile(`<ui-slider>${template}</ui-slider>`);
      };
    });

    describe(`${description} event`, function () {

      beforeEach(function (){
        this.raf = sinon.stub(window, "requestAnimationFrame", (fn) => fn());
        this.uiSliderElement = this.compileSliderContent()(this.$rootScope);
        this.$rootScope.$digest();
        this.element = this.uiSliderElement.children(0);


        const thumb_bb = this.element[0].getBoundingClientRect();
        dump(thumb_bb)
      });

      describe('native behaviour', function () {

        it.skip('should stay at the start' +
          ' when clicking on it', function () {
          throw new Error('TODO');
        });

        it.skip('should go to the middle of the slider' +
          ' when clicking at the middle', function () {
          throw new Error('TODO');
        });

        it.skip('should go to the end of the slider' +
          ' when clicking at the end', function () {
          throw new Error('TODO');
        });


        it.skip(`should follow the ${description}`, function () {
          throw new Error('TODO');
        });
      });

    });
  });
}

sliderThumbUserEventTests('mouse', 'mousedown', 'mousemove', 'mouseup');
sliderThumbUserEventTests('touch', 'touchstart', 'touchmove', 'touchend');
