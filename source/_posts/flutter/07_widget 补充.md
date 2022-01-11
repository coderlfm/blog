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

`FittedBox` 挤压 压缩过大的 widget

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