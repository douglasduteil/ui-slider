//

chai.config.truncateThreshold = 2;

(function chaiHelpers(Assertion) {
  'use strict';

  Assertion.addMethod('class', chaiClassHelper);

  ////

  function chaiClassHelper(className) {
    const obj = this._obj;

    // REQUIRED
    new Assertion(obj).to.have.property('classList');

    // second, our type check
    this.assert(
      obj.classList.contains(className),
      "expected #{act} to contain #{exp}, but it does not.",
      "expected #{act} to not be of type #{exp}",
      className,
      Array.from(obj.classList)
    );
  }
}(chai.Assertion));
