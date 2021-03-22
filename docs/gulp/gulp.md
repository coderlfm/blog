---
title: gulp
date: 2021-01-08 11:13:54
toc: true
tags:
  - javaScript

categories:
  - javaScript

cover: /cover-imgs/gulp.png
---

gulp 的核心是 `流(stream)` 和 `任务(task)`

<!-- more -->


## 创建 `gulpfile.js`

首先先在 项目根目录下创建 `gulpfile.js` 配置文件

安装所需插件

```shell
npm i gulp
```
<br/>

## 任务(tasks)

在 `gulp` 中，任务通常是一个异步的函数, 该函数有一个 `callback` 作为参数，调用该
`callback` 来告诉 gulp 当前任务已结束
或者可以在函数中返回 `stream`、`promise`、`event emitter`、`child process` 或 `observable`的值来告诉 `gulp` 当前任务已经执行完毕

在 gulp 中还有 `公开任务` 和 `私有任务` 两个只需要理解性的概念

### 公开任务 `(Public tasks)`

- 被导出(exports) 的任务被称为 公开任务，可以被 `gulp` 命令直接调用

### 私有任务 `(Private tasks)`

- 没有被导出的任务，只在内部被使用的任务被称为 私有任务，通过作为 `series()串行任务` 和 `parallel()并行任务` 的一部分
  <br/>
  <br/>

### 基本任务的创建和使用

早期 3.x 版本中，注册任务是通过从导入 `gulp` 然后通过 gulp.task 的方式来注册，如果使用的老版本，注册任务的方式如下

现在的版本中，采用这种方式也是可以的，但是官方建议我们使用 `导出(exports)` 任务名的方式来作为注册任务的主要方式

使用 `task` 注册任务
```js gulpfile.js
gulp.task("js", (cb) => {
  cb();
});
```

使用 `exports` 来注册任务
```js gulpfile.js
function build(cb) {
  cb();
}

function js(cb) {
  cb();
}

// 导出的任务被称为公开任务
exports.build = build;
```

输入以下命令可以查看所有公开任务

```shell
npx gulp --tasks
```

<center>{% asset_img tasks-1.png %}</center>
<br/>

<article class="message is-warning">
  <div class="message-body">
    也可全局安装 gulp-cli 来安装命令行工具，省去 执行命令前的 npx
  </div>
</article>

### 组合任务

在 `gulp` 中，组合任务可以通过 `series` 和 `parallel` 来创建

- `series()` 创建一个串行任务
- `parallel()` 创建一个并行任务

```js gulpfile.js
const { series, parallel } = require("gulp");

function build(cb) {
  cb();
}

function js(cb) {
  console.log("js 任务执行完毕");
  cb();
}

function css(cb) {
  console.log("css 任务执行完毕");
  cb();
}

exports.build = build;
exports.default = series(js, css);
```

<article class="message is-warning">
  <div class="message-body">
    使用 <code>exports.default</code> 方式导出的任务，在使用 <code>gulp</code> 执行的时候不需要跟上任务名称
  </div>
</article>

执行以下命令

```shell
npx gulp
```

可以看到任务是串行执行的

<center>{% asset_img tasks-2.png %}</center>

```js 串行任务和并行任务
const seriesTask = series(tesk1, tesk2, tesk3);
const parallelTask = parallel(tesk1, tesk2, tesk3);

// 还可以继续组合
const composeTask = series(seriesTask, parallelTask);

exports = { seriesTask, parallelTask };
```

<br/>

## [gulp 异步任务](https://www.gulpjs.com.cn/docs/getting-started/async-completion/#%E5%BC%82%E6%AD%A5%E6%89%A7%E8%A1%8C)
前面提到 gulp 中的所有任务都是异步任务，除了可以通过调用回调函数 callback 来告诉 gulp 任务已执行完成外，还有其它几种常用的方式

1. 返回 stream 的方式

``` js src/index.js
console.log("hello gulp");
```

``` js gulpfile.js
const { src, dest } = require("gulp");

function build() {
  return src("./src/**/*.js").pipe(dest("./build"));
}

exports.build = build;
```

执行以下命令

```shell
npx gulp build
```

可以看到帮我们把 src 下的文件输出到了 build 目录下
<center>{% asset_img build-1.png %}</center>


2. 返回 `promise` 的方式

```js gulpfile.js
const fs = require("fs");

async function asyncAwaitTask() {
  const { version } = fs.readFileSync("package.json");
  console.log(version);
  await Promise.resolve("some result");
}

exports.default = asyncAwaitTask;
```

## 插件
在 gulp 中也有插件的概念，当我们需要在使用 gulp 的过程中对我们的代码进行一下转换的时候，就可以使用一些 gulp 的插件来帮助我们完成

### 插件的基本使用
我们使用 `terser` 插件来对我们的代码进行压缩
 
``` js
const { src, dest } = require("gulp");
const teser = require("gulp-terser");

function build() {
  return src("./src/**/*.js")
  .pipe(teser())
  .pipe(dest("./build"));
}
```

<article class="message is-warning">
  <div class="message-body">
    其它更多插件可以在 <a href="https://gulpjs.com/plugins/">这里</a> 查看更多
  </div>
</article>



### 使用模块

并非 gulp 中的一切都需要用插件来完成。虽然它们是一种快速上手的方法，但许多操作都应当通过使用独立的功能模块或库来实现。

插件应当总是用来转换文件的。其他操作都应该使用（非插件的） Node 模块或库来实现。
``` js gulpfiile.js
const { src, dest, parallel } = require("gulp");
const teser = require("gulp-terser");
const del = require("delete");

function build() {
  return src("./src/**/*.js")
    .pipe(teser())
    .pipe(dest("./build"));
}

function clean(cb) {
  del(["./build"], cb);
}

exports.default = parallel(clean, build);
```


## 监听

监听文件变化后执行单个任务，如果要执行多个任务就需要 使用组合任务，

``` js gulpfiile.js
const { src, dest, watch, parallel } = require("gulp");
const teser = require("gulp-terser");
const del = require("delete");

function build() {
  return src("./src/**/*.js")
    .pipe(teser())
    .pipe(dest("./build"));
}

function clean(cb) {
  del(["./build"], ()=> cb());
}

watch("src/**/*.js", build);

exports.default = parallel(clean, build));
```

