const assert = require('assert')
const vector2d = require('../index').vector2d

describe('vector2d', function () {

  describe('zero', function () {

    it('returns a 2d zero vector', function () {
      assert.deepEqual(vector2d.zero(), [0, 0])
    })
  })

  describe('linearInterpolate', function () {
    it('interpolates between two 2d vectors', function () {
      const start = [0, 1]
      const end = [1, 2]
      let result

      result = vector2d.linearInterpolate(start, end, 0)
      assert.deepEqual(result, start, 't=0 results in start vector')

      result = vector2d.linearInterpolate(start, end, 1)
      assert.deepEqual(result, end, 't=1 results in end vector')

      result = vector2d.linearInterpolate(start, end, 0.5)
      assert.deepEqual(result, [0.5, 1.5],
        't=0.5 results in start+end midpoint')
    })
  })

  describe('smoothInterpolate', function () {
    it('interpolates between two 2d vectors', function () {
      const start = [0, 1]
      const end = [1, 2]
      let result

      result = vector2d.linearInterpolate(start, end, 0)
      assert.deepEqual(result, start, 't=0 results in start vector')

      result = vector2d.linearInterpolate(start, end, 1)
      assert.deepEqual(result, end, 't=1 results in end vector')

      result = vector2d.linearInterpolate(start, end, 0.5)
      assert.deepEqual(result, [0.5, 1.5],
        't=0.5 results in start+end midpoint')
    })

    it('has slow start and fast finish', function () {
      const start = [0, 1]
      const end = [1, 2]
      let smooth, linear

      smooth = vector2d.smoothInterpolate(start, end, 0.1)
      linear = vector2d.linearInterpolate(start, end, 0.1)
      assert(smooth[0] < linear[0], 'starts slower than linear')
      assert(smooth[1] < linear[1], 'starts slower than linear')

      smooth = vector2d.smoothInterpolate(start, end, 0.9)
      linear = vector2d.linearInterpolate(start, end, 0.9)
      assert(smooth[0] > linear[0], 'finishes faster than linear')
      assert(smooth[1] > linear[1], 'finishes faster than linear')
    })
  })

  describe('keyframeInterpolate', function () {

    it('returns the zero vector for empty keyframes', function () {
      let vector

      vector = vector2d.keyframeInterpolate([], 0)
      assert.deepEqual(vector, [0,0])

      vector = vector2d.keyframeInterpolate([], 0.5)
      assert.deepEqual(vector, [0,0])

      vector = vector2d.keyframeInterpolate([], 1)
      assert.deepEqual(vector, [0,0])
    })

    it('returns the first keyframe when only one is present', function () {
      const keyframes = [{
        stop: 0,
        value: [255,255]
      }]
      let vector

      vector = vector2d.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(vector, [255,255])

      vector = vector2d.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(vector, [255,255])

      vector = vector2d.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(vector, [255,255])
    })

    it('interpolates between two keyframes', function () {
      const keyframes = [{
        stop: 0,
        value: [0,0]
      }, {
        stop: 1,
        value: [255,255]
      }]
      let vector

      vector = vector2d.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(vector, [0,0])

      vector = vector2d.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(vector, [127.5,127.5])

      vector = vector2d.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(vector, [255,255])
    })

    it('interpolates between three keyframes', function () {
      const keyframes = [{
        stop: 0,
        value: [0,0]
      }, {
        stop: 0.5,
        value: [48,96]
      }, {
        stop: 1,
        value: [255,255]
      }]
      let vector

      vector = vector2d.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(vector, [0,0])

      vector = vector2d.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(vector, [48,96])

      vector = vector2d.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(vector, [255,255])
    })

    it('clamps first and last keyframes', function () {
      const keyframes = [{
        stop: 0.25,
        value: [0,0]
      }, {
        stop: 0.5,
        value: [127,127]
      }, {
        stop: 0.75,
        value: [255,255]
      }]
      let vector

      vector = vector2d.keyframeInterpolate(keyframes, 0)
      assert.deepEqual(vector, [0,0])

      vector = vector2d.keyframeInterpolate(keyframes, 0.25)
      assert.deepEqual(vector, [0,0])

      vector = vector2d.keyframeInterpolate(keyframes, 0.5)
      assert.deepEqual(vector, [127,127])

      vector = vector2d.keyframeInterpolate(keyframes, 0.75)
      assert.deepEqual(vector, [255,255])

      vector = vector2d.keyframeInterpolate(keyframes, 1)
      assert.deepEqual(vector, [255,255])
    })

    it('interpolates smooth or linear', function () {
      const keyframes = [{
        stop: 0,
        value: [0,0]
      }, {
        stop: 1,
        value: [255,255]
      }]
      let smooth, linear

      smooth = vector2d.keyframeInterpolate(keyframes, 0, 'smooth')
      linear = vector2d.keyframeInterpolate(keyframes, 0, 'linear')
      assert.deepEqual(smooth, [0,0])
      assert.deepEqual(linear, [0,0])

      smooth = vector2d.keyframeInterpolate(keyframes, 0.1, 'smooth')
      linear = vector2d.keyframeInterpolate(keyframes, 0.1, 'linear')
      assert(smooth[0] < linear[0])
      assert(smooth[1] < linear[1])

      smooth = vector2d.keyframeInterpolate(keyframes, 0.5, 'smooth')
      linear = vector2d.keyframeInterpolate(keyframes, 0.5, 'linear')
      assert.deepEqual(smooth, [127.5,127.5])
      assert.deepEqual(linear, [127.5,127.5])

      smooth = vector2d.keyframeInterpolate(keyframes, 0.9, 'smooth')
      linear = vector2d.keyframeInterpolate(keyframes, 0.9, 'linear')
      assert(smooth[0] > linear[0])
      assert(smooth[1] > linear[1])

      smooth = vector2d.keyframeInterpolate(keyframes, 1, 'smooth')
      linear = vector2d.keyframeInterpolate(keyframes, 1, 'linear')
      assert.deepEqual(smooth, [255,255])
      assert.deepEqual(linear, [255,255])
    })
  })
})
