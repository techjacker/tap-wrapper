var _    = require('underscore'),
	test = require('tap').test,
	main = require('./../lib/main');

// api exports test
test('main.js exports', function(t) {
	t.ok(_.isObject(main.Wrap), 'main.Wrap static class is exposed');
	t.ok(_.isFunction(main.WrapLoud), 'main.WrapLoud constructor fn class exposed');
	t.ok(_.isFunction(main.WrapSilent), 'main.WrapSilent constructor fn class exposed');
	t.end();
});


// integration test
var counter 		 = 0,
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

helperTestFnLoud(testName); // must be called first for counter test to work
helperTestFnSilent.test(testName);