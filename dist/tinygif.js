(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Tinygif"] = factory();
	else
		root["Tinygif"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _recorder = __webpack_require__(1);

var _recorder2 = _interopRequireDefault(_recorder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tinygif = function () {
  function Tinygif() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Tinygif);

    var defaults = {
      prerender: true,
      loop: 0,
      fps: 50,
      seconds: 5,
      frames: null,
      width: null,
      height: null,
      sample: 30,
      autoStop: true,
      recordingProgress: function recordingProgress() {},
      renderingProgress: function renderingProgress() {}
    };

    this.options = Object.assign({}, defaults, options);
    this.recorder = null;
  }

  _createClass(Tinygif, [{
    key: 'capture',
    value: function capture(recorder, canvas, context, count) {
      recorder.capture(canvas, context);
      this.options.recordingProgress(count);
    }
  }, {
    key: 'record',
    value: function record(canvas) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.done = null;

        var complete = function complete(blob) {
          resolve(blob);
        };

        var error = function error(err) {
          reject(err);
        };

        var tick = 1000 / _this.options.fps;
        var delay = tick / 10;

        _this.recorder = new _recorder2.default({
          loop: _this.options.loop,
          delay: delay | 0,
          width: _this.options.width || canvas.width,
          height: _this.options.height || canvas.height,
          sample: _this.options.sample,
          progress: _this.options.renderingProgress,
          complete: complete
        });
        var start = Date.now();
        var count = 0;
        var context = canvas.getContext('2d') || canvas.getContext('webgl');

        _this.recorder.start();
        _this.captureInterval = setInterval(function () {
          var elapsed = Date.now() - start;
          try {
            _this.capture(_this.recorder, canvas, context, count);
          } catch (err) {
            _this.done = Date.now();
            _this.recorder.error(err);
            if (_this.captureInterval) clearInterval(_this.captureInterval);
            error(err);
            return;
          }
          count++;
          if (_this.options.autoStop) {
            var maxFrames = _this.options.frames;
            var maxElapsed = _this.options.seconds ? _this.options.seconds * 1000 : null;
            if (maxFrames && count >= maxFrames || maxElapsed && elapsed >= maxElapsed) {
              _this.stop().then(resolve).catch(reject);
              return;
            }
          }
        }, tick);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.captureInterval) {
          clearInterval(_this2.captureInterval);
          _this2.captureInterval = null;
        }

        if (_this2.recorder) {

          _this2.recorder.stop();
          _this2.recorder.complete = function (blob) {
            resolve(blob);
          };

          _this2.recorder.error = function (err) {
            reject(err);
          };
        } else {
          reject(new Error("Recorder is not initialized"));
        }
      });
    }
  }]);

  return Tinygif;
}();

exports.default = Tinygif;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__encoder_worker_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__encoder_worker_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__encoder_worker_js__);


class Recorder {
  constructor(options) {
    options = options || {}
    this.complete = options.complete || (() => {})
    this.progress = options.progress || (() => {})
    this.width = options.width
    this.height = options.height
    this.sample = options.sample || 30 // smaller == more accurate, larger == faster, 1..30
    this.loop = options.loop || 0 // null == do not loop; 0 == loop forever; N = number of loops
    this.delay = options.delay || 2 // in hundredths of seconds, 2 == 50 fps
    this.frames = []
    this.encoded = 0
    this.capturing = false
    this.waiting = false
    this.encoder = new __WEBPACK_IMPORTED_MODULE_0__encoder_worker_js___default.a()
  }

  // Get ready to capture, call this before capturing frames
  start() {
    this.capturing = true
    this.waiting = true
  }

  // No more frames will be captured, finish up the work and render
  stop() {
    this.capturing = false
    this.progress(this.frames.length, this.frames.length)

    // If processing is all caught up... complete the encoding
    if (this.encoded >= this.frames.length) {
      this.render()
    }
  }

  error(error) {
    this.capturing = false
  }

  render() {
    // Fire the callback
    this.encoder.onmessage = (message) => {
      this.frames = []
      this.complete(message.data.blob)
    }
    this.encoder.postMessage({
      render: true
    })
  }

  // Capture a frame from the canvas
  capture(canvas, context, delay) {
    if (!this.capturing) {
      throw "Not capturing"
    }

    delay = delay || this.delay

    let data

    if (typeof context === "WebGLRenderingContext") {
      data = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4)
      gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, data)
    } else {
      let imageData = context.getImageData(0, 0, this.width, this.height)
      data = imageData.data

      // Pre-2013 imageData could be a pixel array, backward-compatabile
      if (typeof data === "CanvasPixelArray") {
        data = new Uint8Array(imageData.data)
      }
    }

    // Add this frame onto the stack
    this.frames.push({
      data: data,
      delay: delay
    })

    if (this.waiting) {
      this.waiting = false
      this.encode()
    }
  }

  // Process the palette and index the image data for the next available frame
  encode() {
    let index = this.encoded
    let frame = this.frames[index]

    this.encoder.onmessage = (message) => {
      this.progress(index, this.frames.length)
      this.encoded += 1

      // Check for pending frames, if any process
      if (this.encoded < this.frames.length) {
        setTimeout(() => { this.encode() }, 0)
        return
      }

      // If still capturing and no pending frames, start waiting again
      if (this.capturing) {
        this.waiting = true
        return
      }

      // Everything is done...
      this.render()
    }

    // TODO: it doesn't make sense to pass width and height around
    this.encoder.postMessage({
      frame: frame,
      width: this.width,
      height: this.height,
      sample: this.sample,
      loop: this.loop
    })
    // We don't need the data anymore
    delete(frame.data)
  }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = Recorder;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return __webpack_require__(3)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, {\n/******/ \t\t\t\tconfigurable: false,\n/******/ \t\t\t\tenumerable: true,\n/******/ \t\t\t\tget: getter\n/******/ \t\t\t});\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, __webpack_exports__, __webpack_require__) {\n\n\"use strict\";\nObject.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__encoder__ = __webpack_require__(1);\n\n\nlet encoder\n\nself.onmessage = function(message) {\n  let data = message.data\n  if (data.render) {\n    let gif = encoder ? encoder.render() : null\n    let array = new Uint8Array(gif)\n    let blob = new Blob([array], {type: 'image/gif'})\n    console.log(JSON.stringify(encoder.timing))\n    postMessage({blob: blob})\n    close()\n    return\n  }\n  encoder = encoder || new __WEBPACK_IMPORTED_MODULE_0__encoder__[\"a\" /* default */]({\n    width: data.width,\n    height: data.height,\n    sample: data.sample,\n    loop: data.loop\n  })\n  let frame = data.frame\n  encoder.encode(frame)\n  postMessage({})\n}\n\n\n/***/ }),\n/* 1 */\n/***/ (function(module, __webpack_exports__, __webpack_require__) {\n\n\"use strict\";\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NeuQuant__ = __webpack_require__(2);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__NeuQuant___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__NeuQuant__);\n\n\nconst GifWriter = __webpack_require__(3).GifWriter\n\nclass Encoder {\n  constructor(options) {\n    this.width = options.width\n    this.height = options.height\n    this.sample = options.sample\n    this.loop = options.loop\n    this.colors = null\n    this.palette = null\n    this.quantizer = null\n    this.previous = null\n    this.encoded = 0\n    this.rendered = null\n  }\n\n  componentizedPaletteToArray(paletteRGB) {\n    let paletteArray = []\n\n    for (let i = 0; i < paletteRGB.length; i += 3) {\n      let r = paletteRGB[i]\n      let g = paletteRGB[i + 1]\n      let b = paletteRGB[i + 2]\n      paletteArray.push(r << 16 | g << 8 | b)\n    }\n\n    return paletteArray\n  }\n\n  dirtyRect(previousData, imageData) {\n    return this.time(\"dirty\", () => {\n      let result = {\n        x: 0,\n        y: 0,\n        width: this.width,\n        height: this.height\n      }\n\n      if (!previousData) {\n        return result\n      }\n\n      let left = -1, right = -1, top = -1, bottom = -1\n\n      for (let i = 0, l = previousData.length; i < l; i++) {\n        if (previousData[i] !== imageData[i]) {\n          top = Math.floor(i / (this.width * 4))\n          break\n        }\n      }\n\n      // There is no delta, all pixels match\n      if (top == -1) {\n        return null\n      }\n\n      for (let i = previousData.length - 1; i > -1; i--) {\n        if (previousData[i] !== imageData[i]) {\n          bottom = Math.floor(i / (this.width * 4))\n          break\n        }\n      }\n\n      for (let x = 0, l = (this.width * 4); x < l; x += 4) {\n        for (let y = 0; y < this.height; y++) {\n          let pos = (y * (this.width * 4)) + x\n          if (previousData[pos] !== imageData[pos] ||\n            previousData[pos + 1] !== imageData[pos + 1] ||\n            previousData[pos + 2] !== imageData[pos + 2] ||\n            previousData[pos + 3] !== imageData[pos + 3]) {\n            left = x / 4\n            break\n          }\n        }\n        if (left > -1) break\n      }\n\n      for (let x = ((this.width - 1) * 4); x > -1; x -= 4) {\n        for (let y = 0; y < this.height; y++) {\n          let pos = (y * (this.width * 4)) + x\n          if (previousData[pos] !== imageData[pos] ||\n            previousData[pos + 1] !== imageData[pos + 1] ||\n            previousData[pos + 2] !== imageData[pos + 2] ||\n            previousData[pos + 3] !== imageData[pos + 3]) {\n            right = x / 4\n            break\n          }\n        }\n        if (right > -1) break\n      }\n\n      return {\n        x: left,\n        y: top,\n        width: (right - left) + 1,\n        height: (bottom - top) + 1\n      }\n    })\n  }\n\n  encode(frame) {\n    let processed = this.process(frame)\n\n    // If nothing has changed between frames, lets just skip this frame\n    if (processed.skip) {\n      this.previous.delay += frame.delay\n      delete(frame.data)\n    } else {\n      frame.pixels = processed.pixels\n      frame.palette = processed.palette\n      frame.colors = processed.colors\n      frame.x = processed.delta.x\n      frame.y = processed.delta.y\n      frame.width = processed.delta.width\n      frame.height = processed.delta.height\n\n      // Try to save the palette as the global palette if there is none\n      if (!this.palette) {\n        this.palette = frame.palette\n        this.colors = frame.colors\n      }\n\n      // We've accounted for the skips and can render the previous frame\n      if (this.previous) {\n        this.write(this.previous)\n        delete(this.previous.data)\n      }\n\n      this.previous = frame\n    }\n    this.encoded += 1\n  }\n\n  process(frame) {\n    return this.time(\"process\", () => {\n      let t0\n      let data = frame.data\n      let deltaImageData\n      let delta\n\n      // Find the delta\n      if (!this.previous) {\n        delta = {x: 0, y: 0, width: this.width, height: this.height }\n        deltaImageData = data\n        this.rendered = deltaImageData\n      } else {\n        delta = this.dirtyRect(this.previous.data, data)\n        // A null result means nothing changed, the frame is the same\n        if (!delta) {\n          return {\n            skip: true\n          }\n        }\n\n        // Grab only the changed portion and work with that\n        deltaImageData = new Uint8ClampedArray(delta.width * delta.height * 4)\n        let deltaIndex = 0\n        t0 = performance.now()\n        for (let y = delta.y, l = delta.y + delta.height; y < l; y++) {\n          let start = (y * this.width * 4) + (delta.x * 4)\n          let end = (y * this.width * 4) + (delta.x * 4) + (delta.width * 4)\n          for (let i = start; i < end; i += 4) {\n            let r = data[i]\n            let g = data[i + 1]\n            let b = data[i + 2]\n            // If the color is already the same, make it transparent,\n            // otherwise update it to the new color\n            if (this.rendered[i] === r &&\n                this.rendered[i + 1] === g &&\n                this.rendered[i + 2] === b) {\n              // ignore alpha, make it transparent\n              deltaImageData[deltaIndex++] = r\n              deltaImageData[deltaIndex++] = g\n              deltaImageData[deltaIndex++] = b\n              deltaImageData[deltaIndex++] = 0\n            } else {\n              // Pixel has changed, overwrite it\n              this.rendered[i] = r\n              this.rendered[i + 1] = g\n              this.rendered[i + 2] = b\n              this.rendered[i + 3] = 1\n              deltaImageData[deltaIndex++] = r\n              deltaImageData[deltaIndex++] = g\n              deltaImageData[deltaIndex++] = b\n              deltaImageData[deltaIndex++] = 1\n            }\n          }\n        }\n        this.report(\"deltaImageData\", t0)\n      }\n\n      // Prepare an index array into the palette\n      let numberPixels = delta.width * delta.height\n      let indexedPixels = new Uint8Array(numberPixels)\n      let pixel = 0\n\n      // If we can use the global palette directly let's do it... even if we have\n      // to add a couple more colors, if we used a quantized palette before we\n      // assume we have a more complex image animating and just go down that road\n      if (this.palette && !this.quantizer) {\n        t0 = performance.now()\n        let globalPaletteMatches = true\n        let globalPaletteAdded = false\n        for (let i = 0, l = deltaImageData.length; i < l; i+=4){\n          let r = deltaImageData[i]\n          let g = deltaImageData[i + 1]\n          let b = deltaImageData[i + 2]\n          // Ignore alpha, make it solid\n          let color = (r << 16 | g << 8 | b)\n          let foundIndex = this.colors[color]\n          // If we didn't find it on the global palette, is there room to add it?\n          if (foundIndex == null && this.palette.length >= 256) {\n            globalPaletteMatches = false\n            break\n          }\n          if (foundIndex == null) {\n            this.palette.push(color)\n            foundIndex = this.palette.length - 1\n            this.colors[color] = foundIndex\n          }\n          indexedPixels[pixel++] = foundIndex\n        }\n        this.report(\"check_global_palette\", t0)\n\n        if (globalPaletteMatches) {\n          return {\n            delta: delta,\n            pixels: indexedPixels,\n          }\n        }\n      }\n\n      // We couldn't use the global palette, try to create a local palette instead\n      // Grabbing the unique colors and just using them is way more efficient, but\n      // it doesn't work for images > 256 colors; we'll be optimisitic about it\n      // We start the palette with a single color 0 which is for transparency. This\n      // reduces our total color space by 1 but is optimal for potential transparency\n      // savings which we won't know a priori, but are betting on.\n      let colorsArray = [0]\n      let colorsHash = {}\n      pixel = 0\n      t0 = performance.now()\n      for (let i = 0, l = deltaImageData.length; i < l; i += 4) {\n        let r = deltaImageData[i]\n        let g = deltaImageData[i + 1]\n        let b = deltaImageData[i + 2]\n        let a = deltaImageData[i + 3]\n        if (a === 0) {\n          indexedPixels[pixel++] = 0 // transparent\n        } else {\n          // Ignore the alpha channel, make it solid\n          let color = (r << 16 | g << 8 | b)\n          let foundIndex = colorsHash[color]\n          if (foundIndex == null) {\n            colorsArray.push(color)\n            foundIndex = colorsArray.length - 1\n            // If there are already too many colors, just bail on this approach\n            if (foundIndex >= 256) break\n            colorsHash[color] = foundIndex\n          }\n          indexedPixels[pixel++] = foundIndex\n        }\n      }\n      // this.report(\"local\", t0)\n\n      if (colorsArray.length <= 256) {\n        return {\n          delta: delta,\n          pixels: indexedPixels,\n          palette: colorsArray,\n          colors: colorsHash\n        }\n      }\n\n      // This is the \"traditional\" animated gif style of going from RGBA to\n      // indexed color frames via sampling\n      t0 = performance.now()\n      let nq = new __WEBPACK_IMPORTED_MODULE_0__NeuQuant___default.a(deltaImageData, deltaImageData.length, this.sample)\n      let paletteRGB = nq.process()\n      this.report(\"neuquant\", t0)\n\n      t0 = performance.now()\n      let paletteArray = this.componentizedPaletteToArray(paletteRGB)\n      paletteArray.splice(0, 0, 0) // insert a transparent index\n      let k = 0\n      colorsHash = {}\n      for (let i = 0; i < numberPixels; i++) {\n        let r = deltaImageData[k++]\n        let g = deltaImageData[k++]\n        let b = deltaImageData[k++]\n        let a = deltaImageData[k++]\n        if (a === 0) {\n          indexedPixels[i] = 0\n        } else {\n          let color = (r << 16 | g << 8 | b)\n          let foundIndex = colorsHash[color]\n          if (foundIndex == null) {\n            foundIndex = nq.map(r, g, b) + 1\n            colorsHash[color] = foundIndex\n          }\n          indexedPixels[i] = foundIndex\n        }\n      }\n      this.report(\"mapping\", t0)\n\n      this.quantizer = true\n\n      return {\n        delta: delta,\n        pixels: indexedPixels,\n        palette: paletteArray\n      }\n    })\n  }\n\n  write(frame) {\n    return this.time(\"write\", () => {\n      // If we haven't started the gif lets do it now\n      if (!this.gif) {\n        this.buffer = []\n        // We default to an empty 2 color palette which we replace later\n        let options = {loop: this.loop, palette: [0, 0]}\n        this.gif = new GifWriter(this.buffer, this.width, this.height, options)\n      }\n\n      if (frame.palette) {\n        this.ensurePalettePowerOfTwo(frame.palette)\n      }\n\n      this.gif.addFrame(frame.x, frame.y, frame.width, frame.height, frame.pixels, {\n        num_colors: (frame.palette || this.palette).length,\n        palette: frame.palette, // might be null if using global\n        delay: frame.delay,\n        transparent: 0,\n        disposal: 1\n      })\n\n      // Let go of memory fast\n      if (frame.palette) delete(frame.palette)\n      if (frame.pixels) delete(frame.pixels)\n    })\n  }\n\n  render() {\n    return this.time(\"render\", () => {\n      // Write the final frame if pending\n      if (this.previous) {\n        this.write(this.previous)\n        delete(this.previous.data)\n        this.previous = null\n      }\n      this.frames = []\n      this.gif.end()\n\n      // Insert the palette now\n      this.ensurePalettePowerOfTwo(this.palette)\n\n      // Adjust the packed field\n      let gp_num_colors_pow2 = 0\n      let gp_num_colors = this.palette.length\n      while (gp_num_colors >>= 1) ++gp_num_colors_pow2\n      gp_num_colors = 1 << gp_num_colors_pow2\n      --gp_num_colors_pow2;\n      let packedField = 0x80 | gp_num_colors_pow2\n      this.buffer[10] = packedField\n\n      // Build Global Color Table\n      let colorTable = []\n      let p = 0\n      for (var i = 0, il = this.palette.length; i < il; ++i) {\n        var rgb = this.palette[i];\n        colorTable[p++] = rgb >> 16 & 0xff;\n        colorTable[p++] = rgb >> 8 & 0xff;\n        colorTable[p++] = rgb & 0xff;\n      }\n\n      // Insert the global palette into the array\n      let tail = this.buffer.splice(19, this.buffer.length)\n      this.buffer.splice(13, 19)\n      this.buffer = this.buffer.concat(colorTable)\n      this.buffer = this.buffer.concat(tail)\n\n      return this.buffer\n    })\n  }\n\n  ensurePalettePowerOfTwo(palette) {\n    // GIF89a palettes must be lenghts that are 2..256 and a power of 2\n    let next = Math.pow(2, Math.ceil(Math.log(palette.length)/Math.log(2)))\n    if (next < 2) next = 2\n    while (palette.length < next) {\n      palette.push(0)\n    }\n  }\n\n  time(key, func) {\n    this.timing = this.timing || {}\n    let t0 = performance.now()\n    let result = func()\n    this.timing[key] = this.timing[key] || 0\n    this.timing[key] += performance.now() - t0\n    return result\n  }\n\n  report(key, t0) {\n    this.timing = this.timing || {}\n    this.timing[key] = this.timing[key] || 0\n    this.timing[key] += performance.now() - t0\n  }\n}\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = Encoder;\n\n\n\n/***/ }),\n/* 2 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n\n/*\n* NeuQuant Neural-Net Quantization Algorithm\n* ------------------------------------------\n*\n* Copyright (c) 1994 Anthony Dekker\n*\n* NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See\n* \"Kohonen neural networks for optimal colour quantization\" in \"Network:\n* Computation in Neural Systems\" Vol. 5 (1994) pp 351-367. for a discussion of\n* the algorithm.\n*\n* Any party obtaining a copy of these files from the author, directly or\n* indirectly, is granted, free of charge, a full and unrestricted irrevocable,\n* world-wide, paid up, royalty-free, nonexclusive right and license to deal in\n* this software and documentation files (the \"Software\"), including without\n* limitation the rights to use, copy, modify, merge, publish, distribute,\n* sublicense, and/or sell copies of the Software, and to permit persons who\n* receive copies from any such party to do so, with the only requirement being\n* that this copyright notice remain intact.\n*/\n\n/*\n* This class handles Neural-Net quantization algorithm\n* @author Kevin Weiner (original Java version - kweiner@fmsware.com)\n* @author Thibault Imbert (AS3 version - bytearray.org)\n* @version 0.1 AS3 implementation\n* @version 0.2 JS->AS3 \"translation\" by antimatter15\n* @version 0.3 JS clean up + using modern JS idioms by sole - http://soledadpenades.com\n* Also implement fix in color conversion described at http://stackoverflow.com/questions/16371712/neuquant-js-javascript-color-quantization-hidden-bug-in-js-conversion\n*/\n\nmodule.exports = function NeuQuant() {\n\n    var pixSize = 4; // expect rgba\n    var netsize = 255; // number of colours used\n\n    // four primes near 500 - assume no image has a length so large\n    // that it is divisible by all four primes\n    var prime1 = 499;\n    var prime2 = 491;\n    var prime3 = 487;\n    var prime4 = 503;\n\n    // minimum size for input image\n    var minpicturebytes = pixSize * prime4;\n\n    // Network Definitions\n\n    var maxnetpos = netsize - 1;\n    var netbiasshift = 4; // bias for colour values\n    var ncycles = 100; // no. of learning cycles\n\n    // defs for freq and bias\n    var intbiasshift = 16; // bias for fractions\n    var intbias = 1 << intbiasshift;\n    var gammashift = 10; // gamma = 1024\n    var gamma = 1 << gammashift;\n    var betashift = 10;\n    var beta = intbias >> betashift; // beta = 1/1024\n    var betagamma = intbias << gammashift - betashift;\n\n    // defs for decreasing radius factor\n    // For 256 colors, radius starts at 32.0 biased by 6 bits\n    // and decreases by a factor of 1/30 each cycle\n    var initrad = netsize >> 3;\n    var radiusbiasshift = 6;\n    var radiusbias = 1 << radiusbiasshift;\n    var initradius = initrad * radiusbias;\n    var radiusdec = 30;\n\n    // defs for decreasing alpha factor\n    // Alpha starts at 1.0 biased by 10 bits\n    var alphabiasshift = 10;\n    var initalpha = 1 << alphabiasshift;\n    var alphadec;\n\n    // radbias and alpharadbias used for radpower calculation\n    var radbiasshift = 8;\n    var radbias = 1 << radbiasshift;\n    var alpharadbshift = alphabiasshift + radbiasshift;\n    var alpharadbias = 1 << alpharadbshift;\n\n    // Input image\n    var thepicture;\n    // Height * Width * pixSize\n    var lengthcount;\n    // Sampling factor 1..30\n    var samplefac;\n\n    // The network itself\n    var network;\n    var netindex = [];\n\n    // for network lookup - really netsize max 256\n    var bias = [];\n\n    // bias and freq arrays for learning\n    var freq = [];\n    var radpower = [];\n\n    function NeuQuantConstructor(thepic, len, sample) {\n\n        var i;\n        var p;\n\n        thepicture = thepic;\n        lengthcount = len;\n        samplefac = sample;\n\n        network = new Array(netsize);\n\n        for (i = 0; i < netsize; i++) {\n            network[i] = new Array(4);\n            p = network[i];\n            p[0] = p[1] = p[2] = (i << netbiasshift + 8) / netsize | 0;\n            freq[i] = intbias / netsize | 0; // 1 / netsize\n            bias[i] = 0;\n        }\n    }\n\n    function colorMap() {\n        var map = [];\n        var index = new Array(netsize);\n        for (var i = 0; i < netsize; i++) {\n            index[network[i][3]] = i;\n        }var k = 0;\n        for (var l = 0; l < netsize; l++) {\n            var j = index[l];\n            map[k++] = network[j][0];\n            map[k++] = network[j][1];\n            map[k++] = network[j][2];\n        }\n        return map;\n    }\n\n    // Insertion sort of network and building of netindex[0..255]\n    // (to do after unbias)\n    function inxbuild() {\n        var i;\n        var j;\n        var smallpos;\n        var smallval;\n        var p;\n        var q;\n        var previouscol;\n        var startpos;\n\n        previouscol = 0;\n        startpos = 0;\n\n        for (i = 0; i < netsize; i++) {\n\n            p = network[i];\n            smallpos = i;\n            smallval = p[1]; // index on g\n            // find smallest in i..netsize-1\n            for (j = i + 1; j < netsize; j++) {\n\n                q = network[j];\n\n                if (q[1] < smallval) {\n                    // index on g\n                    smallpos = j;\n                    smallval = q[1]; // index on g\n                }\n            }\n\n            q = network[smallpos];\n\n            // swap p (i) and q (smallpos) entries\n            if (i != smallpos) {\n                j = q[0];\n                q[0] = p[0];\n                p[0] = j;\n                j = q[1];\n                q[1] = p[1];\n                p[1] = j;\n                j = q[2];\n                q[2] = p[2];\n                p[2] = j;\n                j = q[3];\n                q[3] = p[3];\n                p[3] = j;\n            }\n\n            // smallval entry is now in position i\n            if (smallval != previouscol) {\n\n                netindex[previouscol] = startpos + i >> 1;\n\n                for (j = previouscol + 1; j < smallval; j++) {\n                    netindex[j] = i;\n                }\n\n                previouscol = smallval;\n                startpos = i;\n            }\n        }\n\n        netindex[previouscol] = startpos + maxnetpos >> 1;\n        for (j = previouscol + 1; j < 256; j++) {\n            netindex[j] = maxnetpos; // really netsize - 1 or 254\n        }\n    }\n\n    // Main Learning Loop\n\n    function learn() {\n        var i;\n        var j;\n        var b;\n        var g;\n        var r;\n        var radius;\n        var rad;\n        var alpha;\n        var step;\n        var delta;\n        var samplepixels;\n        var p;\n        var pix;\n        var lim;\n\n        if (lengthcount < minpicturebytes) {\n            samplefac = 1;\n        }\n\n        alphadec = 30 + (samplefac - 1) / pixSize;\n        p = thepicture;\n        pix = 0;\n        lim = lengthcount;\n        samplepixels = lengthcount / (pixSize * samplefac);\n        delta = samplepixels / ncycles | 0;\n        alpha = initalpha;\n        radius = initradius;\n\n        rad = radius >> radiusbiasshift;\n        if (rad <= 1) {\n            rad = 0;\n        }\n\n        for (i = 0; i < rad; i++) {\n            radpower[i] = alpha * ((rad * rad - i * i) * radbias / (rad * rad));\n        }\n\n        if (lengthcount < minpicturebytes) {\n            step = pixSize;\n        } else if (lengthcount % prime1 !== 0) {\n            step = pixSize * prime1;\n        } else {\n\n            if (lengthcount % prime2 !== 0) {\n                step = pixSize * prime2;\n            } else {\n                if (lengthcount % prime3 !== 0) {\n                    step = pixSize * prime3;\n                } else {\n                    step = pixSize * prime4;\n                }\n            }\n        }\n\n        i = 0;\n\n        while (i < samplepixels) {\n\n            b = (p[pix + 0] & 0xff) << netbiasshift;\n            g = (p[pix + 1] & 0xff) << netbiasshift;\n            r = (p[pix + 2] & 0xff) << netbiasshift;\n            j = contest(b, g, r);\n\n            altersingle(alpha, j, b, g, r);\n\n            if (rad !== 0) {\n                // Alter neighbours\n                alterneigh(rad, j, b, g, r);\n            }\n\n            pix += step;\n\n            if (pix >= lim) {\n                pix -= lengthcount;\n            }\n\n            i++;\n\n            if (delta === 0) {\n                delta = 1;\n            }\n\n            if (i % delta === 0) {\n                alpha -= alpha / alphadec;\n                radius -= radius / radiusdec;\n                rad = radius >> radiusbiasshift;\n\n                if (rad <= 1) {\n                    rad = 0;\n                }\n\n                for (j = 0; j < rad; j++) {\n                    radpower[j] = alpha * ((rad * rad - j * j) * radbias / (rad * rad));\n                }\n            }\n        }\n    }\n\n    // Search for BGR values 0..255 (after net is unbiased) and return colour index\n    function map(b, g, r) {\n        var i;\n        var j;\n        var dist;\n        var a;\n        var bestd;\n        var p;\n        var best;\n\n        // Biggest possible distance is netsize * pixSize\n        bestd = 1024;\n        best = -1;\n        i = netindex[g]; // index on g\n        j = i - 1; // start at netindex[g] and work outwards\n\n        while (i < netsize || j >= 0) {\n\n            if (i < netsize) {\n\n                p = network[i];\n\n                dist = p[1] - g; // inx key\n\n                if (dist >= bestd) {\n                    i = netsize; // stop iter\n                } else {\n\n                    i++;\n\n                    if (dist < 0) {\n                        dist = -dist;\n                    }\n\n                    a = p[0] - b;\n\n                    if (a < 0) {\n                        a = -a;\n                    }\n\n                    dist += a;\n\n                    if (dist < bestd) {\n                        a = p[2] - r;\n\n                        if (a < 0) {\n                            a = -a;\n                        }\n\n                        dist += a;\n\n                        if (dist < bestd) {\n                            bestd = dist;\n                            best = p[3];\n                        }\n                    }\n                }\n            }\n\n            if (j >= 0) {\n\n                p = network[j];\n\n                dist = g - p[1]; // inx key - reverse dif\n\n                if (dist >= bestd) {\n                    j = -1; // stop iter\n                } else {\n\n                    j--;\n                    if (dist < 0) {\n                        dist = -dist;\n                    }\n                    a = p[0] - b;\n                    if (a < 0) {\n                        a = -a;\n                    }\n                    dist += a;\n\n                    if (dist < bestd) {\n                        a = p[2] - r;\n                        if (a < 0) {\n                            a = -a;\n                        }\n                        dist += a;\n                        if (dist < bestd) {\n                            bestd = dist;\n                            best = p[3];\n                        }\n                    }\n                }\n            }\n        }\n\n        return best;\n    }\n\n    function process() {\n        learn();\n        unbiasnet();\n        inxbuild();\n        return colorMap();\n    }\n\n    // Unbias network to give byte values 0..255 and record position i\n    // to prepare for sort\n    function unbiasnet() {\n        var i;\n        var j;\n\n        for (i = 0; i < netsize; i++) {\n            network[i][0] >>= netbiasshift;\n            network[i][1] >>= netbiasshift;\n            network[i][2] >>= netbiasshift;\n            network[i][3] = i; // record colour no\n        }\n    }\n\n    // Move adjacent neurons by precomputed alpha*(1-((i-j)^2/[r]^2))\n    // in radpower[|i-j|]\n    function alterneigh(rad, i, b, g, r) {\n\n        var j;\n        var k;\n        var lo;\n        var hi;\n        var a;\n        var m;\n\n        var p;\n\n        lo = i - rad;\n        if (lo < -1) {\n            lo = -1;\n        }\n\n        hi = i + rad;\n\n        if (hi > netsize) {\n            hi = netsize;\n        }\n\n        j = i + 1;\n        k = i - 1;\n        m = 1;\n\n        while (j < hi || k > lo) {\n\n            a = radpower[m++];\n\n            if (j < hi) {\n\n                p = network[j++];\n\n                try {\n\n                    p[0] -= a * (p[0] - b) / alpharadbias | 0;\n                    p[1] -= a * (p[1] - g) / alpharadbias | 0;\n                    p[2] -= a * (p[2] - r) / alpharadbias | 0;\n                } catch (e) {}\n            }\n\n            if (k > lo) {\n\n                p = network[k--];\n\n                try {\n\n                    p[0] -= a * (p[0] - b) / alpharadbias | 0;\n                    p[1] -= a * (p[1] - g) / alpharadbias | 0;\n                    p[2] -= a * (p[2] - r) / alpharadbias | 0;\n                } catch (e) {}\n            }\n        }\n    }\n\n    // Move neuron i towards biased (b,g,r) by factor alpha\n    function altersingle(alpha, i, b, g, r) {\n\n        // alter hit neuron\n        var n = network[i];\n        var alphaMult = alpha / initalpha;\n        n[0] -= alphaMult * (n[0] - b) | 0;\n        n[1] -= alphaMult * (n[1] - g) | 0;\n        n[2] -= alphaMult * (n[2] - r) | 0;\n    }\n\n    // Search for biased BGR values\n    function contest(b, g, r) {\n\n        // finds closest neuron (min dist) and updates freq\n        // finds best neuron (min dist-bias) and returns position\n        // for frequently chosen neurons, freq[i] is high and bias[i] is negative\n        // bias[i] = gamma*((1/netsize)-freq[i])\n\n        var i;\n        var dist;\n        var a;\n        var biasdist;\n        var betafreq;\n        var bestpos;\n        var bestbiaspos;\n        var bestd;\n        var bestbiasd;\n        var n;\n\n        bestd = ~(1 << 31);\n        bestbiasd = bestd;\n        bestpos = -1;\n        bestbiaspos = bestpos;\n\n        for (i = 0; i < netsize; i++) {\n\n            n = network[i];\n            dist = n[0] - b;\n\n            if (dist < 0) {\n                dist = -dist;\n            }\n\n            a = n[1] - g;\n\n            if (a < 0) {\n                a = -a;\n            }\n\n            dist += a;\n\n            a = n[2] - r;\n\n            if (a < 0) {\n                a = -a;\n            }\n\n            dist += a;\n\n            if (dist < bestd) {\n                bestd = dist;\n                bestpos = i;\n            }\n\n            biasdist = dist - (bias[i] >> intbiasshift - netbiasshift);\n\n            if (biasdist < bestbiasd) {\n                bestbiasd = biasdist;\n                bestbiaspos = i;\n            }\n\n            betafreq = freq[i] >> betashift;\n            freq[i] -= betafreq;\n            bias[i] += betafreq << gammashift;\n        }\n\n        freq[bestpos] += beta;\n        bias[bestpos] -= betagamma;\n        return bestbiaspos;\n    }\n\n    NeuQuantConstructor.apply(this, arguments);\n\n    var exports = {};\n    exports.map = map;\n    exports.process = process;\n\n    return exports;\n};\n\n/***/ }),\n/* 3 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n\n// (c) Dean McNamee <dean@gmail.com>, 2013.\n//\n// https://github.com/deanm/omggif\n//\n// Permission is hereby granted, free of charge, to any person obtaining a copy\n// of this software and associated documentation files (the \"Software\"), to\n// deal in the Software without restriction, including without limitation the\n// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or\n// sell copies of the Software, and to permit persons to whom the Software is\n// furnished to do so, subject to the following conditions:\n//\n// The above copyright notice and this permission notice shall be included in\n// all copies or substantial portions of the Software.\n//\n// THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS\n// IN THE SOFTWARE.\n//\n// omggif is a JavaScript implementation of a GIF 89a encoder and decoder,\n// including animation and compression.  It does not rely on any specific\n// underlying system, so should run in the browser, Node, or Plask.\n\nfunction GifWriter(buf, width, height, gopts) {\n  var p = 0;\n\n  var gopts = gopts === undefined ? {} : gopts;\n  var loop_count = gopts.loop === undefined ? null : gopts.loop;\n  var global_palette = gopts.palette === undefined ? null : gopts.palette;\n\n  if (width <= 0 || height <= 0 || width > 65535 || height > 65535) throw \"Width/Height invalid.\";\n\n  function check_palette_and_num_colors(palette) {\n    var num_colors = palette.length;\n    if (num_colors < 2 || num_colors > 256 || num_colors & num_colors - 1) throw \"Invalid code/color length, must be power of 2 and 2 .. 256.\";\n    return num_colors;\n  }\n\n  // - Header.\n  buf[p++] = 0x47;buf[p++] = 0x49;buf[p++] = 0x46; // GIF\n  buf[p++] = 0x38;buf[p++] = 0x39;buf[p++] = 0x61; // 89a\n\n  // Handling of Global Color Table (palette) and background index.\n  var gp_num_colors_pow2 = 0;\n  var background = 0;\n  if (global_palette !== null) {\n    var gp_num_colors = check_palette_and_num_colors(global_palette);\n    while (gp_num_colors >>= 1) {\n      ++gp_num_colors_pow2;\n    }gp_num_colors = 1 << gp_num_colors_pow2;\n    --gp_num_colors_pow2;\n    if (gopts.background !== undefined) {\n      background = gopts.background;\n      if (background >= gp_num_colors) throw \"Background index out of range.\";\n      // The GIF spec states that a background index of 0 should be ignored, so\n      // this is probably a mistake and you really want to set it to another\n      // slot in the palette.  But actually in the end most browsers, etc end\n      // up ignoring this almost completely (including for dispose background).\n      if (background === 0) throw \"Background index explicitly passed as 0.\";\n    }\n  }\n\n  // - Logical Screen Descriptor.\n  // NOTE(deanm): w/h apparently ignored by implementations, but set anyway.\n  buf[p++] = width & 0xff;buf[p++] = width >> 8 & 0xff;\n  buf[p++] = height & 0xff;buf[p++] = height >> 8 & 0xff;\n  // NOTE: Indicates 0-bpp original color resolution (unused?).\n  buf[p++] = (global_palette !== null ? 0x80 : 0) | // Global Color Table Flag.\n  gp_num_colors_pow2; // NOTE: No sort flag (unused?).\n  buf[p++] = background; // Background Color Index.\n  buf[p++] = 0; // Pixel aspect ratio (unused?).\n\n  // - Global Color Table\n  if (global_palette !== null) {\n    for (var i = 0, il = global_palette.length; i < il; ++i) {\n      var rgb = global_palette[i];\n      buf[p++] = rgb >> 16 & 0xff;\n      buf[p++] = rgb >> 8 & 0xff;\n      buf[p++] = rgb & 0xff;\n    }\n  }\n\n  if (loop_count !== null) {\n    // Netscape block for looping.\n    if (loop_count < 0 || loop_count > 65535) throw \"Loop count invalid.\";\n    // Extension code, label, and length.\n    buf[p++] = 0x21;buf[p++] = 0xff;buf[p++] = 0x0b;\n    // NETSCAPE2.0\n    buf[p++] = 0x4e;buf[p++] = 0x45;buf[p++] = 0x54;buf[p++] = 0x53;\n    buf[p++] = 0x43;buf[p++] = 0x41;buf[p++] = 0x50;buf[p++] = 0x45;\n    buf[p++] = 0x32;buf[p++] = 0x2e;buf[p++] = 0x30;\n    // Sub-block\n    buf[p++] = 0x03;buf[p++] = 0x01;\n    buf[p++] = loop_count & 0xff;buf[p++] = loop_count >> 8 & 0xff;\n    buf[p++] = 0x00; // Terminator.\n  }\n\n  var ended = false;\n\n  this.addFrame = function (x, y, w, h, indexed_pixels, opts) {\n    if (ended === true) {\n      --p;ended = false;\n    } // Un-end.\n\n    opts = opts === undefined ? {} : opts;\n\n    // TODO(deanm): Bounds check x, y.  Do they need to be within the virtual\n    // canvas width/height, I imagine?\n    if (x < 0 || y < 0 || x > 65535 || y > 65535) throw \"x/y invalid.\";\n\n    if (w <= 0 || h <= 0 || w > 65535 || h > 65535) throw \"Width/Height invalid.\";\n\n    if (indexed_pixels.length < w * h) throw \"Not enough pixels for the frame size.\";\n\n    var using_local_palette = true;\n    var palette = opts.palette;\n    if (palette === undefined || palette === null) {\n      using_local_palette = false;\n      palette = global_palette;\n    }\n\n    if (palette === undefined || palette === null) throw \"Must supply either a local or global palette.\";\n\n    var num_colors = opts.num_colors || check_palette_and_num_colors(palette);\n\n    // Compute the min_code_size (power of 2), destroying num_colors.\n    var min_code_size = 0;\n    while (num_colors >>= 1) {\n      ++min_code_size;\n    }num_colors = 1 << min_code_size; // Now we can easily get it back.\n\n    var delay = opts.delay === undefined ? 0 : opts.delay;\n\n    // From the spec:\n    //     0 -   No disposal specified. The decoder is\n    //           not required to take any action.\n    //     1 -   Do not dispose. The graphic is to be left\n    //           in place.\n    //     2 -   Restore to background color. The area used by the\n    //           graphic must be restored to the background color.\n    //     3 -   Restore to previous. The decoder is required to\n    //           restore the area overwritten by the graphic with\n    //           what was there prior to rendering the graphic.\n    //  4-7 -    To be defined.\n    // NOTE(deanm): Dispose background doesn't really work, apparently most\n    // browsers ignore the background palette index and clear to transparency.\n    var disposal = opts.disposal === undefined ? 0 : opts.disposal;\n    if (disposal < 0 || disposal > 3) // 4-7 is reserved.\n      throw \"Disposal out of range.\";\n\n    var use_transparency = false;\n    var transparent_index = 0;\n    if (opts.transparent !== undefined && opts.transparent !== null) {\n      use_transparency = true;\n      transparent_index = opts.transparent;\n      if (transparent_index < 0 || transparent_index >= num_colors) throw \"Transparent color index.\";\n    }\n\n    if (disposal !== 0 || use_transparency || delay !== 0) {\n      // - Graphics Control Extension\n      buf[p++] = 0x21;buf[p++] = 0xf9; // Extension / Label.\n      buf[p++] = 4; // Byte size.\n\n      buf[p++] = disposal << 2 | (use_transparency === true ? 1 : 0);\n      buf[p++] = delay & 0xff;buf[p++] = delay >> 8 & 0xff;\n      buf[p++] = transparent_index; // Transparent color index.\n      buf[p++] = 0; // Block Terminator.\n    }\n\n    // - Image Descriptor\n    buf[p++] = 0x2c; // Image Seperator.\n    buf[p++] = x & 0xff;buf[p++] = x >> 8 & 0xff; // Left.\n    buf[p++] = y & 0xff;buf[p++] = y >> 8 & 0xff; // Top.\n    buf[p++] = w & 0xff;buf[p++] = w >> 8 & 0xff;\n    buf[p++] = h & 0xff;buf[p++] = h >> 8 & 0xff;\n    // NOTE: No sort flag (unused?).\n    // TODO(deanm): Support interlace.\n    buf[p++] = using_local_palette === true ? 0x80 | min_code_size - 1 : 0;\n\n    // - Local Color Table\n    if (using_local_palette === true) {\n      for (var i = 0, il = palette.length; i < il; ++i) {\n        var rgb = palette[i];\n        buf[p++] = rgb >> 16 & 0xff;\n        buf[p++] = rgb >> 8 & 0xff;\n        buf[p++] = rgb & 0xff;\n      }\n    }\n\n    p = GifWriterOutputLZWCodeStream(buf, p, min_code_size < 2 ? 2 : min_code_size, indexed_pixels);\n  };\n\n  this.end = function () {\n    if (ended === false) {\n      buf[p++] = 0x3b; // Trailer.\n      ended = true;\n    }\n    return p;\n  };\n}\n\n// Main compression routine, palette indexes -> LZW code stream.\n// |index_stream| must have at least one entry.\nfunction GifWriterOutputLZWCodeStream(buf, p, min_code_size, index_stream) {\n  buf[p++] = min_code_size;\n  var cur_subblock = p++; // Pointing at the length field.\n\n  var clear_code = 1 << min_code_size;\n  var code_mask = clear_code - 1;\n  var eoi_code = clear_code + 1;\n  var next_code = eoi_code + 1;\n\n  var cur_code_size = min_code_size + 1; // Number of bits per code.\n  var cur_shift = 0;\n  // We have at most 12-bit codes, so we should have to hold a max of 19\n  // bits here (and then we would write out).\n  var cur = 0;\n\n  function emit_bytes_to_buffer(bit_block_size) {\n    while (cur_shift >= bit_block_size) {\n      buf[p++] = cur & 0xff;\n      cur >>= 8;cur_shift -= 8;\n      if (p === cur_subblock + 256) {\n        // Finished a subblock.\n        buf[cur_subblock] = 255;\n        cur_subblock = p++;\n      }\n    }\n  }\n\n  function emit_code(c) {\n    cur |= c << cur_shift;\n    cur_shift += cur_code_size;\n    emit_bytes_to_buffer(8);\n  }\n\n  // I am not an expert on the topic, and I don't want to write a thesis.\n  // However, it is good to outline here the basic algorithm and the few data\n  // structures and optimizations here that make this implementation fast.\n  // The basic idea behind LZW is to build a table of previously seen runs\n  // addressed by a short id (herein called output code).  All data is\n  // referenced by a code, which represents one or more values from the\n  // original input stream.  All input bytes can be referenced as the same\n  // value as an output code.  So if you didn't want any compression, you\n  // could more or less just output the original bytes as codes (there are\n  // some details to this, but it is the idea).  In order to achieve\n  // compression, values greater then the input range (codes can be up to\n  // 12-bit while input only 8-bit) represent a sequence of previously seen\n  // inputs.  The decompressor is able to build the same mapping while\n  // decoding, so there is always a shared common knowledge between the\n  // encoding and decoder, which is also important for \"timing\" aspects like\n  // how to handle variable bit width code encoding.\n  //\n  // One obvious but very important consequence of the table system is there\n  // is always a unique id (at most 12-bits) to map the runs.  'A' might be\n  // 4, then 'AA' might be 10, 'AAA' 11, 'AAAA' 12, etc.  This relationship\n  // can be used for an effecient lookup strategy for the code mapping.  We\n  // need to know if a run has been seen before, and be able to map that run\n  // to the output code.  Since we start with known unique ids (input bytes),\n  // and then from those build more unique ids (table entries), we can\n  // continue this chain (almost like a linked list) to always have small\n  // integer values that represent the current byte chains in the encoder.\n  // This means instead of tracking the input bytes (AAAABCD) to know our\n  // current state, we can track the table entry for AAAABC (it is guaranteed\n  // to exist by the nature of the algorithm) and the next character D.\n  // Therefor the tuple of (table_entry, byte) is guaranteed to also be\n  // unique.  This allows us to create a simple lookup key for mapping input\n  // sequences to codes (table indices) without having to store or search\n  // any of the code sequences.  So if 'AAAA' has a table entry of 12, the\n  // tuple of ('AAAA', K) for any input byte K will be unique, and can be our\n  // key.  This leads to a integer value at most 20-bits, which can always\n  // fit in an SMI value and be used as a fast sparse array / object key.\n\n  // Output code for the current contents of the index buffer.\n  var ib_code = index_stream[0] & code_mask; // Load first input index.\n  var code_table = {}; // Key'd on our 20-bit \"tuple\".\n\n  emit_code(clear_code); // Spec says first code should be a clear code.\n\n  // First index already loaded, process the rest of the stream.\n  for (var i = 1, il = index_stream.length; i < il; ++i) {\n    var k = index_stream[i] & code_mask;\n    var cur_key = ib_code << 8 | k; // (prev, k) unique tuple.\n    var cur_code = code_table[cur_key]; // buffer + k.\n\n    // Check if we have to create a new code table entry.\n    if (cur_code === undefined) {\n      // We don't have buffer + k.\n      // Emit index buffer (without k).\n      // This is an inline version of emit_code, because this is the core\n      // writing routine of the compressor (and V8 cannot inline emit_code\n      // because it is a closure here in a different context).  Additionally\n      // we can call emit_byte_to_buffer less often, because we can have\n      // 30-bits (from our 31-bit signed SMI), and we know our codes will only\n      // be 12-bits, so can safely have 18-bits there without overflow.\n      // emit_code(ib_code);\n      cur |= ib_code << cur_shift;\n      cur_shift += cur_code_size;\n      while (cur_shift >= 8) {\n        buf[p++] = cur & 0xff;\n        cur >>= 8;cur_shift -= 8;\n        if (p === cur_subblock + 256) {\n          // Finished a subblock.\n          buf[cur_subblock] = 255;\n          cur_subblock = p++;\n        }\n      }\n\n      if (next_code === 4096) {\n        // Table full, need a clear.\n        emit_code(clear_code);\n        next_code = eoi_code + 1;\n        cur_code_size = min_code_size + 1;\n        code_table = {};\n      } else {\n        // Table not full, insert a new entry.\n        // Increase our variable bit code sizes if necessary.  This is a bit\n        // tricky as it is based on \"timing\" between the encoding and\n        // decoder.  From the encoders perspective this should happen after\n        // we've already emitted the index buffer and are about to create the\n        // first table entry that would overflow our current code bit size.\n        if (next_code >= 1 << cur_code_size) ++cur_code_size;\n        code_table[cur_key] = next_code++; // Insert into code table.\n      }\n\n      ib_code = k; // Index buffer to single input k.\n    } else {\n      ib_code = cur_code; // Index buffer to sequence in code table.\n    }\n  }\n\n  emit_code(ib_code); // There will still be something in the index buffer.\n  emit_code(eoi_code); // End Of Information.\n\n  // Flush / finalize the sub-blocks stream to the buffer.\n  emit_bytes_to_buffer(1);\n\n  // Finish the sub-blocks, writing out any unfinished lengths and\n  // terminating with a sub-block of length 0.  If we have already started\n  // but not yet used a sub-block it can just become the terminator.\n  if (cur_subblock + 1 === p) {\n    // Started but unused.\n    buf[cur_subblock] = 0;\n  } else {\n    // Started and used, write length and additional terminator block.\n    buf[cur_subblock] = p - cur_subblock - 1;\n    buf[p++] = 0;\n  }\n  return p;\n}\n\nfunction GifReader(buf) {\n  var p = 0;\n\n  // - Header (GIF87a or GIF89a).\n  if (buf[p++] !== 0x47 || buf[p++] !== 0x49 || buf[p++] !== 0x46 || buf[p++] !== 0x38 || (buf[p++] + 1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {\n    throw \"Invalid GIF 87a/89a header.\";\n  }\n\n  // - Logical Screen Descriptor.\n  var width = buf[p++] | buf[p++] << 8;\n  var height = buf[p++] | buf[p++] << 8;\n  var pf0 = buf[p++]; // <Packed Fields>.\n  var global_palette_flag = pf0 >> 7;\n  var num_global_colors_pow2 = pf0 & 0x7;\n  var num_global_colors = 1 << num_global_colors_pow2 + 1;\n  var background = buf[p++];\n  buf[p++]; // Pixel aspect ratio (unused?).\n\n  var global_palette_offset = null;\n\n  if (global_palette_flag) {\n    global_palette_offset = p;\n    p += num_global_colors * 3; // Seek past palette.\n  }\n\n  var no_eof = true;\n\n  var frames = [];\n\n  var delay = 0;\n  var transparent_index = null;\n  var disposal = 0; // 0 - No disposal specified.\n  var loop_count = null;\n\n  this.width = width;\n  this.height = height;\n\n  while (no_eof && p < buf.length) {\n    switch (buf[p++]) {\n      case 0x21:\n        // Graphics Control Extension Block\n        switch (buf[p++]) {\n          case 0xff:\n            // Application specific block\n            // Try if it's a Netscape block (with animation loop counter).\n            if (buf[p] !== 0x0b || // 21 FF already read, check block size.\n            // NETSCAPE2.0\n            buf[p + 1] == 0x4e && buf[p + 2] == 0x45 && buf[p + 3] == 0x54 && buf[p + 4] == 0x53 && buf[p + 5] == 0x43 && buf[p + 6] == 0x41 && buf[p + 7] == 0x50 && buf[p + 8] == 0x45 && buf[p + 9] == 0x32 && buf[p + 10] == 0x2e && buf[p + 11] == 0x30 &&\n            // Sub-block\n            buf[p + 12] == 0x03 && buf[p + 13] == 0x01 && buf[p + 16] == 0) {\n              p += 14;\n              loop_count = buf[p++] | buf[p++] << 8;\n              p++; // Skip terminator.\n            } else {\n              // We don't know what it is, just try to get past it.\n              p += 12;\n              while (true) {\n                // Seek through subblocks.\n                var block_size = buf[p++];\n                if (block_size === 0) break;\n                p += block_size;\n              }\n            }\n            break;\n\n          case 0xf9:\n            // Graphics Control Extension\n            if (buf[p++] !== 0x4 || buf[p + 4] !== 0) throw \"Invalid graphics extension block.\";\n            var pf1 = buf[p++];\n            delay = buf[p++] | buf[p++] << 8;\n            transparent_index = buf[p++];\n            if ((pf1 & 1) === 0) transparent_index = null;\n            disposal = pf1 >> 2 & 0x7;\n            p++; // Skip terminator.\n            break;\n\n          case 0xfe:\n            // Comment Extension.\n            while (true) {\n              // Seek through subblocks.\n              var block_size = buf[p++];\n              if (block_size === 0) break;\n              // console.log(buf.slice(p, p+block_size).toString('ascii'));\n              p += block_size;\n            }\n            break;\n\n          default:\n            throw \"Unknown graphic control label: 0x\" + buf[p - 1].toString(16);\n        }\n        break;\n\n      case 0x2c:\n        // Image Descriptor.\n        var x = buf[p++] | buf[p++] << 8;\n        var y = buf[p++] | buf[p++] << 8;\n        var w = buf[p++] | buf[p++] << 8;\n        var h = buf[p++] | buf[p++] << 8;\n        var pf2 = buf[p++];\n        var local_palette_flag = pf2 >> 7;\n        var interlace_flag = pf2 >> 6 & 1;\n        var num_local_colors_pow2 = pf2 & 0x7;\n        var num_local_colors = 1 << num_local_colors_pow2 + 1;\n        var palette_offset = global_palette_offset;\n        var has_local_palette = false;\n        if (local_palette_flag) {\n          var has_local_palette = true;\n          palette_offset = p; // Override with local palette.\n          p += num_local_colors * 3; // Seek past palette.\n        }\n\n        var data_offset = p;\n\n        p++; // codesize\n        while (true) {\n          var block_size = buf[p++];\n          if (block_size === 0) break;\n          p += block_size;\n        }\n\n        frames.push({ x: x, y: y, width: w, height: h,\n          has_local_palette: has_local_palette,\n          palette_offset: palette_offset,\n          data_offset: data_offset,\n          data_length: p - data_offset,\n          transparent_index: transparent_index,\n          interlaced: !!interlace_flag,\n          delay: delay,\n          disposal: disposal });\n        break;\n\n      case 0x3b:\n        // Trailer Marker (end of file).\n        no_eof = false;\n        break;\n\n      default:\n        throw \"Unknown gif block: 0x\" + buf[p - 1].toString(16);\n        break;\n    }\n  }\n\n  this.numFrames = function () {\n    return frames.length;\n  };\n\n  this.loopCount = function () {\n    return loop_count;\n  };\n\n  this.frameInfo = function (frame_num) {\n    if (frame_num < 0 || frame_num >= frames.length) throw \"Frame index out of range.\";\n    return frames[frame_num];\n  };\n\n  this.decodeAndBlitFrameBGRA = function (frame_num, pixels) {\n    var frame = this.frameInfo(frame_num);\n    var num_pixels = frame.width * frame.height;\n    var index_stream = new Uint8Array(num_pixels); // At most 8-bit indices.\n    GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);\n    var palette_offset = frame.palette_offset;\n\n    // NOTE(deanm): It seems to be much faster to compare index to 256 than\n    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in\n    // the profile, not sure if it's related to using a Uint8Array.\n    var trans = frame.transparent_index;\n    if (trans === null) trans = 256;\n\n    // We are possibly just blitting to a portion of the entire frame.\n    // That is a subrect within the framerect, so the additional pixels\n    // must be skipped over after we finished a scanline.\n    var framewidth = frame.width;\n    var framestride = width - framewidth;\n    var xleft = framewidth; // Number of subrect pixels left in scanline.\n\n    // Output indicies of the top left and bottom right corners of the subrect.\n    var opbeg = (frame.y * width + frame.x) * 4;\n    var opend = ((frame.y + frame.height) * width + frame.x) * 4;\n    var op = opbeg;\n\n    var scanstride = framestride * 4;\n\n    // Use scanstride to skip past the rows when interlacing.  This is skipping\n    // 7 rows for the first two passes, then 3 then 1.\n    if (frame.interlaced === true) {\n      scanstride += width * 4 * 7; // Pass 1.\n    }\n\n    var interlaceskip = 8; // Tracking the row interval in the current pass.\n\n    for (var i = 0, il = index_stream.length; i < il; ++i) {\n      var index = index_stream[i];\n\n      if (xleft === 0) {\n        // Beginning of new scan line\n        op += scanstride;\n        xleft = framewidth;\n        if (op >= opend) {\n          // Catch the wrap to switch passes when interlacing.\n          scanstride = framestride * 4 + width * 4 * (interlaceskip - 1);\n          // interlaceskip / 2 * 4 is interlaceskip << 1.\n          op = opbeg + (framewidth + framestride) * (interlaceskip << 1);\n          interlaceskip >>= 1;\n        }\n      }\n\n      if (index === trans) {\n        op += 4;\n      } else {\n        var r = buf[palette_offset + index * 3];\n        var g = buf[palette_offset + index * 3 + 1];\n        var b = buf[palette_offset + index * 3 + 2];\n        pixels[op++] = b;\n        pixels[op++] = g;\n        pixels[op++] = r;\n        pixels[op++] = 255;\n      }\n      --xleft;\n    }\n  };\n\n  // I will go to copy and paste hell one day...\n  this.decodeAndBlitFrameRGBA = function (frame_num, pixels) {\n    var frame = this.frameInfo(frame_num);\n    var num_pixels = frame.width * frame.height;\n    var index_stream = new Uint8Array(num_pixels); // At most 8-bit indices.\n    GifReaderLZWOutputIndexStream(buf, frame.data_offset, index_stream, num_pixels);\n    var palette_offset = frame.palette_offset;\n\n    // NOTE(deanm): It seems to be much faster to compare index to 256 than\n    // to === null.  Not sure why, but CompareStub_EQ_STRICT shows up high in\n    // the profile, not sure if it's related to using a Uint8Array.\n    var trans = frame.transparent_index;\n    if (trans === null) trans = 256;\n\n    // We are possibly just blitting to a portion of the entire frame.\n    // That is a subrect within the framerect, so the additional pixels\n    // must be skipped over after we finished a scanline.\n    var framewidth = frame.width;\n    var framestride = width - framewidth;\n    var xleft = framewidth; // Number of subrect pixels left in scanline.\n\n    // Output indicies of the top left and bottom right corners of the subrect.\n    var opbeg = (frame.y * width + frame.x) * 4;\n    var opend = ((frame.y + frame.height) * width + frame.x) * 4;\n    var op = opbeg;\n\n    var scanstride = framestride * 4;\n\n    // Use scanstride to skip past the rows when interlacing.  This is skipping\n    // 7 rows for the first two passes, then 3 then 1.\n    if (frame.interlaced === true) {\n      scanstride += width * 4 * 7; // Pass 1.\n    }\n\n    var interlaceskip = 8; // Tracking the row interval in the current pass.\n\n    for (var i = 0, il = index_stream.length; i < il; ++i) {\n      var index = index_stream[i];\n\n      if (xleft === 0) {\n        // Beginning of new scan line\n        op += scanstride;\n        xleft = framewidth;\n        if (op >= opend) {\n          // Catch the wrap to switch passes when interlacing.\n          scanstride = framestride * 4 + width * 4 * (interlaceskip - 1);\n          // interlaceskip / 2 * 4 is interlaceskip << 1.\n          op = opbeg + (framewidth + framestride) * (interlaceskip << 1);\n          interlaceskip >>= 1;\n        }\n      }\n\n      if (index === trans) {\n        op += 4;\n      } else {\n        var r = buf[palette_offset + index * 3];\n        var g = buf[palette_offset + index * 3 + 1];\n        var b = buf[palette_offset + index * 3 + 2];\n        pixels[op++] = r;\n        pixels[op++] = g;\n        pixels[op++] = b;\n        pixels[op++] = 255;\n      }\n      --xleft;\n    }\n  };\n}\n\nfunction GifReaderLZWOutputIndexStream(code_stream, p, output, output_length) {\n  var min_code_size = code_stream[p++];\n\n  var clear_code = 1 << min_code_size;\n  var eoi_code = clear_code + 1;\n  var next_code = eoi_code + 1;\n\n  var cur_code_size = min_code_size + 1; // Number of bits per code.\n  // NOTE: This shares the same name as the encoder, but has a different\n  // meaning here.  Here this masks each code coming from the code stream.\n  var code_mask = (1 << cur_code_size) - 1;\n  var cur_shift = 0;\n  var cur = 0;\n\n  var op = 0; // Output pointer.\n\n  var subblock_size = code_stream[p++];\n\n  // TODO(deanm): Would using a TypedArray be any faster?  At least it would\n  // solve the fast mode / backing store uncertainty.\n  // var code_table = Array(4096);\n  var code_table = new Int32Array(4096); // Can be signed, we only use 20 bits.\n\n  var prev_code = null; // Track code-1.\n\n  while (true) {\n    // Read up to two bytes, making sure we always 12-bits for max sized code.\n    while (cur_shift < 16) {\n      if (subblock_size === 0) break; // No more data to be read.\n\n      cur |= code_stream[p++] << cur_shift;\n      cur_shift += 8;\n\n      if (subblock_size === 1) {\n        // Never let it get to 0 to hold logic above.\n        subblock_size = code_stream[p++]; // Next subblock.\n      } else {\n        --subblock_size;\n      }\n    }\n\n    // TODO(deanm): We should never really get here, we should have received\n    // and EOI.\n    if (cur_shift < cur_code_size) break;\n\n    var code = cur & code_mask;\n    cur >>= cur_code_size;\n    cur_shift -= cur_code_size;\n\n    // TODO(deanm): Maybe should check that the first code was a clear code,\n    // at least this is what you're supposed to do.  But actually our encoder\n    // now doesn't emit a clear code first anyway.\n    if (code === clear_code) {\n      // We don't actually have to clear the table.  This could be a good idea\n      // for greater error checking, but we don't really do any anyway.  We\n      // will just track it with next_code and overwrite old entries.\n\n      next_code = eoi_code + 1;\n      cur_code_size = min_code_size + 1;\n      code_mask = (1 << cur_code_size) - 1;\n\n      // Don't update prev_code ?\n      prev_code = null;\n      continue;\n    } else if (code === eoi_code) {\n      break;\n    }\n\n    // We have a similar situation as the decoder, where we want to store\n    // variable length entries (code table entries), but we want to do in a\n    // faster manner than an array of arrays.  The code below stores sort of a\n    // linked list within the code table, and then \"chases\" through it to\n    // construct the dictionary entries.  When a new entry is created, just the\n    // last byte is stored, and the rest (prefix) of the entry is only\n    // referenced by its table entry.  Then the code chases through the\n    // prefixes until it reaches a single byte code.  We have to chase twice,\n    // first to compute the length, and then to actually copy the data to the\n    // output (backwards, since we know the length).  The alternative would be\n    // storing something in an intermediate stack, but that doesn't make any\n    // more sense.  I implemented an approach where it also stored the length\n    // in the code table, although it's a bit tricky because you run out of\n    // bits (12 + 12 + 8), but I didn't measure much improvements (the table\n    // entries are generally not the long).  Even when I created benchmarks for\n    // very long table entries the complexity did not seem worth it.\n    // The code table stores the prefix entry in 12 bits and then the suffix\n    // byte in 8 bits, so each entry is 20 bits.\n\n    var chase_code = code < next_code ? code : prev_code;\n\n    // Chase what we will output, either {CODE} or {CODE-1}.\n    var chase_length = 0;\n    var chase = chase_code;\n    while (chase > clear_code) {\n      chase = code_table[chase] >> 8;\n      ++chase_length;\n    }\n\n    var k = chase;\n\n    var op_end = op + chase_length + (chase_code !== code ? 1 : 0);\n    if (op_end > output_length) {\n      console.log(\"Warning, gif stream longer than expected.\");\n      return;\n    }\n\n    // Already have the first byte from the chase, might as well write it fast.\n    output[op++] = k;\n\n    op += chase_length;\n    var b = op; // Track pointer, writing backwards.\n\n    if (chase_code !== code) // The case of emitting {CODE-1} + k.\n      output[op++] = k;\n\n    chase = chase_code;\n    while (chase_length--) {\n      chase = code_table[chase];\n      output[--b] = chase & 0xff; // Write backwards.\n      chase >>= 8; // Pull down to the prefix code.\n    }\n\n    if (prev_code !== null && next_code < 4096) {\n      code_table[next_code++] = prev_code << 8 | k;\n      // TODO(deanm): Figure out this clearing vs code growth logic better.  I\n      // have an feeling that it should just happen somewhere else, for now it\n      // is awkward between when we grow past the max and then hit a clear code.\n      // For now just check if we hit the max 12-bits (then a clear code should\n      // follow, also of course encoded in 12-bits).\n      if (next_code >= code_mask + 1 && cur_code_size < 12) {\n        ++cur_code_size;\n        code_mask = code_mask << 1 | 1;\n      }\n    }\n\n    prev_code = code;\n  }\n\n  if (op !== output_length) {\n    console.log(\"Warning, gif stream shorter than expected.\");\n  }\n\n  return output;\n}\n\ntry {\n  exports.GifWriter = GifWriter;exports.GifReader = GifReader;\n} catch (e) {} // CommonJS.\n\n/***/ })\n/******/ ]);", __webpack_require__.p + "8f6dec74ea2d5f9a5004.worker.js");
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

module.exports = function (content, url) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      return new Worker(URL.createObjectURL(blob));
    } catch (e) {
      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new Worker(url);
  }
};

/***/ })
/******/ ]);
});