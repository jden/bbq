var Q = require('q')
var K = function (x) { return x }

// (promiser: () => Promise, advice?: {before: Function, after: Function}) => Promise
function bbq (promiser, advice) {
  var state = {}

  if (!advice) {
    return promiser()
  }

  advice.before = (advice.before || K(Q())).bind(state)
  advice.after = (advice.after || K(Q())).bind(state)

  // TODO: optimize cases
  return Q(advice.before())
  .then(function (val) {
    // shortcircuit promiser
    return val !== undefined
      ? val
      : promiser()
        .then(function (val) {
          state.val = val
          return Q(advice.after())
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