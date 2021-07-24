---
title: TypeScript 中的 interface
date: 2021-07-20 17:50:54
toc: true
tags:
- TypeScript

categories:
- TypeScript

cover: "/cover-imgs/typescript.jpg"

---
TypeScript 中的 interface
<!-- more -->


## interface 的基本使用

`interface` 一般用来声明对象类型

```TypeScript
  interface Iinfo {
    name: string;
    age?: number; // 可缺省的
  }

  const info1: Iinfo = {
    name: 'ts',
    age: 18,
  };

  const info2: Iinfo = {
    name: 'ts',
  };
```




## interface 函数类型

`interface`也可以用来声明函数类型，但是 **多数情况下我们会使用 type 类型别名来声明函数类型** 

```TypeScript
  interface ISum {
    (num1: number, num2: number): number;
  }

  const sum: ISum = (num1, num2) => {
    return num1 + num2;
  };
```




## interface 只读属性

```TypeScript
  interface Iinfo {
    readonly name: string;
    age: number;
  }

  const info: Iinfo = {
    name: 'ts',
    age: 18,
  };

  // info.name = 'java'   // 只读属性被赋值后不允许再次修改
```




## interface 索引签名

索引签名一般用于，我们 **不知道对象中具体的属性名，但是我们知道对象中的具体结构** 

```TypeScript
  interface IInfo {
    [name: string]: string;
  }

  const info: IInfo = {
    name: '小明',
    like: '唱歌',
    // age: 18,    // ts 语法报错，不能将类型“number”分配给类型“string”。ts(2322)
  };
```



### 索引签名 的 字符串 和 数字类型

索引签名支持 字符串 和 数字类型，但是 **数字类型为索引时，实际上在索引对象的时候 ** **JavaScript** **还是将其转换为 字符串类型** ，所以如果同时使用了两种类型，则两种索引类型的值需要一致

```TypeScript
  interface IInfo {
    [name: string]: string;
    // [age:number]: number;      // ts 语法报错 数字索引类型“number”不能赋给字符串索引类型“string”。ts(2413)
  }

  const info: IInfo = {
    name: '小明',
    like: '唱歌',
    // age: 18,    // ts 语法报错，不能将类型“number”分配给类型“string”。ts(2322)
  };


{ 
  interface IInfo {
    [id: number]: string;
  }

  const info: IInfo = {
    1001: '小明',
    // like: '唱歌', //   对象文字可以只指定已知属性，并且“like”不在类型“IInfo”中。
  }; 

} 
```



### 索引签名 的联合类型

如果我们 **需要让对象中的值支持多种类型** ，我们可以使用联合类型

```TypeScript
  interface IInfo {
    [name: string]: string | boolean; // 同时支持字符串和布尔值类型
    man: boolean;
    name: string;
    // age: number;  // 类型“number”的属性“age”不能赋给字符串索引类型“string | boolean”。ts(2411)
  }

  const info: IInfo = {
    man: true,
    name: '小明',
    // age:18,  // 不能将类型“number”分配给类型“string | boolean”。ts(2322)
  };
```



### 索引签名 的 readonly 只读类型

当我们 使用 `readonly` 来修饰索引类型的时候，**可以防止这个对象被修改** 

```TypeScript
  interface IInfo {
    readonly [name: string]: string; 
  }

  function getInfo(): IInfo {
    return {
      name: '小明',
    };
  }

  const info: IInfo = getInfo();

  // info.name = '小红';   // ts 语法报错 类型“IInfo”中的索引签名仅允许读取。ts(2542)
```




## interface 接口的继承

在 `Typescript`中，接口可以继承和被继承

```TypeScript
  interface Animal {
    run: () => void;
  }

  interface Person extends Animal {
    name: string;
  }

  const info: Person = {
    name: '小明',
    run() {},
  };
```




### interface 的多继承

一个接口可以继承多个接口

```TypeScript
  interface Animal {
    run: () => void;
  }

  interface Person {
    name: string;
  }

  interface Info extends Animal, Person {
    age: number;
  }

  const info: Info = {
    name: '小明',
    run() {},
    age: 18,
  };
```




## interface 接口的实现

 在 `Typescript` 中，接口可以用交给类来实现

```TypeScript
  interface IInfo {
    name: string;
    age: number;
    sayName: () => void;
  }
  
  class Info implements IInfo {
    name: string;
    age: number;
  
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  
    sayName() {
      console.log('my name is', this.name);
    }
  }
  
  const info: Info = new Info('小明', 18);
  info.sayName(); // my name is 小明
```




## interface 和 type 的区别

可以看到，**在多数情况下，接口类型 和 类型别名 的功能类似** ，但是在某些情况下还是有所区别   

例如我们使用一些第三方库的时候，需要做一些类型扩展，重复定义接口类型，那么它的属性会叠加，这个特性可以很方便的使我们扩展

```TypeScript
  interface IInfo {
    id: number;
  }
  
  interface IInfo {
    name: string;
  }
  
  const info: IInfo = {
    id: 1001,
    name: '小明',
  };

```


```TypeScript
type teacher = { vehicle: () => void };
type coder = { codering: () => void };

function work(people: teacher | coder) {
  // people.codering(); //报错
  if ('codering' in people) {
    people.codering();
  } else {
    people.vehicle();
  }
}
```



