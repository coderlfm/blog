---
title: TypeScript 中的 class
date: 2021-07-19 17:45:54
toc: true
tags:
- TypeScript

categories:
- TypeScript

cover: "/cover-imgs/typescript.jpg"

---
TypeScript 中的 class

<!-- more -->


## class 的基本使用

```TypeScript
class Person {
  name: string;
  age: number; // 需要初始化值，否则 ts 检查报错

  constructor(name: string, age: number) {
    this.name = name; // 对于这种情况 Dart 中可以简写
    this.age = age;
  }

  sayName() {
    console.log(this.name);
  }
}

const xiaomin = new Person('小明', 18);
xiaomin.name = '小东';
// xiaomin.age = 18;

xiaomin.sayName();
```




## 类的继承

一个类可以继承另外一个类，继承的类叫做 `子类/派生类`，被继承的类叫做 `父类/基类/超类`


在 `TypeScript` 中 如果 `子类` 写了 `构造函数`，则需要手动调用 `super`

```TypeScript
class Person {
  name: string;
  age: number; 

  constructor(name: string, age: number) {
    this.name = name; 
    this.age = age;
  }

  sayName() {
    console.log(this.name);
  }
}

class Man extends Person {
  // constructor(name: string, age: number){
  //   super(name, age)  // 如果写了构造函数，就需要手动调用 super();
  // }

  printSex() {
    console.log('男生');
  }
}

const man = new Man('小明', 18); //当子类没有构造函数的时，会自动调用父类的构造函数
man.printSex();

```



## public、private、protected 可见性修饰符

### public

public 对于类中的 `成员/属性`，如果没有手动添加过 可见性修饰符，默认就是 `public`

```TypeScript
class Person {
  name: string;
  // public name: string; 上述语法等同于该写法

  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person('小明');

console.log(person);
```



### private

`private` 修饰的成员属性只能在类内部访问，**子类和类的示例无法直接访问使用 ** `private`** 修饰的成员属性或方法** 

`TypeScript` 在类中声明的 `private` 只是编译阶段的 `private`，如果强制忽略 `TypeScript` 的语法检测，子类和类的示例依旧可以访问到

```TypeScript
class Person {
  // 在 js 运行阶段时依旧可以获取到 prefix 属性，这是因为 JavaScript 并不支持真正意义的 private；
  public name: string;
  private nation = '中国';

  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person('小明');
// person.nation = '英国';  // ts 语法报错，运行阶段实际上是可以获取的

console.log(person);
```



### protected

受保护的类型，使用`protected` 修饰的属性可以在子类中访问，但是实例上不可以访问

```TypeScript
class Person {
  public name: string;
  protected sex: string = '男'; // protected 修饰的属性可以在子类中访问，但是实例上不可以访问

  constructor(name: string) {
    this.name = name;
  }
}

class Man extends Person {
  constructor(name: string) {
    super(name);
  }

  saySex() {
    console.log(this.sex);    // 子类可以访问父类中用 protected 修饰的成员
  }
}

const man = new Man('小明');
man.saySex(); // 男
// man.sex = 'woman'; // ts 语法报错，实例不能访问受保护的类型属性或方法
```



### 子类中如何获取 父类中的 私有属性

```TypeScript
class Person {
  public name: string;
  private nation = '中国';

  constructor(name: string) {
    this.name = name;
  }

  getNation() {
    return this.nation;
  }

  setNation(nation: string) {
    this.nation = nation;
  }
}

class Man extends Person {
  printNation() {
    console.log(this.getNation());
  }
}

const man = new Man('小明');
// person.nation = '英国';  // ts 语法报错，运行阶段实际上是可以获取的
// man.printNation();      // 中国

// 通过调用子类中的方法来获取，或者实例也可以直接调用 getNation() 因为 该函数的声明是缺省的，默认是 public，如果将它的修饰符改为 protected 则实例无法调用
console.log(man.getNation());
```




## readonly

类的成员属性可以加上 `readonly`,一旦赋值后则无法再次修改

```TypeScript
class Student {
  name: string;
  readonly grade: string;
  // 如果 可见性修饰符 和 只读修饰符 同时出现，则 readonly 放在可见性修饰符后面

  constructor(name: string, grade: string) {
    this.name = name;
    this.grade = grade;
  }
}

const stu = new Student('小明', '1班');

console.log(`${stu.name}的班级为:${stu.grade}`);

// stu.grade = '2班';    // 无法分配到 "grade" ，因为它是只读属性
```




## static 静态属性/方法

静态属性 和 方法 只能通过类去访问，不能通过类的实例去访问

```TypeScript
class Student {
  public static school = '希望小学';
}

// Student.school = '实验小学';
console.log(Student.school);  // 实验小学
```



### 静态属性注意事项

因为覆盖 `Function` 上的属性和方法时不安全的，所以例如 `name`，`length`，`call`，`bind`等不能定位有静态属性

```TypeScript
class Student {
  // static name = 'hello';  // 静态属性“name”与构造函数“Student”的内置属性函数“name”冲突。ts(2699)
  // static length = 10;
  // static call = 'call';
}
```




## class 中的 getter 和 getter

`getter` 和 `setter` 可以来截取我们队属性的获取和设置

需要注意以下几点

- 如果只写了 `get`，没有写`set`，则该属性为 `readonly`

- 如果 `set` 的参数没有写类型注解，则会根据 `get` 的返回值推导

- `set` 和 `get` 的可见性修饰符必须一致，例如：不允许 `get` 为 `public`，而 `set` 为 `private`

&ensp;&ensp;&ensp;&ensp;

```TypeScript
class Person {
  _home = '';
  
  public get home() {
    return this._home;
  }

  public set home(value) {
    this._home = value;
  }
}

const person = new Person();
person.home = '成都';
console.log(person.home); // 成都
```



## abstract 抽象类

抽象类中的 属性 或者 方法 可以 **不包含具体的实现** ，交给子类来实现

抽象方法 或者 抽象属性 都是没有具体的实现，**且抽象类不能 ** **new** 

由于抽象类不能 `new`，所有一般 抽象类 **是用来做一些基础逻辑的封装** 

```TypeScript
abstract class Info {
  abstract name: string;    // 使用 abstract 修饰，子类必须实现
  abstract sayName(): void; // 抽象类声明 函数和普通函数声明不太一致

  sayHell() {
    console.log('hello');
  }
}

class Person extends Info {
  name;

  constructor(name: string) {
    super();
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}
// new Info();      // 语法报错，不允许 new 抽象类

const person = new Person('小明');
person.sayName();
person.sayHell();
```


