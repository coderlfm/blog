---
title: Redux 工具
date: 2020-10-25 19:07:51
toc: true
tags:
- javaScript
- React
categories:
- javaScript

cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/redux-toolkit.png
---


#  `@redux/toolkit`
目前有很多状态管理工具 `react-redux`， `mbox`等，但 `@redux/toolkit` 更加简化了 `react-redux` 的操作，让你的代码看起来更简洁
<!-- more -->
## 安装
``` bash bash

# 使用 npm
npm install @redux/toolkit

# 使用 yarn
yarn add @redux/toolkit

```
## 基本使用

### 创建 Slice

- createSlice中集成了 创建reducer，创建action，集成 `immer`
- reducer 和 actions在 createSlice 的返回值中可以获取到
- configureStore 集成了 `redux-thunk`、 `Redux DevTools Extension` 并默认开启
- 在触发action时，`Redux DevTools Extension` 中会显示  `count/increment`，自动加上name前缀，

- reducer中的，action中有两个属性，`type` 和 `payload`， `payload`为传入的值

``` js  store/index.js


import { combineReducers, createSlice, configureStore } from '@reduxjs/toolkit'

const countReducer = createSlice({
    name: 'count',
    initialState: 0,
    reducers:{
        'increment': (state, action) => {
            state++;
        },
        'decrement': (state, action) => {
            state--;
        }
    },
})

const reducer = combineReducers({
    count: countReducer.reducer
})

export const { increment , decrement } = countReducer.actions
export default configureStore({ reducer });

```

### App.js
``` jsx App.js 
import React from 'react';
import { Provider } from 'react-redux'

import store from './store'
import Count from './count'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Count />
      </div>
    </Provider>
  );
}

export default App;

```

### 组件内使用  

``` jsx count.jsx 
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { increment, decrement } from '@/store'

export default memo(function Count() {

    const dispatch = useDispatch()
    const count = useSelector(state => state.count)

    return (
        <div>
            <h3>count：{count}</h3>
            <button onClick={ ()=>dispatch(increment()) }> + </button><br />
            <button onClick={ ()=>dispatch(decrement()) }> - </button>
        </div>
    )
})


```

## 进阶使用

### 1. 创建组件的store

在组件同级文件夹中新建 `store` 文件夹并新建三个文件 `constant.js` `reducer.js` `index.js`，如下图所示
{% asset_img store.png  %}

``` js users/store/constatn.js
export default {
    'CHANGE_INFO': 'change_info',
    'REMOVE_INFO': 'remove_info',
}   
```

``` js users/store/reducer.js
import actionType from './constant'

const initialState = {};

const reducers = {
    [actionType.CHANGE_INFO]: (state, action) => {
        state.info = action.payload;
    },
    [actionType.REMOVE_INFO]: (state, action) => {
        state.info = null;
    }
};

export {
    initialState,
    reducers,
}
```

``` js users/store/index.js
import { createSlice } from '@reduxjs/toolkit'
import { initialState, reducers } from './reducers'

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers,
})

export const actions = userSlice.actions;
export default userSlice.reducer

```

### 2. 创建全局store

在src下创建 `store` 文件夹，并新建两个文件 `reducers.js` `index.js`，如下图所示
{% asset_img store1.png %}

``` js reducers.js
import { combineReducers } from '@reduxjs/toolkit'
import usersReducer from '../page/users/store'

const reducer = combineReducers({
    users: usersReducer
})

export default reducer;

```

``` js index.js 
import { configureStore } from '@reduxjs/toolkit'
import reducer from './reducers'

export default configureStore({ reducer })
```

``` js App.js 
import React from 'react';
import { Provider } from 'react-redux'
import { Router } from '@reach/router'

import store from './store/index'
import Users from './page/users'

function App() {
  return (
    <Provider store={store}>
        <Router>
          <Users path='/'/>
          <Profile path='/profile'/>
        </Router>
    </Provider>
  );
}

export default App;

```

### 3. 组件中使用
``` jsx users/index.jsx
import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions } from './store'

export default memo(function Users() {

    const usersInfo = useSelector(state => state.users)
    const dispatch = useDispatch()

    const changeInfo = () => {
        dispatch(actions.change_info('user_id:1001'))
    }

    const removeInfo = () => {
        dispatch(actions.remove_info())
    }

    return (
        <div>
            <h3>usersInfo.info：{usersInfo.info}</h3>
            <button onClick={changeInfo}>设置用户info</button><br />
            <button onClick={removeInfo}>删除用户info</button>
        </div>
    )
})

```


#### 3.1 页面中查看
- `configureStore` 中默认开启了 `Redux DevTools Extension` 

打开页面即可看到以下内容
{% asset_img page.png %}

打开控制台，在redux工具可以看到我们定义在usersstore中的初始化数据
{% asset_img redux_init.png %}


点击 设置用户info 按钮即会触发一次action
可以看到触发 actions 时会自动带上我们在 创建 slice 时的 name ，方便我们定位是那个组件中触发的action改变了store中的状态
{% asset_img redux_change.png %}


