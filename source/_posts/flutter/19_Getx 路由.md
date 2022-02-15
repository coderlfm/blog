---
title: flutter Getx 路由
date: 2022-02-15 10:52:10
toc: true
tags:
  - Flutter
  - Dart

categories:
  - Flutter
  - Dart

cover: /cover-imgs/flutter.png
---

Getx 路由

<!-- more -->
# GetX 路由

## 前置条件

将 `MaterialApp` 修改为 `GetMaterialApp`，然后传入 getPages

```Dart
void main() {
  runApp(
    GetMaterialApp(
      title: "Application",
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
    ),
  );
}
```




routes.dart

```Dart
class AppPages {
  AppPages._();

  static const INITIAL = Routes.HOME;

  static final routes = [
    GetPage(
      name: _Paths.HOME,
      page: () => HomeView(),
      binding: HomeBinding(),
    ),
  ];
}
```




## 路由跳转

功能和原生的类似，也可以通过 `await`来等待跳转页面的返回结果

### 匿名路由跳转

```Dart
Get.to(
  () => Home()
  transition: Transition.rightToLeft  从右向左
  duration: 
  curve: 动画效果
  arguments: 'xxx'
);
```




### 命名路由跳转

```Dart
Get.toNamed('/home');
```




## 返回

```Dart
Get.back(result:'yyyy');

```


