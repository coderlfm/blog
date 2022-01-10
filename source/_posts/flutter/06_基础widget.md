---
title: flutter 基础 widget
date: 2022-01-09 17:00:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/flutter.png

---
常用的 widget，`Container`，`Text`，`image`，圆角等
 
<!-- more -->


## 文本省略号

```Dart
  // 2行省略号
  return Text(
    '文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1文字1',
    maxLines: 2,
    overflow: TextOverflow.ellipsis,
  );
```




## 富文本

富文本可以自动换行

Text.rich -> TextSpan() -> TextSpan()/WidgetSpan()  

```Dart
  // 富文本
  return Text.rich(TextSpan(children: [
    TextSpan(text: 'hello', style: TextStyle(color: Colors.red)),
    WidgetSpan(child: Icon(Icons.delete, color: Colors.amber,)),
    TextSpan(text: 'world', style: TextStyle(color: Colors.green)),
  ]));
```




## Row/Column

设置 `Row` 和 `Column` 为由内容撑开 `mainAxisSize: MainAxisSize.min`

```Dart
  // Row Column 设置为由内容撑开
  return Container(
    color: Colors.red,
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [Text('1111'), Text('2222')],
    ),
  );
```




## 按钮圆角

```Dart
  return ElevatedButton(
    onPressed: () {},
    child: Text('按钮圆角'),
    style: ButtonStyle(
        shape: MaterialStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)))
    ),
  );
```




## 按钮边距

默认为 `MaterialTapTargetSize.padded` 如果没有`48px`则会设置为 `48px`

```Dart
  return Column(
    children: [
      ElevatedButton(
        onPressed: () {},
        child: Text('按钮1'),
        //  默认为 MaterialTapTargetSize.padded 如果没有48px则会设置为 48px
        style: ButtonStyle(tapTargetSize: MaterialTapTargetSize.shrinkWrap,),
      ),
      ElevatedButton(onPressed: () {}, child: Text('按钮2')),
    ],
  );
```




## 图片

设置大小及裁切方式

```Dart
  return Image.network(
    'https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp',
    width: 200,
    height: 200,
    fit: BoxFit.fitWidth,
    alignment: Alignment(1, 1),
  );
```




## 占位图

渐入渐出效果

```Dart
  // 占位图，
  return FadeInImage(
      placeholder: AssetImage('lib/assets/images/img2.png'),
      image: NetworkImage(
          'https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp')
  );
```




## 字体图标本质

```Dart
  // 字体图标本质
  return Column(
    children: [
      Icon(Icons.favorite),
      Text('\ue25b', style: TextStyle(fontFamily: 'MaterialIcons'),)
    ],
  );
```




## 文本输入框

```Dart
  return TextField(
    decoration: InputDecoration(labelText: 'username', icon: Icon(Icons.account_circle)),
  )
```




## 通过点击按钮获取文本框内容

```Dart
class FormContent extends StatelessWidget {

  final usernameField = TextEditingController();
  final passwordField = TextEditingController();

  void handleSubmit(){
    print('username: ${usernameField.text} password: ${passwordField.text}');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: usernameField,
          decoration: InputDecoration(
              labelText: 'username',
              icon: Icon(Icons.account_circle),
              border: OutlineInputBorder(),
              hintText: '请输入用户名'),
        ),
        TextField(
          controller: passwordField,
          decoration: InputDecoration(labelText: 'password', icon: Icon(Icons.lock)),
        ),
        Container(
            width: 200,
            margin: EdgeInsets.only(top: 10),
            child: ElevatedButton(onPressed: handleSubmit, child: Text('提交')))
      ],
    );
  }
}

```




## Center

`Center` 本质就是 `Align`

```Dart
  // Center 的本质就是 Align
  // widthFactor 根据 等比放大子元素宽的倍数
  return Container(
      color: Colors.amber,
      child: Align(
        child: Icon(Icons.favorite),
        widthFactor: 6,
        heightFactor: 6,
      )
  );
      
  return Center(
    child: Icon(Icons.favorite),
  );
```




## Padding

通过包裹 `Padding` 设置`padding`， 或者可以包裹 `Container` 设置`padding`

```Dart
  // 通过包裹 Padding 设置paddingn， 或者可以包裹 Container 设置paddingn
  return Padding(
    padding: EdgeInsets.all(30),
    child: Icon(Icons.favorite),
  );
```




## Container
可以设置 `margin`，`padding` 类似前端的 `div`

`Container` 的 `color` 和 `decoration` 有冲突，传了 `decoration` 时必须将 `color`也写入

```Dart
  // Container 的 color 和 decoration 有冲突，传了 decoration 时必须将 color也写入
  return Container(
    // color: Colors.amber,
      decoration: BoxDecoration(color: Colors.amber),
      transform: Matrix4.rotationZ(50),
      child: Align(
        child: Icon(Icons.favorite),
        widthFactor: 6,
        heightFactor: 6,
      )
  );
```




## Flex/Row/Column

`flex` 占据剩余空间 `Flexible` `fit:FlexFit.tight`, 或者 `Expanded`

```Dart
  return Row(
    children: [
      Flexible(fit:FlexFit.tight, child: Container(child: Text('第1个'), color: Colors.red,)),
      Expanded(child: Container(child: Text('第2个'), color: Colors.amber,)),
      Container(child: Text('第3个'), color: Colors.green,),
      Container(child: Text('第4个'), color: Colors.blue,),
    ],
  );
```




## Stack 层叠布局

通过 `Positioned`可以设置定位的元素

```Dart
  // 层叠布局
  return Stack(
    alignment: Alignment.center,
    children: [
      Image.network('https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp'),
      Positioned(right: 0, bottom: 0, child: Container(width: 200, height: 100, color: Colors.amber,)),
      Positioned(left: 0, bottom: 0, child: Text('内容', style: TextStyle(fontWeight: FontWeight.bold),)),
    ],
  );
```


