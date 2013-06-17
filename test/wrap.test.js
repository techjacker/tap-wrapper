/*jslint nomen: true, plusplus: false, sloppy: true, white:true*/
/*jshint nomen: false, curly: true, plusplus: false, expr:true, undef:true, newcap:true, latedef:true, camelcase:true  */
/*global module: false, iScroll:false, setTimeout: false, document:false, WebKitCSSMatrix:false, _: false, Backbone: false, backbone: false, $: false, define: false, require: false, console: false, window:false */

// npm modules
var _ = require('underscore'),
	tap = require('tap'),
	test = tap.test,
	tc = new tap.Consumer;

// files in lib
var wrap = require('./../lib/wrap');


// api exports test
test('wrap.js exports', function(t) {
	t.ok(_.isObject(wrap.Wrap), 'wrap.Wrap static class is exposed');
	t.ok(_.isFunction(wrap.WrapLoud), 'wrap.WrapLoud constructor fn class exposed');
	t.ok(_.isFunction(wrap.WrapSilent), 'wrap.WrapSilent constructor fn class exposed');
	t.end();
});