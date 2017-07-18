const assert = require('assert')
const scalar = require('../index').scalar

const alpha = {

  zero() {
    return '*'
  },

  linearInterpolate(a, b, t) {
    return scalar.linearInterpolate(a.charCodeAt(0), b.charCodeAt(0), t)
  },

  smoothInterpolate(a, b, t) {
    return scalar.smoothInterpolate(a.charCodeAt(0), b.charCodeAt(0), t)
  },

  keyframeInterpolate(keyframes, t, timing='linear', lib=alpha) {
    const result = scalar.keyframeInterpolate(keyframes, t, timing, lib)
    return String.fromCharCode(Math.round(result))
  }
}

describe('custom interplation lib', function () {

  it('interpolates from a-z', function () {

    const keyframes = [
      {stop:   0, value: 'a'},
      {stop:  25, value: 'z'}
    ]

    let result = alpha.keyframeInterpolate(keyframes, 0)
    assert.equal(result, 'a')

    result = alpha.keyframeInterpolate(keyframes, 6)
    assert.equal(result, 'g')

    result = alpha.keyframeInterpolate(keyframes, 19)
    assert.equal(result, 't')

    result = alpha.keyframeInterpolate(keyframes, 25)
    assert.equal(result, 'z')

    result = alpha.keyframeInterpolate(keyframes, 26)
    assert.equal(result, 'z')
  })

})
