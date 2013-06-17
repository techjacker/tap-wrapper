var _               = require('underscore'),
    AbstractFactory = require('abstract-factory'),
	ValidationError = require('custom-errors').general.ValidationError,
    TP              = require('tap').Producer;

/**
 * Base Wrapper static class that relays end signal to tap.Test
 *
 * @class Wrap
 * @static
 */
var Wrap = {

	/**
	 * Relay end() call to tap test instance
	 * @method end
	 * @param  {Test} t instance of tap.Test
	 * @return {Test} return the instance of the tap test
	 */
	end: function (t) {
		return t.end();
	}
};


/**
 * Wrap a function and allow tap tests to print to STDOUT as normal
 *
 * @class WrapLoud
 * @constructor
 * @extends {Wrap}
 *
 * @param  {Function} fn the function that returns tap.Test()
 *
 * @return {Function}      the wrapper function is returned
 */
var WrapLoud = function (fn) {
	if (!(this instanceof WrapLoud)) {
		return new WrapLoud(fn);
	}

	return fn.bind(this);
};

WrapLoud.prototype = Object.create(Wrap);


/**
 * ##### Prevents node-tap harness from writing output to STDOUT
 *  - Creates a new stream that returns summary of results in JSON so can access programmatically
 *  - Good for testing test helpers -> eg used in unit tests for [tap-test-helpers](https://npmjs.org/package/tap-test-helpers) module
 *                    > so can do fn.Producer.on('end', fn (results))
 *
 * @class WrapSilent
 * @constructor
 * @extends {Wrap}
 *
 * @param {Function} test helper function which contains tap.test() function
 * @param {AbstractFactory} tp instance of tap.Producer stream
 * @return {Function} returns original function bound to new context
 */
var WrapSilent = function (fn, factory) {

	if (!(this instanceof WrapSilent)) {
		return new WrapSilent(fn, factory);
	}
	if (!(factory instanceof AbstractFactory)) {
		throw new ValidationError('need factory to be instanceof AbstractFactory');
	}


	/**
	 * Factory instance of AbstractFactory class
	 *
	 * @property Factory
	 * @type {AbstractFactory}
	 */
	this.Factory = factory;
	/**
	 * Producer new instance of tap.Producer
	 *
	 * @property Producer
	 * @type Tap.Producer
	 */
	this.Producer = this.Factory.getFactory('TapProducer');
	/**
	 * test helper function passed as param, now bound to WrapSilent context
	 *
	 * @property test
	 * @type {Function}
	 */
	this.test = fn.bind(this);

	return _(this).bindAll('end', 'silence', 'writeStream');
};

WrapSilent.prototype = Object.create(Wrap);
// require('util').inherits(WrapSilent, WrapLoud);


/**
 * Handle test end call
 *
 * @method end
 * @param  {Test} t instance of Tap.test
 */
WrapSilent.prototype.end = function (t) {
	this.silence(t);
	this.Factory.getFactory('Wrap').end(t); // Wrap.end(t); // t.end()
	// WrapSilent.super_.prototype.end(t); // Wrap.end(t); // t.end()
};

/**
 * Silence the tap.test output to STDOUT by calling t.clear()
 * Save results first and pipe into new tap.Producer stream
 *
 * @method silence
 *
 * @param  {Test} t instance of Tap.test
 */
WrapSilent.prototype.silence = function (t) {
	t.results.list.forEach(this.writeStream);
	this.Producer.end();
	t.clear.call(t);
};

/**
 * Pipe the results using the Tap.Producer stream
 *
 * @method writeStream
 *
 * @param  {Object} res JSON obj representing test results
 */
WrapSilent.prototype.writeStream = function (res) {
	this.Producer.write(res);
};

/**
 * Exports Hash of Wrap Classes
 *
 * @type {Wrap} Base Wrapper static class
 * @type {WrapLoud} Wrap Loud class
 * @type {WrapSilent} Wrap Silent class
 */
module.exports = {
	Wrap: Wrap,
	WrapLoud: WrapLoud,
	WrapSilent: WrapSilent
};