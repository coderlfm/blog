---
title: babel 7 的使用
date: 2021-02-02 11:05:47
toc: true
tags:
- Webpack

categories:
- Webpack

cover: /cover-imgs/babel1.png
---

`babel` 是一个 `JavaScript` 编译器，可以将 `es2015+` 的代码转换成向后兼容的 `javaScript` 代码，使我们在低版本浏览器中能够正常运行

<!-- more -->
`babel` 自身也是一个独立的工具 和 `post-css` 一样 ，它是可以单独使用的
<br/>


## `babel` 的基本使用
1. 安装 `babel` 所需的包
``` shell shell
npm i @babel/core @babel/cli -D
```

2. 使用 `bebel` 编译源代码，该命令会将 `src` 下的所有代码编译到 `lib` 目录下，输出目录可以使用 `--out-dir` 或 `-d` 来指定
``` shell shell
npx babel src --out-dir lib
```

 2.1. 将 `src` 目录下的文件合并为一个文件，输出文件可以使用 `--out-file` 或 `-o` 来指定
``` shell shell
npx babel src --out-file bundle.js 
```

 <article class="message is-warning"> 
  <div class="message-body">
   注意：在执行 npx babel 前请求务必确认已经安装 @babel/core 和 babel/cli，否则会安装 babel 6.x 的版本，更多 cli 的命令请查看<a href="https://www.babeljs.cn/docs/babel-cli#%E7%94%A8%E6%B3%95"> 详情 </a>
  </div>
</article>



运行后会发现我们代码中的箭头函数、 let、 const 等代码还是没有转换成 es5 中的代码，此时我们就需要使用 babel 的一些插件来帮助我们完成一些转换
<br/>

### `babel` 中 箭头函数 的转换
1. 安装对应的插件
当我们需要将我们写的箭头函数转换成 普通函数时， 我们需要使用 babel 中所对应的插件来完成 转换  
``` shell shell
npm install --save--dev @babel/plugin-transform-arrow-functions
```
<br/>

2. 运行以下命令来帮助我们转换
该命令会将我们src下的文件编译到 `lib` 目录下， 且将我们的箭头函数编译为普通函数
``` shell shell
npx babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions 
```

以上就是babel 中在命令行中插件的使用，当我们需要使用其它插件的时候方式也是类似，比如配置项目支持装饰器等
<br/>

## `babel` 命令行中 `preset` (预设) 的使用
当我们想要在我们的代码中应用多个插件时，一个一个来添加的话就会显得太繁琐了

我们可以使用一个 `preset` (一组设定好的插件)，以下是 `babel` 给我们写的一些 `preset` ，我们也可以根据自己的项目自定义一些 `preset`

官方已经针对常用环境写了一些 `preset`，
针对我们的例子，使用的是 `@babel/preset-env`
 + @babel/preset-env
 + @babel/preset-flow
 + @babel/preset-react
 + @babel/preset-typescript
<br/>

1. 安装 `preset` 
``` shell shell
npm install --save--dev @babel/preset-env
```

2. 运行以下命令会帮助我们转换
``` shell shell
npx babel src --out-dir lib --presets=@babel/env
```

 <article class="message is-warning"> 
  <div class="message-body">
   注意：当我们未对 <code>preset-env</code> 进行任何配置的话，<code>preset-env</code> 会帮我们转换所有 ES2015-2020的代码，如果我们需要传递一些参数，那就不能再通过终端来传递了
  </div>
</article>
<br/>

## 通过配置文件来配置 babel
在项目根目录创建 `babel.config.js`

```js babel.config.js
module.exports = {
    presets: [
        "@babel/preset-env",
    ]
}
```
<article class="message is-warning"> 
  <div class="message-body">
   注意：当我们未对 @babel/preset-env 进行任何配置的时候，他会读取我们项目根目录下的 borwserlsit 的配置文件，根据里面的配置来确定我们需要适配的浏览器
  </div>
</article>

<article class="message is-warning"> 
  <div class="message-body">
   注意：preset 的顺序是 从后往前的，和 webpack 中的 loader 顺序是一样的
  </div>
</article>

<br/>

### 使用命令行指定配置文件
该命令会读取 `babel.config.js` 下的配置，并将 `src` 目录下的代码编译到 `lib` 目录下
``` shell shell
npx babel --config-file ./babel.config.js -d lib ./src
```
<br/>


## `preset` 具体使用

### `preset-env` 适配目标浏览器
当我们不需要适配低版本浏览器或者指定需要适配某个版本的浏览器时，可以通过 `targets` 来指定我们需要适配的目标版本  

要查看 `@babel/preset-env` 更多配置选项，请 [查看](https://www.babeljs.cn/docs/babel-preset-env#options)



我们在项目根目录下新建一个 babel 的配置文件，并且配置一些 `presets`, `presets` 可以配置一些预设，预设是一些插件的集合，类似于我们去肯德基吃东西时买的套餐，里面包含了一些其它食物。

在使用 babel 的时候我们还需要安装其它的一些必须插件 

`babel-loader` 主要是提供一个过程管理 -> 调用 babel-core
`@babel/bable-core` babel 的核心，把源码转换成` 抽象语法树`，再进行遍历生成
`@babel/preset-env` 把 es6 语法树转换成 es5 语法树

最终再把 es5 语法树转换成 es5 的代码 -> 调用 babel-core 进行转换




```js babel.config.js
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    "chrome": "88"
                }
            }
        ]
    ]
}
```


### `preset-env` 中使用 `polyfill`
当我们项目需要适配一些低版本的浏览器的时，我们使用的 es2015+ 的特性可能不被浏览器所支持，此时，可以引入 polyfill 来帮我们把 一些 es2015+ 的语法转换成 浏览器所能识别的 es5 代码

+ `polyfill`
  + 一种用于衣物、床具等的聚酯填充材料, 使这些物品更加温暖舒适
  + <strong>垫片</strong>、<strong>补丁</strong>的意思

<br/>

在之前我们使用 `polyfill` 时，都是使用  `@babel/polyfill` 这个包的

从 `babel` 7.4.0 开始 `@babel/polyfill` 已经被废弃了，因为这个包没有提供从 `core-js@2` 到 `core-js@3` 平滑升级路径，所以转而直接使用 `core-js/stable` 和 `regenerator-runtime/runtime`

 关于此详情请查看 [core-js](https://github.com/zloirock/core-js/blob/master/docs/zh_CN/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill) 或  [babel](https://babeljs.io/docs/en/babel-polyfill) 官网中的说明

`regenerator-runtime/runtime` 是 `facebook` 团队开源的一个代码转换器，它可以帮我们代码中使用了 es2015+ 后的 `async/await` `generator/yield` 等代码帮我们转成 es5 的代码
`core-js` 为其他团队开源的一个独立项目

1. 安装所需插件
``` shell shell
npm install --save--dev core-js regenerator-runtime 
```
2. 修改 `.browserslistrc` 文件
默认情况下 会查找 `.browserslistrc` 下的文件来根据我们需要适配的浏览器来使用 `polyfill`，
``` shell .browserslistrc
> 0.25%
not dead
```

3. 修改 `babel.config.js` 配置文件
``` js  babel.config.js
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                corejs: '3.8',
                useBuiltIns: 'usage', 
            }
        ]
    ]
}
```
<article class="message is-warning">
  <div class="message-body">
    <p><strong >corejs</strong ></p>
 由于 <code>preset-env</code> 同时支持 <code>core-js@/2</code> 和 <code>core-js@/3</code> ，因此需要通过 <code>corejs</code> 来指定 <code>core-js</code> 的版本，默认是 2;<br/>
 该配置需要与 <code>useBuiltIns</code> 一块配置才能生效
  </div>
 </article>
 <article class="message is-warning">
    <div class="message-body">
    建议指定 需要使用 <code>corejs</code> 的具体版本，而不是写成  <code>corejs: 3</code>，因为使用<code>corejs: 3</code> 将不会注入在最新的版本中添加的模块，相关信息请 <a href="https://github.com/zloirock/core-js#babelpreset-env"> 查看 </a>
    </div>
 </article>

 `useBuiltIns` 有三个配置选项
  + `false` 表示不为我们的代码添加 `polyfill`，  该值也是 `默认值`
  + `useage` 将会根据我们需要适配的目标浏览器是否支持我们在代码中使用的语法新特性来按需添加 `polyfill`
  + `entry` 需要我们在项目的入口手动引入 
  `import 'core/stable'` 和 `import 'regenerator-runtime/runtime'`， 来使用所有 `polyfill`

  <article class="message is-warning">
    <div class="message-body">
    如我们以上例子配置的 <code>useBuiltIns: 'usage'</code>，会帮我们检测需要适配的目标浏览器是否支持我们使用的语法特性来动态添加 <code>polyfill</code><br/><br/>
    有关 <code>polyfill</code> 的更多信息，具体请查看 <a href="https://github.com/zloirock/core-js">core-js</a>
    </div>
 </article>


 <article class="message is-warning"> 
  <div class="message-body">
  除此之外，我们也可以通过在 html 中添加 以下代码来实现添加 <code>polyfill</code>，该服务器会根据浏览器请求的请求头来动态分发不同的 <code>polyfil</code>，如果觉得这种方式可能存在一些隐患的话，也可以自己搭建一个私服，网上也有一些相关的教程

  <code>
    <script src="https://polyfill.io/v3/polyfill.min.js"> </script>
  </code>

  </div>
</article>

<br/>

## babel 编译 react 代码的使用
首先需要在项目中安装 `react` 和 `react-dom`，接着我们可以编写一些 react 代码，然后交给 babel 来帮我们解析，
在 babel 中解析 react 代码 我们 可以用到 babel 官方以及帮我写好的一个 预设 `@babel/preset-react`

 1. 安装所需插件
```shell shell
npm install --save-dev react react-dom @babel/preset-react
 ```

 2. 配置 babel.config.js
``` js babel.config.js
 module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        corejs: 3,
        useBuiltIns: "usage",
      },
    ],
    ["@babel/preset-react"],
  ],
};
 ```
 3. 执行编译
 ``` shell shell 
npx babel --config-file ./babel.config.js -d lib src
 ```
<br/>

## babel 编译 typescript 代码的使用
babel 也可以用来编译我们写的 ts 代码，
babel 官方也给我们写好了一个 预设 `@babel/preset-typescript`

 1. 安装所需插件
 ``` shell shell
npm install --save-dev @babel/preset-typescript
 ```
 2.配置 babel.config.js
 ``` js babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        corejs: 3,
        useBuiltIns: "usage",
      },
    ],
    ["@babel/preset-typescript"],
  ],
};
 ```
 3. 执行编译
 ``` shell shell 
npx babel --config-file ./babel.config.js ./src/script.ts -o ./lib/script.js
```
<br/>

## `babel` 编译原理 

{% asset_img babel.png %}
有关 babel 编译原理的话题，有时间再写一遍相关的博客

以上就是 `babel` 中 `plugin` ，`preset`，`polyfill`，以及在 `babel` 中编译 `react`，`typescript` 的基本使用，也可在官网来查询 [更多配置](https://babeljs.io/docs/en/)   
<br/>
