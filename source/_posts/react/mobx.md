---
title: mobx
date: 2020-11-23 10:31:10
toc: true
tags:
- javaScript
- React
categories:
- javaScript

cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/mobx.png

---
近期mobx更新了6.0版本，该版本可以说是一次大更新，对比之前的mobx4/5改变很大
<!-- more -->
# mobx 6

## mobx核心概念
> 对于observer工作而言，可观察对象如何到达组件无关紧要，只需要读取它们即可。深入阅读可观察对象是todos[0].author.displayName开箱即用的精细，复杂表达。与必须显式声明或预先计算数据依赖项（例如选择器）的其他框架相比，这使订阅机制更加精确和高效。

> 状态的组织方式具有很大的灵活性，因为状态（从技术上来说）与我们阅读的可观察对象或可观察对象来自何处无关紧要

## mobx核心 API
+ Observable state
    - makeObservable
    - makeAutoObservable
    - observable
+ Actions
    - action
    - action.bound
    - runInAction
+ Computeds
+ Reactions

### observable 组件获取状态的3种方式

```jsx 1. props父组件传值的方式 >folded 
//可观察的对象可以作为props传递到组件中(如下例所示):

import { observer } from "mobx-react-lite"
import { makeAutoObservable } from "mobx"

class Timer {
    secondsPassed = 0

    constructor() {
        makeAutoObservable(this)
    }

    increaseTimer() {
        this.secondsPassed += 1
    }
}

const myTimer = new Timer() // Timer的定义请查看以上

const TimerView = observer(({ timer }) => {

    return <span>Seconds passed: {timer.secondsPassed}</span>
    
})

// 把 myTimer 作为 props 传入
ReactDOM.render(<TimerView timer={myTimer} />, document.body)

```

```jsx 2. 全局变量的方式 >folded 
import { observer } from "mobx-react-lite"

// 由于我们对可观察对象（observable）如何引入的方式并不重要，
// 因此我们可以直接从外部（包括导入等）的方式使用可观察对象
const myTimer = new Timer() // Timer 的定义请参考上述示例 

// 没有props，`myTimer` 直接从闭包中使用
const TimerView = observer(() => {

    return  <span>Seconds passed: {myTimer.secondsPassed}</span>
    
})

// 直接使用可观察对象非常方便，但是由于这通常会引入模块状态，
// 因此这种模式可能会使单元测试复杂化。所以 mobx 建议使用 React Context的方式
ReactDOM.render(<TimerView />, document.body)
```

```jsx 3. React context的方式 >folded 
// React Context是一种与整个子组件共享可观察对象的很好的机制
import { observer } from 'mobx-react-lite'
import { createContext, useContext } from "react"

const TimerContext = createContext<Timer>()

const TimerView = observer(() => {
    // 从 context 获取 timer
    const timer = useContext(TimerContext) // Timer 的定义请参考上述示例 

    return  <span>Seconds passed: {timer.secondsPassed}</span>
    
})

// 注意 Mobx 不建议将 Provider 的值替换为其他值。
// 在 MobX 中，不需要这样做，因为共享的可观察对象可以自己更新。
ReactDOM.render(
    <TimerContext.Provider value={new Timer()}
        <TimerView />
    </TimerContext.Provider>,
    document.body
)
```


### actions

#### 创建actions的几种常用方式

mobx中创建action主要是以下几种方式

```jsx 1. makeObservable >folded 
import { makeObservable, observable, action } from "mobx"

class Doubler {
    value = 0

    constructor(value) {
        makeObservable(this, {
            value: observable,
            increment: action
        })
    }

    increment() {
        // 中间状态对观察者将不可见。
        this.value++
        this.value++
    }
}
```

```jsx 2. makeAutoObservable >folded 
import { makeAutoObservable } from "mobx"

class Doubler {
    value = 0

    constructor(value) {
        makeAutoObservable(this)
    }

    increment() {
        this.value++
        this.value++
    }
}
```

```jsx 3. action.bound 的方式，绑定this >folded      
import { makeObservable, observable, computed, action } from "mobx"

class Doubler {
    value = 0

    constructor(value) {
        makeObservable(this, {
            value: observable,
            increment: action.bound
        })
    }

    increment() {
        this.value++
        this.value++
    }
}

const doubler = new Doubler()

// 这种方式的this是正确的
setInterval(doubler.increment, 1000)
```

```jsx 4. action >folded  
import { observable, action } from "mobx"

const state = observable({ value: 0 })

const increment = action(state => {
    state.value++
    state.value++
})

increment(state)
```

```jsx 5. runActions >folded 
import { observable } from "mobx"

const state = observable({ value: 0 })

// 会立即执行
runInAction(() => {
    state.value++
    state.value++
})
```

#### action.bound
action.bound可以自动绑定到正确的this，从而使this总是被正确地在函数内部约束。

建议优先使用箭头函数
如果您想结合使用绑定动作，makeAutoObservable通常使用箭头功能会更简单。
```jsx >folded 
import { makeAutoObservable } from "mobx"

class Doubler {
    value = 0

    constructor(value) {
        makeAutoObservable(this)
    }

    increment = () => {
        this.value++
        this.value++
    }
}
```


#### runInAction
使用此runInAction可以创建一个立即调用的临时操作。在异步过程中很有用。

#### 异步actions
处理异步actions的几种方式
在处理promise时，更新状态的处理方法应该使用action或be action进行包装，如下所示。

```jsx 1. 使用action作为包装 >folded 
// Promise解析处理函数是内联处理的，但是它在原始操作完成后运行，因此需要用以下代码包装action
import { action, makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending", "done" or "error"

    constructor() {
        makeAutoObservable(this)
    }

    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        fetchGithubProjectsSomehow().then(
            action("fetchSuccess", projects => { // 成功的回调
                const filteredProjects = somePreprocessing(projects)
                this.githubProjects = filteredProjects
                this.state = "done"
            }),
            action("fetchError", error => {      // 失败的回调
                this.state = "error"
            })
        )
    }
}
```

```jsx 2. >folded 
// 如果 promise 的处理函数是类里面的字段，它们将被 makeAutoObservable 自动包装在 action 中
import { makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending", "done" or "error"

    constructor() {
        makeAutoObservable(this)
    }

    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        fetchGithubProjectsSomehow().then(
            this.projectsFetchSuccess,      // 成功的回调
            this.projectsFetchFailure       // 失败的回调
        )
    )

    // 成功的回调
    projectsFetchSuccess = (projects) => {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filteredProjects
        this.state = "done"
    }

    // 失败的回调
    projectsFetchFailure = (error) => {
        this.state = "error"
    }
}
```

```jsx 3. async/await 的方式 >folded 
// await 之后的步骤不在同一个tick中，因此它们需要进行包装。在这里，我们可以利用 runInAction
import { runInAction, makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending", "done" or "error"

    constructor() {
        makeAutoObservable(this)
    }

    async fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        try {
            const projects = await fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            
            // 立即执行
            runInAction(() => {
                this.githubProjects = filteredProjects
                this.state = "done"
            })
        } catch (e) {
            // 立即执行
            runInAction(() => {
                this.state = "error"
            }
        }
    )
}
```

```jsx 4. flow + generator 的方式 >folded 
import { flow, makeAutoObservable, flowResult } from "mobx"

class Store {
    githubProjects = []
    state = "pending"

    constructor() {
        makeAutoObservable(this, {
            fetchProjects: flow
        })
    }

    // * 号创建一个 generator函数
    *fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        try {
            // 用 yield 来替换 await
            const projects = yield fetchGithubProjectsSomehow()

            // 以下不需要再使用 runInAction 包裹了
            const filteredProjects = somePreprocessing(projects)
            this.state = "done"
            this.githubProjects = filteredProjects
        } catch (error) {
            this.state = "error"
        }
    }
}

const store = new Store()
const projects = await flowResult(store.fetchProjects())
```

##### 使用 `flow` 来替代 `async/await`
flow 可以更好的和 Mobx 结合，flow 将确保 generator 在生成 promise 时是继续运行或抛出 
+ 因此，flow 是 async/await 的替代方法，不需要进一步 action 包装。
    - 使用 flow 包装异步处理
    - 代替 async 使用 function *
    - 代替 await 使用 yield

注意，flowResult 只有在使用 TypeScript 时才需要该函数。由于使用 flow 来包装方法，因此它将返回的生成器包装在 Promise 中。但是，TypeScript 不知道该如何转换，所以使用 flowResult 会让 TypeScript 知道这种类型的变化。

flow 和 action 一样，可以直接包装函数，所以上述的实例也换成以下写法
```jsx 
import { flow } from "mobx"

class Store {
    githubProjects = []
    state = "pending"

    fetchProjects = flow(function* (this: Store) {
        this.githubProjects = []
        this.state = "pending"
        try {
            // 用 yield 来替换 await
            const projects = yield fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            this.state = "done"
            this.githubProjects = filteredProjects
        } catch (error) {
            this.state = "error"
        }
    })
}

const store = new Store()
const projects = await store.fetchProjects()
```

### Computeds
```jsx >folded 
import { makeObservable, observable, computed,autorun } from "mobx"

class OrderLine {
    price = 0
    amount = 1

    constructor(price) {
        makeObservable(this, {
            price: observable,
            amount: observable,
            total: computed
        })
        this.price = price
    }

    get total() {
        console.log("Computing...")
        return this.price * this.amount
    }
}

const order = new OrderLine(0)

const stop = autorun(() => {
    console.log("Total: " + order.total)
})

```
>上面的示例很好地演示了computed值的好处，它充当缓存点。即使我们更改了amount，这也会触发total重新进行计算，但不会触发autorun，因为total它将检测到其输出未受到影响，因此无需更新autorun。

>相比之下，如果total不加注解 computed ，autorun效果将运行3次，因为它直接取决于total和amount。自己尝试一下。



### Reactions

### when
`when(predicate: () => boolean, effect?: () => void, options?)`

when观察并运行给定的谓词函数，直到返回为止true。一旦发生这种情况，将执行给定的效果功能并处置自动运行器。

```jsx 方式1 >folded 
import { when, makeAutoObservable } from "mobx"

class MyResource {
    constructor() {
        makeAutoObservable(this, { dispose: false })
        // 如果为true，则会执行一些操作
        when(
            // Once...
            () => !this.isVisible,
            // ... then.
            () => this.dispose()
        )
    }

    get isVisible() {
        // Indicate whether this item is visible.
    }

    dispose() {
        // Clean up some resources.
    }
    
    // 一旦isVisible成为false，该dispose方法就会被调用，然后对进行一些清理MyResource。
    
}
```

`when(predicate: () => boolean, options?): Promise`

该when函数返回一个处理程序，允许您手动取消它，除非您不传入第二个effect函数，在这种情况下，它将返回a Promise。

when过早取消，可以调用.cancel()自身返回的承诺。
```jsx 方式二 >folded 
async function() {
    await when(() => that.isVisible)
    // etc...
}
```

## 关闭自动任务

该函数传递给autorun，reaction并且when只垃圾回收使用的所有对象，他们观察到的垃圾回收自己。原则上，他们一直在等待使用的可观察物发生新的变化。为了能够阻止它们等待直到永远过去，它们都返回了一个Disposer函数，该函数可用于停止它们并取消订阅所使用的任何可观察对象。

```jsx  >folded 
const counter = observable({ count: 0 })

// 第一次打印0
const disposer = autorun(() => {
    console.log(counter.count)
})

// 打印 1
counter.count++

// 停止自动运行
disposer()

// 不会打印
counter.count++
```


