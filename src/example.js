const vk = require('./index')
const scalar = vk.scalar
const vector2d = vk.vector2d
const vector3d = vk.vector3d
const util = vk.util

function exScalar() {
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
}

function exVector2d() {
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
}

function exVector3d() {
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
  console.log('\vvector    (t=0.5):', result)
  console.log('rgb color (t=0.5):', util.vector3dToRgb(result))
  console.log('hex color (t=0.5):', util.vector3dToHex(result))

  result = vector3d.keyframeInterpolate(keyframes, 0.9)
  console.log('\nvector    (t=0.9):', result)
  console.log('rgb color (t=0.9):', util.vector3dToRgb(result))
  console.log('hex color (t=0.9):', util.vector3dToHex(result))
}

function exCustom() {
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
}

console.log('\nscalar')
console.log('--------')
exScalar()

console.log('\nvector2d')
console.log('--------')
exVector2d()

console.log('\nvector3d')
console.log('--------')
exVector3d()

console.log('\ncustom')
console.log('------')
exCustom()

console.log()
