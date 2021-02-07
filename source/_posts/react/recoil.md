---
title: recoil
toc: true
tags:
- javaScript
- React
categories:
- javaScript

cover: /cover-imgs/recoil.png

---
Recoil 是 FaceBook 的一个 React 的一个状态管理库
<!-- more -->

## RecoilRoot
使用时需在最外层使用 `RecoilRoot` 包裹一层，`RecoilRoot` 是可以嵌套的，里层的 `RecoilRoot` 会覆盖外层的 `RecoilRoot` 

```jsx RecoilRoot
import { RecoilRoot } from 'recoil'

function App() {

    return (
        <RecoilRoot>
            <ChildrenComponent />
        <RecoilRoot />
    )

}

```

## atom
创建一个 atom
注意：atom不能是一个 Promise [详见](https://recoiljs.org/docs/api-reference/core/atom)
```jsx
const countState = atom({
    key: 'count',
    default: 1
})
```

有了 `atom` 后，有以下几个常用的 hooks 来和 `atom` 来进行交互
+ [`useRecoilState()`](/docs/api-reference/core/useRecoilState): 打算同时读取和写入 `atom` 时，请使用此 hook 。这个 hook 将组件订阅到 `atom` 上。
+ [`useRecoilValue()`](/docs/api-reference/core/useRecoilValue): 仅打算读取 `atom` 时，请使用此 hook 。这个 hook 将组件订阅到 `atom` 上。
+ [`useSetRecoilState()`](/docs/api-reference/core/useSetRecoilState): 仅打算写入 `atom` 时，请使用此 hook 。
+ [`useResetRecoilState()`](/docs/api-reference/core/useResetRecoilState): 使用此 hook 将 `atom` 重置为其默认值。


## select
可以将一些 atom 做一些处理后返回，可用于做过滤等操作，其中也可以做一些异步的操作后返回

### 基本案例

```jsx
import React, { memo } from 'react'
import { selector, atom, useRecoilState } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})


const tempCountState = selector({
    key: 'tempCount',
    get: ({ get }) => {             //参数中可解构出一个get方法，该方法可以用来获取其它atom的值
        return (get(countState) * 100)
    }
})

export default memo(function () {

    const [tempCount, setTempCount] = useRecoilState(tempCountState);

    return (
        <div>
            tempCount：{tempCount}
        </div>
    )
})

```

### 可写案例
```jsx
import React, { memo, Suspense } from 'react'
import { selector, atom, useRecoilState } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

const tempCountState = selector({
    key: 'tempCount',
    get: ({ get }) => {             //参数中可解构出一个get方法，该方法可以用来获取其它atom的值
        return get(countState) * 100
    },
    set: ({ set, get, reset }, payload) => { //第一个参数中可解构出 set, get, reset 方法，第二个参数为需要修改后的值
        set(countState, payload)
    }
})


export default memo(function () {

    const [tempCount, setTempCount] = useRecoilState(tempCountState);

    return (
        <div>
            tempCount:{tempCount}
            <br />
            <button onClick={() => setTempCount(0)}>清空</button>
        </div>
    )
})

```

### 异步案例
```jsx
import React, { memo, Suspense } from 'react'
import { selector, atom, useRecoilState } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

const getCountAsync = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(200)
        }, 10);
    })
}

const AsyncTempCountState = selector({
    key: 'tempCount',
    get: async ({ }) => {             //参数中可解构出一个get方法，该方法可以用来获取其它atom的值
        return await getCountAsync()
    }
})

const CountResult = () => {
    const [tempCount, setTempCount] = useRecoilState(AsyncTempCountState);

    return (
        <div>
            tempCount:{tempCount}
        </div>
    )
}


export default memo(function () {

    return (
        <div>
            <Suspense fallback={'loading...'}>
                <CountResult />
            </Suspense>
        </div>
    )
})

```

## useRecoilState
`useRecoilState` 可以帮助我们获取和设置 atom

```jsx
import React, { memo } from 'react'
import { atom, useRecoilState } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

export default memo(function () {

    const [count, setCount] = useRecoilState(countState)

    return (
        <div>
            count：{count}
            <br />
            <button onClick={() => setCount(count - 1)} >-</button> <button onClick={() => setCount(count + 1)} >+</button>
        </div>
    )
})
```


## useRecoilValue
`useRecoilValue` hooks可以不修改 值 只读取值
```jsx
import React, { memo } from 'react'
import { atom, useRecoilValue } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

export default memo(function () {

    const count = useRecoilValue(countState)

    return (
        <div>
            count：{count}
        </div>
    )
})

```


### 只设置，不读取
不会订阅状态
```jsx
useSetRecoilState()
```


## useSetRecoilState
当你只打算 写入 值而不打算读取值的时候可以使用此hook `useSetRecoilState` 
```jsx
import React, { memo } from 'react'
import { atom, useSetRecoilState } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

export default memo(function () {

    const setCount = useSetRecoilState(countState)

    return (
        <div>
            <button onClick={() => setCount(0)} >清空</button>
        </div>
    )
})

```

## useResetRecoilState
当你打算重置某个 `atom` 的状态时可以使用此hook
```jsx
import React, { memo } from 'react'
import { atom, useRecoilState, useResetRecoilState } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

export default memo(function () {

    const [count, setCount] = useRecoilState(countState)
    const resetCount = useResetRecoilState(countState)

    return (
        <div>
            count：{count}
            <br />
            <button onClick={() => setCount(count - 1)} >-</button> <button onClick={() => setCount(count + 1)} >+</button>
            <br />
            <button onClick={() => resetCount()}>重置</button>
        </div>
    )
})

```

## isRecoilValue

```jsx
import { atom, isRecoilValue } from 'recoil'

const countState = atom({
    key: 'count',
    default: 1
})

console.log(isRecoilValue(countState));     // true
console.log(isRecoilValue({}));             // false

```

