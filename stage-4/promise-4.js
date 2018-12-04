// promise 构造函数
function promise(fn) {
  let that = this
  that.status = 'pending' // 存储promise的state
  that.value = '' // 存储promise的value
  that.reason = '' // 存储promise的reason
  that.onFulfilledCb = [] // 存储then方法中注册的回调函数（第一个参数）
  that.onRejectedCb = [] // 存储then方法中注册的回调函数（第二个参数）

  // 2.1
  function resolve(value) {
    // 将promise的状态从pending更改为fulfilled，并且以value为参数依次调用then方法中注册的回调
    setTimeout(() => {
      if (that.status === 'pending') {
        that.status = 'fulfilled'
        that.value = value
        // 2.2.2、2.2.6
        that.onFulfilledCb.map(item => {
          item(that.value)
        })
      }
    }, 0)
  }

  function reject(reason) {
    // 将promise的状态从pending更改为rejected，并且以reason为参数依次调用then方法中注册的回调
    setTimeout(() => {
      if (that.status === 'pending') {
        that.status = 'rejected'
        that.reason = reason
        // 2.2.3、2.2.6
        that.onRejectedCb.map(item => {
          item(that.reason)
        })
      }
    }, 0)
  }

  fn(resolve, reject)
}

// 2.2
promise.prototype.then = function(onFulfilled, onRejected) {
  let that = this
  let promise2

  // 2.2.1、2.2.5
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
  onRejected = typeof onRejected === 'function' ? onRejected : r => r

  if (that.status === 'pending') {
    // 2.2.7
    return promise2 = new promise((resolve, reject) => {
      that.onFulfilledCb.push(value => {
        try {
          let x = onFulfilled(value)
          promiseResolution(promise2, x, resolve, reject)
        } catch(e) {
          // 2.2.7.2
          reject(e)
        }
      })

      that.onRejectedCb.push(reason => {
        try {
          let x = onRejected(reason)
          promiseResolution(promise2, x, resolve, reject)
        } catch(e) {
          // 2.2.7.2
          reject(e)
        }
      })
    })
  }
}

// promise resolution
function promiseResolution(promise2, x, resolve, reject) {
  let then
  let thenCalled = false
  // 2.3.1
  if (promise2 === x) {
    return reject(new TypeError('promise2 === x is not allowed'))
  }
  // 2.3.2
  if (x instanceof promise) {
    x.then(resolve, reject)
  }
  // 2.3.3
  if (typeof x === 'object' || typeof x === 'function') {
    try {
      // 2.3.3.1
      then = x.then
      if (typeof then === 'function') {
        // 2.3.3.2
        then.call(x, function resolvePromise(y) {
          // 2.3.3.3.3
          if (thenCalled) return
          thenCalled = true
          // 2.3.3.3.1
          return promiseResolution(promise2, y, resolve, reject)
        }, function rejectPromise(r) {
          // 2.3.3.3.3
          if (thenCalled) return
          thenCalled = true
          // 2.3.3.3.2
          return reject(r)
        })
      } else {
        // 2.3.3.4
        resolve(x)
      }
    } catch(e) {
      // 2.3.3.3.4.1
      if (thenCalled) return
      thenCalled = true
      // 2.3.3.2
      reject(e)
    }
  } else {
    // 2.3.4
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
  return this.promise2

  // return new promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('promise2 done')
  //   }, 2000)
  // })

  // return {
  //   then: (resolvePromise, rejectPromise) => {
  //     setTimeout(() => {
  //       resolvePromise(22)
  //       rejectPromise(33)
  //     })
  //   }
  // }

  // return { test: 4 }

  // return function() {
  //   console.log('xxxx')
  // }

  // return 4

  // return Promise.reject('ES6 promise')
}

this.promise2 = doSomething().then(doSomethingElse)
console.log(this.promise2)