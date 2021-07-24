---
title: react17
date: 2020-11-23 10:31:10
toc: true
tags:
- javaScript
- React
categories:
- javaScript
---
react 17 的更改

## 事件委托的变更
在react17之前, react 会对时间对象进行复用

从技术上讲，可以在应用程序中嵌套不同版本的 React。但是，由于 React 事件系统的工作原理，这很难实现。

>自从其发布以来，React 一直自动进行事件委托。当 document 上触发 DOM 事件时，React 会找出调用的组件，然后 React 事件会在组件中向上 “冒泡”。但实际上，原生事件已经冒泡出了 document 级别，React 在其中安装了事件处理器。
>
> 但是，这就是逐步升级的困难所在。
>
>如果页面上有多个 React 版本，他们都将在顶层注册事件处理器。这会破坏 e.stopPropagation()：如果嵌套树结构中阻止了事件冒泡，但外部树依然能接收到它。这会使不同版本 React 嵌套变得困难重重。这种担忧并不是没有根据的 —— 例如，四年前 Atom 编辑器就遇到了相同的问题。

在 React 16 或更早版本中，React 会对大多数事件执行 `document.addEventListener()`。React 17 将会在底层调用 `rootNode.addEventListener()`。

{% asset_img react_17_delegation.png  %}
{% asset_img store.png  %}

由于此更改，现在可以更加安全地进行新旧版本 React 树的嵌套。请注意，要使其正常工作，两个版本都必须为 17 或更高版本，这就是为什么强烈建议升级到 React 17 的根本原因。从某种意义上讲，React 17 是一个 “垫脚石” 版本，使逐步升级成为可能。

这也是我们为什么要改变 React 底层附加事件方式的原因。
在react17之前, 对于元素的处理时间会被挂载到 `document` 上，
当一个项目引入多个react版本时，事件冒泡的时候就会出现问题
所以在react 17 

## useEffect 副作用的清理时机

在react 17 中 useEffect return 后的函数会异步清理，之前都是同步清理，这可能会影响一些体验，比如切换时的动画卡顿

<b>在 React 17 中，副作用清理函数总会异步执行 —— 如果要卸载组件，则清理会在屏幕更新后运行。</b>

此外，React 17 将在运行任何新副作用之前 `执行所有副作用的清理函数（针对所有组件）`。React 16 只对组件内的 effect 保证这种顺序。

## 返回 undefined 的错误

以前，React 只对 class 和函数组件执行此操作，但并不会检查 forwardRef 和 memo 组件的返回值。这是编码错误的原因。

<b>在 React 17 中，forwardRef 和 memo 组件的行为会与常规函数组件和 class 组件保持一致。在返回 undefined 时会报错</b>



