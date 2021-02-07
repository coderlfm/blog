---
title: package.json细节
tags:
---

### package.json
我们创建项目时脚手架都会帮我们自动生成一个 `package.json` 里面记录着我们项目的信息，
或者我们可以手动 npm init 或 npm init -y 来生成该文件，生成的是以上样子的

```json package.json
{
  "name": "test",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

```

private: true //表示项目是私有的，不会被发布到npm上去

通常我们项目里面 `dependencies` 属性中会记录着我们项目的生产依赖
```json package.json
"dependencies": {
    "react": "^16.13.1",
}
```
可以看到上面的代码中我们依赖了 `react` ，并且版本是 `^16.13.1`，但是前面有一个 `^`号，这个 `^`是什么意思呢，
>语义化版本控制规范 SemVer
>SemVer（Semantic Versioning，语义化版本控制）是Github起草的一个语义化版本号管理模块，它实现了版本号的解析和比较，规范版本号的格式，它解决了依赖地狱的问题。

那我们上图中的意思是 允许在16版本的次版本升级，但是主版本不能够升级，相当于 `16.13.1` >= 16.13.1 并且 <17.0.0
比较常见的还有 `~16.13.1` 表示的是主版本和次版本都不能够升级，允许修订版本升级，相当于 `16.13.1` >= 16.13.1 并且 <16.14.0
还有很多描述符，比如
+ * 允许所有版本号
+ 1.x 表示 >=1.0.0 并且 <2.0.0 ，也可以用 1 来描述
+ 1.5.* 表示 >=1.5.0 并且 <1.5.0，锁定主版本和次版本号，也可以用 1 来描述

## `package-lock.json`
用来保存缓存

## yarn 
+ yarn rebuild   //强制build
+ yarn cache clean //清除缓存
yarn upgrade // 删除 node_modules

## 自定义脚手架工具
前言：通过脚手架创建的项目没有任何配置
1. 没有划分目录结构
2. 基本配置 ：vue.config.js
3. axios 未安装，未封装，未配置
4. Element-UI Ant-Design
5. router 未配置，未安装
6. vuex

### 实现方向

自己写项目模板，
根据不同项目组写不同的模板
安装工具，工具在仓库中 和 webpack 一样
内部服务器或者 开源

```bash
coderlfm create music
coderlfm addStore home // 创建页面
```
会从内部服务器或者github上下载项目并安装东西
github已经上传了



