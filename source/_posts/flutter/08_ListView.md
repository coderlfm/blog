---
title: flutter ListView
date: 2022-01-11 10:00:10
toc: true
tags:
  - Flutter
  - Dart

categories:
  - Flutter
  - Dart

cover: /cover-imgs/flutter.png

---

页面滚动 ListView

<!-- more -->
# ListView

`flutter`中需要通过 `ListView`才能够让页面进行滚动

## ListView的基本使用

`itemExtent`指定子元素的 宽或者高(根据展示的方向)，显示指定更有利于优化性能，

```Dart
 return ListView(
    // 指定子元素的 宽或者高(根据展示的方向)，显示指定更有利于优化性能，
    itemExtent: 100,
    children: [
      Text('1'),
      Text('2'),
      Text('3'),
      Text('4'),
    ],
  );

```




### list.generate

可以快速生成多个元素

```Dart
  return ListView(
    children: List.generate(100, (index) => Text('内容$index')),
  );
```






## ListView.separated 分割线

`ListView.separated`有一个`separatorBuilder`属性来设置分割线

```Dart
  return ListView.separated(
      itemBuilder: (BuildContext context, int index) {
        return Text('内容$index');
      },
      separatorBuilder: (BuildContext context, int index) {
        // 分割线
        return Divider(
          color: Colors.green,
          thickness: 2,
          indent: 10,
          endIndent: 10,
        );
      },
      itemCount: 100
  );
```




### Divider

分割线 widget



## ListView.builder

这个性能会相对更好一些，它会在item即将展示的时候再进行构建，且可通过配置来修改预渲染的范围

```Dart
  return ListView.builder(
      itemCount: 50,
      itemExtent: 50,
      itemBuilder: (BuildContext context, int index) {
        return ListTile(
          title: Text('联系人$index'),
          subtitle: Text('1777828617$index'),
          leading: Icon(Icons.person),
          trailing: Icon(Icons.call_end),
        );
      }
  );
```




### ListTile

一个由前缀，后缀，title，subTitle的widget，比较适合用来展示联系人



## gridView.builder 网格布局

可以给 `gridDelegate`来设置 `SliverGridDelegateWithMaxCrossAxisExtent`或者`SliverGridDelegateWithFixedCrossAxisCount`来修改交叉轴是根据 **个数** 还是 **最大宽** 来布局侧轴的排列



可以通过添加 `controller`来完成返回顶部的操作，返回顶部可以让值设置为负值 `-20`，这样会有一个反弹的效果

也可以实现向下翻页的效果 `_controller.jumpTo(_controller.offset + (屏幕高度 - appbar高度) )`



```Dart
  return GridView.builder(
    controller: _controller,
    itemExtent: 100, // 每个item最大主轴方向 高度/宽度 约束，设置这个可以让滚动条正确计算
    itemCount: 100,
    // 设置交叉轴的 item 个数
    // gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3),
    // 通过 主轴 设置占据的最大值来设置 item
    gridDelegate:
      SliverGridDelegateWithMaxCrossAxisExtent(maxCrossAxisExtent: 100, mainAxisSpacing: 5, crossAxisSpacing: 5),
    itemBuilder: (BuildContext context, index) {
      return Container(
        width: 100,
        height: 100,
        color: Color.fromRGBO(
            Random().nextInt(256), Random().nextInt(256), Random().nextInt(256), Random().nextInt(10) / 10),
      );
    },
  );
```




## physics属性的作用

`flutter`会根据操作系统来模拟不同的效果，如果需要手动设置效果反弹效果可以手动设置

- `BouncingScrollPhysics` ios 效果
- `ClampingScrollPhysics` android 效果
- `[NeverScrollableScrollPhysics](https://api.flutter-io.cn/flutter/widgets/NeverScrollableScrollPhysics/NeverScrollableScrollPhysics.html)` 不可滚动，可以通过 `controller` 来操作滚动
- `[AlwaysScrollableScrollPhysics](https://api.flutter-io.cn/flutter/widgets/AlwaysScrollableScrollPhysics/AlwaysScrollableScrollPhysics.html)` 永远可以滚动
- `FixedExtentScrollPhysics` 精准的停留在某个元素上



```Dart
ListView.builder(
  physics: BouncingScrollPhysics()
); 
```


> 文档 [https://api.flutter-io.cn/flutter/widgets/ScrollPhysics-class.html](https://api.flutter-io.cn/flutter/widgets/ScrollPhysics-class.html)




### Random

`dart` 中用来生成随机数的函数



## ListWheelScrollView 3d效果滚动

类似于`ios` 上 时间选择器的效果

```Dart
  ListWheelScrollView({
    Key? key,
    this.controller,
    this.physics,  // 使用 FixedExtentScrollPhysics() 可以精准的停留在某个item上
    this.diameterRatio = RenderListWheelViewport.defaultDiameterRatio, // 直径比例，上下的高度
    this.perspective = RenderListWheelViewport.defaultPerspective,
    this.offAxisFraction = 0.0, // 与轴心的偏移
    this.useMagnifier = false,  // 中间元素是否开启放大镜
    this.magnification = 1.0,  // 中间元素的缩放大小
    this.overAndUnderCenterOpacity = 1.0, // 上下的非选中元素的透明度
    required this.itemExtent,  // 子元素的高度
    this.squeeze = 1.0,
    this.onSelectedItemChanged,  // 选中后的回调
    this.renderChildrenOutsideViewport = false,
    this.clipBehavior = Clip.hardEdge,
    this.restorationId,
    this.scrollBehavior,
    required List<Widget> children,
  })
```


 

## PageView 轮播图滚动效果

```Dart
  PageView({
    Key? key,
    this.scrollDirection = Axis.horizontal, // 水平方向滚动
    this.reverse = false,
    PageController? controller,
    this.physics, 
    this.pageSnapping = true, // 是否可使页面停留在一半效果
    this.onPageChanged,  // 选择后回调
    List<Widget> children = const <Widget>[],
    this.dragStartBehavior = DragStartBehavior.start,
    this.allowImplicitScrolling = false,
    this.restorationId,
    this.clipBehavior = Clip.hardEdge,
    this.scrollBehavior,
    this.padEnds = true,
  })
```




## ReorderableListView

`ReorderableListView`拖拽列表





## SingleChildScrollView 

和 `ListView`的区别是，在高度不足以滚动的时候，用户是感受不到滚动的回弹效果的，`ListView`如果在元素少的时候依旧可以感受到滚动的回弹效果

`SingleChildScrollView `较少用，一般用于 默认情况下不需要滚动，但是某些情况有可能需要滚动的时候

```Dart
SingleChildScrollView(
  child: Column()
)
```




## Column嵌套 ListView

通过 `Expanded`将 `ListView`进行包裹

因为 `Column`会讲自己向下级传递的约束伪装成 无限高的，如果直接嵌套 `ListView`，那么`ListView`也会将自己的高度设置为无限高，这时候高度就出现问题了，而通过 `Expanded`就可以避免这问题

例如`Column`把其它的非弹性元素布局完后发现只剩下600高度，那么就会把`600`高度的约束平均分给 `Expanded`

```Dart
Column(
  children: [
    FlutterLogo(size: 50),
    Expanded(
      child: ListView(children: [])
    )
  ]
)
```




## CustomScrollView 同时使用 ListView 和 GridView

如果项目中出现 同时使用 `ListView` 和 `GridView`的需求的话，就需要通过自定义 `ScrollView`的方式来实现，因为`ListView` 和 `GridView`本质也是这个，只是往里面插入了一个元素`return <Widget>[ sliver ];`



`SliverList`:  ListView的本质

`SliverGrid`:  GridView 的本质

通过直接使用 `SliverList`和`SliverGrid`来构建自定义`ListView`和`GridView`

通过给 `delegate`设置为`SliverChildBuilderDelegate`来构建子元素

```Dart
  // 同时使用 ListView 和 GridView, 自定义 ScrollView
  return CustomScrollView(
    slivers: [
      SliverAppBar(
        title: Text('标题'),
      ),
      SliverList(
          delegate: SliverChildBuilderDelegate((BuildContext context, int index) {
            return ListTile(
              title: Text('联系人$index'),
              subtitle: Text('1777828617$index'),
              leading: Icon(Icons.person),
              trailing: Icon(Icons.call_end),
            );
          }, childCount: 20)),
      SliverGrid(
          delegate: SliverChildBuilderDelegate((BuildContext context, index) {
            return Container(
              width: 100,
              height: 100,
              color: Color.fromRGBO(
                  Random().nextInt(256), Random().nextInt(256), Random().nextInt(256), Random().nextInt(10) / 10),
            );
          }, childCount: 20),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3))
    ],
  );
```




如果要在`slivers`中放普通元素，需要使用 `SliverToBoxAdapter`进行一个简单的转接



### SliverAppBar

安全区域内的 `appBar`



## SliverSafeArea 安全区域

在通过包裹 `SliverSafeArea`来让内容在安全区域内展示，放只在刘海和屏幕底部的操作栏遮挡

```Dart
  return CustomScrollView(
    controller: _scrollController,
    slivers: [
      SliverSafeArea(
          sliver: SliverPadding(
            padding: EdgeInsets.all(5),
            sliver: SliverGrid(
              delegate: SliverChildBuilderDelegate((BuildContext context, index) {
                return Container(
                  width: 100,
                  height: 100,
                  color: Color.fromRGBO(Random().nextInt(256), Random().nextInt(256), Random().nextInt(256), 1),
                );
              }, childCount: 50),
              gridDelegate:
              SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3, mainAxisSpacing: 5, crossAxisSpacing: 5),
            ),
          ))
    ],
  );
```




### SliverPadding

可以在安全区域设置外`padding`  



