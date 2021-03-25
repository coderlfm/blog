---
title: dart 语法二
date: 2021-02-03 22:41:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/dart2.png
---
class 
<!-- more -->

## 1. 类的基本使用

``` dart
main() {
  var p1 = Person();
  // var p1 = new Person(); 可以简写 new 关键字
  p1.name = 'dart';

  print('p1: ${p1.name}');    //p1: dart
  p1.sayName();     // dart
  
}

class Person {
  var name = 'hello';

  sayName() {
    print(this.name);
  }
}
```

## 2. 构造函数
简单的构造函数使用和 java 中的使用类似

### 2.1 构造函数的基本使用

``` dart
main() {
  var p1 = Person('dart');
  print(p1.name); // dart
}

class Person {
  var name = 'hello';

  Person(String name) {
    this.name = name;
  }

  sayName() {
    print(this.name);
  }
}
```

<article class="message is-warning">
  <div class="message-body">
    注意： 当写了构造函数后，new 对象实例的时候必须传入参数
  </div>
</article>
<br/>

### 2.2 构造函数可选参数
其实这个类似与 `方法的重载`，但是 dart 中没有 `方法的重载`
可我们在实际开发中，是有可能会遇到需要使用 `方法的重载` 这种情况的
那我们可不可以通过其它方式来实现类似于 `方法的重载` 呢，其实是有的

1. 方式一： 可选参数
``` dart
main() {
  var p1 = Person(name: 'dart');
  print(p1.name); // dart
}

class Person {
  var name = 'hello';
  var age = 18;

  Person({name: String, age: Number}) {
    this.name = name;
    this.age = age;
  }

  // 以上写法可以简写成下列写法
  Person({this.name, this.age});

}
```
<br/>

2. 方式二：命名构造函数
通过命名构造函数我们可以根据自己的需求来创建不同的命名构造函数
``` dart
main() {
  var p1 = Person.createName(name: 'dart');
  print(p1.name); // dart
}

class Person {
  var name = 'hello';
  var age = 18;

  Person.createName({this.name});
  Person.createAge({this.age});
}
```
<br/>

### 2.3 常量构造函数 
使用常量构造函数，在构造函数前面必须加上 `const` 关键字
若要省略 `const` 关键字，则该对象的实例也必须是 `const` 来修饰 

``` dart
main() {
  const p1 = Person('dart', 18);
  const p2 = Person('dart', 18);
  // const p2 = const Person('dart', 18); 此处可省略 const

  print(identical(p1, p2)); // true
}

class Person {
  final String name;
  final int age;

  const Person(this.name, this.age);
}
```

<article class="message is-warning">
  <div class="message-body">
    <a href="https://api.dart.cn/stable/2.10.5/dart-core/identical.html">identical</a>： 检测两个对象的堆中的引用地址是否一致
  </div>
</article>
<br/>

### 2.4 构造函数的重定向
当我们想将某个构造函数委托给其它构造函数时，可以使用 构造函数的重定向
``` dart
main() {
  var p1 = Person.create('dart', 18);
  print(p1.name); // dart
}

class Person {
  var name = 'hello';
  var age = 18;

  Person(this.name, this.age);

  // 将命名构造函数 重定向到主构造函数
  Person.create(name, age) : this(name, age);
}
```
<br/>

### 2.5 工厂构造函数
使用 `factory` 关键字可以来定义工厂构造函数

``` dart
main() {
  var p1 = Person.userName('dart');
  print(p1.name); // dart
}

class Person {
  String name = 'dart';
  int age = 18;

  factory Person.userName(String name) {
    return Person._internal(name);
  }

  // 命名构造函数
  Person._internal(this.name);
}

```
<br/>

## 3. 初始化列表
当我们class 中的一些实例变量是使用 `final` 或者 `const` 修饰的
但我们又想在创建实例的时候动态传进来的时候我们就可以用到初始化列表了，这个特性和 c++ 中类似

``` dart
main() {
  var p1 = Person(name: 'dart', age: 18);
  print(p1.name); // dart
}

class Person {
  final name;
  final age;

  Person({name: String, age: int})
      : this.name = name,
        this.age = age;

}
```
<br/>

## 4. 方法

### 4.1 方法的 `getter` 和 `setter`
``` dart
main() {
  var p1 = Person();
  print('${p1.number}, ${p1.numberMax}');
  p1.numberMax = 50;
  print('${p1.number}, ${p1.numberMax}');
}

class Person {
  double number = 10;

  double get numberMax => number * 10;
  set numberMax(double value) => number = value / 10;
}
```
<br/>

### 4.2 方法的重写
`dart` 中方法的重写和 `java` 中类似
``` dart
main() {
  var p1 = Person();
  print(p1);
}

class Person {
  String name = 'dart';

  @override
  String toString() {
    return '$name';
  }
}
```
<br/>

## 5. 抽象类
使用关键字 `abstract` 标识类可以让该类成为 抽象类，抽象类 `无法被实例化`。
抽象类常用于声明接口方法、有时也会有具体的方法实现(当某些方法内已经有空实现的话，子类继承抽象类的时候可以不实现给方法)。
如果想让抽象类同时可被实例化，可以为其定义 [工厂构造函数](https://dart.cn/guides/language/language-tour#constructors)。

``` dart
main() {
  var p1 = Parent('dart');
  p1.sayName();
}

abstract class Person {
  String name;

  Person(this.name);

  void sayName();

  // 其他类继承该类时可不实现该方法
  void sayHello() {
    print('hello dart');
  }
}

class Parent extends Person {
  Parent(String name) : super(name);

  @override
  void sayName() {
    print(name);
  }
}

```
<br/>

## 6.类变量和方法
`static` 关键字是用来修饰类变量和方法的，使用 `static` 修饰的变量和方法只能通过类来访问，不能通过实例来访问
使用 `static` 修饰的方法只能访问 静态变量，不能对实列进行操作(因为没有 this)

``` dart
main() {
  print(Person.nation); // china
  Person.sayNation();   // nation:china
}

class Person {
  static final nation = 'china';

  static void sayNation() => print('nation:$nation');
}
```

<article class="message is-warning">
  <div class="message-body">
  <code>dart</code> 中没有 <code>private</code>、  <code>public</code>、 <code>protected</code> 这些关键字修饰属性和方法
  <p>dart 中使用 `_`开头声明的变量或方法表示私有变量和方法</p>
  </div>
</article>
















































































