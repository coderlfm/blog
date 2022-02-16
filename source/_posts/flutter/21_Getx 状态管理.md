---
title: flutter Getx 状态管理
date: 2022-02-16 22:00:10
toc: true
tags:
  - Flutter
  - Dart

categories:
  - Flutter
  - Dart

cover: /cover-imgs/flutter.png
---

Getx 状态管理

<!-- more -->
# GetX 状态管理

之前如果状态需要发生改变需要 通过继承 `StatefulWidget`，而使用 `Getx`之后就不在需要了

## Obx

类似于 `vue` 中的响应式变量

### 方式一

```Dart
RxInt count = RxInt(0);

使用 Obx(()=> Text(count))
修改 count++;
```




### 方式二

```Dart
var count = Rx<double>(0);  // 使用 Rx 泛型的方式定义 
使用方式同上
```




### 方式三

这种方式使用的较多

```Dart
var count = 0.obs;
使用方式同上
```




### 自定义类

```Dart
class User {
  // rx 变量
  var name = 'lfm'.obs;
  var age = 18.obs;

  构造函数创建
  var name;
  var age;
  User({this.name, this.age})

}

  使用
  注意需要 .value 
  final user = User();

  Obx(()=> Text(user.name) );
  user.name.value = 'hhh';
  
 
  构造函数创建时，使用方式需要进行修改
  final user = User(naem:'lfm',age:18).obs;

  Obx(()=> Text(user.value.name) );
  user.update((val){
    user.value.name = 'hhh';
  })

```






## GetxController

`Getx`将`ui`和 `controller`进行了分离，不需要将业务逻辑和`ui`耦合



### 1. 编写controller

将业务`state`和 业务逻辑单独写在一个`class`中，且这个`class`必须继承自`GetController`

```Dart
class HomeController extends GetxController {
  final count = 0.obs;

  int count2 = 0;

  @override
  void onClose() {}
  void increment() => count.value++;

  void increment2() {
    count2++;
    update(); // 如果不是通过 obs创建的变量需要调用 update() 来通知更新
  }
}
```






### 2.依赖注入

需要在使用之前进行依赖注入，如在`build`方法中，或者`main`函数中提前注入，后面有自动注入的方式

```Dart
  // 依赖注入 会自动释放
  HomeController homeController = Get.put(HomeController());
```






### 3.使用

#### GetBuilder

性能更好一些

```Dart
  GetBuilder<CounterState>(
    init: CounterState(), // 可以不传，在使用到的时候会自动
    builder: (_) => Text(_.counter);
  )
```




#### GetX

```Dart
  GetX<MyController>(
    init: MyController(),
    builder: (_) => Text(_.count2),
  )
```




#### Obx

如果是通过 `obx`来使用，需要在使用时先获取到对应的依赖

```Dart
final controller = Get.find<HomeController>();

```






## Workers

### ever

监听值改变

```Dart
ever(count1,(newValue){
  print('发生改变')
})
```




### once

```Dart
once(count1,(newValue){
  print('发生改变')
})
```




### debounce 防抖

3秒后触发回调

```Dart
debounce(count1,(newValue){
  print('发生改变')
},time: Duration(seconds:3));
```






### interval 节流

频繁触发时每3秒触发一次

```Dart
interval(count1,(newValue){
  print('发生改变')
},time: Duration(seconds:3))
```




