# vector-keyframes
Interpolate between any number of scalar, 2d, or 3d vector keyframes with a focus on colors

## Installation

    npm install vector-keyframes

or

    yarn add vector-keyframes


## Examples
See examples.js

    var vk = require('./index')
    var scalar = vk.scalar
    var vector2d = vk.vector2d
    var vector3d = vk.vector3d
    var util = vk.util

### scalar
`scalar` provides a set of interpolation methods that `vector2d` and `vector3d` are built on.

    var keyframes = [{
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

Output:

    linear   (t=0): 0
    linear (t=0.5): 1
    linear   (t=1): 0
    linear (t=0.1): 0.2
    smooth (t=0.1): 0.10400000000000002

### vector2d
`vector2d` iterpolates between 2d vectors.

  var keyframes = [{
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

Output:

    linear   (t=0): [ 0, 100 ]
    linear (t=0.5): [ 100, 100 ]
    linear   (t=1): [ 100, 0 ]
    linear (t=0.1): [ 20, 100 ]
    smooth (t=0.1): [ 10.400000000000002, 100 ]

### vector3d
`vector3d` interpolates between 3d vectors. The `util` library provides some conversion helpers.

    var keyframes = [{
      stop: 0,
      value: [0, 0, 255]
    }, {
      stop: 0.5,
      value: [0, 255, 0]
    }, {
      stop: 1,
      value: [0, 0, 255]
    }]

    var result = vector3d.keyframeInterpolate(keyframes, 0.25)
    console.log('vector    (t=0.25):', result)
    console.log('rgb color (t=0.25):', util.vector3dToRgb(result))
    console.log('hex color (t=0.25):', util.vector3dToHex(result))

    result = vector3d.keyframeInterpolate(keyframes, 0.5)
    console.log('vector    (t=0.5):', result)
    console.log('rgb color (t=0.5):', util.vector3dToRgb(result))
    console.log('hex color (t=0.5):', util.vector3dToHex(result))

    result = vector3d.keyframeInterpolate(keyframes, 0.9)
    console.log('vector    (t=0.9):', result)
    console.log('rgb color (t=0.9):', util.vector3dToRgb(result))
    console.log('hex color (t=0.9):', util.vector3dToHex(result))

Output:

    vector    (t=0.25): [ 0, 127.5, 127.5 ]
    rgb color (t=0.25): rgb(0,128,128)
    hex color (t=0.25): #008080
    vector    (t=0.5): [ 0, 255, 0 ]
    rgb color (t=0.5): rgb(0,255,0)
    hex color (t=0.5): #00ff00
    vector    (t=0.9): [ 0, 51, 204 ]
    rgb color (t=0.9): rgb(0,51,204)
    hex color (t=0.9): #0033cc

### custom

    var alpha = {

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
        var result = vk.scalar.keyframeInterpolate(keyframes, t, timing, lib)
        return String.fromCharCode(Math.round(result))
      }
    }

    let keyframes = [{
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

Output:

    linear   (t=0): a
    linear (t=0.5): z
    linear   (t=1): a
    linear (t=0.1): f
    smooth (t=0.1): d
