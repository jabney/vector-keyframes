const assert = require('assert')
const util = require('../index').util

describe('utilities', function () {

  describe('vector3dToHex', function () {
    it('converts 3d byte vector to 6-digit hex color', function () {
      let vector, hex

      vector = [0, 0, 0]
      hex = util.vector3dToHex(vector)
      assert.equal(hex, '#000000')

      vector = [127, 127, 127]
      hex = util.vector3dToHex(vector)
      assert.equal(hex, '#7f7f7f')

      vector = [255, 255, 255]
      hex = util.vector3dToHex(vector)
      assert.equal(hex, '#ffffff')
    })
  })

  describe('hexToVector3d', function () {
    it('converts 6-digit hex color to a 3d byte vector', function () {
      let hex, vector

      hex = '#000000'
      vector = util.hexToVector3d(hex)
      assert.deepEqual(vector, [0, 0, 0])

      hex = '#7f7f7f'
      vector = util.hexToVector3d(hex)
      assert.deepEqual(vector, [127, 127, 127])

      hex = '#ffffff'
      vector = util.hexToVector3d(hex)
      assert.deepEqual(vector, [255, 255, 255])
    })
  })

  describe('vector3dToRgb', function () {
    it('converts vector to rgb color string', function () {
      const rgbColor = util.vector3dToRgb([0,127.4,254.6])
      assert.equal(rgbColor, 'rgb(0,127,255)')
    })
  })

  describe('rgbToVector3d', function () {
    it('converts rgb color string to vector', function () {
      const vector = util.rgbToVector3d('rgb( 0,127, 255)')
      assert.deepStrictEqual(vector, [0,127,255])
    })
  })
})
