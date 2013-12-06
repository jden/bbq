if (!('Promise' in this)) {
  var Promise = require('bluebird')
}
var K = function (x) { return x }

// (promiser: () => Promise, advice?: {before: Function, after: Function}) => Promise
function bbq (promiser, advice) {
  var state = {}

  if (!advice) {
    return promiser()
  }

  advice.before = (advice.before || K(Promise.resolve())).bind(state)
  advice.after = (advice.after || K(Promise.resolve())).bind(state)

  // TODO: optimize cases
  return Promise.cast(advice.before())
  .then(function (val) {
    // shortcircuit promiser
    return val !== undefined
      ? val
      : Promise.cast(promiser())
        .then(function (val) {
          state.val = val
          return Promise.cast(advice.after())
          .then(function (valAfter) {
            // check for override promiser value
            return valAfter !== undefined
              ? valAfter
              : val
          })
        })
  })
}

module.exports = bbq