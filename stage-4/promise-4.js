// promise改造4
function promise(fn) {
  let that = this
  that.status = 'pending'
  that.value = ''
  that.reason = ''
  that.onFulfilledCb = []
  that.onRejectedCb = []

  function resolve(value) {
    setTimeout(() => {
      if (that.status === 'pending') {
        that.status = 'fulfilled'
        that.value = value
        that.onFulfilledCb.map((item) => {
          item(value)
        })
      }
    }, 0)
  }

  function reject(reason) {
    setTimeout(() => {
      if (that.status === 'pending') {
        that.status = 'rejected'
        that.reason = reason
        that.onRejectedCb.map((item) => {
          item(reason)
        })
      }
    }, 0)
  }

  fn(resolve, reject)
}

promise.prototype.then = function(onFulfilled, onRejected) {
  let that = this
  let promise2

  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => r

  if (that.status === 'pending') {
    return promise2 = new promise((resolve, reject) => {
      that.onFulfilledCb.push((value) => {
        let x = onFulfilled(value)
        promiseResolution(promise2, x, resolve, reject)
      })

      that.onRejectedCb.push((reason) => {
        let x = onRejected(reason)
        promiseResolution(promise2, x, resolve, reject)
      })
    })
  }
}

function promiseResolution(promise2, x, resolve, reject) {
  let then
  // 2.3.1
  if (promise2 === x) {
    return reject(new TypeError('promise2 === x is wrong'))
  }
  // 2.3.2
  if (x instanceof promise) {
    if (x.status === 'pending') {
      x.then((v) => {
        promiseResolution(promise2, v, resolve, reject)
      }, reject)
    } else {
      x.then(resolve, reject)
    }
  }
  // 2.3.3
  if (typeof x === 'object' || typeof x === 'function') {
    then = x.then
    if (typeof then === 'function') {
      then.call(x, function resolvePromise(y) {
        return promiseResolution(promise2, y, resolve, reject)
      }, function rejectPromise(r) {
        return reject(r)
      })
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

function doSomething() {
  return new promise((resolve, reject) => {
    setTimeout(() => {
      resolve('promise done')
    }, 2000)
  })
}

function doSomethingElse() {
  return {
    then: (resolvePromise, rejectPromise) => {
      setTimeout(() => {
        resolvePromise(22)
        rejectPromise(33)
      })
    }
  }
  return function() {
    console.log('xxxx')
  }
  return 4
  return {test: 4}
  return new promise((resolve, reject) => {
    setTimeout(() => {
      reject('promise2 done')
    }, 2000)
  })
}
this.promise2 = doSomething().then(doSomethingElse)
console.log(this.promise2)