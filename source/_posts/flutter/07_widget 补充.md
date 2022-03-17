---
title: flutter widget 补充
date: 2022-01-10 17:00:10
toc: true
tags:
  - Flutter
  - Dart

categories:
  - Flutter
  - Dart

cover: /cover-imgs/flutter.png

---

其它场景的widget补充

<!-- more -->

## 背景颜色渐变

```Dart
 Container(
    decoration: BoxDecoration(
      gradient: LinearGradient(colors: [Colors.green.withOpacity(.5), Colors.green]),
    ),
    child: Text('hello world'),
  )
```




## 背景图

```Dart
Container(
  decoration: BoxDecoration(
    image: DecorationImage(
      image: AssetImage("images/bg.jpg"),
      fit: BoxFit.cover,
    ),
  ),
  child: Center(
    child: Text('Hello Wolrd', style: TextStyle(fontSize: 22.0, color: Colors.white),),
  ),
),
```




## 懒渲染

类似于前端中路由懒加载

```Dart
FutureBuilder<List<CategoryItem>>(
  future: HomeRequest.getCategory(),
  builder: (ctx, res) {
    if (!res.hasData) return Center(child: CircularProgressIndicator());
    if (res.hasError) return Center(child: Text('网络超时'));

    return buildContent(res, context);
  },
)
```




## 元素内容过大时挤压

`FittedBox`  挤压 压缩过大的widget

当元素内容过多，又不希望其报警告时可以使其挤压



## 高斯模糊(毛玻璃效果)

背景高斯模糊

```Dart
/// 高斯模糊
class HiBlur extends StatelessWidget {
  final Widget? child;

  final double sigma; // 模糊

  const HiBlur({Key? key, this.child, required this.sigma}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
      child: Container(child: child, color: Colors.white10),
    );
  }
}


// 使用 
  Stack(
    children: [Image.network('https://blog.liufengmao.cn/cover-imgs/speed.jpg'), HiBlur(sigma: 10)],
  )
```




## 换行

Row 元素过多是不会自动换行，需要将 Row 修改成 Wrap

```Dart
  Wrap(
    children: [
      Container(
        width: 167.5.rpx,
        decoration: BoxDecoration(color: Colors.blue),
        padding: EdgeInsets.symmetric(horizontal: 10.rpx, vertical: 46.rpx),
        child: Column(
          children: [Text('看图', style: TextStyle(fontSize: 35.rpx, fontWeight: FontWeight.bold))],
        ),
      )
    ],
  )
```




## 百分比

```Dart
FractionallySizedBox(width: .5 );// 百分之50的宽度
```




## 继承父级高度

```Dart
IntrinsicHeight()
```




## `Stack` 水平垂直居中

```Dart
 Stack(
    alignment: Alignment.center, // 设置 Stack 对齐方式
    children: [
      ElevatedButton(
        onPressed: () { },
        child: Icon(Icons.pause)
      )
    ],
  )
```




## 页面不可滚动时，输入框弹出后报溢出错误

通过设置 `resizeToAvoidBottomInset: false`解决

```Dart
Scaffold(
  appBar: AppBar(title: const Text('首页')),
  resizeToAvoidBottomInset: false,
);
```




## 下拉刷新顶部固定其它组件

```Dart
return Scaffold(
  appBar: AppBar(title: const Text('VipManagePage')),
  body: Column(children: [
    const Text('输入框'),
    Expanded(
        child: ProListView( // 下拉刷新组件
      page: controller.page,
      total: controller.total,
      refreshController: controller.refreshController,
      promise: (int _page) => controller.http(page: _page),
      child: ListView.builder(
        itemCount: 40,
        itemBuilder: (context, index) => const Text('1111'),
      ),
      data: controller.items,
    ))
  ]),
);

```




## 按钮 水波纹边距 

```Dart
Row(children: [
  Expanded(
      child: TextButton(
    onPressed: () {},
    child: const Text('暂停发放'),
    style: ButtonStyle(
      minimumSize: MaterialStateProperty.all(Size.fromHeight(100.rpx)),
      shape: MaterialStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
        topLeft: Radius.circular(20.rpx),
        bottomLeft: Radius.circular(20.rpx),
      ))),
    ),
  )),
  Container(height: double.infinity, width: 2.rpx, color: const Color(0xffeaeaea), margin: EdgeInsets.symmetric(vertical: 20.rpx)),
  Expanded(
      child: TextButton(
    style: ButtonStyle(
      minimumSize: MaterialStateProperty.all(Size.fromHeight(100.rpx)),
      shape: MaterialStateProperty.all(RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
        topRight: Radius.circular(20.rpx),
        bottomRight: Radius.circular(20.rpx),
      ))),
    ),
    onPressed: () {},
    child: const Text('停止使用', style: TextStyle(color: Colors.red)),
  )),
])
```


![](image/image.png "")

 



## 去除按钮水波纹

[https://blog.csdn.net/studying_ios/article/details/107342953](https://blog.csdn.net/studying_ios/article/details/107342953)

```Dart
 TextButton(
    onPressed: onPressed,
    style: const ButtonStyle(splashFactory: NoSplash.splashFactory),
    child: Text(title, style: TextStyle(fontSize: 30.rpx, fontWeight: FontWeight.bold, color: isActive ? Colors.blue : Colors.black)),
  )),
```




## pull_to_refresh 上拉加载更多组件 初始化刷新的问题

场景 顶部搜索栏固定，剩余区域为下拉刷新和上拉加载更多的列表，页面进入默认会刷新的问题，将`initialRefresh`设置为 `false`

```Dart
  RefreshController refreshController = RefreshController(initialRefresh: false);

```




## 子组件变换的动画效果

使用`AnimatedSwitcher`来包裹需要发生变化的子组件，如果子组件只是文字发生变化是不会触发动画，因此可以给`Text`加一个`UniqueKey`

```Dart
AnimatedSwitcher()
```




## 获取随机颜色

```Dart
Colors.primaries[ Random().nextInt(Colors.primaries.length) ];
```




## 获取子`widget`尺寸，位置等信息

`RenderObject`有很多种类型 `RenderBox`只是其中一种

```Dart
final renderBox = _globalKey.currentContext.findRenderObject() as RenderBox
print(renderBox.size);  // 获取尺寸
print(renderBox.localToGlobal(Offset.zero)); // 获取距离屏幕左上角爱的位置 
```


