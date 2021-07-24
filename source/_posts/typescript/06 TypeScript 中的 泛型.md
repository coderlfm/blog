---
title: TypeScript 中的 泛型
date: 2021-07-24 11:38:54
toc: true
tags:
  - TypeScript

categories:
  - TypeScript

cover: '/cover-imgs/typescript.jpg'
---

TypeScript  中的   泛型

<!-- more -->

## 泛型的基本使用

泛型是  `TypeScript`  中较为强大的一种类型

泛型可以将  **类型参数化** ，将原来预先写好的类型变成由使用者使用的时候作为参数传入

泛型的基本语法为 `<>` ，中间为泛型的形参

```TypeScript
  function reflect<P>(param: P) {
    console.log(param);
  }
```

这里可以看到，`<>` 中间为泛型的定义，`param`的类型表示为泛型`P`，返回值也为泛型 `P`

当我们调用这个方法的时候，在方法名的后面加上一个 `<>` 将此次的具体类型传入进去

```TypeScript
  reflect<number>(123); // 类型为：function reflect<number>(param: number): void
  reflect<string>('123'); // 类型为：function reflect<string>(param: string): void
```

当然，也可以不显式传入泛型的类型，`TypeScript` 会帮助我们做类型推导

```TypeScript
  reflect(123); // 类型为：function reflect<number>(param: number): void
  reflect('123'); // 类型为：function reflect<string>(param: string): void
```

### 泛型约束数组、对象

泛型还可以用来约束数组，对象等类型

```TypeScript
  function reflect2<P>(param: P[]) {
    console.log(param);
  }

  reflect2([1, 2, 3]); // 类型为：function reflect2<number>(param: number[]): void
  reflect2([1, 2, '3']); // 类型为：function reflect2<string | number>(param: (string | number)[]): void
```

### 多个泛型参数

多个泛型形参，多个泛型可以用逗号隔开

```TypeScript
  function reflect3<P, T>(param: P, type: T): [P, T] {
    return [param, type];
  }

  reflect3(123, 'abc');
  // 类型为 function reflect3<number, string>(param: number, type: string): [number, string]
```

## 泛型 的接口使用

除了可以在函数上使用泛型，我们还可以在接口中使用泛型

```TypeScript
  interface IInfo<N, A> {
    name: N;
    age: A;
  }

  const info: IInfo<string, number> = {
    name: '小明',
    age: 18,
  };
```

## 泛型 在类中的使用

泛型在类中也是可以使用

```TypeScript
class Person<N> {
  name: N;
  constructor(name: N) {
    this.name = name;
  }

  getName(): N {
    return this.name;
  }
}

// const p = new Person<string>('小明');
const p = new Person('小明'); // 也可以类型推导
```

## 泛型的默认值

可以看到，在接口类型中，我们需要显式的给泛型指定类型，当属性多的话，这种方式会较为低效，那有没有什么方式可以帮助我们设置默认值呢，答案是有的

我们可以在声明泛型的时候, **在  ** `=`**  号的右边设置泛型的默认值**

```TypeScript
  interface IInfo<N = string, A = number> {
    name: N;
    age: A;
  }

  const info: IInfo = {
    name: '小明',
    age: 18,
  };
```

## 泛型约束

我们在使用泛型的时候，可以给泛型添加一些约束，使调用者调用的时候必须符合这些约束

在声明泛型的时候   后面跟上  `extends`  关键字，表示这个泛型的参数需要符合   这个类型

### 基本约束

```TypeScript
  function reflect<P extends string | number>(param: P) {
    console.log(param);
  }
  reflect('123');
  reflect(123);
  // reflect(true); // 类型“boolean”的参数不能赋给类型“string | number”的参数。ts(2345)
```

### 进阶约束

```TypeScript
  function reflect2<P extends { name: string; age: number }>(param: P) {
    console.log(param);
  }
  reflect2({ name: '小明', age: 18 });
  reflect2({ name: '小红', age: 18, like: '唱歌' });
  // reflect2({ name: '小东' });   //  缺少属性 "age"

  interface IPerson {
    name: string;
  }

  function reflect3<P extends IPerson>(param: P) {
    console.log(param);
  }

  const p: IPerson = { name: '小明' };

  reflect3(p);
  reflect3({ name: '小红', age: 18 });
  // reflect3(123);  // 类型“number”的参数不能赋给类型“IPerson”的参数。ts(2345)
```

### 泛型间互相约束

```TypeScript
  function setVal<O extends {}, K extends keyof O, V extends O[K]>(obj: O, key: K, val: V) {
    obj[key] = val;
  }

  const info = {
    name: '小明',
    age: 18,
  };


  // setVal(info,);
  /*
  当我们传入第一个对象的时候，IDE 自动给了我们提示
  setVal(obj: { name: string; age: number; }, key: "name" | "age", val: string | number): void
  */
  setVal(info, 'name', '小红');
  setVal(info, 'age', 19);
  // setVal(info, 'name', true); // 类型“boolean”的参数不能赋给类型“string”的参数。ts(2345)
```
