var curry                  = require('curry'),
    TP                     = require('tap').Producer,
    wrap                   = require('./wrap.js'),
    AbstractFactory        = require('abstract-factory'),
    AbstractWrapperFactory = new AbstractFactory({
		TapProducer: TP,
		Wrap: wrap.Wrap,
		WrapLoud: wrap.WrapLoud,
		WrapSilent: wrap.WrapSilent,
		Default: wrap.WrapLoud
	});

/**
 * @module tap-wrapper
 */
module.exports = {
	Wrap: wrap.Wrap,
	WrapLoud: wrap.WrapLoud,
	WrapSilent: curry(wrap.WrapSilent, [AbstractWrapperFactory])
};