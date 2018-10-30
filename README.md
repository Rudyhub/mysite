# mysite

这是vue构建的多页面个人网站，两种风格系统：**普通来宾**模式是2D普通网页模式，与大多数主流网站类似；**程序员**模式是3D体验模式，非常惊艳的三css3的3D应用。

抛弃vue-cli，动手构建vue多页面应用，不做SPA单页应用突然清爽许多，灵活度更高。

### 针对开发者朋友

*****

如果也想构建多页应用，可在自己的项目里直接使用pre.build.js、config.js、webpack.config.js这三个文件。

1. 文件pre.build.js： 它是node预处理程序，其作用就是准备文件和目录，以及提供给webpack的配置项config，是构建多页面的核心逻辑。如果你不了解它，最好不要动它，只管用它就好。
2. 文件config.js：它是提供页面（pages）结构的配置文件，你需要在这里配置你的页面。
3. webpack.config.js：会用webpack都知道，不用多说，一般情况下你不熟悉它也最好别去动它。

#### config.js配置说明

```
{
  //也就是html标签上的lang属性
  lang: 'zh-cn',
  //为是所有页面公用的部分，后面pages里的配置对应的项目会累加，比如: title = global.title + pages[0].title
  global: {
    title: '网站标题公共部分',
    meta: `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="keyworks" content="关键字">
        <meta name="description" content="描述">`,
    link: `
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="stylesheet" href="/css/global.css">`,
    script: `<script src="/js/rem.js"></script>`,
    style: '',
    //这里的app就是vue的绑定节点，在它之前或之后放任何东西，但不要在app里面放东西。
    body: '<div id="app"></div>'
  },
  /*
   * 这里就配置你页面的结构，配置字段有title, meta, link, script, style, component, children。
   * 其中，title, meta, link, script, style会累加到global对应的字段。
   * component是指定.vue组件的路径，其根目录是src目录，如：detail.vue位置是/src/works/detail.vue，则写为'works/detail.vue'。
   * 如果不指定组件路径，默认为src目录下的[name].vue，如: index.vue
   * children配置子页面，字段同上。
   */
  pages: [{
    name: 'index',
    title: '首页'
  }, {
    name: 'works',
    title: '作品',
    children: [{
      name: 'detail',
      title: '作品详细',
      component: 'works/detail.vue'
    }]
  }, {
    name: 'blog',
    title: '博客',
    link: '<link rel="stylesheet" href="/plugins/highlight.css">',
    script:`
        <script src="/plugins/marked.min.js"></script>
        <script src="/plugins/highlight.js"></script>`
  }]
}
```
#### 如何构建自己的项目
1. 复制config.js、package.json、pre.build.js、webpack.config.js到自己的项目文件夹
2. 安装依赖：npm run install
3. 创建src目录，在目录下创建第一个页面index.vue
4. 修改config.js，配置如下：
```
{
  lang: 'zh-cn',
  global: {
    title: '项目',
    meta: `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="keyworks" content="关键字">
        <meta name="description" content="描述">`,
    link: '',
    script: '',
    style: '',
    body: '<div id="app"></div>'
  },
  pages: [{
    name: 'index',
    title: '首页'
  }]
}
```
5. 运行项目： npm run start。之后浏览器打开localhost:8080，即可看到你的首页。
6. 产出代码压缩版： npm run build 产出的代码都在文件夹dist里
7. 另外还支持： npm run dev 产出开发模式代码。

**恭喜完成！**
