//

chai.config.truncateThreshold = 2;

(function chaiHelpers(Assertion) {
  'use strict';

  Assertion.addMethod('class', chaiClassHelper);
  Assertion.addProperty('pristine', chaiStrictClassMatcher('ng-pristine', 'ng-dirty'));
  Assertion.addProperty('dirty', chaiStrictClassMatcher('ng-dirty', 'ng-pristine'));
  Assertion.addProperty('invalid', chaiStrictClassMatcher('ng-invalid', 'ng-valid'));
  Assertion.addProperty('valid', chaiStrictClassMatcher('ng-valid','ng-invalid'));

  ////

  function chaiClassHelper(className) {
    const obj = this._obj;

    // REQUIRED
    new Assertion(obj).to.have.property('hasClass');

    this.assert(
      obj.hasClass(className),
      `expected [${obj.attr('class')}] to contain #{exp}, but it does not.`,
      `expected [${obj.attr('class')}] to not contain #{exp}`,
      className
    );
  }

  function chaiStrictClassMatcher(defaultPresentClasses, defaultAbsentClasses) {
    return function _chaiStrictClassMatcher(presentClasses, absentClasses) {
      const obj = this._obj;

      presentClasses = presentClasses || defaultPresentClasses;
      absentClasses = absentClasses || defaultAbsentClasses;

      // REQUIRED
      new Assertion(obj).to.have.property('hasClass');

      this.assert(
        obj.hasClass(presentClasses) && !obj.hasClass(absentClasses),
        `expected [${obj.attr('class')}] to contain #{exp}, but it does not.`,
        `expected [${obj.attr('class')}] to not contain #{exp}`,
        presentClasses,
        absentClasses
      )
      ;
    };
  }
}(chai.Assertion));
