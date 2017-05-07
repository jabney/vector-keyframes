[demo]: https://raw.githubusercontent.com/jabney/vector-keyframes/master/meta/demo.gif

# vector-keyframes
Interpolate between any number of scalar, 2d, or 3d vector keyframes with a focus on colors

## Installation

    npm install vector-keyframes

or

    yarn add vector-keyframes

![keyframe demo][demo]

*[demo app](https://jabney.github.io/vector-keyframes-demo/dist/index.html)*

## Examples
See [examples.js](https://github.com/jabney/vector-keyframes/blob/master/src/example.js)

```javascript
// Import the module and create some library aliases.
const vk = require('vector-keyframes')
const vector3d = vk.vector3d
const util = vk.util

// Define some keyframes ordered by stop, low to high.
const keyframes = [{
  stop: 0,
  value: [0, 0, 255]
}, {
  stop: 0.5,
  value: [0, 255, 0]
}, {
  stop: 1,
  value: [0, 0, 255]
}]

// Pass the keyframes and the time parameter to interpolate.
const result = vector3d.keyframeInterpolate(keyframes, 0.25)
console.log('vector    (t=0.25):', result)
console.log('rgb color (t=0.25):', util.vector3dToRgb(result))
console.log('hex color (t=0.25):', util.vector3dToHex(result))
```

### scalar
`scalar` provides a set of interpolation methods that `vector2d` and `vector3d` are built on.

```javascript
const vk = require('vector-keyframes')
const scalar = vk.scalar

const keyframes = [{
  stop: 0,
  value: 0
}, {
  stop: 0.5,
  value: 1
}, {
  stop: 1,
  value: 0
}]

console.log('linear   (t=0):',
  scalar.keyframeInterpolate(keyframes, 0))

console.log('linear (t=0.5):',
  scalar.keyframeInterpolate(keyframes, 0.5))

console.log('linear   (t=1):',
  scalar.keyframeInterpolate(keyframes, 1))

console.log('linear (t=0.1):',
  scalar.keyframeInterpolate(keyframes, 0.1))

console.log('smooth (t=0.1):',
  scalar.keyframeInterpolate(keyframes, 0.1, 'smooth'))
```

Output:

```
linear   (t=0): 0
linear (t=0.5): 1
linear   (t=1): 0
linear (t=0.1): 0.2
smooth (t=0.1): 0.10400000000000002
```

### vector2d
`vector2d` iterpolates between 2d vectors.

```javascript
const vk = require('vector-keyframes')
const vector2d = vk.vector2d

const keyframes = [{
  stop: 0,
  value: [0, 100]
}, {
  stop: 0.5,
  value: [100, 100]
}, {
  stop: 1,
  value: [100, 0]
}]

console.log('linear   (t=0):',
  vector2d.keyframeInterpolate(keyframes, 0))

console.log('linear (t=0.5):',
  vector2d.keyframeInterpolate(keyframes, 0.5))

console.log('linear   (t=1):',
  vector2d.keyframeInterpolate(keyframes, 1))

console.log('linear (t=0.1):',
  vector2d.keyframeInterpolate(keyframes, 0.1))

console.log('smooth (t=0.1):',
  vector2d.keyframeInterpolate(keyframes, 0.1, 'smooth'))
```

Output:

```
linear   (t=0): [ 0, 100 ]
linear (t=0.5): [ 100, 100 ]
linear   (t=1): [ 100, 0 ]
linear (t=0.1): [ 20, 100 ]
smooth (t=0.1): [ 10.400000000000002, 100 ]
```

### vector3d
`vector3d` interpolates between 3d vectors. The `util` library provides some conversion helpers.

```javascript
const vk = require('vector-keyframes')
const vector3d = vk.vector3d
const util = vk.util

const keyframes = [{
  stop: 0,
  value: [0, 0, 255]
}, {
  stop: 0.5,
  value: [0, 255, 0]
}, {
  stop: 1,
  value: [0, 0, 255]
}]

let result = vector3d.keyframeInterpolate(keyframes, 0.25)
console.log('\nvector    (t=0.25):', result)
console.log('rgb color (t=0.25):', util.vector3dToRgb(result))
console.log('hex color (t=0.25):', util.vector3dToHex(result))

result = vector3d.keyframeInterpolate(keyframes, 0.5)
console.log('\nvector    (t=0.5):', result)
console.log('rgb color (t=0.5):', util.vector3dToRgb(result))
console.log('hex color (t=0.5):', util.vector3dToHex(result))

result = vector3d.keyframeInterpolate(keyframes, 0.9)
console.log('\nvector    (t=0.9):', result)
console.log('rgb color (t=0.9):', util.vector3dToRgb(result))
console.log('hex color (t=0.9):', util.vector3dToHex(result))
```

Output:

```
vector    (t=0.25): [ 0, 127.5, 127.5 ]
rgb color (t=0.25): rgb(0,128,128)
hex color (t=0.25): #008080

vector    (t=0.5): [ 0, 255, 0 ]
rgb color (t=0.5): rgb(0,255,0)
hex color (t=0.5): #00ff00

vector    (t=0.9): [ 0, 51, 204 ]
rgb color (t=0.9): rgb(0,51,204)
hex color (t=0.9): #0033cc
```

### custom
Custom interpolation can be achieved by providing a base library and defining
certain methods within:

```javascript
const vk = require('vector-keyframes')
const scalar = vk.scalar

// Create a base 'alpha' library which defines its own interpolation
// methods, making use of the ones in the 'scalar' lib.
const alpha = {

  zero() {
    return '*'
  },

  linearInterpolate(a, b, t) {
    return vk.scalar.linearInterpolate(a.charCodeAt(0), b.charCodeAt(0), t)
  },

  smoothInterpolate(a, b, t) {
    return vk.scalar.smoothInterpolate(a.charCodeAt(0), b.charCodeAt(0), t)
  },

  keyframeInterpolate(keyframes, t, timing='linear', lib=alpha) {
    const result = vk.scalar.keyframeInterpolate(keyframes, t, timing, lib)
    return String.fromCharCode(Math.round(result))
  }
}

// Use the newly defined 'alpha' library.
const keyframes = [{
  stop: 0,
  value: 'a'
}, {
  stop: 0.5,
  value: 'z'
}, {
  stop: 1,
  value: 'a'
}]

console.log('linear   (t=0):',
  alpha.keyframeInterpolate(keyframes, 0, 'linear'))

console.log('linear (t=0.5):',
  alpha.keyframeInterpolate(keyframes, 0.5, 'linear'))

console.log('linear   (t=1):',
  alpha.keyframeInterpolate(keyframes, 1, 'linear'))

console.log('linear (t=0.1):',
  alpha.keyframeInterpolate(keyframes, 0.1, 'linear'))

console.log('smooth (t=0.1):',
  alpha.keyframeInterpolate(keyframes, 0.1, 'smooth'))
```

Output:

```
linear   (t=0): a
linear (t=0.5): z
linear   (t=1): a
linear (t=0.1): f
smooth (t=0.1): d
```
