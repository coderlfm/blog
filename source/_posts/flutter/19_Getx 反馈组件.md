---
title: flutter Getx 反馈组件
date: 2022-02-14 10:15:10
toc: true
tags:
  - Flutter
  - Dart

categories:
  - Flutter
  - Dart

cover: /cover-imgs/flutter.png
---

Getx 反馈组件

<!-- more -->

## snackbar

顶部消息通知

```Dart
Get.snackbar();

mainButton 小按钮
onTap 监听点击
可以设置 关闭的方向，边框的颜色
开启和关闭动画

overlayBlur: 100 模板的背景模糊
模板的背景颜色
snackbarStatus:(){ } 监听 开启/关闭 状态的变化
可以配置输入框 userInput

```




## Dialog

对话框

```Dart
Get.defaultDialog(
  title:'',
  middleText: '中间'
);

content: 自定义区域
监听确认，取消事件
actions 扩展的按钮 Get.back();
barrierDismissble: false 点击背景不允许关闭

onWillPop 监听退出页面

```




## bottomSheet

底部弹出框

```Dart
Get.bottomSheet(
  Contaier(); // 展示的元素
);

isDismissible : 空白区域是否可关闭
enableDarg: true; 是否可拖动
isScrollControlled: true 是否可以全屏展出
shape: 设置圆角
可配置动画 弹出/关闭 时间

```






