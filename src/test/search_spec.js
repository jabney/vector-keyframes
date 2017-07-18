const assert = require('assert')
const _ = require('lodash')
const vk = require('../index')
const search = vk.search

describe('tweenSearch', function () {

  describe('deterministic', function () {

    it('returns null for an empty list', function () {
      let result = search.tween([], 0)
      assert.equal(result, null)
    })

    it('returns the only element for a single-element list', function () {
      let keyframe = {stop: 0.25}

      let result = search.tween([keyframe], 0)
      assert.equal(result.length, 1)
      assert.equal(result[0], keyframe)

      result = search.tween([keyframe], 0.5)
      assert.equal(result.length, 1)
      assert.equal(result[0], keyframe)

      result = search.tween([keyframe], 1)
      assert.equal(result.length, 1)
      assert.equal(result[0], keyframe)
    })

    it('returns the low element when time < low.stop', function () {
      let keyframes = [
        {stop: 0.1},
        {stop: 0.5},
        {stop: 0.9}
      ]

      let result = search.tween(keyframes, 0.05)
      assert.equal(result.length, 1)
      assert.equal(result[0], keyframes[0])

      result = search.tween(keyframes, 0.1)
      assert.equal(result.length, 2)
      assert.equal(result[0], keyframes[0])
    })

    it('returns the high element when time >= high.stop', function () {
      let keyframes = [
        {stop: 0.1},
        {stop: 0.5},
        {stop: 0.9}
      ]

      let result = search.tween(keyframes, 0.9)
      assert.equal(result.length, 1)
      assert.equal(result[0], keyframes[2])

      result = search.tween(keyframes, 0.95)
      assert.equal(result.length, 1)
      assert.equal(result[0], keyframes[2])
    })

    it('returns the correct range in a long list of keyframes', function () {
      let keyframes = []
      let size = 1000
      for (let i = 1; i < size; i++) {
        keyframes.push({stop: i/size})
      }

      for (let i = 0; i <= 2*size; i++) {
        let time = i/(2*size)
        let result = search.tween(keyframes, time)

        if (result.length == 1) {
          if (time < 0.5) {
            assert(time <= result[0].stop, 'time is le low end')
          } else {
            assert(time >= result[0].stop, 'time is ge high end')
          }
        } else if (result.length == 2) {
          assert(result[0].stop <= time && time < result[1].stop,
            'time is between keyframe pair')
        } else {
          assert(false, 'list lengths should be 1 or 2')
        }
      }
    })
  })

  it('finds keyframes in O(lg(n)) time', function () {
    const maxSize = 1e3
    const skip = 100

    // Generate lists of size [skip, maxSize]
    for (let size = skip; size <= maxSize; size += skip) {
      let maxCompares = 0
      let keyframes = []

      for (let i = 0; i < size; i++) {
        keyframes.push({stop: Math.random()})
      }

      for (let i = 0; i < size; ++i) {
        let compares = 0
        let time = i/size

        search.tween(keyframes, time, function (a, b, time) {
          maxCompares = Math.max(maxCompares, ++compares)

          if (a.stop <= time && time < b.stop) {
            return 0
          } else {
            if (time < a.stop) {
              return -1
            } else {
              return 1
            }
          }
        })

        assert(maxCompares <= Math.floor(Math.log2(size)) + 1,
          'maxCompares <= log2(list_size) + 1')
      }
    }

  })
})

function timeIt(n, callback) {
  let start = process.hrtime()

  for (let i = 0; i < n; ++i) {
    callback()
  }
  let timeTuple = process.hrtime(start)

  return timeTuple[0] * 1e9 + timeTuple[1]
}
