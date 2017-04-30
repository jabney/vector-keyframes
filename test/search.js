var assert = require('assert')
var search = require('../index').search
var _ = require('lodash')

describe('binary search', function () {
  it('returns null for an empty list', function () {
    var list = []
    var found = search.binary(list, 1)
    assert.equal(found, null)
  })

  it('returns null for target not in list', function () {
    var list = [1, 2, 3, 4, 5, 6, 7]
    var found = search.binary(list, 8)
    assert.equal(found, null)
  })

  it('finds all targets in lists of length [1,100]', function () {
    var maxSize = 1e2
    var skip = 1
    var list, size, find, found

    // Generate lists of size [1,maxSize]
    for (size = 1; size <= maxSize; size += skip) {
      list = _.range(0, size, skip)

      for (find = 0; find < list.length; find += skip) {
        found = search.binary(list, find)
        assert.equal(find, found)
      }
    }
  })

  it('finds values in O(lg(n)) time', function () {
    var maxSize = 1e3
    var skip = 100
    var list, size, find, found, compares, maxCompares

    // Generate lists of size [skip,maxSize]
    for (size = skip; size <= maxSize; size += skip) {
      list = _.range(0, size)
      maxCompares = 0

      for (find = 0; find < size; ++find) {
        compares = 0

        found = search.binary(list, find, function (candidate, target) {
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

