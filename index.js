'use strict';

var WmiClient = require('wmi-client');
var nircmd = require('nircmd');
var path = require('path');

// Will be added whenever wmic support works properly.
//module.exports.options = {
//	timeout: 0, // Seconds for brightness level to change, can be used to get smooth change.
//	monitor: 0  // Used to specify index for monitor to get/set level on.
//};

module.exports.get = function(cb) {
	if (process.platform !== 'win32') {
		throw new Error('Only Windows systems are supported.');
	}
	
	var wmi = new WmiClient({
		host: 'localhost',
	    namespace: '\\\\root\\WMI'
	});
	
	wmi.query('SELECT * FROM WmiMonitorBrightness', function (err, result) {
		
		if (err) {
			cb(err);
			return;
		}
		
		if (result.length == 0) {
			cb(new Error('Unable to find any monitors to read brightness levels from.'));
		}
		
		var brightnessValue = result[0].CurrentBrightness;
		
		cb(null, brightnessValue / 100);
	});
};

module.exports.set = function(val, cb) {
	
	if (process.platform !== 'win32') {
		throw new Error('Only Windows systems are supported.');
	}
	
	if (typeof val !== 'number' || isNaN(val)) {
		throw new TypeError('Expected a number.');
	}
	
	nircmd(['setbrightness', Math.round(val * 100)], function (err) {
		if (err) {
			cb(err);
			return;
		}
		
		cb();
	});

	// Would like to use wmic directly to set brightness, but execution of the method returns errors for different syntax.
	// Need some help figuring out the proper way to CALL WmiSetBrightness using wmic.
	// Want this working to remove dependency on NirCmd. "wmic" is installed with Windows.
	
	// wmic /namespace:\\root\wmi CLASS WmiMonitorBrightnessMethods CALL WmiSetBrightness Timeout=0 Brightness=100
	// Description = Invalid method Parameter(s)	
	
	// wmic /namespace:\\root\wmi CLASS WmiMonitorBrightnessMethods CALL WmiSetBrightness(0,100)
	// Description = Out of present range.
	
	// wmic /namespace:\\root\wmi CLASS WmiMonitorBrightnessMethods CALL WmiSetBrightness 0 25
	// 	Invalid format.
	// Hint: <paramlist> = <param> [, <paramlist>].
	
	// Execution with powershell.exe from node.js have such a high performance penatly, it works to execute WmiSetBrightness
	// from PowerShell, yet wmic is prefered and need a solution that works.
};
