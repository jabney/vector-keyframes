'use strict';

var vk = require('./index');
var scalar = vk.scalar;
var vector2d = vk.vector2d;
var vector3d = vk.vector3d;
var util = vk.util;

function exScalar() {
  var keyframes = [{
    stop: 0,
    value: 0
  }, {
    stop: 0.5,
    value: 1
  }, {
    stop: 1,
    value: 0
  }];

  console.log('linear   (t=0):', scalar.keyframeInterpolate(keyframes, 0));

  console.log('linear (t=0.5):', scalar.keyframeInterpolate(keyframes, 0.5));

  console.log('linear   (t=1):', scalar.keyframeInterpolate(keyframes, 1));

  console.log('linear (t=0.1):', scalar.keyframeInterpolate(keyframes, 0.1));

  console.log('smooth (t=0.1):', scalar.keyframeInterpolate(keyframes, 0.1, 'smooth'));
}

function exVector2d() {
  var keyframes = [{
    stop: 0,
    value: [0, 100]
  }, {
    stop: 0.5,
    value: [100, 100]
  }, {
    stop: 1,
    value: [100, 0]
  }];

  console.log('linear   (t=0):', vector2d.keyframeInterpolate(keyframes, 0));

  console.log('linear (t=0.5):', vector2d.keyframeInterpolate(keyframes, 0.5));

  console.log('linear   (t=1):', vector2d.keyframeInterpolate(keyframes, 1));

  console.log('linear (t=0.1):', vector2d.keyframeInterpolate(keyframes, 0.1));

  console.log('smooth (t=0.1):', vector2d.keyframeInterpolate(keyframes, 0.1, 'smooth'));
}

function exVector3d() {
  var keyframes = [{
    stop: 0,
    value: [0, 0, 255]
  }, {
    stop: 0.5,
    value: [0, 255, 0]
  }, {
    stop: 1,
    value: [0, 0, 255]
  }];

  var result = vector3d.keyframeInterpolate(keyframes, 0.25);
  console.log('\nvector    (t=0.25):', result);
  console.log('rgb color (t=0.25):', util.vector3dToRgb(result));
  console.log('hex color (t=0.25):', util.vector3dToHex(result));

  result = vector3d.keyframeInterpolate(keyframes, 0.5);
  console.log('\vvector    (t=0.5):', result);
  console.log('rgb color (t=0.5):', util.vector3dToRgb(result));
  console.log('hex color (t=0.5):', util.vector3dToHex(result));

  result = vector3d.keyframeInterpolate(keyframes, 0.9);
  console.log('\nvector    (t=0.9):', result);
  console.log('rgb color (t=0.9):', util.vector3dToRgb(result));
  console.log('hex color (t=0.9):', util.vector3dToHex(result));
}

function exCustom() {
  var alpha = {
    zero: function zero() {
      return '*';
    },
    linearInterpolate: function linearInterpolate(a, b, t) {
      return vk.scalar.linearInterpolate(a.charCodeAt(0), b.charCodeAt(0), t);
    },
    smoothInterpolate: function smoothInterpolate(a, b, t) {
      return vk.scalar.smoothInterpolate(a.charCodeAt(0), b.charCodeAt(0), t);
    },
    keyframeInterpolate: function keyframeInterpolate(keyframes, t) {
      var timing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'linear';
      var lib = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : alpha;

      var result = vk.scalar.keyframeInterpolate(keyframes, t, timing, lib);
      return String.fromCharCode(Math.round(result));
    }
  };

  var keyframes = [{
    stop: 0,
    value: 'a'
  }, {
    stop: 0.5,
    value: 'z'
  }, {
    stop: 1,
    value: 'a'
  }];

  console.log('linear   (t=0):', alpha.keyframeInterpolate(keyframes, 0, 'linear'));

  console.log('linear (t=0.5):', alpha.keyframeInterpolate(keyframes, 0.5, 'linear'));

  console.log('linear   (t=1):', alpha.keyframeInterpolate(keyframes, 1, 'linear'));

  console.log('linear (t=0.1):', alpha.keyframeInterpolate(keyframes, 0.1, 'linear'));

  console.log('smooth (t=0.1):', alpha.keyframeInterpolate(keyframes, 0.1, 'smooth'));
}

console.log('\nscalar');
console.log('--------');
exScalar();

console.log('\nvector2d');
console.log('--------');
exVector2d();

console.log('\nvector3d');
console.log('--------');
exVector3d();

console.log('\ncustom');
console.log('------');
exCustom();

console.log();

// var tweenSearch = require('./index').search.tweenSearch

// var list = [
//   {stop: 1},
//   {stop: 2},
//   {stop: 3},
//   {stop: 4},
//   {stop: 5},
//   {stop: 6},
//   {stop: 7},
//   {stop: 8},
//   {stop: 9},
//   {stop: 10},
// ]

// let list = []
// for (let i = 0; i < 9; i++) {
//   list.push({stop: Math.random()})
// }
// list = list.sort((a, b) => a.stop - b.stop)

// console.log('low, high:', list[0], list[list.length-1])
// let time = 4 // Math.random()
// console.log('time:', time)
// var result = tweenSearch(list, time)
// console.log(result)