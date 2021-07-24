---
title: TypeScript 基本数据类型
date: 2021-07-15 14:07:54
toc: true
tags:
- TypeScript

categories:
- TypeScript

cover: "/cover-imgs/typescript.jpg"

---
TypeScript 基本数据类型

<!-- more -->
# TypeScript 基本数据类型


## any 类型

```TypeScript
// 可以赋值为 任意类型
let a:any ;

// 12314
let obj = {
  a:123
}
```



## unknown 类型

 类型只能赋值为 `unknown` 类型和 `any` 类型，

 这个类型可以避免我们将 `unknown` 到处乱用

```TypeScript
let result: unknown;

function foo() {
  return 'hello'
}

function bar() {
  return 123
}

result = foo();
result = bar();

```




## nerver 类型

```TypeScript
// 封装了一个 核心处理函数，只支持 string 和 number 类型，
// 如果手动修改类型，则 check 会报错，需要增加一行 对于新增 的类型处理
function handleMessage (message: string | number | boolean) {
  
  // 穷举检查
  switch (typeof message) {
    case 'string':
      console.log('字符串处理');
      break;

    case 'number':
      console.log('数字处理');
      break;

    case 'boolean':
      console.log('布尔值处理');
      break;
  
    default:
    // 应该绝不可能走到这一步
    // 不应该存在的类型
    const check:never = message;// 如果以上没有判断到，则这里会报错
  }
}

handleMessage(123);
handleMessage('hello');
handleMessage(true);
```



> `never` 类型可分配给任意一个类型; 但是，没有类型可以分配给`never`（除了 `never` 自己）
`never`** 可以作为所有类型的子类型，这一点很重要** 




## tuple类型

元组类型

需要制定 数组中具体类型，元组类型的典型示例

```TypeScript
const info:[ string, number ] = [ 'lfm', 18 ];

function useState<T>(initState:T):[ T, (value: T)=> void ]{
    let state = initState;
  
    function setState(value:T){
      state = value;
    }
  
    return [state, setState];
}

const [counter, setCounter] = useState(1);
setCounter(3);

const [flag, setFlag] = useState(false);
setFlag(true);
```




## 函数类型

### 使用 函数字面量 声明函数

```TypeScript
// 类型推导出返回值为 number
function foo() {
  return 123;  
}

// 显式声明返回值为 number
function foo(): number {
  return 123; 
}

// 函数无返回值则返回值类型为 void，一般可不写，不写会推导为 void
// 如果手动返回则会出现报错
function foo(): void {
  // return 123;  // 报错
}

```



### 使用 函数表达式 声明函数

```TypeScript
const foo: () => number = () => {
  return 123;
};

// 使用 type 关键字给类型起别名
type numberFunc = () => number;
const foo: numberFunc = () => {
  return 123;  
};
```


> 需要注意的是，这个 `=>` 与 `es6 `的箭头函数 `=> `有所不同，`TypeScript `中的 `=>` 为函数类型的声明，其左侧是参数类型，右侧是返回值



### 函数表达式 void 的问题

返回类型为 `void`的上下文类型 **并不强制函数不返回某些内容** 。
另一种说法是，一个带有`void`返回类型的上下文函数类型 `(type vf = () => void)` ，当实现时，可以返回任何其他值，但它返回的类型将被忽略

```TypeScript
type voidFunc = () => void;
const foo: voidFunc = () => {
  return 123;   // 语法不对，但是ts会忽略该返回值类型
};

const v1 = foo(); // v1类型为 void
console.log('v1:', v1); // v1: 123

```



### 函数的参数

#### 函数字面量 参数注解

```TypeScript
function foo(value: number): void {}
```



#### 函数表达式 参数注解

```TypeScript
const foo: (value: number) => void = (value) => {};

type fooType = (value: number) => void;
const foo: fooType = (value) => {};

```



#### 函数的可选参数

```TypeScript
function foo(name: string, age?: number) {
  console.log(name);
  console.log(age);
}
foo('ts');     // age 可不传
foo('ts', 18);
```



#### 函数的默认值

```TypeScript
// 写了默认参数就不需要把 age写成 可选参数了
function foo5(name: string, age: number = 18) {
  console.log(name);
  console.log(age);
}
foo5('ts');
foo5('ts', 18);
```



#### 函数的剩余参数

```TypeScript
function printNum(initNum: number, ...nums: number[]) {
  let totalNum = initNum;
  for (const num of nums) {
    totalNum += num;
  }
  console.log('totalNum:', totalNum);
}
printNum(10);
printNum(10, 20, 30);
```


## 数组类型

```TypeScript
// 数组类型
// 注解方式1
const arr: string[] = ['a', 'b', 'c'];

// 注解方式2 // 不推荐该方式，因为该方式在 react 的jsx 的语法会有冲突
const arr2: Array<string> = ['a'];
```




## 对象类型

```TypeScript
const info: {
  name: string;
  age: number;
} = {
  name: 'lfm',
  age: 18,
};
```



## 联合类型

联合类型可以让一个值有多种类型

```TypeScript
let id: string | number;

id = '1001';
id = 1001;
```




### 类型守卫

```TypeScript
// 类型守卫
// 当使用联合类型时，如果不明确具体的类型而去使用形参中的属性或者方法时会报错
// 解决方式是明确形参的类型，这个行为在 ts 中叫(narrowing)类型守卫
function foo(id: string | number) {
  if (typeof id === 'string') {
    console.log(id.length);
  }
}
foo('1001');
foo(1001);
```



## 可选类型

### 可选类型在 对象中的使用

```TypeScript
type infoType = {
  name: string;
  age: 18;
  like?: string; // 为可选类型
};

let info1: infoType = {
  name: '小明',
  age: 18,
};

let info2: infoType = {
  name: '小红',
  age: 18,
  like: '唱歌',
};
```



### 可选类型在 函数中的使用

```TypeScript
function foo(name: string, mobile?: number) {}

foo('小明');
foo('小红', 13366668888);
```



## 字面量类型

`TypeScript` 中还支持字面量类型，字面量类型支持以下三种

- 字符串字面量

- 数字字面量

- 布尔值字面量

### 字符串字面量

```TypeScript
let zh: 'china';   // 类型为 'china'
let en: 'america'; // 类型为 'america'

// zh = 'britain';     //报错，只支持输入 'china'
```


### 数字字面量

```TypeScript
let code: 200 | 201 | 400 | 500;
// code = 700;   // 报错

```


### 布尔值字面量

```TypeScript
let flag: false | true;
// flag = '123';   // 报错
```


### 字面量类型在 函数中的使用

```TypeScript
type Direction = 'top' | 'bottom' | 'left' | 'right'; // 只允许输入范围内的值
function toDirection(direction: Direction) {
  console.log(direction);
}
toDirection('left');
// toDirection('100');   // 报错
```




