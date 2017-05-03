const assert = require('assert')
const search = require('../index').search
const _ = require('lodash')

describe('binary search', function () {
  it('returns null for an empty list', function () {
    const found = search.binary([], 1)
    assert.equal(found, null)
  })

  it('returns null for target not in list', function () {
    const found = search.binary([1, 2, 3, 4, 5, 6, 7], 8)
    assert.equal(found, null)
  })

  it('finds all targets in lists of length [1,100]', function () {
    const maxSize = 1e2
    const skip = 1

    // Generate lists of size [1,maxSize]
    for (let size = 1; size <= maxSize; size += skip) {
      const list = _.range(0, size, skip)

      for (let find = 0; find < list.length; find += skip) {
        const found = search.binary(list, find)
        assert.equal(find, found)
      }
    }
  })

  it('finds values in O(lg(n)) time', function () {
    const maxSize = 1e3
    const skip = 100

    // Generate lists of size [skip,maxSize]
    for (let size = skip; size <= maxSize; size += skip) {
      const list = _.range(0, size)
      let maxCompares = 0

      for (let find = 0; find < size; ++find) {
        let compares = 0

        const found = search.binary(list, find, function (candidate, target) {
          maxCompares = Math.max(maxCompares, ++compares)

          if (target < candidate) {
            return -1
          } else if (target > candidate) {
            return 1
          } else {
            return 0
          }
        })

        assert.equal(find, found, 'found the target value')

        assert(maxCompares <= Math.floor(Math.log2(size)) + 1,
          'maxCompares <= log2(list_size) + 1')
      }
    }
  })
})

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
      for (let i = 0; i <= 100; i++) {
        keyframes.push({stop: i/100})
      }

      for (let i = 0; i <= 200; i++) {
        let time = i/200
        let result = search.tween(keyframes, time)
        if (result.length == 1) {
          if (time < 0.5) {
            assert(time <= result[0].stop)
          } else {
            assert(time >= result[0].stop)
          }
        } else if (result.length == 2) {
          assert(result[0].stop <= time && time < result[1].stop )
        } else {
          assert(false, 'list lengths should be 1 or 2')
        }
      }
    })
  })
})
