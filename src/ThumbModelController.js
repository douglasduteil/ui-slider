//

export default class ThumbModelController {

  constructor(viewModel) {
    this.viewModel = viewModel;
  }

  writeOnNgModel(ngModelCtrl) {
    asNumber(ngModelCtrl);
    formatInMin(ngModelCtrl, this.viewModel);
    formatInMax(ngModelCtrl, this.viewModel);
    formatInStep(ngModelCtrl, this.viewModel);
  }

}

////

function asNumber(ngModelCtrl) {

  ngModelCtrl.$parsers.push(parseAsNumber);
  ngModelCtrl.$formatters.push(formatAsNumber);

  //

  function parseAsNumber(value) {
    if (ngModelCtrl.$isEmpty(value)) { return null; }

    value = Number(value);
    if (Number.isNaN(value)) { return; }

    return value;
  }

  function formatAsNumber(value) {
    if (ngModelCtrl.$isEmpty(value)) {
      return value;
    }

    const number = Number(value);
    if (Number.isNaN(number)) {
      throw new TypeError(`Expected "${value}" to be a number`);
    }

    return number;
  }
}

function formatInMin(ngModelCtrl, viewModel) {

  ngModelCtrl.$parsers.push(parseWithMin);
  ngModelCtrl.$formatters.push(parseWithMin);
  ngModelCtrl.$validators.min = minValidator;

  //

  function parseWithMin(value) {
    if (ngModelCtrl.$isEmpty(value)) { return value; }
    const min = viewModel.min;
    return Math.max(value, min);
  }

  function minValidator(value) {
    const min = viewModel.min;
    return ngModelCtrl.$isEmpty(value) || value >= min;
  }
}

function formatInMax(ngModelCtrl, viewModel) {

  ngModelCtrl.$parsers.push(parseWithMax);
  ngModelCtrl.$formatters.push(parseWithMax);
  ngModelCtrl.$validators.max = maxValidator;

  //

  function parseWithMax(value) {
    if (ngModelCtrl.$isEmpty(value)) { return value; }
    const max = viewModel.max;
    return Math.min(value, max);
  }

  function maxValidator(value) {
    const max = viewModel.max;
    return ngModelCtrl.$isEmpty(value) || value <= max;
  }
}

function formatInStep(ngModelCtrl, viewModel) {

  ngModelCtrl.$parsers.push(parseWithStep);
  ngModelCtrl.$formatters.push(parseWithStep);
  ngModelCtrl.$validators.step = stepValidator;

  //

  function parseWithStep(value) {
    if (ngModelCtrl.$isEmpty(value)) { return value; }
    const step = viewModel.step;
    return Math.floor(value / step) * step;
  }

  function stepValidator(value) {
    const step = viewModel.step;
    return ngModelCtrl.$isEmpty(value)
      || value === Math.floor(value / step) * step;
  }
}
