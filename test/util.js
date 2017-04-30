var assert = require('assert')
var util = require('../index').util

describe('utilities', function () {

  describe('linearInterpolate', function () {

    it('interpolates between two scalars', function () {
      var start = 1
      var end = 2
      var result

      result = util.linearInterpolate(start, end, 0)
      assert.equal(result, start, 't=0 results in start value')

      result = util.linearInterpolate(start, end, 1)
      assert.equal(result, end, 't=1 results in end value')

      result = util.linearInterpolate(start, end, 0.5)
      assert.equal(result, (start+end)/2, 't=0.5 results in start+end midpoint')
    })
  })

  describe('smoothInterpolate', function () {
    it('interpolates between two scalars', function () {
      var start = 1
      var end = 2
      var result

      result = util.linearInterpolate(start, end, 0)
      assert.equal(result, start, 't=0 results in start value')

      result = util.linearInterpolate(start, end, 1)
      assert.equal(result, end, 't=1 results in end value')

      result = util.linearInterpolate(start, end, 0.5)
      assert.equal(result, (start+end)/2, 't=0.5 results in start+end midpoint')
    })

    it('has slow start and fast finish', function () {
      var start = 1
      var end = 2
      var smooth, linear

      smooth = util.smoothInterpolate(start, end, 0.1)
      linear = util.linearInterpolate(start, end, 0.1)
      assert(smooth < linear, 'starts slower than linear')

      smooth = util.smoothInterpolate(start, end, 0.9)
      linear = util.linearInterpolate(start, end, 0.9)
      assert(smooth > linear, 'finishes faster than linear')
    })
  })

  describe('vectorToHex', function () {
    it('converts 3d byte vector to hex color', function () {
      var vector, hex

      vector = [0, 0, 0]
      hex = util.vectorToHex(vector)
      assert.equal(hex, '#000000')

      vector = [127, 127, 127]
      hex = util.vectorToHex(vector)
      assert.equal(hex, '#7f7f7f')

      vector = [255, 255, 255]
      hex = util.vectorToHex(vector)
      assert.equal(hex, '#ffffff')
    })
  })
})