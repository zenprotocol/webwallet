// https://github.com/facebook/jest/issues/4545
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0)
}