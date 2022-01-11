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

```Dart
  return GridView.builder(
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




### Random

`dart` 中用来生成随机数的函数

 

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



