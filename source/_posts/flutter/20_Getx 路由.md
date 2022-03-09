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

Getx 路由，免context

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




### 关闭当前页面并进入下一个页面(replace)

```Dart
Get.offNamed("/NextScreen");

```




### 关闭所有页面并进入下一个页面

```Dart
Get.offAllNamed("/NextScreen");

```




### 命名路由跳转

```Dart
Get.toNamed('/home');
```






## 路由传参

### url参数

```Dart
Get.offAllNamed("/detail?id=1001&title=苹果");

```


页面 /controller 接收

```Dart
print(Get.parameters['id']);  // out: 1001
print(Get.parameters['title']);  // out: 苹果

```




### arguments 参数

```Dart
Get.toNamed("/NextScreen", arguments: '苹果');

```


页面 /controller 接收

```Dart
print(Get.arguments); // out: 苹果

```




## 返回上一页

返回传参

```Dart
Get.back(result:'yyyy');

```


返回接受参数

```Dart
Get.toNamed("/detail/1001?title=苹果").then((res){
  print(res); //  out: yyyy
});
```




## 动态路由

### 动态路由注册

```Dart
 getPages: [
    GetPage(name: '/', page: () => MyHomePage()),
    GetPage(name: '/detail/:id', page: () => DetailPage()),
  ],
```




### 动态路由跳转

```Dart
Get.toNamed("/detail/1001?title=苹果");

```




### 动态路由接受参数

```Dart
print(Get.parameters['id']);  // out: 1001
print(Get.parameters['title']);  // out: 苹果

```




## 中间件

### 全局中间件(全局导航守卫)

```Dart
GetMaterialApp(
  routingCallback: (routing) {
    if(routing.current == '/second'){
      openAds();
    }
  }
)
```


