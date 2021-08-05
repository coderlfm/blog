---
title: TypeScript 中交叉类型的妙用
date: 2021-08-05 10:12:54
toc: true
tags:
  - TypeScript

categories:
  - TypeScript

cover: '/cover-imgs/typescript.jpg'
---

交叉类型在我们定义复杂类型的时能够起到至关重要的作用
<!-- more -->


# 交叉类型的基本使用
交叉类型顾名思义，就是既有这个类型，又有另外一个类型

```TypeScript
  interface Color {
    color: string;
  }

  interface Text {
    text: string;
  }

  type Font = Color & Text;

  function renderMsg(context: Font) {
    console.log(context.color, context.text);
  }

  renderMsg({ color: 'green', text: '成功' });
```



# 合并联合类型

## 示例一

我们可以使用一个联合类型来合并两个联合类型，这样后，会求出两个联合类型中的交集，只有交集才允许赋值

```TypeScript
  type UnionA = 'px' | 'em' | 'rem' | '%';
  type UnionB = 'vh' | 'em' | 'rem' | 'pt';

  type IntersectionUnion = UnionA & UnionB;

  let union: IntersectionUnion = 'rem'; // em, rem
```



## 示例二

如果两个两个类型中都没有重复的值，则交叉出来的类型为 `never`

```TypeScript
  type UnionA = 'px' | 'pt';
  type UnionB = 'em' | 'rem';

  type IntersectionUnion = UnionA & UnionB;

  // let union: IntersectionUnion = 'rem'; // 已声明“union”，但从未读取其值。ts(6133)
```



# 交叉类型和联合类型的进阶使用

交叉操作符优先级高于联合操作符

## 示例一

```TypeScript
  // 交叉操作符优先级高于联合操作符
  type UnionIntersectionA = ({ id: number } & { name: string }) | ({ id: string } & { name: number });
  type UnionIntersectionB = ('px' | 'em' | 'rem' | '%') | ('vh' | 'em' | 'rem' | 'pt'); // 调整优先级
  
  
  // 这里需要注意的是这里，UnionIntersectionA 的联合结果为 { id: number, name: string } | { id: string, name: number }
  // 所以当 id 为 number 的时候，name 就必须是 name
  let union1: UnionIntersectionA = { id: '1', name: 1 };
  let union2: UnionIntersectionA = { id: 1, name: '小明' };
  // let union3: UnionIntersectionA = { id: 1, name: 1 };      // ts(2322) 错误
  let union5: UnionIntersectionB = 'em';
```



## 示例二

```TypeScript
  type UnionIntersectionC = (({ id: number } & { name: string }) | { id: string }) & { name: number };
  type UnionIntersectionD =
    | ({ id: number } & { name: string } & { name: number })
    | ({ id: string } & { name: number }); // 满足分配率

  //
  type UnionIntersectionE = ({ id: string } | ({ id: number } & { name: string })) & { name: number }; // 满足交换律

  let union1: UnionIntersectionC = { name: 1, id: '11' }; // name: number id: string | number
  let union2: UnionIntersectionD = { name: 1, id: '11' }; // name: number id: string | number
  let union3: UnionIntersectionD = { name: 1, id: '11' }; // name: number id: string | number
```



# 交叉与联合类型 运算优先级

```TypeScript
  type UnionIntersection = (({ id: number } & { name: string }) | { id: string }) & { name: number };
  // 1.运算  ({ id: number } & { name: string }) 交叉出: { id: number, name: string }
  // 2.运算  { id: number, name: string } | { id: string }  联合出: { id: number|string, name: string }
  // 3.运算  { id: number|string, name: string } & { name: number }  交叉出: { id: number|string, name: number }
  // 4.类型  { id: number|string, name: number }
```



> 此处需要注意 如果是两个 接口类型进行交叉，则会将它们合并成一个接口类型，如果是两个联合类型，则会求它们的交集



# 交叉类型类型缩减的妙用

我们使用 字符串字面量类型 联合 `string` 类型时，那这个类型会被缩减成 `string`，这是因为 `TypeScript` 会帮我们自动的做一些合理的 "优化"，而这个 "优化"，这是因为 字符串字面量类型是 `string` 类型的子类型，**但是这会让我们的编辑器无法为我们做一些提示** 

```TypeScript
  type borderColor = 'red' | 'green' | string; // 类型为 string
  const color: borderColor = 'red'; // 编写时不会有字面量的类型提示
```


如果我们需要有原来编写的字符串字面量的提示，`TypeScript` 有一些 hack 的方式
我们只需要为它的父类型加上 `& {}`, 那么这个类型缩减就可以被控制

```TypeScript
  type borderColor = 'red' | 'green' | (string & {}); // 类型为 "red" | "green" | (string & {})
  const color: borderColor = 'red'; // IDE 会有提示
```



# 思考

定义一个对象，已知对象中 `age` 属性的类型是 `number`，其它属性都为 `string` 类型，**这个类型需要怎么定义？** 


```TypeScript
  type Info = { age: number } | { age: never; [key: string]: string };

  const info: Info = { age: 1, name: '小明' };
```


>  这里其实考察到了对 `never` 的理解，只需要理解了 `never` 类型可以作为任意类型的子类型，那么这个类型就能够轻而易举的定义了


