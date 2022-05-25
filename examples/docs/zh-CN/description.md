## Description 描述列表
成组展示多个只读字段。

### 何时使用
常见于详情页的信息展示。对于在基于业务逻辑对显示项目进行显示/隐藏控制时，会方便很多。

### 基本用法
简单的展示。

:::demo

```html
<el-radio-group v-model="size">
  <el-radio-button label="large">large</el-radio-button>
  <el-radio-button label="medium">medium</el-radio-button>
  <el-radio-button label="small">small</el-radio-button>
  <el-radio-button label="mini">mini</el-radio-button>
</el-radio-group>
<el-button @click="handleShowItem" :round="false" style="margin-bottom: 10px;">显示/隐藏 [创建人] 项目</el-button>
<el-description title="基本信息" :columns="3" :size="size" label-suffix=":">
  <el-description-item label="姓名">
    <span slot="label">
      111
      <el-tooltip content="辅助说明文字">
        <i class="el-icon-warning-outline"></i>
      </el-tooltip>
    </span>
    <span>张三</span>
  </el-description-item>
  <el-description-item label="性别">男</el-description-item>
  <el-description-item label="年龄">20</el-description-item>
  <el-description-item label="住址">中国北京</el-description-item>
  <el-description-item label="创建人" v-if="isItemShowFlag">zhanghuan6</el-description-item>
  <el-description-item label="备注" :span="3">
    备注--------------
  </el-description-item>
  <el-description-item label-class="description-item-label-class" content-class="description-item-custom-class" label="自定义class">可自定义class</el-description-item>
</el-description>
<script>
  export default {
    data() {
      return {
        isItemShowFlag: true,
        size: 'large'
      };
    },
    methods: {
      handleShowItem() {
        this.isItemShowFlag = !this.isItemShowFlag;
      }
    }
  }
</script>
```
:::

### Description Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title   | 描述列表的标题，显示在最顶部 | string | — | — |
| column   | 一行的 `DescriptionItems` 数量 | number | — | 4 |
| label-suffix   | 标签的后缀 | string | — | — |
| bordered   | 是否展示边框 | boolean | — | true |

### Description-Item Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| label   | 内容的描述 | string | — | — |
| span   | 包含列的数量 | number | — | — |
| label-class   | 标签的class | string | — | — |
| content-class   | 内容的class | string | — | — |

### Description-Item Slot
| name | 说明 |
|------|--------|
| — | Description Item 的内容 |
| label | 标签文本的内容 |