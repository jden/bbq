var chai = require('chai')
chai.should()
var Q = require('q')

describe('bbq', function () {
  var bbq = require('../')

  it('example', function (done) {

    var now = Date.now()
    var beforeCalled = false
    var afterCalled = false


    bbq(function () {
      return Q.promise(function (resolve) {
        beforeCalled.should.equal(true)
        afterCalled.should.equal(false)
        setTimeout(function () {
          resolve('ok')
        }, 0)
        now += 100
      })
    }, {
      before: function () {
        this.start = now
        beforeCalled = true
      },
      after: function () {
        (now - this.start).should.equal(100)
        afterCalled = true
      }
    })
    .then(function (val) {
      afterCalled.should.equal(true)
      val.should.equal('ok')
    })
    .then(done, done)
  })

  it('before advice can shortcircuit resovle', function (done) {


    var now = Date.now()
    var beforeCalled = false
    var afterCalled = false


    bbq(function () {
      return Q.promise(function (resolve, reject) {
        reject(new Error('promiser should not be called'))
      })
    }, {
      before: function () {
        beforeCalled = true
        return 23
      },
      after: function () {
        throw new Error('after advice should not be called')
      }
    })
    .then(function (val) {
      beforeCalled.should.equal(true)
      val.should.equal(23)
    })
    .then(done, done)

  })

  it('before and after advice are called in the context of state', function (done) {

    var beforeState
    var afterState

    bbq(function () {
      return Q()
    }, {
      before: function () {
        beforeState = this
        this.foo = 12
      },
      after: function () {
        afterState = this
        this.foo.should.equal(12)
      }
    })
    .then(function () {
      beforeState.should.equal(afterState)
    })
    .then(done, done)

  })

})