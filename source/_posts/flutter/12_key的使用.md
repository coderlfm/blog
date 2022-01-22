---
title: flutter key的使用
date: 2022-01-22 15:35:10
toc: true
tags:
  - Flutter
  - Dart

categories:
  - Flutter
  - Dart

cover: /cover-imgs/flutter.png
---

flutter 中 key 的使用

<!-- more -->

<!-- # key 的使用 -->

一共分为两大类 `LocalKey` 和 `GlobalKey`

## LocalKey

### ValueKey

普通的key，字符串类型

这个`key`就和 `vue`，`react`和 小程序 遍历生成元素时绑定的`key`类似，必须要加`key`且不可重复



### ObjectKey

对象类型的key，比较的是引用



### UniqueKey

每次会生成一个唯一的 key



## GlobalKey



### GlobalKey

类似于前端中的 `ref`,用来获取 `widget` 中的内容，调取子组件的属性或者方法

```
  final GlobalKey<_HomeContentState> homeKey = GlobalKey();
  
  homeKey.curretnState.message
  homeKey.curretnState.widget.message
  homeKey.curretnState.submit();
  homeKey.curretnState.setState();
```




### GlobalObjectKey



String name = [widget.name](http://widget.name);

