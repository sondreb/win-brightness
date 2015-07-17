# win-brightness
> Get or set screen brightness in Windows


## Install

```
$ npm install --save win-brightness
```


## Usage

```js
var winBrightness = require('win-brightness');

winBrightness.get(function (err, brightness) {
	console.log(brightness);
	//=> 0.5
});

winBrightness.set(0.75, function (err) {
	console.log('Changed brightness to 75%');
});

```

## License

MIT © [Sondre Bjellås](http://sondreb.com)