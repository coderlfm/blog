---
title: TypeScript 中的 枚举类型
date: 2021-07-24 10:38:54
toc: true
tags:
- TypeScript

categories:
- TypeScript

cover: "/cover-imgs/typescript.jpg"

---

TypeScript 中的 枚举类型
<!-- more -->


## 枚举类型的基本使用

枚举类型是 `TypeScript`中特有的类型

`TypeScript`提供了 `数字枚举` 和 `字符串枚举`

枚举类型使用 `enum` 来声明

枚举类型如果未赋值，**则默认从数字 0 递增** 

```TypeScript
enum Direction {
  TOP, // 0
  LEFT, // 1
  RIGHT, // 2
  BOTTOM,
}

```



这个枚举值转换成 `JavaScript` 后为如下

```TypeScript
var Direction;
(function (Direction) {
  Direction[(Direction['TOP'] = 0)] = 'TOP';
  Direction[(Direction['LEFT'] = 1)] = 'LEFT';
  Direction[(Direction['RIGHT'] = 2)] = 'RIGHT';
  Direction[(Direction['BOTTOM'] = 3)] = 'BOTTOM';
})(Direction || (Direction = {}));
```



 也可以显式的指定值，后续的值也会自动递增

```TypeScript
  enum Direction {
    TOP = 100, // 100
    LEFT, // 101
    RIGHT, // 102
    BOTTOM,
  }
```


但是如果我们不是给第一个成员赋值，而是给其它成员赋值的时候，就可能会出现意想不到的问题了，**所以一般我们不会手动的给枚举类型赋值** ，如下例子

```TypeScript
  enum Direction {
    TOP,
    LEFT,
    RIGHT = 1,
    BOTTOM,
  }

 // 编译成 js 后，会发现 key 值重复了
  var Direction;
  (function (Direction) {
      Direction[Direction["TOP"] = 0] = "TOP";
      Direction[Direction["LEFT"] = 1] = "LEFT";
      Direction[Direction["RIGHT"] = 1] = "RIGHT";
      Direction[Direction["BOTTOM"] = 2] = "BOTTOM";
  })(Direction || (Direction = {})) 
```



### 数字枚举在函数中的使用

```TypeScript
enum Direction {
  TOP, // 0
  LEFT, // 1
  RIGHT, // 2
  BOTTOM,
}

function toDirection(direction: Direction) {
  switch (direction) {
    case Direction.TOP:
      console.log('top');
      break;

    case Direction.LEFT:
      console.log('left');
      break;

    case Direction.RIGHT:
      console.log('right');
      break;

    case Direction.BOTTOM:
      console.log('bottom');
      break;

    default:
      const check: never = direction;
  }
}

toDirection(Direction.BOTTOM);  // nottom

console.log(Direction.TOP); // 0

console.log(Direction.TOP === 0);  // true
```




## 字符串枚举

相对于 数字枚举， **字符串枚举 在运行和调试阶段更具有明确的含义和可读性** 

```TypeScript
  enum Direction {
    TOP = 'TOP',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    BOTTOM = 'BOTTOM',
  }

  // 编译成 js 后
  var Direction;
  (function (Direction) {
      Direction["TOP"] = "TOP";
      Direction["LEFT"] = "LEFT";
      Direction["RIGHT"] = "RIGHT";
      Direction["BOTTOM"] = "BOTTOM";
  })(Direction || (Direction = {})); 
```




## 异构枚举

从技术上讲，`TypeScript` 支持异构枚举，异构枚举就是字符串枚举和数字枚举可以同时存在，但是连`TypeScript` 官方也不知道在什么场景可用到这种枚举🤣

```TypeScript
  enum Flag {
    YES = 1,
    NO = 'NO',
  }

  // 编译成 js 后
  var Flag;
  (function (Flag) {
      Flag[Flag["YES"] = 1] = "YES";
      Flag["NO"] = "NO";
  })(Flag || (Flag = {})); 
```




## 计算值枚举

计算值枚举在 在实际中用的较少，有关计算值枚举的更多信息，可以访问 [这里](https://www.typescriptlang.org/docs/handbook/enums.html#computed-and-constant-members)

```TypeScript
  enum Direction {
    TOP,
    LENGTH = 'abc'.length,  // 计算值枚举
  }
```




## 常量枚举

`TypeScript` 中也支持常量枚举，使用常量枚举，使用常量枚举 **不允许成员有计算值** 

使用常量枚举时，在编译阶段会将该枚举删除，**这可以避免生成一些额外的代码** ，在代码体积方面，会比常规的枚举类型性能稍好

常量类型可以在 `enum` 前通过 `const`关键字来修饰

```TypeScript
  const enum Direction {
    TOP,
    LEFT,
    RIGHT,
    BOTTOM,
    // LENGTH = 'abc'.length,  // 常量枚举成员初始值设定项只能包含文字值和其他计算的枚举值。ts(2474)
  }
  console.log(Direction.TOP);
  console.log(Direction.LEFT);

 
  // 转换成 js 时，可以看到没有生成额外的冗余代码
  {
    ('use strict');
    console.log(0 /* TOP */);
    console.log(1 /* LEFT */);
  } 
```




## declare 的使用

 `declare` 也可以用来声明类型，使用 `declare` 声明的类型只是在编译阶段用作检查，在运行阶段会被删除。

需要注意以下几点

- `declare` 只能在 `.d.ts` 结尾的声明文件中使用

- `d` 是 `definition/定义` 的简写

- 使用 `declare` 声明的所有类型都是全局类型

&ensp;&ensp;&ensp;&ensp;所以有些值可能会冲突，例如枚举类型可能会重复声

&ensp;&ensp;&ensp;&ensp;

我们先在 `xxx.d.ts` 中声明 外部枚举 `$`，然后在其它文件就可以使用了

```TypeScript
  declare let $: (select: string) => any;
```



声明了外部枚举后，我们就可以在 其它文件中使用它了

```TypeScript
  $('#id').addClass('show'); // ok
```



### declare 声明 namespace

在早期还没有 `es6` 的时候，`TypeScript` 使用 `module` 来声明一个模块，后来 `es6` 也使用了 `module` 关键字，`TypeScript` 就把 `module` 改成了 `namespace`

现在 `TypeScript` 和 `es6` 一样，只要包含了顶级 `import` 或者 `export`，则会将这个文件生成一个模块，随着`es6`的广泛使用，**致使 ** `namespace`** 基本被淘汰了** ，但是我们在给第三方库声明 `namespace` 的时候就显得非常有用了

```TypeScript
  declare namespace loaddash {
    export function join(list: string[]): string[];
  }
```


```TypeScript
  loaddash.join(['a', 'b', 'c']);
```



## 外部枚举的使用

```TypeScript
declare const enum Day {
  SUNDAY,
  MONDAY,
}
```


```TypeScript
function work(day: Day) {
  if (day === Day.SUNDAY) {
    console.log('今天是周日~');
  }
}

work(0);

console.log(Day.SUNDAY);
```


