---
title: dart 基本语法
date: 2021-12-19 14:24:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---
dart 基本语法

<!-- more -->

## 变量声明

`var` 类型推导

`const`必须赋值常量

`final`可以运行时赋值

`dynamic` 动态类型，最后一次赋值时是它的类型



`dart`没有非零即真和非空即真



```Dart
final date = DateTime.now(); // 正确
const date = DateTime.now(); // 错误

```




### 字符串

单引号

双引号

三引号 类似模板字符串



字符串拼接 '${name}' 或 '$name'  没有运算符的时候可以省略大括号



## 数组

```Dart
List<String> names = ['a','b','c'];

Set<int> nums = {1,2,3,4,5}; 

///  for in 进行遍历
for (String name in names) {

}

names.add();
names.remove();
```




## Map

```Dart
Map<String, dynamic> info = {
  'name': 'lfm',
  'age': 18,
  'height': 1.88
}
```






## 函数

`dart` 没有函数的重载

返回值可以通过类型推导，但是开发时不推荐

```Dart
void fn(String name) {
  print(name);
}

// 位置可选参数
void fn(String name, [int age, double height]){
  print(name, age);
}

// 命名可选参数
void fn(String name, {int age, double height}){
  print(name, age);
}

// 参数的默认值
void fn(String name, {int age = 18, double height = 1.88}){
  print(name, age);
}

fn('lfm', age: 18, height: 2.00);

indentical(p1, p2); // 判断两个对象是否相等；
```




### 函数是一等公民

将函数作为参数传递

将函数作为返回值



### 匿名函数

```Dart
test(() {
  print("匿名函数被调用");
});

test(() => print("匿名箭头函数被调用"));

void test(Function fn) {
  fn();
}
```




### 箭头函数

和js不一样，只有函数体只有一行才能写成箭头函数，不能有多行。

```Dart
  test(() => print("匿名箭头函数被调用"));

```




### typedef

```Dart
test2((num1, num2) => num1 + num2);


void test2(int sum(int num1, int num2)) {
  sum(10, 20);
}

/****************************************/

test3((num1, num2) => num1 + num2);

typedef sumType = int Function(int num1, int num2);

void test3(sumType sum) {
  sum(10, 20);
}
```




## 运算符

### ??=

```Dart
  // 当 name 是空时才赋值为 小明
  var name = null;
  name ??= '小明';
```


### ??

```Dart
  // 前一个变量为 null 时则使用后面的值
  var name2 = name ?? '小红';
```




### .. 级联调用

```Dart
  final p1 = Person()
    ..name = '小彤'
    ..sayHello()
    ..sayName();
  
  
  class Person {
    String name = '';
  
    void sayName() => print(this.name);
    void sayHello() => print('hello');
  }
```




## enum 枚举

通过 `enum`来定义枚举，所有的枚举都有 `values`每个枚举的`item`都拥有其对应的`index`

```Dart
  enum Colors { red, blue, green }

  final color = SystemColors.blue;
  print(SystemColors.values);
  print(color.index);

```




