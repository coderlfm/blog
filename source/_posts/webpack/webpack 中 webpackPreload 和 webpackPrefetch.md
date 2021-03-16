---
title: webpack 中 webpackPreload 和 webpackPrefetch
date: 2021-03-16 21:34:54
toc: true
tags:
 - Webpack

categories:
 - Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 中 `webpackPreload` 和 `webpackPrefetch` 可以让我们对一些模块进行预加载及预获取

<!-- more -->

## `webpackChunkName` 
在介绍 `webpackPreload` 和 `webpackPrefetch` 之前，我们先介绍一下 `webpackChunkName`

`webpackChunkName` 可以定义我们 chunk 的名字

```js src
export function sum(num1, num2){
    return num1 + num2;
}
```

``` js src/index.js
import(
  /* webpackChunkName:'bar' */
  "./bar"
  ).then(({sum: sum }) => {
    console.log('webpackPreload: ',sum(1,2));
  });
```
执行打包命令 

``` shell
yarn build
```

可以看到以下文件，我们刚刚引入的 bar.js 在打包后的加上了前缀
<center>
{% asset_img build-1.png %}
</center>
<br/>

## `webpackPreload` 预加载
预加载 会在当前模块加载时立即以并行的方式加载该模块

```js src/index.jx
import(
  /* webpackChunkName:'bar' */
  /* webpackPreload: true */
  "./bar"
  ).then(({sum: sum }) => {
    console.log('webpackPreload: ',sum(1,2));
  });
```
可以看到我们的 bar 文件可以被正常加载并执行
<center>
{% asset_img console.png %}<br/>
</center>
<center>
{% asset_img webpackPreload.png %}
</center>

## `webpackPrefeatch` 预获取

`webpackPrefeatch` 和 `webpackPrelaod` 不太一样， `webpackPrefeatch` 会在浏览器空闲的时候进行下载

``` src/index.js
const button = document.createElement('button');
button.innerText = '加载bar';

button.addEventListener('click',() => {

  import(
    /* webpackChunkName: 'bar' */
    /* webpackPrefetch: true */
    "./bar"
  ).then(({sum: sum }) => {
    console.log('webpackPrefetch: ',sum(1,2));
  });
})

document.body.appendChild(button);
```
执行打包命令 

``` shell
yarn build
```

可以看到以下文件，我们刚刚引入的 bar.js 在打包后的加上了前缀
<center>
{% asset_img build-2.png %}
</center>

打开我们的项目 可以看到 bar 文件已经被预先加载了 
<center>
{% asset_img webpackPrefeatch-1.png %}
</center>

我们点击 `加载 bar ` 按钮，可以看到以下 这次加载的 bar 文件 在 size 一栏 显示 `(prefeatch cache)`

<center>
{% asset_img webpackPrefeatch-2.png %}
</center>

这就是 webpack 中的 预加载和预获取，两个比较简单的东西