# setaria-ui
> A Vue.js 2.0 UI Toolkit for Web.

Fork自[element-ui](https://github.com/ElemeFE/element)

**同步至Element-UI 2.14.1**

**建议使用node8进行本地开发，使用Node9+以上版本在执行初始化构建时可能会出现编译错误**

基于Vue和Element UI，结合其他优秀组件库（[Ant Design](https://ant.design/index-cn)，[Material Deisgn](https://material.angular.io/)等)，加速业务级应用页面开发。

## Feature

- [New]JSON Schema Dynamic Form [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/json-form)
  - 基于标准Json Schema格式数据生成表单
- [New]Ellipsis [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/ellipsis)
  - 文本省略组件
- [New]Description [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/description)
  - 描述列表组件,常见于详情页的信息展示。对于在基于业务逻辑对显示项目进行显示/隐藏控制时，会方便很多。
- [New]Statistics [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/statistics)
  - 统计数值组件
- [New]List [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/list)
- [New]JsonViewer [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/json-viewer)
- [Update]Badge [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/badge)
  - 添加 `status`, `text` 属性支持状态点功能
- [Update]Button [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/button)
  - 新增 `href`, `target` 属性支持a 链接功能
- [Update]Card [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/card)
  - 支持标签
  - 新增 `type` 属性，优化卡片嵌套时的表现形式
  - 新增支持封面、头像、标题和描述信息的卡片
- [Update]Dialog [链接](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/dialog)
  - 支持拖动

## Install

```shell
npm install setaria-ui -S
```

## Quick Start

``` javascript
import Vue from 'vue'
import Setaria from 'setaria-ui'

Vue.use(Setaria)

// or
import {
  Select,
  Button
  // ...  
} from 'setaria-ui'

Vue.component(Select.name, Select)
Vue.component(Button.name, Button)
```
For more information, please refer to [Quick Start](https://bluejfox.github.io/setaria-ui/#/zh-CN/component/quickstart) in our documentation.

## Browser Support

Modern browsers and Internet Explorer 10+.

## Development

Skip this part if you just want to use Element.

For those who are interested in contributing to Element, please refer to our contributing guide ([中文](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md) | [English](https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.en-US.md)) to see how to run this project.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/bluejfox/setaria-ui/releases).

## FAQ

We have collected some [frequently asked questions](https://github.com/bluejfox/setaria-ui/blob/master/FAQ.md). Before reporting an issue, please search if the FAQ has the answer to your problem.

## 感谢 JetBrains 免费的开源授权

<a href="https://www.jetbrains.com/?from=setaria-ui" target="_blank">
<img src="https://user-images.githubusercontent.com/1787798/69898077-4f4e3d00-138f-11ea-81f9-96fb7c49da89.png" height="200"/></a>

## LICENSE

[MIT](LICENSE)
