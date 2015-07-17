'use strict';
var test = require('ava');
var winBrightness = require('./');

if (!process.env.CI) {
	test('get level', function (t) {
		t.plan(2);

		winBrightness.get(function (err, brightness) {
			t.assert(!err, err);
			t.assert(typeof brightness === 'number');
			
			console.log(brightness);
			
		});
	});

	test('set level to 75%', function (t) {
		t.plan(3);

		var brightness = 0.75;

		winBrightness.set(brightness, function (err) {
			t.assert(!err, err);

			winBrightness.get(function (err, brightness) {
				t.assert(!err, err);
				t.assert(brightness === brightness);
			});
		});
	});
	
}