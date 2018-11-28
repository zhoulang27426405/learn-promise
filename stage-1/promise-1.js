// 回调方式
doSomething(val => console.log(val))

function doSomething(cb) {
  let res = ''
  setTimeout(() => {
    res = 'cb done'
    cb(res)
  }, 2000)
}

// promise改造1
promise().then(res => console.log(res))

function promise() {
  return {
    then: cb => {
      let res = ''
      setTimeout(() => {
        res = 'promise done';
        cb(res)
      }, 2000)
    }
  }
}