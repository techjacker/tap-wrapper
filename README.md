# tap-wrapper

[![Build Status](https://secure.travis-ci.org/techjacker/tap-wrapper.png)](http://travis-ci.org/techjacker/tap-wrapper)

## Description
- utility to prevent [node-tap](https://github.com/isaacs/node-tap) test results printing to STDOUT
- receive test results in JSON format

### How does it help you?
- good for testing tap test helpers
- used in unit tests for [tap-test-helpers](https://npmjs.org/package/tap-test-helpers) module

## Install
```Shell
npm install tap-wrapper
```

## Api

#### Helper Test Function (```helperTestFn```) to be wrapped
Must do 2 things:
1. call ```this.end(t)``` instead of ```t.end()```
	- don't forget to pass the ```t``` param to ```this.end```
2. bind tap.Test to this, eg:
	```return require('tap').Test('test banner', function (t) {....}.bind(this));```

```JavaScript
var helperTestFn = function (paramToPass) {
	return require('tap').Test(testName, function (t) {
		t.equal(paramToPass, testName, 'Integration Test: WrapLoud is called');
		this.end(t);
	}.bind(this));
};
```

#### ```Wrap.WrapSilent(helperTestFn)```
- Wrap a function and and prevent results for going to STDOUT
- Listen for tap.Producer 'end evt' for results of tests to be delivered in JSON format, eg:

```JavaScript
var helperTestFnSilent = require('tap-wrapper').WrapSilent(function () {
	return require('tap').Test('test banner', function (t) {....}.bind(this));
});

helperTestFnSilent.Producer.on("end", function (er, total, ok) {
	console.log('JSON representation of tap.test results', this.results);
});

// trigger test after bound to Producer end evt
// tap test harness is silenced (does not print to STDOUT)
helperTestFnSilent.test();
```


#### ```Wrap.WrapLoud(helperTestFn)```
- Wrap a function and allow tap tests to print to STDOUT as normal

```JavaScript
var helperTestFnLoud = require('tap-wrapper').WrapLoud(function () {
	return require('tap').Test('test banner', function (t) {....}.bind(this));
});
// tap test harness prints to STDOUT as normal (ie not intercepted)
helperTestFnLoud();
```


## Full Example

```JavaScript
var test 			   = require('tap').Test,
	testName           = 'randomTest',
	helperTestFn       = function (paramToPass) {
		return test(testName, function (t) {
			counter += 1;
			t.equal(paramToPass, testName, 'Integration Test: WrapLoud is called');
			this.end(t);
		}.bind(this));
	},
	helperTestFnSilent = main.WrapSilent(helperTestFn),
	helperTestFnLoud   = main.WrapLoud(helperTestFn);

helperTestFnSilent.Producer.on("end", function (er, total, ok) {

		var results = this.results;
		test('Integration Test: WrapSilent: wrappedFn.Producer end evt triggered', function (t) {
			t.equal(results.testsTotal, 1, '1 test in total');
			t.equal(results.pass, 1, '1 pass in total');
			t.equal(counter, 2, 'both silent and loud tests are called');
			t.end();
		});

});

// prints to STDOUT as normal
helperTestFnLoud(testName);

// silenced > collect results in JSON thru .Producer 'end' evt
helperTestFnSilent.test(testName);
```