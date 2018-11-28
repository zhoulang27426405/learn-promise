// Promise正常调用方式
// function doSomething() {
//   return new Promise((resolve) => {
//     let value = ''
//     setTimeout(() => {
//       value = 'promise done'
//       resolve(value)
//     }, 2000)
//   })
// }

// doSomething().then(res => console.log(res))

// promise改造2
function promise(fn) {
  let callback = () => console.log('callback is null')
  this.then = (cb) => {
    callback = cb
  }
  function resolve(value) {
    callback(value)
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