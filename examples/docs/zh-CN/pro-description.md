## ProDescription 高级定义列表

高级描述列表组件，提供一个更加方便快速的方案来构建描述列表。
ProDescriptions 的诞生是为了解决项目中需要写很多 Descriptions 的样板代码的问题，所以在其中做了封装了很多常用的columns 列展示的逻辑。

### 基本用法

:::demo
```html
<template>
  <div>
    <el-pro-description :schema="schema" :ui-schema="uiSchema" :data="data">
      <span slot="CustomSlot" slot-scope="{data}">
        <el-button type="text">{{ data }}</el-button>
      </span>
    </el-pro-description>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        labelMode: true,
        schema: {
          properties: {
            Name: {
              title: '名称',
              type: 'string',
            },
            Enum: {
              title: '枚举值',
              type: 'string',
              oneOf: [
                {
                  const: '1',
                  title: '枚举值一'
                },
                {
                  const: '2',
                  title: '枚举值二'
                }
              ],
            },
            AnyOf: {
              title: '多选枚举值',
              type: 'array',
              anyOf: [
                {
                  const: '1',
                  title: '枚举值一'
                },
                {
                  const: '2',
                  title: '枚举值二'
                }
              ],
            },
            Number: {
              title: '数字',
              type: 'number',
            },
            Price: {
              title: '价格',
              type: 'number',
              precision: '16',
              scale: '2',
              format: 'price',
            },
            Price2: {
              title: '价格2',
              type: 'number',
              // scale: '2',
              format: 'price',
            },
            Comment: {
              title: '备注',
              type: 'string',
            },
            Date: {
              title: '日期',
              type: 'string',
              format: 'date',
            },
            Time: {
              title: '时间',
              type: 'string',
              format: 'time',
            },
            Boolean: {
              title: '布尔值',
              type: 'boolean',
            },
            CustomSlot: {
              title: '自定义插槽',
              type: 'string',
            }
          },
        },
        uiSchema: {
          Comment: {
            'ui:colspan': 3,
          }
        },
        data: {},
      };
    },
    created() {
      // 设置页面初始状态
      this.initialState();
    },
    methods: {
      /**
       * 初始化
       */
      initialState() {
        this.data = {
          Name: 'XXX',
          Price: 12345.678,
          Price2: '12345',
          Enum: '2',
          AnyOf: ['1', '2'],
          Number: 98765,
          Date: '2021-09-03',
          Time: '10:59:00',
          Comment: '高级描述列表组件，提供一个更加方便快速的方案来构建描述列表。 ProDescriptions 的诞生是为了解决项目中需要写很多 Descriptions 的样板代码的问题，所以在其中做了封装了很多常用的columns 列展示的逻辑。',
          'Boolean': true,
          CustomSlot: 'Link'
        };
      },
    }
  }
</script>
```
:::


### DetailForm 属性

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| tab-list     | 页签列表，当需要使用页签的场合，可传入 { label: '', key: '' } 结构的数组           | Array | — | — |
| active-tab     | `sync` 默认显示的页签  | String | — | — |
| label-mode     | 是否为编辑模式           | Boolean | — | true |
| force-content-render     | Tab页签内容被隐藏时是否渲染 DOM 结构    | Boolean | — | true |
| before-tab-leave | 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。    | Function | — |  — |
| before-return | 点击返回按钮后的回调函数，可返回reject状态promise或false以阻止页面返回。  | Function | — |  — |
| custom-validator | 自定义校验函数。需返回 Promise 且 resolve 数组，数组元素格式为 { field, message }。    | Function | — |  — |

### DetailForm 插槽

| 名称 | 描述 |
|------|--------|
| title | 标题的内容 |
| titleBar | 标题右侧操作按钮插槽 |

### DetailForm 事件


| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| close | 关闭alert时触发的事件 | — |

### DetailForm 方法


| 方法名称    | 说明           | 入参   | 返回参数 |
| ----------- | -------------- | ------ | -------- |
| customValidate   | 仅执行自定义校验函数 | — |  是否校验通过  |
| validate   | 执行校验（含form-card, table-card, 自定义校验函数） | — |  是否校验通过  |
