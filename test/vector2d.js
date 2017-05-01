var assert = require('assert')
var vector2d = require('../index').vector2d

describe('vector2d', function () {

  describe('zero', function () {

    it('returns a 2d zero vector', function () {
      assert.deepEqual(vector2d.zero(), [0, 0])
    })
  })

  describe('linearInterpolate', function () {
    it('interpolates between two 2d vectors', function () {
      var start = [0, 1]
      var end = [1, 2]
      var result

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
      var start = [0, 1]
      var end = [1, 2]
      var result

      result = vector2d.linearInterpolate(start, end, 0)
      assert.deepEqual(result, start, 't=0 results in start vector')

      result = vector2d.linearInterpolate(start, end, 1)
      assert.deepEqual(result, end, 't=1 results in end vector')

      result = vector2d.linearInterpolate(start, end, 0.5)
      assert.deepEqual(result, [0.5, 1.5],
        't=0.5 results in start+end midpoint')
    })

    it('has slow start and fast finish', function () {
      var start = [0, 1]
      var end = [1, 2]
      var smooth, linear

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
})
