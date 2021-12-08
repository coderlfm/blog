---
title: react state更新
toc: true
date: 2021-12-08 15:31:10
tags:
- javaScript
- React

categories:
- javaScript

cover: /cover-imgs/react-5.jpg

---
react state更新
<!-- more -->



## 优化更新

1. `shouldComponentUpdate` 和 `pureComponent` 可以对`state`和`props` 进行浅层比较，避免更新

2. 函数式组件可以通过 `memo` 来优化更新


## 批量更新

在一个事件处理函数中调用多次 `setState`会别合并为一个更新，称为批量更新


源码 `react-dom\src\events\ReactDOMUpdateBatching.js`

```C++
export function batchedEventUpdates(fn, a, b) {
  if (isBatchingEventUpdates) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state.
    return fn(a, b);
  }
  
  // 开启批量更新
  isBatchingEventUpdates = true;
  try {
    // 执行事件处理函数的代码
    return batchedEventUpdatesImpl(fn, a, b);
  } finally {
    isBatchingEventUpdates = false;
    finishEventHandler();
  }
}
```



看完上述代码就会发现，会先开启批量更新，再执行事件处理函数中的代码，也就可以解释，为什么我们在 `setTimeout`中调用 `setState`是同步更新的了，因为在 定时器中，每次执行 `setState`的时候，批量更新都是关闭的。

```C++
setTimeout(()=>{
    this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback1', this.state.number)  })
    console.log(this.state.number)
    this.setState({ number:this.state.number + 1 },()=>{    console.log( 'callback2', this.state.number)  })
    console.log(this.state.number)
    this.setState({ number:this.state.number + 1 },()=>{   console.log( 'callback3', this.state.number)  })
    console.log(this.state.number)
})
```


![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48e730fc687c4ce087e5c0eab2832273~tplv-k3u1fbpfcp-watermark.awebp)



## 手动开启批量更新

如果希望在定时器中继续开启批量更新，可以通过 `react-dom`包中导出的 `unstable_batchedUpdates`来手动开启批量更新

```js
import ReactDOM from 'react-dom'
const { unstable_batchedUpdates } = ReactDOM


setTimeout(()=>{
    unstable_batchedUpdates(()=>{
        this.setState({ number:this.state.number + 1 })
        console.log(this.state.number)
        this.setState({ number:this.state.number + 1})
        console.log(this.state.number)
        this.setState({ number:this.state.number + 1 })
        console.log(this.state.number) 
    })
})

```




## 提高更新优先级

如果希望提高更新优先级，可以使用 `react-dom`包中导出的 `flushSync`来提高更新的优先级

```js
handerClick=()=>{
    setTimeout(()=>{
        this.setState({ number: 1  })
    })
    this.setState({ number: 2  })
    ReactDOM.flushSync(()=>{
        this.setState({ number: 3  })
    })
    this.setState({ number: 4  })
}
render(){
   console.log(this.state.number)
   return ...
}
```


输出

```js
3
4
1
```


**flushSync补充说明** ：flushSync 在同步条件下，会合并之前的 setState | useState，可以理解成，如果发现了 flushSync ，就会先执行更新，如果之前有未更新的 setState ｜ useState ，就会一起合并了，所以就解释了如上，2 和 3 被批量更新到 3 ，所以 3 先被打印。


