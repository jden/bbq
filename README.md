# bbq
AOP with Promises

## usage example
```js
var bbq = require('bbq')

function foo(){
  // return a promise
}

bbq(foo, {
  before: function () {
    this.start = Date.now()
  },
  after: function () {
    this.end = Date.now()
    this.elapsed = this.end - this.start
    console.log('promise resolved in ' + this.elapsed + 'ms')
  }
})
.then(function (resolvedValOfFoo) {
  // stuff
})

```


## api

`bbq: (promiser: () => Promise, advice?: {before: Function, after: Function}) => Promise`

`before` and `after` are AOP advice, functions which can modify the control flow of the `promiser`.

- Advice can modify the return value by returning other than undefined or a Promise of undefined.
- Advice is called in the `this` context of a `state` object, which can be used to keep track of state between before and after advice for that `promiser` invocation.
- If `before` advice returns a value, it will short-circuit the `promiser` from being called.
- `after` advice has `this.val` set to the return value of the `promiser`. If `after` returns a value other than undefined or a Promise of undefined, it will be the ultimate resolved value; otherwise `this.val` will be used.

## installation

    $ npm install bbq


## running the tests

From package root:

    $ npm install
    $ npm test


## contributors

- jden <jason@denizac.org>


## license

MIT. (c) MMXIII jden <jason@denizac.org>. See LICENSE.md
