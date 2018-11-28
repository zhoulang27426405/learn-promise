// promise改造3
function promise(fn) {
  let callback = () => console.log('callback is null')
  let status = 'pending'
  let deferred = ''
  let value = ''
  this.then = (cb) => {
    if (status == 'pending') {
      deferred = cb
      return
    }
    cb(value)
  }
  function resolve(newValue) {
    status = 'fulfilled'
    value = newValue
    if (deferred) {
      deferred(value)
    }
  }
  fn(resolve)
}

function doSomething() {
  return new promise((resolve) => {
    let value = ''
    setTimeout(() => {
      value = 'promise done'
      resolve(value)
    }, 2000)
  })
}

doSomething().then(res => console.log(res))