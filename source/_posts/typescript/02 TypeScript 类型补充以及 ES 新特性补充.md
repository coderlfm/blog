---
title: TypeScript 类型补充以及 ES 新特性补充
date: 2021-07-17 11:24:54
toc: true
tags:
- TypeScript

categories:
- TypeScript

cover: "/cover-imgs/typescript.jpg"

---
TypeScript 类型补充以及 ES 新特性补充
<!-- more -->

## type 关键字

当我们在多个地方需要用到同一类型时，重复编写类型注解就会显得很冗余`TypeScript` 中有一个 `type` 关键字 可以来帮助我们来给这些类型起别名，

`Dart` 中也有类似的的语法 `typedef `

我们先来查看以下代码

```TypeScript
let info: {
  name: string;
  age: number;
  like: string;
} = {
  name: '小明',
  age: 18,
  like: 'rap',
};

function sayName(info: { name: string; age: number; like: string }) {
  console.log('My name is ', info.name);
}
```



可以看到，我们在两个地方使用重复的类型注解，这会显得很冗余，这种情况我们可以使用 `type` 关键字来帮助我们给类型起别名，我们的代码可以改写成以下方式

```TypeScript
type Info = {
  name: string;
  age: number;
  like: string;
};

let info: Info = {
  name: '小明',
  age: 18,
  like: 'rap',
};

function sayName(info: Info) {
  console.log('My name is ', info.name);
}

```




## 类型断言 `as`

### 示例一

`as`关键字可以让我们将一种类型转换成一个更具体的类型或者 更不具体的类型(`any`)

```TypeScript
const img = document.getElementById('img')

img.src = 'https://www.typescriptlang.org/favicon-32x32.png'
// 报错，因为默认取到的是 HTMLElement，该类型中没有 src属性，

```



此时就可以使用 as 明确的告诉 ts 我们取到是什么类型

```TypeScript
const img = document.getElementById('img') as HTMLImageElement;

img.src = 'https://www.typescriptlang.org/favicon-32x32.png';
```



### 示例二

```TypeScript
class Person {}

class Man extends Person {
  sayHello() {
    console.log("Hello, I'm a man");
  }
}

// Man 中才有 sayHello 方法，如果不告诉 ts 我们这个参数具体类型直接调用则会报错，且没有语法提示
function sayHello(person: Person) {
  (person as Man).sayHello();
}
```




## 非空断言 `!.`

在 ts 中，如果明确一个值不会是 `null` 和 `undefined` 时，可以使用非空断言来避免 `ts`的语法检查

```TypeScript
type Info = {
  name: string;
  age: number;
  like?: string;
};

let info: Info = {
  name: '小明',
  age: 18,
};

function sayLike(info: Info | undefined) {
  // console.log(info.name);    // 严格模式下报错
  console.log(info!.like);      // 编译正常,运行时报错
}

sayLike(undefined); // 运行时报错
sayLike(info);      // 运行时正常
```


> 练习阶段如果没有 `tsconfig.json` 的情况不会出现报错，
使用 `tsc --init` 命令生成 `tsconfig.json` 后，默认会开启严格模式，严格模式下会出现ts的报错




## `ES2020` 可选链

在 `ES2020` 中新增了可选链操作符，可以减少我们使用 `if` 使用 

可选链的语法为，如果左边不为 `null` 和 `undefined` 才会取右边的值，例如以下示例

```TypeScript
console.log(info?.name)   // info 不为空才会取 name
```



当我们熟悉了可选链的语法后，我们来改写一下以上示例

```TypeScript
type Info = {
  name: string;
  age: number;
  like?: string;
};

let info: Info = {
  name: '小明',
  age: 18,
};

function sayLike(info: Info | undefined) {
  // console.log(info.name.);    // 严格模式下报错, 运行正常
  console.log(info?.like); // 编译正常, 运行正常
  
  // console.log(info?.like.length); // 严格模式下报错,, 运行报错，
  console.log(info?.like?.length); // 编译正常, 运行正常
}

sayLike(undefined); //运行时正常
sayLike(info); //运行时正常
```



## ?. 和 !. 的区别

- `?.` optional chaining 是 es 规范支持的一个操作符

- `!.` non-null assertion operator 是 ts 类型支持的一个操作符

&ensp;&ensp;&ensp;&ensp;`!`不一定要和`.`连在一起，但是 `?.` 一定是连在一起的

&ensp;&ensp;&ensp;&ensp;

## 空值合并操作符 `??`

当左边为 `null` 或 `undefined` 时会使用右边的值，否则返回左边的值，例如以下示例

```TypeScript
console.log(name ?? '小明') 
```




### `??` 和 `||` 的区别

- `||` 会先将左边的值转换成布尔值再判断左边是否为 true，当左边为 true，则返回左边的值，否则返回右边的值，所以 `||` 会判断 `0`, `''`, `null`, `undefined`

- `??` 只判断 `null` 或 `undefined`，


```TypeScript
function sayName(name: string | undefined | null) {
  console.log(name ?? '请输入姓名'); // 编译正常, 运行正常
}

sayName(undefined); // '请输入姓名'
sayName(null);      // '请输入姓名'
sayName('');        // ''
sayName('小明');     // '小明'
```




## 类型守卫

`ts` 一共支持以下几种方式来进行类型缩小

- `typeof`

- `true`判断值是否为空

- 平等类型的对比 `=== `, `==`, `!==`, `!=`

- `in`关键字

- `instanceof`

- `<`,`>`

- `if`

- `as `

- 字面量类型

- `never`

- 穷举, `switch`

### 示例一 , `typeof`

```TypeScript
// 打印所有的参数
function seeId(id: number | string) {
  // id = id.toLocaleLowerCase();  // 报错

  if (typeof id === 'string') {
    id = id.toLocaleLowerCase(); // 正常
    console.log(id);
  } else {
    console.log(id);
  }
}
```



### 示例二, `in`

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




## this

### this 的默认推导

```TypeScript
type Info = {
  name: string;
  age: number;
  sayName: () => void;
};

let info: Info = {
  name: '小明',
  age: 18,
  sayName() {
    console.log(this.name);
  },
};

info.sayName();
```



### this的不明确类型

在 `TypeScript`严格模式中，必须显示的指定 `this`

```TypeScript
 function sayName(this: Info, msg: string) {
  // 显示的指定 this，且不会占用第一个参数的位置
  console.log(this.name, msg); // 如果没有指定this则报错
}

sayName.call(info, 'hello');   // 绑定 this
```



## 函数的重载

当我们一个函数可以接收多个参数时，可以使用函数的重载，在很多语言中都有函数的重载，例如 `java`

在 `TypeScripte` 中函数的重载编写方式如下，`1-2`行都是函数不同参数以及返回值列表，而 `3-6` 行才是函数的具体实现。


```TypeScript
function info(name: string): void;
function info(name: string, age: number): void;
function info(name: string, age?: number) {
  console.log('name:', name);
  console.log('age:', age);
}

info('ts');
info('ts', 18);
```


