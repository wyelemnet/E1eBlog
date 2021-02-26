## 用 github pages + react 写一个自己的博客网站

### 壹（序）

一直想着写一个自己的博客网站，但是害怕没时间维护，最后选择白嫖 github，使用 react 从零搭建一个项目；

尽量多使用 react 全家桶系列技术，熟悉熟悉 react，累积经验。

[博客地址](https://wyelemnet.github.io/E1eBlog/#/home), [源码地址](https://github.com/wyelemnet/E1eBlog)。

### 贰（技术选型）

- 从初学 react 到工作至今，还没有写过 react 项目，所以这次必须使用 react。
- UI 方面，选择 antd。
- 脚手架使用 react 官方的 cra。
- 除此之外，使用 react-router，redux。
- 没有使用 lint，IDE 都配置好的。
- CSS 预处理器使用 less。

### 叁（路由）

- 首页（home）
- 文章列表（article）
- 文章详情（article/articleId）
- 自我介绍（aboutMe）

### 肆（样式）

样式使用了三种方式，外部引入、内联样式、styled-components。

- 外部引入：外部写样式，然后 import 进来，但是样式无法私有化（vue 的 scoped）;
- 内联样式：直接使用内联样式，可以实现私有化;
- [styled-components](https://styled-components.com/)：样式私有化，CSS-IN-JS，不用绞尽脑汁想 className 了（nice)...;

### 伍（功能点）

- 简单实现打字效果，可以使用[typing.js](https://typeitjs.com/):

  ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f503a92ee08475f990ebc6198df581f~tplv-k3u1fbpfcp-watermark.image)

- 动态读取 markdown 文章：
  使用[require-context](https://webpack.js.org/guides/dependency-management/#require-context),根据路由文章 id 读取指定目录下的文章

  ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7629f14c15ab4ff0b37264a502731544~tplv-k3u1fbpfcp-watermark.image)

webpack 配置读取 md 文件：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12fa24f937f144d2aa943d94ba7c908e~tplv-k3u1fbpfcp-watermark.image)

- GitHub Pages 部署

1. 引入：yarn add -D gh-pages;
2. package.json 中增加脚本 predeploy 和 deploy，部署直接终端输入命令 yarn deploy;

   ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/243d868750c14d28be5f5f0c84a92c6e~tplv-k3u1fbpfcp-watermark.image)
