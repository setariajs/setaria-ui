## PageHeader 页头

页头起到了内容概览和引导页级操作的作用。包括由面包屑、标题、页面内容简介、页面级导航组成。

### 何时使用

当需要使用户快速理解当前页是什么以及方便用户使用页面功能时使用，通常也可被用作页面间导航。

### 简单示例

标准页头，适合使用在需要简单描述的场景。


:::demo
```html
<template>
  <el-page-header :bread-crumb="breadCrumb"
                  title="页头">
  </el-page-header>
</template>
<script>
export default {
  data() {
    return {
      breadCrumb: [
        {
          path: '#',
          label: '第一级页面'
        },
        {
          label: '第二级页面'
        },
        {
          path: '#',
          label: '当前页面'
        }
      ],
    };
  }
}
</script>
```
:::

### 组合示例

使用了 PageHeader 提供的所有能力。

:::demo
```html
<template>
  <el-page-header :bread-crumb="breadCrumb"
                  title="页头"
                  :tab-list="tabList"
                  :tab-active-key.sync="tabActiveKey">
    <template slot="action">
      <el-button type="primary">主操作</el-button>
      <el-button>普通操作</el-button>
      <el-button>普通操作</el-button>
    </template>
    <template slot="content">
      <div>
        大江东去，浪淘尽，千古风流人物。故垒西边，人道是：三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。
        <br/>
        遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间、樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。
      </div>
    </template>
    <template slot="extraContent">
      <img src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg" width="100%"/>
    </template>
  </el-page-header>
  {{ tabActiveKey }}
</template>
<script>
  export default {
    data() {
      return {
        breadCrumb: [
          {
            path: '#',
            label: '第一级页面'
          },
          {
            label: '第二级页面'
          },
          {
            path: '#',
            label: '当前页面'
          }
        ],
        tabList: [
          {
            key: 'A',
            label: '页签一'
          },
          {
            key: 'B',
            label: '页签二'
          }
        ],
        tabActiveKey: 'B',
      }
    }
  }
</script>
```
:::

### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title     | 标题           | string | — | — |
| content     | 内容           | string | — | — |
| bread-crumb     | 面包屑列表，结构为{ path: string, label: string }           | array | — | — |
| show-bread-crumb     | 是否显示面包屑           | array | — | — |
| tab-list     | 标签页列表，结构为{ key: string, label: string }           | array | — | — |
| tab-active-key     | 处于激活状态标签的key值          | string | — | — |

### Slot

| Name | Description |
|------|--------|
| 插槽名称 | 描述 |
| title | 标题的内容 |
| action | 操作按钮 |
| content |  内容 |
| extraContent | 额外内容 |

### Events

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| tab-click | 标签点击的事件 | 当前点击的标签对象 |
