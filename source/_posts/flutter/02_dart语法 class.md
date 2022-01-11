---
title: dart 中的 class
date: 2021-12-19 15:24:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---
dart 中的 class
 
<!-- more -->


# class

可以简写 `new`关键字，`dart`中的类没有 `public`，`private`，`protected`修饰符



## 简写构造函数

```Dart
final p = Person2('lfm', 18, 1.88);


class Person {
  String name;
  int age;
  double height;
  
  Person(this.name, this.age, this.height);
  
}
```




## 命名构造函数

```Dart
final p = Person.withHeigth('lfm', 18, 1.88);


class Person {
  String name;
  int age;
  double height;
  
  Person(this.name, this.age, this.height);
  
  Person.withHeigth(this.name, this.age, this.height);
}
```




## 常量构造函数

需要加上 `const`，且成员属性需要加上 `final`

在实例化对象时省略不是 `new` 是`const`

使用常量构造函数时，如果传入的参数一致，则返回的是同一个对象，这是 `dart`内部做的优化

```Dart
  const p = Person.withConst('lfm', 18, 1.88);
  const p1 = Person.withConst('lfm', 18, 1.88);
  print(identical(p, p1));  // true


  class Person {
    final String name;
    final int age;
    final double height;
    
    const Person.withConst(this.name, this.age, this.height);
  }


```




## 初始化列表

在构造函数的后面加上`:`

```Dart
  class Person {
  final String name;
  final int age;
  final double height;
  
    
  Person.withHeigth(this.name, {int age = 18, double height = 1.88})
      : this.age = age,
        this.height = height;
 
}


```




## 构造函数重定向

```Dart
final p = Person2('lfm', 18, 1.88);


class Person {
  final String name;
  final int age;
  final double height;
  
   // 构造函数的重定向
  Person(String name, int age, double height) : this._internal(name, age, height);

  Person._internal(this.name, this.age, this.height);
  
}


```




## 工厂构造函数

通过 `factory`关键字修饰，可以手动 `return`对象，例如 `Map`

如传入 相同的名称或者学校，返回同一个对象

```Dart
final p2 = Person2.withName('lfm');
final p3 = Person2.withName('lfm');
print(identical(p2, p3));  // true


class Person2 {
  final String name;
  final String school;

  // 姓名和学校的缓存
  static Map<String, Person2> _nameCache = {};
  static Map<String, Person2> _schoolCache = {};

  factory Person2.withName(String name) {
    if (_nameCache.containsKey(name)) {
      return _nameCache[name]!;
    } else {
      Person2 p = Person2(name, 'default');
      _nameCache[name] = p;
      return p;
    }
  }

  factory Person2.withSchool(String school) {
    if (_schoolCache.containsKey(school)) {
      return _schoolCache[school]!;
    } else {
      Person2 p = Person2('default', 'school');
      _schoolCache[school] = p;
      return p;
    }
  }

  Person2(this.name, this.school);
}

```






## get set

在需要拦截的属性前 加上 `get/set`，可以简写箭头函数，`get`不能加小括号

```Dart
class Person {
  String name = '';

  set setName(String name) => this.name = name;
  
  // 简写
  get getName => this.name;
  
  // 不能加小括号
  // String get getName {
  //   return this.name;
  // }

}

```




## extends 继承

`dart`中只支持单继承

子类需要在初始化列表中调用父类的构造函数

```Dart
class Car {
  final String barnd;

  Car(this.barnd);
}

class BWM extends Car {
  final String model;

  BWM(this.model) : super('宝马');
}
```




## abstract 抽象类

抽象类不能被实例化，且子类必须实现抽象类中声明的函数

```Dart
abstract class Animal {
  void eat();
  void sleep();
}

// 实现类必须重写
class Woman extends Animal {
  @override
  void eat() {
    // TODO: implement eat
  }

  @override
  void sleep() {
    // TODO: implement sleep
  }
} 
```


> 抽象类如果需要实例化，则需要通过工厂函数来实现，如 `Map`就是通过工厂函数实现的，`extenal factory Map();` 通过将函数的声明和实现进行分离，来针对不同的平台做不同的实现




## 所有class 都是隐式接口

`dart` 中所有的类都是隐式接口，通过 `implements` 可以实现多继承，且实现的类必须实现抽象类的所有方法

```Dart
  final c = C();
  
  class A {
    void a() {}
  }
  
  class B {
    void b() {}
  }
  
  class C implements A, B {
    void a() {}
  
    void b() {}
  }
```




## mixin

通过 `mixin`可以实现活动，即：一个类中混入多个类的其它方法

```Dart
class A {
  void a() {}
}

class B {
  void b() {}
}

class C with A, B {}
```




## static 静态属性和静态方法

通过 `static` 关键字来进行修饰

```Dart
print(Book.color);
Book.foo();

class Book {
  static String color = 'red';
  static foo() {}
}
```






