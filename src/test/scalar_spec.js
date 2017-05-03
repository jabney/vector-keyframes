const assert = require('assert')
const scalar = require('../index').scalar

describe('scalar', function () {

  describe('zero', function () {

    it('returns a scalar zero', function () {
      assert.deepEqual(scalar.zero(), 0)
    })
  })

  describe('linearInterpolate', function () {
    it('interpolates between two scalars', function () {
      const start = 1
      const end = 2
      let result

      result = scalar.linearInterpolate(start, end, 0)
      assert.deepEqual(result, start, 't=0 results in start value')

      result = scalar.linearInterpolate(start, end, 1)
      assert.deepEqual(result, end, 't=1 results in end value')

      result = scalar.linearInterpolate(start, end, 0.5)
      assert.deepEqual(result, 1.5,
        't=0.5 results in start+end midpoint')
    })
  })

  describe('smoothInterpolate', function () {
    it('interpolates between two scalars', function () {
      const start = 1
      const end = 2
      let result

      result = scalar.linearInterpolate(start, end, 0)
      assert.deepEqual(result, start, 't=0 results in start value')

      result = scalar.linearInterpolate(start, end, 1)
      assert.deepEqual(result, end, 't=1 results in end value')

      result = scalar.linearInterpolate(start, end, 0.5)
      assert.deepEqual(result, 1.5,
        't=0.5 results in start+end midpoint')
    })

    it('has slow start and fast finish', function () {
      const start = 1
      const end = 2
      let smooth, linear

      smooth = scalar.smoothInterpolate(start, end, 0.1)
      linear = scalar.linearInterpolate(start, end, 0.1)
      assert(smooth < linear, 'starts slower than linear')

      smooth = scalar.smoothInterpolate(start, end, 0.9)
      linear = scalar.linearInterpolate(start, end, 0.9)
      assert(smooth > linear, 'finishes faster than linear')
    })
  })

  describe('keyframeInterpolate', function () {

    it('returns the zero scalar for empty keyframes', function () {
      let value

      value = scalar.keyframeInterpolate([], 0)
      assert.deepEqual(value, 0)

      value = scalar.keyframeInterpolate([], 0.5)
      assert.deepEqual(value, 0)

      value = scalar.keyframeInterpolate([], 1)
      assert.deepEqual(value, 0)
    })

    it('returns the first keyframe when only one is present', function () {
      const keyframes = [{
        stop: 0,
        value: 255
      }]
      let value

      value = scalar.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(value, 255)

      value = scalar.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(value, 255)

      value = scalar.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(value, 255)
    })

    it('interpolates between two keyframes', function () {
      const keyframes = [{
        stop: 0,
        value: 0
      }, {
        stop: 1,
        value: 255
      }]
      let value

      value = scalar.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(value, 0)

      value = scalar.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(value, 127.5)

      value = scalar.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(value, 255)
    })

    it('interpolates between three keyframes', function () {
      const keyframes = [{
        stop: 0,
        value: 0
      }, {
        stop: 0.5,
        value: 96
      }, {
        stop: 1,
        value: 255
      }]
      let value

      value = scalar.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(value, 0)

      value = scalar.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(value, 96)

      value = scalar.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(value, 255)
    })

    it('clamps first and last keyframes', function () {
      const keyframes = [{
        stop: 0.25,
        value: 0
      }, {
        stop: 0.5,
        value: 127
      }, {
        stop: 0.75,
        value: 255
      }]
      let value

      value = scalar.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(value, 0)

      value = scalar.keyframeInterpolate(keyframes, 0.25)
      assert.deepEqual(value, 0)

      value = scalar.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(value, 127)

      value = scalar.keyframeInterpolate(keyframes, 0.75)
      assert.deepEqual(value, 255)

      value = scalar.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(value, 255)
    })

    it('interpolates smooth or linear', function () {
      const keyframes = [{
        stop: 0,
        value: 0
      }, {
        stop: 1,
        value: 255
      }]
      let smooth, linear

      smooth = scalar.keyframeInterpolate(keyframes, 0, 'smooth')
      linear = scalar.keyframeInterpolate(keyframes, 0, 'linear')
      assert.deepEqual(smooth, 0)
      assert.deepEqual(linear, 0)

      smooth = scalar.keyframeInterpolate(keyframes, 0.1, 'smooth')
      linear = scalar.keyframeInterpolate(keyframes, 0.1, 'linear')
      assert(smooth < linear)

      smooth = scalar.keyframeInterpolate(keyframes, 0.5, 'smooth')
      linear = scalar.keyframeInterpolate(keyframes, 0.5, 'linear')
      assert.deepEqual(smooth, 127.5)
      assert.deepEqual(linear, 127.5)

      smooth = scalar.keyframeInterpolate(keyframes, 0.9, 'smooth')
      linear = scalar.keyframeInterpolate(keyframes, 0.9, 'linear')
      assert(smooth > linear)

      smooth = scalar.keyframeInterpolate(keyframes, 1, 'smooth')
      linear = scalar.keyframeInterpolate(keyframes, 1, 'linear')
      assert.deepEqual(smooth, 255)
      assert.deepEqual(linear, 255)
    })
  })
})
