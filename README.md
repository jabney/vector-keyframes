# vector-keyframes
Interpolate between any number of 2d or 3d vector keyframes with a focus on colors

## Installation

    npm install vector-keyframes

or

    yarn add vector-keyframes


## Example
    var vk = require('./index')
    var vector3d = vk.vector3d
    var util = vk.util

    var keyframes = [{
      stop: 0,
      vector: [0, 0, 255]
    }, {
      stop: 0.5,
      vector: [0, 255, 0]
    }, {
      stop: 1,
      vector: [0, 0, 255]
    }]

    var result = vector3d.keyframeInterpolate(keyframes, 0.25)
    console.log(result)
    console.log(util.vectorToRgb(result))
    console.log(util.vectorToHex(result))

Output:

    [ 0, 127.5, 127.5 ]
    rgb(0,128,128)
    #008080
