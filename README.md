# learn-promise
## promise规范
### 2.1 promise必须是三种状态之一：pending, fulfilled, rejected
  - 2.1.1 promise在pending状态下，可以变为fulfilled或者rejected状态
  - 2.1.2 promise变为fulfilled状态，不能再改变状态，并保存了一个不能改变的value（异步操作的结果）
  - 2.1.3 promise变为rejected状态，同样不能再改变状态，并保存一个不能改变的reason（通常是一个异常）
### 2.2 promise必须提供一个then方法 `promise.then(onFulfilled, onRejected)`
  - 2.2.1 `onFulfilled`, `onRejected`均为可选参数，参数如果不是函数，就忽略
  - 2.2.2 `onFulfilled` 如果是函数
    1. 2.2.2.1 必须在 `promise` 状态变为fulfilled之后调用，并且将value作为它的第一个参数
    2. 2.2.2.3 只能调用一次
  - 2.2.3 `onRejected` 如果是函数
    1. 2.2.3.1 必须在 `promise` 状态变为rejected之后调用，并且将reason作为它的第一个参数
    2. 2.2.3.3 只能调用一次
  - 2.2.5 `onFulfilled` ,  `onRejected` 必须做为函数被调用
  - 2.2.6 `then` 方法可以被同一个promise多次调用，当 `promise` 状态更改后，所有的 `onFulfilled` 和 `onRejected` 必须按照注册顺序依次执行
  - 2.2.7 `then` 方法必须返回一个新的promise,`promise2 = promise1.then(onFulfilled, onRejected)`
    1. 2.2.7.1 如果 `onFulfilled` 或者 `onRejected` 返回一个值 `x` ，则运行Promise解决过程：`[[Resolve]](promise2, x)`
    2. 2.2.7.2 如果 `onFulfilled` 或者 `onRejected` 抛出一个异常 `e` ，则 `promise2` 必须拒绝执行，并返回拒因 `e`
    3. 2.2.7.3 如果 `onFulfilled` 不是函数且 `promise1` 成功执行， `promise2` 必须成功执行并返回相同的 `value`
    4. 2.2.7.4 如果 `onRejected` 不是函数且 `promise1` 拒绝执行， `promise2` 必须拒绝执行并返回相同的 `reason`
### 2.3 Promise 解决过程
  Promise 解决过程是一个抽象的操作，其需输入一个 `promise` 和一个值，我们表示为 `[[Resolve]](promise, x)`，如果 `x` 有 `then` 方法且看上去像一个 `Promise` ，解决程序即尝试使 `promise` 接受 `x` 的状态；否则其用 `x` 的值来执行 `promise`
  - 2.3.1 如果 `promise` 和 `x` 指向同一对象，以 `TypeError` 为 `reason` 拒绝执行 `promise`
  - 2.3.2 如果 `x` 为 `Promise` ，则使 `promise` 接受 `x` 的状态
    1. 2.3.2.1 如果 `x` 处于等待态， `promise` 需保持为等待态直至 `x` 被执行或拒绝
    2. 2.3.2.2 如果 `x` 处于执行状态，用相同的 `value` 执行 `promise`
    3. 2.3.2.3 如果 `x` 处于拒绝状态，用相同的 `reason` 拒绝 `promise`
  - 2.3.3 如果 `x` 为对象或者函数
    1. 2.3.3.1 把 `x.then` 赋值给 `then`
    2. 2.3.3.2 如果取 `x.then` 的值时抛出错误 `e` ，则以 `e` 为 `reason` 拒绝 `promise`
    3. 2.3.3.3 如果 `then` 是函数，将 `x` 作为函数的作用域 `this` 调用之。传递两个回调函数作为参数，第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
      - 2.3.3.3.1 如果 `resolvePromise` 以 `y` 为参数被调用，则运行 `[[Resolve]](promise, y)`
      - 2.3.3.3.2 如果 `rejectPromise` 以 `r` 为参数被调用，则以`reason` `r` 拒绝 `promise`
      - 2.3.3.3.3 如果 `resolvePromise` 和 `rejectPromise` 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      - 2.3.3.3.4 如果调用 `then` 方法抛出了异常 `e`
        1. 2.3.3.3.4.1 如果 `resolvePromise` 或 `rejectPromise` 已经被调用，则忽略之
        2. 2.3.3.3.4.2 否则以 `e` 为 `reason` 拒绝 `promise`
    4. 2.3.3.4 如果 `then` 不是函数，以 `x` 为参数执行 `promise`
  - 2.3.4 如果 `x` 不为对象或者函数，以 `x` 为参数执行 `promise`
        
        
        
      
      