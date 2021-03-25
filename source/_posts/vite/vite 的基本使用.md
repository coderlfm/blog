---
title: vite 的基本使用
date: 2021-03-25 14:10:54
tags:
- http

categories:
- http

cover: /cover-imgs/vite.png


---

vite 的基本使用

<!-- more -->

## vite 的基本使用

为什么 vite更快，vite 使用的是 esbuild 打包，该打包工具采用 go 语言编写
省去了 js 中 字节码等转换 ast 抽象语法树 -> 字节码 -> 机器码

esbuild 可以直接编译为 计算机可以识别的机器码，快到不需要缓存
