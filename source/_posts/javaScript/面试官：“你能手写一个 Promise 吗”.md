---
title: 面试官：“你能手写一个 Promise 吗”
date: 2021-10-26 14:50:38
tags:
- javaScript
categories:
- javaScript

cover: /cover-imgs/js-2.jpg

---
手写 `Promise` 实现

<!-- more -->


es6 新增了 [promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 用于表示一个异步操作的最终完成 (或失败)及其结果值。现在也是前端主要用来处理异步最常用的一种方案且现在无论是笔试，面试，小厂还是大厂都必考 `promise`，通过手写一遍 `promise`，可以更好的了解 `promise` 内部的运行机制。



以下我们实现了 `es6`之后的所有`promise`实例方法，静态方法，包括还在提案中的 `Promise.any`

## 前置知识
在手写之前，我们先需要了解一些前置知识

### 基本使用

```JavaScript
let myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});

myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    console.log("Yay! " + successMessage);
});
```



### 状态

`promise` 共有三个状态，且状态一经修改后就不能再次修改

- 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。

- 已兑现（fulfilled）: 意味着操作成功完成。

- 已拒绝（rejected）: 意味着操作失败。


### then方法

`then` 方法可以传入两个参数，这两个参数都是函数

第一个函数 `onfulfilled` 会在成功后(`resolve`)执行

第二个函数 `onrejected` 会在 失败后(`reject`)执行

且两个函数只会调用一个

`then` 返回的所有值都会被包装成 一个新的 `promise` 对象，意味着 `then` 可以链式调用



## 基本实现

### 实现思路

看完上述使用了，我们需要实现一个 `class`，并且实例化的时候可以传入一个函数，这个函数有两个参数 `resolve，reject`，该回调函数内的代码会被立即执行

调用 `resolve`，则会返回成功的状态 `fulfilled`

调用 `reject` 会返回失败的状态 `rejected`

`resolve，reject`都支持传入参数，传入的参数可以在 `then` 回调中获取到。

`resolve，reject`都会在这一次 [事件循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop#%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF) 的末尾执行

`then`方法会返回一个新的 `promise`

### status

我们用一个对象来表示 `promise` 的三个状态
```JavaScript
const promiseStatus = {
  pending: Symbol('pending'),
  fulfilled: Symbol('fulfilled'),
  rejected: Symbol('rejected'),
};
```



### Promise

以下是我们要实现 `Promise` 需要最基本的属性

实例属性

- status： 状态，默认为 `pending` 状态

- value：`resolve/reject`  返回的值，默认是 `undefind`

- onfulfilleds：所有成功的回调函数， `then`里面的第一个回调函数

- onrejecteds： 所有失败的回调函数， `then`里面的第二个回调函数和 `catch`的回调函数


实例方法

- _isPending()/_isFulfilled()/_isRejected()：返回当前 `promise` 的状态

- then()：将传入的回调函数添加到 对应的数组中


executor

这里需要注意 `executor` ，它就是我们 `new Promise((resolve, reject) => {})` 时传入的函数，在new 的时候会直接将该函数执行，并且将 `resolve`和`reject`传入进去，下面马上会看到 `resolve` 和 `reject` 的实现


```JavaScript
class MyPromise {
  status = promiseStatus.pending; // 初始状态
  value = undefined;
  onfulfilleds = [];
  onrejecteds = [];

  constructor(executor) {
    if (isFunction(executor)) executor(resolve.bind(this), reject.bind(this));
  }

  _isPending() {
    return this.status === promiseStatus.pending;
  }

  _isFulfilled() {
    return this.status === promiseStatus.fulfilled;
  }

  _isRejected() {
    return this.status === promiseStatus.rejected;
  }

  then(onfulfilled, onrejected) {
    if (isFunction(onfulfilled)) this.onfulfilleds.push(onfulfilled);

    if (isFunction(onrejected)) this.onrejecteds.push(onrejected);
  }

}
```



### resolve & reject

在 `new Promise` 会将 `resolve` 和 `reject` 作为实参注入到 `new Promise` 时的函数中


#### resolve

调用 `resolve` 的时候会先判断当前 是否为 `pending`，**因为状态只要被敲定，就不能被修改了** 

1. 当执行 `resolve` 的时候会将`status`修改为 `fulfilled`，

2. 将参数存储在 `value`上

3. 启动一个微任务，**会执行该 ** `promise`**的 成功/失败 回调 (在当前事件循环的末尾执行)** 


```JavaScript
function resolve(value) {
  if (this._isPending()) {
    this.status = promiseStatus.fulfilled;
    this.value = value;
    execCallback(this);
  }
}
```



#### reject

该实现和 `resolve` 类似，只是 第三行 会将当前状态修改为 `rejected`

```JavaScript
function reject(reason) {
  if (this._isPending()) {
    this.status = promiseStatus.rejected;
    this.value = reason;
    execCallback(this);
  }
}

```



看完 `resolve` 和 `reject` 的实现后，我们停下来思考一下它最主要做了什么，其实它最主要就是修改当前的状态，并记录需要返回值，**然后调用了 ** `execCallback`** ** ，`execCallback`内部会开启一个微任务执行我们在 `then`时传入的回调，我们马上会看到 `execCallback` 的实现


可以理解为在 `then`时传入的回调会在后续执行，可以简单的理解为`then`会将我们传入的回调函数(then(fn1, fn2)) 添加到对应的数组(onfulfilleds/onrejecteds) 中，然后这时候 `execCallback`会根据当前 `promise` 的状态(*fulfilled* /*rejected* ) 来遍历 `onfulfilleds/onrejecteds` 将里面的函数进行执行


理解上述流程很重要，这是`promise` 的核心之一，下面看一下 `execCallback`的实现


### execCallback

`execCallback` 的实现也很简单 该函数会启动一个微任务(queueMicrotask)，在当前事件循环的末尾执行。

该函数最主要是根据当前的状态 来决定执行 成功/失败 的回调


```JavaScript
function execCallback(promise) {
  queueMicrotask(() => {
    const { value, onfulfilleds, onrejecteds } = promise;

    const callbacks = promise._isFulfilled() ? onfulfilleds : onrejecteds;

    callbacks.forEach((fn) => fn(value));

  });
}
```



到这里我们已经实现了一个最基本功能的 `promise` 了，以下是完成代码。

```JavaScript
const promiseStatus = {
  pending: Symbol('pending'),
  fulfilled: Symbol('fulfilled'),
  rejected: Symbol('rejected'),
};

function isFunction(fn) {
  return typeof fn === 'function';
}

// 执行回调
function execCallback(promise) {
  queueMicrotask(() => {
    const { value, onfulfilleds, onrejecteds } = promise;

    const callbacks = promise._isFulfilled() ? onfulfilleds : onrejecteds;

    callbacks.forEach((fn) => {
      fn(value);
    });
  });
}

function resolve(value) {
  if (this._isPending()) {
    this.status = promiseStatus.fulfilled;
    this.value = value;
    execCallback(this);
  }
}

function reject(reason) {
  if (this._isPending()) {
    this.status = promiseStatus.rejected;
    this.value = reason;
    execCallback(this);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = promiseStatus.pending; // 初始状态
    this.value = undefined;
    this.onfulfilleds = [];
    this.onrejecteds = [];

    if (isFunction(executor)) executor(resolve.bind(this), reject.bind(this));
  }

  _isPending() {
    return this.status === promiseStatus.pending;
  }

  _isFulfilled() {
    return this.status === promiseStatus.fulfilled;
  }

  _isRejected() {
    return this.status === promiseStatus.rejected;
  }

  then(onfulfilled, onrejected) {
    if (isFunction(onfulfilled)) this.onfulfilleds.push(onfulfilled);

    if (isFunction(onrejected)) this.onrejecteds.push(onrejected);
  }
}
```



测试一下

```JavaScript
const p = new MyPromise((resolve, reject) => {
  resolve('123');
});

p.then(
  (res) => {
    console.log('res:', res);
  },
  (err) => {
    console.log('err:', err);
  }
);

```


输出

```Bash
res: 123
```



到这里就实现了一个最基本的 `promise`了，理解了上述后，我们就可以基于此再来不断的进行优化了。


## 实现链式调用

我们知道在 `promise.then()`，`promise.catch()` 和 `promise.finally()` 都会返回一个新的 `promise`对象，所以我们可以不断的链式调用

### 示例

```JavaScript
const p = new Promise((resolve) => {
  resolve('123');
});

p.then(
  (res) => {
    console.log('res1: ', res);
    return '456';
  }
).then((res) => {
  console.log('res2: ', res);
});

```



输出

```Bash
res2: 123
res3: 456
```



基于上述的实现后，思考一下通过什么方式才能实现链式调用呢


思路：首先可以想到的是，`then` 一定返回的也是一个 `promise`，那怎么让 `then` 返回一个 `promise` 呢


### 实现方式一

这个方式是 直接 返回一个新的 `promise` 对象，然后 `new` 新的 `promise`对象的时候先把这一次的回调添加进去(因为 这个函数是会立即执行的) 

```JavaScript
  then(onfulfilled, onrejected) {
  
    return new MyPromise((resolve, reject) => {
    
      if (isFunction(onfulfilled)) {
        this.onfulfilleds.push((value) => {
          const result = onfulfilled(value);
          resolve(result);
        });
      }

      if (isFunction(onrejected)) {
        this.onrejecteds.push((value) => {
          const result = onrejected(value);
          reject(result);
        });
      }
      
    });
    
  }
```



这里难以理解的可能就是添加回调的操作了，这里以添加 成功回调为例，来看一下以下代码


old

```JavaScript
this.onfulfilleds.push(onfulfilled);
```



new

```JavaScript
return new MyPromise((resolve, reject) => {

  this.onfulfilleds.push((value) => {
    const result = onfulfilled(value);
    resolve(result);
  });
  
});

```



这里可以看到，原来我们是直接将 回调添加到 `onfulfilleds`数组中，现在改写成了 创建一个新的函数，然后在新的函数中 执行成功的回调，执行完成后拿到结果，然后再把这个结果 `resolve` 出去

我们知道，只有调用了 `resolve/reject` 后才会开启一个微任务，然后里面会执行当前 `promise`的回调，那么对应到我们上述代码的话，就是在 当前这个`promise`的回调被执行完后，才会开启下一个 `promise`的微任务，也就是通过这样来实现链式调用的


例如以下代码

```JavaScript
p.then(
  (res) => {       // fn1  
    console.log('res1: ', res);
    return '456';
  }
).then((res) => {  // fn2
  console.log('res2: ', res);
});
```


解读以下上述代码

给 p 添加成功的回调函数，当这个函数(fn1) 执行的时候会返回一个 `'456'`，之前提到 `then` 方法会返回一个新的 `promise`，而 `'456'` 就会作为 这个新的 `promise` `resolve` 出去的值，也就意味着`fn2` 可以拿到上一个 `then` 的返回值 `'456'`。


这一步应该很好理解， `fn1` 执行的时候，会有一个返回值，再结合如下代码

```JavaScript
const result = onfulfilled(value);
resolve(result);
```


当拿到 `fn1` 的返回值后，会将这个返回值传入新的 `promise` 中的 `resolve`。而当调用完 `resolve`，会新开启一个微任务，在下一个微任务中就会执行 `fn2`


### 实现方式二

该实现和方式一的实现有些差异，该实现是在 当前的 `promise` 身上添加一个 `nextPromise`用来记录这个 `then` 函数返回的新 `promise`


```JavaScript
  then(onfulfilled, onrejected) {
    if (isFunction(onfulfilled)) this.onfulfilleds.push(onfulfilled);

    if (isFunction(onrejected)) this.onrejecteds.push(onrejected);

    this.nextPromise = new MyPromise();

    return this.nextPromise;
  }
```



除了 `then` 方法有改动外，`execCallback` 方法也需要进行一些改动才能实现链式调用，该方式的关键是在当前 `promise`对应的回调执行完成后，根据当前 `promise` 的状态执行下一个 `promise`的回调


```JavaScript
function execCallback(promise) {
  queueMicrotask(() => {
    const { value, onfulfilleds, onrejecteds, nextPromise } = promise;

    const callbacks = promise._isFulfilled() ? onfulfilleds : onrejecteds;

    function execNextPromise(result) {
      promise._isFulfilled() ? resolve.call(nextPromise, result) : reject.call(nextPromise, value);
    }

    callbacks.forEach((fn, index) => {
      // 执行回调
      const result = fn(value);

      // 链式调用 then,最后一次 .then 的时候需要调用
      // 成功状态则将这一次的返回值传入，失败状态则将初始的失败值传入
      if (index + 1 === callbacks.length) execNextPromise(result);
    });

  });
}
```


这个实现方式比较好理解，会在 上一个`promise` 的所有回调执行完毕后执行 下一个 `promise` 的回调，就这么简单


## catch 方法实现

在上述的基础上我们就可以进一步来完成其它实现了，以下的实现我们都给予链式调用方式二的基础实现的


`catch` 是 `es6`规范里`promise` 对象原型中的一个方法，用来捕捉错误 (reject())，那我们怎么做到通过 `catch` 来捕捉错误呢？

其实很简单，我们只需要在 `catch` 中调用一下 `then` 方法就可以了，并且给**成功的回调传入一个空函数** (这一步很关键)

```JavaScript
  catch(onrejected) {
    // onfulfilled 添加 空函数是为了在执行成功回调的时候能够执行到它，在执行它的时候拿到 nextPromise 才能够执行 finally回调
    // 以下这种情况 finally 其实是注册在 catch 的 nextPromise 回调中，试想一下，如果是 this.then(undefined, onrejected); 那么这个 .catch的中回调就不会被执行， 因为 当 成功回调的fn 已经是 callback 的长度的话就已经执行 nextPromise 了所以到了 .catch 就相当于已经中止了，那么 .catch 返回的新promise 中的 回调也就不会被执行了

    return this.then(() => {}, onrejected);
  }
```



解释一下为什么成功的回调需要传入空函数

我们先理解一下 `return this.then(() => {}, onrejected)`会发生什么，执行这行代码会调用 `then`，然后返回一个新的 `promise`，结合以下代码进行解读


`.catch` 是 一个 `then`返回的新的 `promise`身上的 `.catch`，再回想我们链式调用的方式二实现，我们会在所有的回调都执行完成后再执行 下一个 `promise`，但是下面我们的示例返回的是 失败的状态，且 `then`方法没有注册注册失败的回调，而是通过 `catch`来注册

这也就意味着当前我们的实现是无法调用到 `catch`的，因为我们 `then`中成功回调的函数不会被执行，既然不会被执行那也就意味着不会开启新的微任务去执行下一个`promise` 的回调

```JavaScript
const p = new MyPromise((resolve, reject) => { reject('456') });

 p
  .then(
    (res) => {
      console.log('成功：', res);
    }
  )
  .catch((err) => {
    console.log('错误：', err);
  })
```



那我们如果希望能够执行 `catch` 的回调的话，就需要做一些修改

我们在底部 新增了一行代码 `if (!callbacks.length && nextPromise) execNextPromise();` 当回调的数组为空时，我们会直接为下一个 `promise` 开启微任务执行其回调，因为我们刚刚已经在 `catch`中为下一个 `promise`添加了对应的回调，就会将其执行。


```JavaScript
function execCallback(promise) {
  queueMicrotask(() => {
    const { value, onfulfilleds, onrejecteds, nextPromise } = promise;

    const callbacks = promise._isFulfilled() ? onfulfilleds : onrejecteds;

    function execNextPromise(result) {
      promise._isFulfilled() ? resolve.call(nextPromise, result) : reject.call(nextPromise, value);
    }

    callbacks.forEach((fn, index) => {
      // 执行回调
      const result = fn(value);

      // 链式调用 then,最后一次 .then 的时候需要调用
      // 成功状态则将这一次的返回值传入，失败状态则将初始的失败值传入
      if (index + 1 === callbacks.length) execNextPromise(result);
    });

    // 执行 .catch()
    if (!callbacks.length && nextPromise) execNextPromise();
  });
}
```


阅读一下上述代码

1. 判断当前状态，因为上述代码返回的失败状态，所以我们会拿到失败的数组(onrejecteds)，但是我们在 `then`中只添加了成功的回调，没有失败的回调，所以会拿到一个空数组(callbacks)

2. 空数组不会进入到 `forEach`，直接跳过，执行后续逻辑

3. 判断当前是否为空数组，如果为空数组，则直接执行下个 `promise`

&ensp;&ensp;&ensp;&ensp;1. 根据当前的状态来决定给下一个 `promise`调用 成功或失败 的回调

&ensp;&ensp;&ensp;&ensp;2. 如果是成功的回调，则会将这一次 成功回调的返回值拿到作为下一个 `promise` 成功回调的参数注入

&ensp;&ensp;&ensp;&ensp;3. 如果是失败的回调，**则会将这一次失败的值作为下一个 ** `promise`**失败回调的参数注入** ，这样就实现了 `catch`能够捕捉到错误


## finally 方法实现

`finally` 无论成功和失败都会执行

通过调用 `then`，且将成功和失败的回调都注册为这个函数，这样当上一个 `promise` 执行结束后，无论他的状态成功或失败，都会执行这个函数


```JavaScript
  finally(onfinally) {
    if (isFunction(onfinally)) return this.then(onfinally, onfinally);
  }
```



## Promise.resolve

`resolve`静态方法，直接返回一个成功状态的 `promise`，理解了上述后，实现起来就非常简单了

```JavaScript
  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }
```



## Promise.reject

`reject` 静态方法，直接返回一个失败状态的 `promsie`，和上述实现类似

```JavaScript
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }
```



## Promise.all

[Promise.all](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 接受一个可迭代的`promise`对象，如果传入的不是 `promise`会自动包装成 `promise`且返回成功状态，一般我们会传入一个数组

> 在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组，它包含所有的传入迭代参数对象的值（也包括非 `promise` 值）


> 如果传入的 `promise` 中有一个失败（rejected），`Promise.all` 异步地将失败的那个结果给失败状态的回调函数，而不管其它 `promise` 是否完成。



了解了具体的用法了我们就知道了，只要有一个失败了，那么就直接返回失败，如果所有的都成功则会用一个数组来返回返回所有成功的值

- currentIndex：用来记录当前存储了几个值(**它的作用是为了保证返回结果按照请求的顺序返回** )

- fulfilleds：用来保存所有成功的值的数组

- fnLength：传入的`promise` 对象个数


1. 通过`insertVal`方法，往指定索引插入一条数据，插入完成后 `++索引`后判断一下是否达到了所有`promise`的长度，如果达到了则表示成功

2. 遍历 传入的可迭代`promise`对象(这里我们当做数组处理) 然后给这个`promise` 添加上成功的回调和失败的回调，成功的回调则会往`fulfilleds`里面添加一个值，失败的时候则直接返回一个失败的状态


```JavaScript
  static all(fns) {
    // 只要有一个失败，那么则认为是失败，只有全部成功则表示成功
    let currentIndex = 0;
    const fnLength = fns.length,
      fulfilleds = [];

    return new MyPromise((resolve, reject) => {
    
      function insertVal(index, value) {
        fulfilleds[index] = value;
        if (++currentIndex === fnLength) resolve(fulfilleds);
      }

      fns.forEach((fn, index) => fn.then((res) => insertVal(index, res)).catch(reject));
    });
  }
```



## Promise.race

[Promise.race](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 也接受一个可迭代`promise`对象，和上述类似

**race**  是赛跑、竞速的意思，当多个`promise`一起执行的时候将最快返回结果的 `promise`的状态作为最终的状态

> 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，则 `Promise.race` 将解析为迭代中找到的第一个值。



理解了上述的使用后`race` 的实现就非常简单了，便利传入的可迭代的 `promise`对象(这里当做数组处理)，然后给所有的 `promise`都添加上成功和失败的回调，这样的话，只要有一个 成功或者失败 就会作为最终的状态了

```JavaScript
  static race(fns) {
    // 只要有一个确定了状态，那么则将其作为最终状态
    return new MyPromise((resolve, reject) => {
      fns.forEach((fn) => fn.then(resolve, reject));
    });
  }
```



## Promise.allSettled

[Promise.allSettled](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 也接受一个可迭代`promise`对象，和上述类似

`allSettled` 会将所有的 `promise`返回的状态及值都记录下来，用一个数组保存

> 对于每个结果对象，都有一个 `status` 字符串。如果它的值为 `fulfilled`，则结果对象上存在一个 `value` 。如果值为 `rejected`，则存在一个 `reason` 。 value（或 reason ）反映了每个 promise 决议（或拒绝）的值。



`allSettled` 的实现其实和 `Promise.all` 很相似

- result：用来保存所有状态和值的数组

- fnLength：传入的`promise` 对象个数


1. 通过`insertVal`方法，往指定索引插入一条数据，插入完成后 `++索引`后判断一下是否达到了所有`promise`的长度，如果达到了则表示成功

2. 遍历 传入的可迭代`promise`对象(这里我们当做数组处理) 然后给这个`promise` 添加上成功的回调和失败的回调，无论成功还是失败都会往`result`添加对象


```JavaScript
  static allSettled(fns) {
    // 将以 { value: xxx, status: fulfilled/rejected } 的格式组合成一个数组并通过 resolve 返回
    let currentIndex = 0;
    const fnLength = fns.length,
      result = [];

    return new MyPromise((resolve) => {
    
      function insertVal(index, value) {
        result[index] = value;
        if (++currentIndex === fnLength) resolve(result);
      }

      fns.forEach((fn, index) => {
        fn.then(
          (res) => insertVal(index, { status: 'fulfilled', value: res }),
          (err) => insertVal(index, { status: 'rejected', reason: err })
        );
      });
      
    });
  }
```



## Promise.any

[Promise.any](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)也接受一个可迭代的`promise` 对象，和上述类似，只有其中一个 `promise`的状态为成功了，那么就返回成功，除非全部失败了，则返回失败，这个方法 和 `Promise.all` 相反


- rejecteds：用来保存所有失败的值的数组

- fnLength：传入的`promise` 对象个数


1. 通过`insertVal`方法，往指定索引插入一条数据，插入完成后 `++索引`后判断一下是否达到了所有`promise`的长度，且返回一个[AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) 对象的错误

2. 遍历 传入的可迭代`promise`对象(这里我们当做数组处理) 然后给这个`promise` 添加上成功的回调和失败的回调，成功的回调则直接返回一个失败的状态，失败的时候则会往`rejecteds`里面添加一个值


```JavaScript
  static any(fns) {
    // 只要有一个成功，那么则认为是成功，只有全部失败则表示失败
    const fnLength = fns.length,
      rejecteds = [];
    let currentIndex = 0;

    return new MyPromise((resolve, reject) => {
      function insertVal(index, value) {
        rejecteds[index] = value;
        if (++currentIndex === fnLength) reject(new AggregateError(rejecteds, 'All promises were rejected'));
      }

      fns.forEach((fn, index) => fn.then(resolve).catch((err) => insertVal(index, err)));
    });
  }
```



## 完成代码

``` JavaScript
const promiseStatus = {
  pending: Symbol('pending'),
  fulfilled: Symbol('fulfilled'),
  rejected: Symbol('rejected'),
};

function isFunction(fn) {
  return typeof fn === 'function';
}

// 执行回调
function execCallback(promise) {
  queueMicrotask(() => {
    const { value, onfulfilleds, onrejecteds, nextPromise } = promise;

    const callbacks = promise._isFulfilled() ? onfulfilleds : onrejecteds;

    function execNextPromise(result) {
      promise._isFulfilled() ? resolve.call(nextPromise, result) : reject.call(nextPromise, value);
    }

    callbacks.forEach((fn, index) => {
      // 执行回调
      const result = fn(value);

      // 链式调用 then,最后一次 .then 的时候需要调用
      // 成功状态则将这一次的返回值传入，失败状态则将初始的失败值传入
      if (index + 1 === callbacks.length) execNextPromise(result);
    });

    // 执行 .catch()
    if (!callbacks.length && nextPromise) execNextPromise();
  });
}

function resolve(value) {
  if (this._isPending()) {
    this.status = promiseStatus.fulfilled;
    this.value = value;
    execCallback(this);
  }
}

function reject(reason) {
  if (this._isPending()) {
    this.status = promiseStatus.rejected;
    this.value = reason;
    execCallback(this);
  }
}

class MyPromise {
  status = promiseStatus.pending; // 初始状态
  value = undefined;
  onfulfilleds = [];
  onrejecteds = [];

  nextPromise = null; // 用于链式调用的 下一个 promise

  constructor(executor) {
    if (isFunction(executor)) executor(resolve.bind(this), reject.bind(this));
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(fns) {
    // 只要有一个失败，那么则认为是失败，只有全部成功则表示成功
    let currentIndex = 0;
    const fnLength = fns.length,
      fulfilleds = [];

    return new MyPromise((resolve, reject) => {
      function insertVal(index, value) {
        fulfilleds[index] = value;
        if (++currentIndex === fnLength) resolve(fulfilleds);
      }

      fns.forEach((fn, index) => fn.then((res) => insertVal(index, res)).catch(reject));
    });
  }

  static race(fns) {
    // 只要有一个确定了状态，那么则将其作为最终状态
    return new MyPromise((resolve, reject) => {
      fns.forEach((fn) => fn.then(resolve, reject));
    });
  }

  static allSettled(fns) {
    // 将以 { value: xxx, status: fulfilled/rejected } 的格式组合成一个数组并通过 resolve 返回
    let currentIndex = 0;
    const fnLength = fns.length,
      result = [];

    return new MyPromise((resolve) => {
      function insertVal(index, value) {
        result[index] = value;
        if (++currentIndex === fnLength) resolve(result);
      }

      fns.forEach((fn, index) => {
        fn.then(
          (res) => insertVal(index, { status: 'fulfilled', value: res }),
          (err) => insertVal(index, { status: 'rejected', reason: err })
        );
      });
    });
  }

  static any(fns) {
    // 只要有一个成功，那么则认为是成功，只有全部失败则表示失败
    const fnLength = fns.length,
      rejecteds = [];
    let currentIndex = 0;

    return new MyPromise((resolve, reject) => {
      function insertVal(index, value) {
        rejecteds[index] = value;
        if (++currentIndex === fnLength) reject(new AggregateError(rejecteds, 'All promises were rejected'));
      }

      fns.forEach((fn, index) => fn.then(resolve).catch((err) => insertVal(index, err)));
    });
  }

  _isPending() {
    return this.status === promiseStatus.pending;
  }

  _isFulfilled() {
    return this.status === promiseStatus.fulfilled;
  }

  _isRejected() {
    return this.status === promiseStatus.rejected;
  }

  then(onfulfilled, onrejected) {
    if (isFunction(onfulfilled)) this.onfulfilleds.push(onfulfilled);

    if (isFunction(onrejected)) this.onrejecteds.push(onrejected);

    this.nextPromise = new MyPromise();

    return this.nextPromise;
  }

  catch(onrejected) {
    return this.then(() => {}, onrejected);
  }

  finally(onfinally) {
    if (isFunction(onfinally)) return this.then(onfinally, onfinally);
  }
}
```


## 测试

### 基本使用

```JavaScript
const p = new MyPromise((resolve, reject) => {
  resolve('123');
});


p.then(
  (res) => {
    console.log('res', res);
  }
);
```


输出

```JavaScript
res 123
```



#### catch & finally

```JavaScript
  const p = new MyPromise((resolve, reject) => {
    reject('789');
  });
  

  p.then(
    (res) => {
      console.log('res: ', res);
    }
  )
  .catch((err) => {
    console.log('err: ', err);
  })
  .finally(() => {
    console.log('成功失败都执行');
  })
```


输出

```JavaScript
err: 789
成功失败都执行
```



### 链式调用

```JavaScript
const p = new MyPromise((resolve, reject) => {
  resolve('123');
});

p.then(
  (res) => {
    console.log('res1：', res);
    return '456';
  }
).then((res) => {
  console.log('res2：', res);
});
```


输出

```JavaScript
res1: 123
res2: 123

```



### Promise.resolve & Promise.reject

```JavaScript
  const test1 = Promise.resolve('123');
  
  test1.then((res) => {
    console.log('res: ', res);
  });
  
  const test2 = Promise.reject('456');
  
  test2.then((err) => {
    console.log('err: ', err);
  });

```


输出

```JavaScript
res: 123
err: 456
```



### Promise.all

```JavaScript
  const test1 = MyPromise.resolve('123');
  const test2 = MyPromise.resolve('456');
  const test3 = MyPromise.reject('789');

  const p = MyPromise.all([test1, test2, test3]);

  p.then(
    (res) => {
      console.log('res:', res);
    },
    (err) => {
      console.log('err:', err);
    }
  );
```


输出

```JavaScript
err: 789

```



### Promise.race

```JavaScript
  const test1 = new MyPromise((resolve) => setTimeout(resolve, 1000, '123'));
  const test2 = new MyPromise((resolve) => setTimeout(resolve, 1500, '456'));
  const test3 = new MyPromise((resolve) => setTimeout(resolve, 280, '789'));

  const p = MyPromise.race([test1, test2, test3]);

  p.then(
    (res) => {
      console.log('res:', res);
    },
    (err) => {
      console.log('err:', err);
    }
  );
```


输出

```JavaScript
err: 789

```



### Promise.allSettled

将所有结果(无论成功失败)通过数组进行返回

```JavaScript
  const test1 = MyPromise.resolve('123');
  const test2 = MyPromise.resolve('456');
  const test3 = MyPromise.reject('789');

  const p = MyPromise.allSettled([test1, test2, test3]);

  p.then(
    (res) => {
      console.log('res:', res);
    }
  );
```


输出

```JavaScript
res: [
  { status: 'fulfilled', value: '123' },
  { status: 'fulfilled', value: '456' },
  { status: 'rejected', reason: '789' }
]

```



### Promise.any

除非所有的都失败才会返回失败，只要有一个成功则返回成功

```JavaScript
  const test1 = new MyPromise((_, reject) => setTimeout(reject, 1000, '123'));
  const test2 = new MyPromise((_, reject) => setTimeout(reject, 1500, '456'));
  const test3 = new MyPromise((resolve, reject) => setTimeout(resolve, 280, '789'));

  const p = MyPromise.any([test1, test2, test3]);

  p.then(
    (res) => {
      console.log('res:', res);
    },
    (err) => {
      console.log('err:', err);
      console.log('errors:', err.errors);
    }
  );
```


输出

```JavaScript
res: 789

```




```JavaScript
  const test1 = new MyPromise((_, reject) => setTimeout(reject, 1000, '123'));
  const test2 = new MyPromise((_, reject) => setTimeout(reject, 1500, '456'));
  const test3 = new MyPromise((_, reject) => setTimeout(reject, 280, '789'));

  const p = MyPromise.any([test1, test2, test3]);

  p.then(
    (res) => {
      console.log('res:', res);
    },
    (err) => {
      console.log('err:', err);
      console.log('errors:', err.errors);
    }
  );
```


输出

```JavaScript
err: AggregateError: All promises were rejected 
errors: ['123', '456', '789']

```



## 总结

通篇手写下来会发现其实并没有那么复杂，其中还有一些边界条件没有做特别细的处理，例如 `resolve`如果传入了一个 `thenable`对象,那么需要继续调用等，但是主体功能都已经基本实现了，只需要在上述基础上架进行修改就ok


