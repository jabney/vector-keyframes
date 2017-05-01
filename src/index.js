
// -------------------------------------------------
// Binary search
function defaultComparator(candidate, target) {
  if (target < candidate) {
    return -1
  } else if (target > candidate) {
    return 1
  } else {
    return 0
  }
}

function binarySearch(sortedList, target, low, high, comparator) {
  if (high < low) {
    return null
  }

  const mid = Math.floor((low + high) / 2)
  const result = comparator(sortedList[mid], target)

  if (result === 0) {
    return sortedList[mid]
  } else if (result < 0) {
    return binarySearch(sortedList, target, low, mid-1, comparator)
  } else {
    return binarySearch(sortedList, target, mid+1, high, comparator)
  }
}
// -------------------------------------------------


// -------------------------------------------------
// Keyframe interpolation
function timingToInterpFn(timing, lib) {
  let map = {
    'linear': lib.linearInterpolate,
    'smooth': lib.smoothInterpolate
  }
  return map[timing] || map.linear
}

function keyframeInterpolate(keyframes, t, timing, lib) {
  const first = 0
  const last = keyframes.length - 1

  if (!Array.isArray(keyframes) || !keyframes.length) {
    return lib.zero()
  }

  if (keyframes.length === 1) {
    return keyframes[first].value
  }

  if (t < keyframes[first].stop) {
    return keyframes[first].value
  }

  if (t > keyframes[last].stop) {
    return keyframes[last].value
  }

  const pairs = []
  keyframes.reduce((a, b) => {
    pairs.push([a, b])
    return b
  })

  const pair = search.binary(pairs, t, pair => {
    const [a, b] = pair

    if (t < a.stop) { return -1 }
    else if (t > b.stop) { return 1 }
    return 0
  })

  if (pair != null) {
    const [a, b] = pair
    const t_segment = (t - a.stop) / (b.stop - a.stop)
    const interpolate = timingToInterpFn(timing, lib)
    return interpolate(a.value, b.value, t_segment)
  }

  return lib.zero()
}
// -------------------------------------------------


const util = {

  smooth(t) {
    return 3 * Math.pow(t, 2) - 2 * Math.pow(t, 3)
  },

  vector3dToHex(vector) {
    const hexColor = '#' + vector.map((c) => {
      const byte = Math.round(c)
      const hex = byte.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    }).join('')

    return hexColor
  },

  hexToVector3d(hexColor) {
    const hex = hexColor.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return [r, g, b]
  },

  vector3dToRgb(vector) {
    vector = vector.map(function (byte) {
      return Math.round(byte)
    })
    return 'rgb(' + vector + ')'
  },

  rgbToVector3d(rgbColor) {
    var list = rgbColor.split(/[(), ]+/)
    return list.slice(1,4).map(function (s) {
      return +s
    })
  }
}

const search = {

  binary(sortedList, target, comparator=defaultComparator) {
    return binarySearch(sortedList, target, 0, sortedList.length-1, comparator)
  }
}

const scalar = {

  zero() {
    return 0
  },

  linearInterpolate(a, b, t) {
    return a + t*(b-a)
  },

  smoothInterpolate(a, b, t) {
    return a + util.smooth(t)*(b-a)
  },

  keyframeInterpolate(keyframes, t, timing='linear', lib=scalar) {
    return keyframeInterpolate(keyframes, t, timing, lib)
  }
}

const vector2d = {

  zero() {
    return [0, 0]
  },

  linearInterpolate(a, b, t) {
    const lerp = scalar.linearInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t)
    ]
  },

  smoothInterpolate(a, b, t) {
    const lerp = scalar.smoothInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t)
    ]
  },

  keyframeInterpolate(keyframes, t, timing='linear', lib=vector2d) {
    return keyframeInterpolate(keyframes, t, timing, lib)
  }
}

const vector3d = {

  zero() {
    return [0, 0, 0]
  },

  linearInterpolate(a, b, t) {
    const lerp = scalar.linearInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t)
    ]
  },

  smoothInterpolate(a, b, t) {
    const lerp = scalar.smoothInterpolate
    return [
      lerp(a[0], b[0], t),
      lerp(a[1], b[1], t),
      lerp(a[2], b[2], t)
    ]
  },

  keyframeInterpolate(keyframes, t, timing='linear', lib=vector3d) {
    return keyframeInterpolate(keyframes, t, timing, lib)
  }
}

exports.util = util
exports.search = search
exports.scalar = scalar
exports.vector2d = vector2d
exports.vector3d = vector3d
