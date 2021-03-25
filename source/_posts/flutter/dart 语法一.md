---
title: dart 语法一
date: 2021-02-03 14:24:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/dart2.png
---
dart 中 声明变量及 定义函数

<!-- more -->
## 1. hello world 
在 `dart` 中 使用 `main` 函数来作为主入口
``` dart 
main() {
  print('hello, World');
}
```
<br/>

## 2. 定义变量 
在 可以显式的给变量定义类型，或者不显示指定类型，采用`类型推导`的方式来推导类型
``` dart 
main() {

  var name = 'lfm';
  // String name = "lfm"; 

  var count = 123;
  // int count = 123;

  var d = 1.24;
  // double d = 1.24;

}
```

### 2.1 声明变量的其它关键字
除了采用以上直接指定类型的声明方式，和类型推导的方式来声明变量，还可以采用 `final` 和 `const` 来修饰变量，[此处](https://dart.cn/guides/language/language-tour#final-and-const) 可查看更多关于变量的内容

``` dart 
  var count = 123;

  // final 运行时确定值
  final b = count + 2;

  // const修饰的变量 必须在编译时确定值
  const c = count + 2;    // 编译报错
```
<br/>

## 3. 数据类型
和大多语言一样，dart 中也有 `int` ，`double`，`boolean` 等常见的类型

### 3.1. 字符串类型 
  `dart` 中支持 使用 `' '` 和 `" "` 还有 `""" """` 来定义字符串类型;
  `""" """` 写法支持换行
```dart 
    var str1 = 'dart';
    var str2 = "dart";
    var str3 = """      
      dart
      dart
    """;
```
#### 3.1.1. 字符串拼接变量
当我们要使用字符串拼接变量的时候可以使用 `${ }` 的方式来拼接变量
当我们拼接的只是变量的时候，可以省略 `{}` ， 简写成 `$`
当我们拼接的是表达式时，不可简写

``` dart
  print('count：${count}');       // 123
  print('count：$count');         // 123

  print('count：${count.runtimeType}');  // int
  print('count：$count.runtimeType');    // 123.runtimeType     不可简写
```
<br/>

### 3.2. 数字类型
```dart 
  var n1 = 123;
  var n2 = 1.23;

  print('n1 ${n1}, ${n1.runtimeType}');
  print('n2 ${n2}, ${n2.runtimeType}');

  // 字符串 转 数字
  var n3 = int.parse('123');
  var n4 = double.parse('123.33');
  print('n3 ${n3}, ${n3.runtimeType}'); // 123, int
  print('n4 ${n4}, ${n4.runtimeType}'); // 123, double

  // 数字 转 字符串
  var ss1 = 123.toString();
  var ss2 = 123.33.toString();
  print('ss1 ${ss1}, ${ss1.runtimeType}');  // ss1 123, String
  print('ss2 ${ss2}, ${ss2.runtimeType}');  // ss2 123.33, String

```
>当我们想要获取某个变量类型时，可以使用 `Object` 对象的 `runtimeType` 在运行时获取该类型

<br/>

### 3.3 布尔类型
  使用 bool 关键字来声明布尔类型
```dart
  bool b1 = false;
  var b2 = true;
```
>注意： `dart` 不允许使用  `if (nonbooleanValue)` 或者 `assert (nonbooleanValue)` 这样的代码检查布尔值
>所以 `dart` 中不存在非空即真，非0即真

<br/>

### 3.4 list(数组) 类型
  使用 `List` 关键字来声明 `list` 类型，其它语言也称为数组
```dart
  var list1 = [10, 20, 30];
  List list2 = ['10', '20', '30'];

  print(list1);
  print(list2);
```
>以上写法会被类型推导为 `List<int>` 和 `List<String>` ， 如果往该类型添加其它类型的数据会报错

#### 3.4.1 list 的增删改
更多 list 对象的属性及方法请查看[此处](https://api.dart.dev/stable/2.10.5/dart-core/List-class.html)

`Dart` 在 2.3 引入了 扩展操作符（`...`）和 null-aware 扩展操作符（`...?`），它们提供了一种将多个元素插入集合的简洁方法。该用法和 javaScript 中的扩展运算符使用类似

如果扩展操作符右边可能为 null ，你可以使用 null-aware 扩展操作符（`...?`）来避免产生异常

```dart
  var list1 = [10, 20, 30];
  List list2 = null;
  var list3 = [100, ...list1, ...?list2];

  list1.add(40);

  list1.remove(10);
  list1.removeAt(1);

  list1.insert(0, 500);

  // 查询是否包含，类似于js 中的 includes
  print(list1.contains(10));    // false
  print(list1.length);          // 3
  print(list1);                 // [500, 20, 40]
  print(list3);                 // [100, 10, 20, 30]
```
<br/>

### 3.5 Set 类型
`Set` 类型不允许有重复值，利用该特性，可以用来坐去重操作，该特性和 `JavaScript` 中的 `Set` 类似；
``` dart

  Set set1 = {'hello', 'Dart'};
  var set2 = {'hello', 'Dart'};

  print(set1);  //{hello, Dart}
  print(set2);  //{hello, Dart}

  // 数组去重
  var list4 = [10, 20, 10];
  var set3 = list4.toSet().toList();
  print('set3:$set3,${set3.runtimeType}');  // set3:[10, 20],List<int>
  
```

#### 3.5.1. Set 类型的增删改
Set 和 List  最大的区别是无序的
``` dart 
  set1.add('test');

  set1.remove('hello');

  print(set1);  // {Dart, test}

```
<br/>

### 3.6 Map 类型
Map 是一种无序的键值对结构，且key不允许重复，
``` dart
  var map1 = {"name": 'lfm', "age": "18"};

  var map2 = Map(); // new Map()   Dart2 开始可以省略 new
  map2['name'] = 'lfm';
  map2['age'] = '18';

  print(map1);    // {name: lfm, age: 18}
```

#### 3.6.1. Map 类型的增删改
Map 类型的增删改和 JavaScript 的操作类似
``` dart 
  var map1 = {"name": 'lfm', "age": "18"};
  map1['height'] = '1.88';    // 此处不可添加数字类型

  map1.remove('age');
  
  var name = map1['name'];

  print('name：$name');  // name：lfm
  print(map1);           // {name: lfm, height: 1.88}


  // 获取所有的 values
  print('map1.values,${map1.values},${map1.values.runtimeType}'); // map1.values,(lfm, 1.88),_CompactIterable<String>

  // 获取所有的 keys
  print('map1.keys,${map1.keys},${map1.keys.runtimeType}'); // map1.keys,(name, height),_CompactIterable<String>

  // 校验是否包含某个 value 或者 key
  print('${map1.containsValue('lfm')},${map1.containsKey('name')}'); // true,true
  

```
<br/>

## 4. 函数

### 4.1 函数基本定义
```dart 
  /**
   * 返回值类型 方法名(){
   *    函数体
   *  return 返回值
   * }
   * 
   */

  bool fn1() {
    print('fn1被调用');
    return true;
  }

  print(fn1());  //fn1被调用      true
```

#### 4.1.1. 类型推导函数返回类型
```dart
  // 不显示声明函数返回类型，类型推导会自动推导出该函数的返回类型   bool fn2()
  fn2() {
    print('fn1()');
    return true;
  }
```




#### 4.1.2. 箭头函数
前端开发看到这肯定惊了，是的 `Dart` 也有箭头函数
当函数体只有一条表达式，可以简写成一行代码，该简写是 { return 表达式; } 的简写
``` dart
  bool isSuccess(int code) => code == 200;

  print(isSuccess(200));    // true
```
<br/>

### 4.2 函数参数

#### 4.2.1 必填参数
``` dart
  fn3(String name) {
    print(name);
  }

  fn3('dart');   // dart
```

#### 4.2.2 位置可选参数

``` dart
  fn4(String name, [int age, double height]) {
    print('$name,$age,$height');
  }

  fn4('dart', 18); // dart,18,null
```

#### 4.2.3 命名可选参数
``` dart 
  fn5(String name, {int age, double height}) {
    print('$name,$age,$height');
  }

  fn5('dart', height: 1.90);    // dart,null,1.9
```
<br/>
<br/>

### 4.3 函数默认值
可选参数可以设置默认值
``` dart 
  fn6(String name, {int age = 18, double height = 1.9}) {
    print('$name,$age,$height');
  }

  fn6('dart');    // dart,18,1.9
```
<br/>

### 4.4 函数作为一等公民
这一特性和 JavaScript 中很像，函数可以作为参数传递
``` dart
  fn7(Function fn(String name)) {
    fn('dart'); // name：dart
  }

  fn7((name) {
    print('name：$name');
  });
```
<br/>

### 4.5 匿名函数
匿名函数和命名函数类似，也可以定义参数，返回值等
``` dart 
  var list1 = [10, 20, 30];
  list1.forEach((item) => print('item: $item'));  // item: 10， ...
```
<br/>

### 4.6 词法作用域

dart 中也存在作用域，即 {} 内定义的变量只能在 {} 内访问，
当前作用域未找到该变量时，会一层一层往上级作用域查找，找到顶层括号依旧找不到便报错
``` dart 
  fn8() {
    var name = '张三';
    var age = 18;

    chindfn() {
      var name = "李四";
      print('name:$name, age:$age'); // name:李四, age:18
    }

    print('name:$name'); // name:张三

    chindfn();
  }

  fn8();
```
<br/>

### 4.7 闭包
  闭包即 一个函数里面 `ruturn` 另外一个函数，且 `return` 的函数中引用了它原有作用域中的变量，该特性和 `JavaScript` 中类似

``` dart
  fn9(String name) {
    return () {
      print('name: $name');
    };
  }

  var result = fn9('dart');
  result();     //name: dart
```
<br/>

## 5. 运算符
dart 中运算符基本上其它语言有的都有，但是有一些运算符是需要稍微注意的，具体的运算符请 [查看](https://dart.cn/guides/language/language-tour#operators)
 以下为几个需要注意的运算符
<br/>

### 5.1 级联运算符
 `..` 可以在同一个对象上连续调用多个变量，或者方法

``` dart main.dart
  Map<String, dynamic> fn1() {
    return {"name": null, "age": null};
  }

  fn1()
    ..['name'] = 'dart'
    ..['age'] = 18;
```
<br/>

### 5.2 `??=` 赋值运算符
`??=` 运算符会在当值为 `null` 时给它赋值
``` dart 
  var age = 19;
  age ??= 20;
  print(age); //19

  var name = null;
  name ??= 'dart';
  print(name); //dart
```









































































































