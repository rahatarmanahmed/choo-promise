var pify = require('pify')

module.exports = function (opts) {
  opts = opts || {}
  var P = opts.Promise || Promise
  function wrapEffects (fn) {
    return function (data, state, send, done) {
      send = pify(send, P)

      return P.resolve(fn(data, state, send, done))
      .then(function (result) {
        done(null, result)
      }, done)
    }
  }

  function wrapSubscriptions (fn) {
    return function (send, done) {
      send = pify(send, P)

      return P.resolve(fn(send, done))
      .then(function (result) {
        done(null, result)
      }, done)
    }
  }

  return {
    wrapEffects: wrapEffects,
    wrapSubscriptions: wrapSubscriptions
  }
}
