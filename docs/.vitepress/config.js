module.exports = {
  lang: "en-US",
  title: "VitePress",
  description: "Vite & Vue powered static site generator.",

  themeConfig: {
    repo: "vuejs/vitepress",
    docsDir: "docs",

    editLinks: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: "Last Updated",

    algolia: {
      apiKey: "c57105e511faa5558547599f120ceeba",
      indexName: "vitepress",
    },

    carbonAds: {
      carbon: "CEBDT27Y",
      custom: "CKYD62QM",
      placement: "vuejsorg",
    },

    nav: [
      { text: "指南", link: "/", activeMatch: "^/$|^/guide/" },
      {
        text: "配置参考 ",
        link: "/config/basics",
        activeMatch: "^/config/",
      },
      {
        text: "发行说明 ",
        link: "https://github.com/vuejs/vitepress/releases",
      },
    ],

    sidebar: {
      "/guide/": getGuideSidebar(),
      "/config/": getConfigSidebar(),
      "/": getGuideSidebar(),
    },
  },
};

function getGuideSidebar() {
  return [
    {
      text: "Webpack",
      children: [
        {
          text: "babel",
          link: "/webpack/babel",
        },
        {
          text: "devServer 和 HMR",
          link: "/webpack/devServer 和 HMR",
        },
        {
          text: "loader",
          link: "/webpack/loader",
        },
        {
          text: "plugin",
          link: "/webpack/plugin",
        },
        {
          text: "webpack 中 cdn 和 shamming的使用",
          link: "/webpack/webpack 中 cdn 和 shamming的使用",
        },
        {
          text: "webpack 中 dll 的使用",
          link: "/webpack/webpack 中 dll 的使用",
        },
        {
          text: "webpack 中 hash，chunkhash，contenthash的区别",
          link: "/webpack/webpack 中 hash，chunkhash，contenthash的区别",
        },
        {
          text: "webpack 中 webpackPreload 和 webpackPrefetch",
          link: "/webpack/webpack 中 webpackPreload 和 webpackPrefetch",
        },
        {
          text: "webpack 中 的 optimization",
          link: "/webpack/webpack 中 的 optimization",
        },
        {
          text: "webpack 中的解析和路径",
          link: "/webpack/webpack 中的解析和路径",
        },
        {
          text: "webpack 打包 vue",
          link: "/webpack/webpack 打包 vue",
        },
        {
          text: "webpack 打包后的 commonjs 代码分析",
          link: "/webpack/webpack 打包后的 commonjs 代码分析",
        },
        {
          text: "webpack 配置分离和代码分离",
          link: "/webpack/webpack 配置分离和代码分离",
        },
        {
          text: "webpack5入门",
          link: "/webpack/webpack5入门",
        },
      ],
    },
    {
      text: "react",
      children: [
        {
          text: "mobx",
          link: "/react/mobx",
        },
        {
          text: "recoil",
          link: "/react/recoil",
        },
        {
          text: "redux工具",
          link: "/react/redux工具",
        },
      ],
    },
    {
      text: "flutter",
      children: [
        {
          text: "dart 语法一",
          link: "/flutter/dart 语法一",
        },
        {
          text: "dart 语法三",
          link: "/flutter/dart 语法三",
        },
        {
          text: "dart 语法二",
          link: "/flutter/dart 语法二",
        },
        {
          text: "flutter系列一 hello world",
          link: "/flutter/flutter系列一 hello world",
        },
        {
          text: "flutter系列二 StatelessWidget 及 StatefulWidget",
          link: "/flutter/flutter系列二 StatelessWidget 及 StatefulWidget",
        },
        {
          text: "配置 flutter、dart 开发环境",
          link: "/flutter/配置 flutter、dart 开发环境",
        },
      ],
    },
  ];
}

function getConfigSidebar() {
  return [
    {
      text: "App Config",
      children: [{ text: "Basics", link: "/config/basics" }],
    },
    {
      text: "Theme Config",
      children: [
        { text: "Homepage", link: "/config/homepage" },
        { text: "Algolia Search", link: "/config/algolia-search" },
        { text: "Carbon Ads", link: "/config/carbon-ads" },
      ],
    },
  ];
}
