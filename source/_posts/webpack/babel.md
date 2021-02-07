---
title: Webpack 集成 babel 的使用
date: 2021-02-05 10:58:54
toc: true
tags:
- Webpack

categories:
- Webpack

cover: /cover-imgs/webpack.jpg

---

`babel` 本身是一个独立的插件，但是它可以很多其他工具配合使用

<!-- more -->
`webpack` 现在已经是前端开发中必不可少的工具了，很多脚手架都是基于 `webpack` 来进行开发的，在开发中我们必不可少的会使用一些 `es2015+` 新特性，或者使用 `react` 或者 `typescript` 来开发我们的项目，浏览器是不能直接识别我们的代码的
此时，我们就可以在 `webpack` 中配合 `babel` 来帮我们做一些转换

## babel-loader 的基本使用
``` shell shell
npm install --save-dev babel-loader
```

## 修改 webpack.config.js 配置
在 `webpack` 中 使用 `babel` 比较简单，只需要在我们匹配到我们写的 js 或者 ts 等文件时，交给 `babel` 来处理就ok，
关于 `babel` 的具体配置写在 `babel.config.js`，用法和单独使用 `babel` 时一致  

``` js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    mode:'development',
    devtool: 'source-map',
    module: {
        rules:[
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,
                use:[
                    'babel-loader'
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'my App',
            template: './public/index.html',
        }),
        new DefinePlugin({
            'env': '"development"'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    globOptions: {
                        ignore: [
                            '**/index.html'
                        ]
                    }

                }
            ]
        })
    ]
}
```

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
    ["@babel/preset-typescript"],
  ],
};
```

## 集成 eslint-loader

### 安装配置所需插件
1. 安装 eslint-loader
```shell shell
npm i --save--dev eslint-loader  eslint
```

2. 修改 webpack.config.js
配置使用 `eslint-loader` ，此前说过 `loader` 加载的顺序是从后往前的，所以我们需要把 `eslint-loader` 放在后面 
``` js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/react-main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    mode:'development',
    devtool: 'source-map',
    module: {
        rules:[
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,
                use:[
                    'babel-loader',
                    'eslint-loader' //使用 eslint-loader
                ]
            },
            {
                test:/\.tsx?$/,
                exclude:/node_modules/,
                use:[
                    'babel-loader'
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'my App',
            template: './public/index.html',
        }),
        new DefinePlugin({
            'env': '"development"'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    globOptions: {
                        ignore: [
                            '**/index.html'
                        ]
                    }

                }
            ]
        })
    ]
}
```

3. 初始化 eslint 
然后根据个人提示来选择所需的配置
``` shell shell
npx eslint --init
```

 <br/>
 
 询问我们需要如何使用 eslint
    + 只检查语法
    + 检查语法并且提示错误
    + 检查语法、提示错误，并且强制按照代码风格
 
 这里我们先选择 检查语法并且提示错误 
 {% asset_img eslint1.png %}
 <br/>
 
 <br/>
 选择哪个模块规范？

  这里因为默认是支持 es6 module，所以我们选择 CommonJS 
 {% asset_img eslint2.png %}
 <br/>
 
 <br/>
 选择使用哪个框架？

 这里测试我们选择 React
 {% asset_img eslint3.png %}
 <br/>
 
 <br/>
 是否使用 Typescript ？

 因为我们是简单测试，所以不用 Typescript
 {% asset_img eslint4.png %}
 <br/>
 
 <br/>
 询问我们代码运行在什么环境？

 我们选择 Browser 
 {% asset_img eslint5.png %}
 <br/>

 <br/>
 询问我们配置文件需要已什么格式来保存

 我们选择 JavaScript
 {% asset_img eslint6.png %}
 <br/>
 
 <br/>
 是否现在就执行 npm 来进行安装

 因为我们选择的配置里面需要支持 React，所以 eslint 需要我们安装对 React 支持的插件
 {% asset_img eslint7.png %}
 <br/>
 
 <br/>
 接着项目目录下就会生成一个 <code>.eslintrc.js</code>

 我们还需要添加一行配置来使它支持 es6 模块化

 ``` js .eslintrc.js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
      "eslint:recommended", 
      "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ["react"],
  rules: {},
};
 ```
 <br/>

### 执行测试
 假设我们 react 代码如下
 ```jsx main.js
import React, { memo, useState } from "react";
import ReactDom from "react-dom"

const App = memo(function App() {
  const [msg, setMsg] = useState("hello react");
  return <div>{msg}</div>;
});

ReactDom.render(<App />, document.getElementById("root"));
 ```
 
 执行打包命令，也可以把该命令配置在 package.json 的 scripts 中
 ``` shell shell
 webpack
 ```

<br/>
 紧接着我们可以控制台 eslint 给我们报了一个错误，并且告诉了我们在第几行
 
 + `setMsg 已赋值但从来没有使用`
 
 {% asset_img eslint-error1.png %}
 
我们可以在代码中先把 `setMsg` 删除，这个错误立马就会消除
 
 但是某个值我们目前可能还没有使用，可能在后面的开发中我们是需要使用的，这种情况下我们更希望的是 `eslint` 给我们报 `警告`，而不是报错，react 脚手架就是这么做的

 但是我们需要怎么把这种类型调整成警告而不是报错呢
 1. 找到报错信息后面的错误规则 `no-unused-vars` 复制
 2. 在 `.eslintrc.js` 中的 `rules` 中把规则粘贴，然后设置为 `1`
 3. 重新编译
 
``` js .eslintrc.js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
      "eslint:recommended", 
      "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": 1,
  },
};

 ```
 
 <article class="message is-warning">
    <div class="message-body">
     rules 里面规则有三个值
    <ul>
        <li><code>off </code>&nbsp&nbsp  和 <code> 0</code> 表示关闭此规则，以后遇到此规则会忽略</li>
        <li><code>warn </code>&nbsp和 <code>1</code> 表示遇到此规则给予警告提示，<strong>不会中断代码运行</strong></li>
        <li><code>error</code> 和 <code>2</code> 表示遇到此规则给予错误提示，<strong>结束代码运行</strong></li>
    </ul>
    更多的配置规则可以查看 <a href="https://eslint.org/docs/user-guide/configuring/rules#configuring-rules">configuring-rules</a><br/>
    更多的配置列表可以查看  <a href="https://eslint.org/docs/rules/">rules</a>
    </div>
 </article>
 
 <br/>
 重新执行编译就会发现错误变成了警告
 {% asset_img eslint-error3.png %}


 那到这里后我们的 eslint 就可以正常使用了吗，其实不然，因为有很多配置规则我们都还没有来根据项目进行配置，比如我们要求每一行代码后面都需要加上分号
 如果我们一个个根据自己的项目规范来手动配置的话，这个工作量就会比较大且繁琐了

 那有没有已经写好的一些代码规则我们可以直接拿来用呢，其实是有的，我们在初始化 eslint 配置的时候其实是可以选择的

## 使用其它的配置规则

### 初始化 eslint 
 然后根据提示来选择所需的配置
``` shell shell
npx eslint --init
```
<br/>
 
询问我们需要如何使用 eslint
+ 只检查语法
+ 检查语法并且提示错误
+ 检查语法、提示错误，并且强制按照代码风格
 
 这里我们选择 `最后一项`
 {% asset_img eslint1-1.png %}
 <br/>
 <br/>
 <code>......  中间步骤和上续一致</code>
 <br/>
 <br/>

  当执行完上续的选择后，会弹出一个新的选择，询问我们如何定义我的代码规范
 + 使用主流的代码风格
 + 根据问答来生成你的代码风格
 + 使用自定义的js文件
 
 我们选择 `第一个`

 {% asset_img eslint1-6.png %}
 <br/>

 <br/>
 选择哪个主流的代码风格

 我们选择 `Airbnb`
 {% asset_img eslint1-7.png %}
 <br/>
 <br/>
 <code>......  剩下步骤和上续一致</code>
 <br/>
 <br/>
 
  接着项目目录下也会生成一个 <code>.eslintrc.js</code>
  会看到在 `extends` 里继承了 `airbnb` 的代码风格，
  当然，如果我们想在 `airbnb` 的代码风格做一些覆盖，可以在 `rules` 中配置
 ``` js .eslintrc.js
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
      "plugin:react/recommended", 
      "airbnb"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: ["react"],
  rules: {
    "linebreak-style": 1,
  },
};
 ```

### 执行测试 
代码还是如下
 ```jsx main.js
import React, { memo, useState } from "react";
import ReactDom from "react-dom"

const App = memo(function App() {
  const [msg, setMsg] = useState("hello react");
  return <div>{msg}</div>;
});

ReactDom.render(<App />, document.getElementById("root"));
 ```
 
 执行打包命令
 ``` shell shell
 webpack
 ```

<br/>
 紧接着我们可以控制台 eslint 给我们报了一些错误
 
 + `字符串必须使用单引号`
 + `缺少分号`
 + `回调函数需要使用箭头函数`
 + `setMsg 已赋值但从来没有使用`
 + `在扩展名为'.js'的文件中不允许使用JSX`

 {% asset_img eslint1-11.png %}
 
 那我们根据以上报的错误修改一下我们的代码后重新运行
 
 1. `.eslintrc.js` 修改未使用的值不报错误而报警告
 {% asset_img eslint1-12.png %}
<br/>
<br/>

 2. 修改 main.js 文件名及代码
 ```jsx main.jsx 
import React, { memo, useState } from 'react';
import ReactDom from 'react-dom';

const App = memo(() => {
    const [msg, setMsg] = useState('hello react');
  return <div>{msg}</div>;
});

ReactDom.render(<App />, document.getElementById('root'));
 ```
<br/>
 3. 重新执行打包命令
    就会发现可以正常编译了
    {% asset_img eslint1-13.png %}

## vscode 插件
我们会发现每次都要重新来执行打包命令来让 eslint 帮助我们做代码检查这个过程太低效了
所以我们可以借助 vscode 中的 eslint 插件来帮助我们在编写代码时就能过京造的检测到我们的代码格式问题

 1. 首先先在 vscode 中安装 eslint 插件
 2. 然后打开我们的代码文件，会发现 eslint 在我们编写的时候就能提示错误了
 {% asset_img eslint2-1.png %}
