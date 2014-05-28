# UI.Slider directive [![Build Status](https://travis-ci.org/angular-ui/ui-slider.png)](https://travis-ci.org/angular-ui/ui-slider)

This directive allows you to add a input slider.

## Requirements

- AngularJS

## Usage

You can get it from [Bower](http://bower.io/)

```sh
bower install angular-ui-slider
```

This will copy the UI.Slider files into a `bower_components` folder, along with its dependencies. Load the script files in your application:

**It's still a work in progress. The build files will not be there....**

```html
<link rel="stylesheet" href="bower_components/angular-ui-slider/src/ui-slider.css" />
// ...
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-slider/src/ui-slider.js"></script>
```

Add the UI.Slider module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['ui.slider']);
```

Finally, add the directive to your html,
as attribute :

```xml
<div ui-slider></div>
// or
<ui-slider class="ui-slider-default">
  <ui-slider-track
    [min="{expression}"]
    [max="{expression}"]
    [step="{expression}"]
   >

    <ui-slider-range
      [start="{expression}"]
      [end="{expression}"]
     ></ui-slider-range>

    <ui-slider-thumb
      ng-model="{string}"
      [name="{string}"]
      [min="{expression}"]
      [max="{expression}"]
      [step="{expression}"]
     ></ui-slider-thumb>

  </ui-slider-track>
</ui-slider>
```

### Parameters

* ui-slider-track
  * min : Sets the minimum value allowed for all of its thumb children.
  * max : Sets the maximum value allowed for all of its thumb children.
  * step : Sets the legal number intervals for all of its thumb children.

* ui-slider-thumb
  * ng-model : Mandatory! Assignable angular expression to data-bind to.
  * name : Property name of the form under which the control is published.
  * min : Sets its minimum value allowed.
  * max : Sets its maximum value allowed.
  * step : Sets its legal number intervals.

* ui-slider-range
  * start : Sets the start of the range (in percent).
  * end : Sets the end of the range (in percent).

Example

```xml
<ui-slider class="ui-slider-default">
  <ui-slider-track>
    <ui-slider-thumb ng-model='_'></ui-slider-thumb>
  </ui-slider-track>
</ui-slider>
// or
<ui-slider class="ui-slider-default">
  <ui-slider-track>
    <ui-slider-range ></ui-slider-range>
    <ui-slider-thumb ng-model='_a'></ui-slider-thumb>
  </ui-slider-track>
</ui-slider>
// or
<ui-slider class="ui-slider-default">
  <ui-slider-track>
    <ui-slider-range start='{{_b}}'></ui-slider-range>
    <ui-slider-thumb ng-model='_b'></ui-slider-thumb>
  </ui-slider-track>
</ui-slider>
// or
<ui-slider class="ui-slider-default">
  <ui-slider-track>
    <ui-slider-range start='{{_c}}' end='{{_d}}'></ui-slider-range>
    <ui-slider-thumb ng-model='_c' max='{{_d}}'></ui-slider-thumb>
    <ui-slider-thumb ng-model='_d' min='{{_c}}'></ui-slider-thumb>
  </ui-slider-track>
</ui-slider>
// or
<ui-slider class="ui-slider-default">
  <ui-slider-track>
    <ui-slider-range start='{{_min}}' end='{{_max}}'></ui-slider-range>
    <ui-slider-thumb ng-model='_min' max='{{_max}}'></ui-slider-thumb>
    <ui-slider-thumb ng-model='_middle' min='{{_min}}' max='{{_max}}'></ui-slider-thumb>
    <ui-slider-thumb ng-model='_max' min='{{_min}}'></ui-slider-thumb>
  </ui-slider-track>
</ui-slider>
```


## Testing

We use Karma and jshint to ensure the quality of the code.  The easiest way to run these checks is to use grunt:

```sh
npm install -g gulp
npm install && bower install
gulp
```

The karma task will try to open Firefox and Chrome as browser in which to run the tests.  Make sure this is available or change the configuration in `test\karma-jqlite.conf.js` and `test\karma-jquery.conf.js`

Some test tasks :
 - `gulp karma` : Will run _jqlite_ and _jquery_ tests in simple run mode,
 - `gulp karma:jqlite:unit` : Will run _jqlite_ tests in simple run mode,
 - `gulp karma:jquery:unit` : Will run _jquery_ tests in simple run mode,
 - `gulp karma:jqlite:watch` : Will run _jqlite_ tests and watch for changes,
 - `gulp karma:jquery:watch` : Will run _jquery_ tests and watch for changes,

** `gulp serve` runs and watches all**
