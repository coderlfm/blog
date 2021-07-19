---
title: react render 阶段源码调用栈
date: 2021-07-06 10:45:10
toc: true
tags:
- javaScript
- React
categories:
- javaScript

cover: /cover-imgs/react.jpg

---
react render 阶段 源码分析及其调用栈
<!-- more -->
# react render 阶段源码调用栈

- [原链接](https://gitmind.cn/app/flowchart/7e27cb864997ac3a5f7c8d8a2acca386)
  原链接 在pc端可打开

- [pdf 版](https://blog.liufengmao.cn/render.pdf)

{% note warning %}
由于 导出的图片一直有问题，没有办法放图片，本来是想 用 ifarm 嵌套展示的，但是 gitmind 好像有点问题
{% endnote %}

最近很长一段时间都没有更新博客，一方面原因是最近比较忙，需求紧，另一方面是在读 `react` 源码，由于 `react` 源码比较多，目前也只是把 `render` 阶段看完，更新阶段 以及 任务优先级 还没有看，希望能够在这个月结束掉，加油！！！o(*￣▽￣*)ブ 

`react` 版本读的是当前 `github` 上最新的 `17.0.2`，但是读的过程中 `react` 又发布了 `React 18 Alpha` 版本，更新的太快了呀😭。
 
准备看完 `react` 的源码后再系统的看一遍 `vue3` 的源码，最近也有在看 vue3，但是源码方面只有简单的了解 `vue3` 中的源码，还没有时间系统的读。

<!-- 不了解？技术敏感度不行呀，你要是继续这么安于现状，迟早在25岁被优化 -->
但是没有关系，昨天看 Dan 直播的时候也，Dan 竟然没有用过 vue，心里感觉得到了安慰😂，看到这的时候，有一条弹幕说 ："`单一框架技术深度还可以，技术敏感度还不够，你这样到35岁是要被优化掉的`"，笑死了🤣🤣🤣，之后看到 Dan 大神 2018年列的 [一份清单](https://overreacted.io/zh-hans/things-i-dont-know-as-of-2018/) , 不知道大神现在这些技术都已经学会了没有。

 
