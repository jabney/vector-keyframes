
// -----------------------------------
// Tween search
// -----------------------------------

function tweenComparator(a, b, time) {
  if (a.stop <= time && time < b.stop) {
    return 0
  } else {
    if (time < a.stop) {
      return -1
    } else {
      return 1
    }
  }
}

function tweenSearch(sortedList, time, low, high, comparator) {
  let mid = Math.floor(low + ((high-low) / 2))
  let len = sortedList.length

  if (len == 0) return null
  if (mid < 0) return [sortedList[0]]
  if (mid == len-1) return [sortedList[len-1]]

  let a = sortedList[mid]
  let b = sortedList[mid+1]

  let result = comparator(a, b, time)

  if (result == 0) {
    return [a, b]
  } else {
    if (result < 0) {
      return tweenSearch(sortedList, time, low, mid-1, comparator)
    } else {
      return tweenSearch(sortedList, time, mid+1, high, comparator)
    }
  }
}

// -----------------------------------
// Keyframe interpolation
// -----------------------------------

function timingToInterpFn(timing, lib) {
  let map = {
    'linear': lib.linearInterpolate,
    'smooth': lib.smoothInterpolate
  }
  return map[timing] || map.linear
}

function keyframeInterpolate(keyframes, time, timing, lib) {

  if (!Array.isArray(keyframes) || !keyframes.length) {
    return lib.zero()
  }

  const result = search.tween(keyframes, time)
  const interpolate = timingToInterpFn(timing, lib)

  if (result.length == 1) {
    let value = result[0].value
    return interpolate(value, value, 0)
  }

  const [a, b] = result
  const t_segment = (time - a.stop) / (b.stop - a.stop)
  return interpolate(a.value, b.value, t_segment)
}

// -------------------------------------------------
// search library
// -------------------------------------------------

const search = {

  /**
   * Find the keyframe or keyframe pair closest to a given time
   * @param {keyframe[]} sortedList a list of keyframes sorted
   * by 'stop', e.g, [{stop: 0.1}, {stop: 0.3}, {stop: 0.5}]
   * @param {number} time the time nearest to the desired keyframe
   * or keyframe pair
   * @param {function} comparator the search comparator function, e.g.,
   * (candidate:keyframe, target:keyframe) => number
   */
  tween(sortedList, time, comparator=tweenComparator) {
    return tweenSearch(sortedList, time, 0, sortedList.length - 1, comparator)
  }
}

// -------------------------------------------------
// util library
// -------------------------------------------------

const util = {

  /**
   * Smooth a parameter in the range 0 <= t <= 1 in a manner
   * that approximates cosine.
   * @param {float} t interpolation parameter in the range [0, 1]
   * @returns {float}
   */
  smooth(t) {
    let time = Math.max(t, Math.min(t, 1), 0)
    return 3 * Math.pow(time, 2) - 2 * Math.pow(time, 3)
  },

  /**
   * Convert a 3d byte vector to a hex color string,
   * e.g, [0, 127, 255] -> #007fff
   * @param {number[]} vector a three-element array
   * @returns {string}
   */
  vector3dToHex(vector) {
    const hexColor = '#' + vector.slice(0,3).map((c) => {
      const byte = Math.round(c)
      const hex = byte.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }).join('')

    return hexColor
  },

  /**
   * Convert a hex color string to a 3d byte vector,
   * e.g, #007fff -> [0, 127, 255]
   * @param {string} hexColor
   * @returns {number[]}
   */
  hexToVector3d(hexColor) {
    const hex = hexColor.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return [r, g, b]
  },

  /**
   * Convert a 3d byte vector to an rgb color string,
   * e.g., [0, 127, 255] -> 'rgb(0,127,255)'
   * @param {number[]}
   * @returns {string}
   */
  vector3dToRgb(vector) {
    vector = vector.slice(0,3).map(function (byte) {
      return Math.round(byte)
    })
    return 'rgb(' + vector + ')'
  },

  /**
   * Convert an rgb color string to a 3d byte vector,
   * e.g., 'rgb(0,127,255)' -> [0, 127, 255]
   * @param {string} rgbColor
   * @returns {number[]}
   */
  rgbToVector3d(rgbColor) {
    var list = rgbColor.split(/[(), ]+/)
    return list.slice(1,4).map(function (s) {
      return +s
    })
  },

  /**
   * Sort a list of keyframes in place, or any list of objects
   * with a numerical 'stop' property
   * @param {keyframe[]} keyframes a list of keyframes in
   * the form, e.g.,  [{stop: 0.5}, {stop: 0.1}, {stop: 0.95}]
   * @returns {keyframe[]}
   */
  keyframeSort(keyframes) {
    return keyframes.sort((a, b) => a.stop - b.stop)
  }
}

// -------------------------------------------------
// scalar library
// -------------------------------------------------

const scalar = {

  /**
   * Return zero
   * @returns {number}
   */
  zero() {
    return 0
  },

  /**
   * Interpolate between a and b for a factor of t
   * @param {number} a the start value
   * @param {number} b the end value
   * @param {number} t the time parameter
   * @returns {number} the interpolated value
   */
  linearInterpolate(a, b, t) {
    return a + t*(b-a)
  },

  /**
   * Interpolate between a and b for a factor of t
   * with a smooth, ease in, ease out type effect
   * @param {number} a the start value
   * @param {number} b the end value
   * @param {number} t the time parameter
   * @returns {number} the interpolated value
   */
  smoothInterpolate(a, b, t) {
    return a + util.smooth(t)*(b-a)
  },

  /**
   * Interpolate with keyframes, e.g.,
   * [{stop: 0.1, value: 10}, {stop: 0.5, value: 20}, {stop: 0.9, value: 30}]
   * @param {keyframe[]} keyframes a list of keyframes
   * @param {number} time the time nearest the keyframe stop
   * @param {'linear'|'smooth'} timing interpolation timing
   * @param {object} lib the interpolation library to use
   */
  keyframeInterpolate(keyframes, time, timing='linear', lib=scalar) {
    return keyframeInterpolate(keyframes, time, timing, lib)
  }
}

// -------------------------------------------------
// vector2d library
// -------------------------------------------------

const vector2d = {

  /**
   * Return the zero vector
   */
  zero() {
    return [0, 0]
  },

  /**
   * Interpolate between vectors a and b for a factor of t
   * @param {number} a the start value
   * @param {number} b the end value
   * @param {number} t the time parameter
   * @returns {number} the interpolated value
   */
  linearInterpolate(a, b, t) {
    const lerp = scalar.linearInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t)
    ]
  },

  /**
   * Interpolate between vectors a and b for a factor of t
   * with a smooth, ease in, ease out type effect
   * @param {number} a the start value
   * @param {number} b the end value
   * @param {number} t the time parameter
   * @returns {number} the interpolated value
   */
  smoothInterpolate(a, b, t) {
    const lerp = scalar.smoothInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t)
    ]
  },

  /**
   * Interpolate with keyframes, e.g.,
   * [
   *   {stop: 0.1, value: [0, 100]},
   *   {stop: 0.5, value: [100, 100]},
   *   {stop: 0.9, value: [100, 0]}
   * ]
   * @param {keyframe[]} keyframes a list of keyframes
   * @param {number} time the time nearest the keyframe stop
   * @param {'linear'|'smooth'} timing interpolation timing
   * @param {object} lib the interpolation library to use
   */
  keyframeInterpolate(keyframes, time, timing='linear', lib=vector2d) {
    return keyframeInterpolate(keyframes, time, timing, lib)
  }
}

// -------------------------------------------------
// vector3d library
// -------------------------------------------------

const vector3d = {

  /**
   * Return the zero vector
   */
  zero() {
    return [0, 0, 0]
  },

  /**
   * Interpolate between vectors a and b for a factor of t
   * @param {number} a the start value
   * @param {number} b the end value
   * @param {number} t the time parameter
   * @returns {number} the interpolated value
   */
  linearInterpolate(a, b, t) {
    const lerp = scalar.linearInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t)
    ]
  },

  /**
   * Interpolate between vectors a and b for a factor of t
   * with a smooth, ease in, ease out type effect
   * @param {number} a the start value
   * @param {number} b the end value
   * @param {number} t the time parameter
   * @returns {number} the interpolated value
   */
  smoothInterpolate(a, b, t) {
    const lerp = scalar.smoothInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t)
    ]
  },

  /**
   * Interpolate with keyframes, e.g.,
   * [
   *   {stop: 0.1, value: [0, 100]},
   *   {stop: 0.5, value: [100, 100]},
   *   {stop: 0.9, value: [100, 0]}
   * ]
   * @param {keyframe[]} keyframes a list of keyframes
   * @param {number} time the time nearest the keyframe stop
   * @param {'linear'|'smooth'} timing interpolation timing
   * @param {object} lib the interpolation library to use
   */
  keyframeInterpolate(keyframes, time, timing='linear', lib=vector3d) {
    return keyframeInterpolate(keyframes, time, timing, lib)
  }
}


exports.util = util
exports.search = search
exports.scalar = scalar
exports.vector2d = vector2d
exports.vector3d = vector3d
