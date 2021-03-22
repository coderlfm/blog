// const { getChildren } = require("vuepress-sidebar-atuo");
// const fs = require("fs");
// const path = require("path");
// const { resolve } = path;

module.exports = {
  title: "Hello VuePress",
  description: "Just playing around",
  sidebar: {
    "/webpack/": [
      {
        title: "基础知识",
        collapsable: true,
        children: [
          "/bable",
          "/bable/",
        ],
      },
      // {
      //   title: "高级进阶",
      //   collapsable: true,
      //   children: getChildren("../flutter/"),
      // },
    ],
    // "/jottings/": [
    //   {
    //     title: "随笔",
    //     collapsable: true,
    //     // children: getChildren("./docs/jottings/"),
    //   },
    // ],
  },
  // sidebar: {
  //   "/webpack/": [
  //     // "" /* /foo/ */,
  //     "loader" /* /foo/one.html */,
  //     "plugin" /* /foo/two.html */,
  //   ],

  //   // fallback
  //   "/": ["" /* / */, "contact" /* /contact.html */, "about" /* /about.html */],
  // },
  themeConfig: {
    displayAllHeaders: true, // 默认值：false
    sidebar: "auto",
  },
};

function getChildren(path, sort = true) {
  path = resolve(__dirname, path);
  console.log("path", path);

  let root = [];
  readDirSync(path, root);
  root = root.map((item) => {
    if (item.split("/")[4]) {
      return item.split("/")[3] + "/" + item.split("/")[4];
    } else {
      return item.split("/")[3];
    }
  });
  //排序
  if (sort) {
    let sortList = [];
    let nosortList = [];
    root.forEach((item) => {
      if (Number(item.replace(".md", "").match(/[^-]*$/))) {
        sortList.push(item);
      } else {
        nosortList.push(item);
      }
    });
    root = sortList
      .sort(function(a, b) {
        return (
          a.replace(".md", "").match(/[^-]*$/) -
          b.replace(".md", "").match(/[^-]*$/)
        );
      })
      .concat(nosortList);
  }

  return root;
}
function readDirSync(path, root) {
  console.log("path,,,,", path);
  var pa = fs.readdirSync(path);
  pa.forEach(function(ele, index) {
    path = resolve(path, ele);
    debugger;

    var info = fs.statSync(path);
    if (info.isDirectory()) {
      readDirSync(path, root);
    } else {
      if (checkFileType(ele)) {
        root.push(prefixPath(path, ele));
      }
    }
  });
}
function checkFileType(path) {
  return path.includes(".md");
}
function prefixPath(basePath, dirPath) {
  let index = basePath.indexOf("/");
  // 去除一级目录地址
  basePath = basePath.slice(index, path.length);
  // replace用于处理windows电脑的路径用\表示的问题
  return path.join(basePath, dirPath).replace(/\\/g, "/");
}
