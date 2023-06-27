## ProDescription 高级定义列表

高级描述列表组件，提供一个更加方便快速的方案来构建描述列表。
ProDescriptions 的诞生是为了解决项目中需要写很多 Descriptions 的样板代码的问题，所以在其中做了封装了很多常用的columns 列展示的逻辑。

### 基本用法

:::demo
```html
<template>
  <div>
    <el-pro-description :schema="schema"  :ui-schema="uiSchema" :data="data" >
      <span slot="CustomSlot" slot-scope="{data}">
        <el-button type="text">{{ data }}</el-button>
      </span>
      <!-- 自定义插槽中可自定义label -->
      <span slot="label.CustomSlot"  slot-scope="{data}" >
        我是自定义label
      </span>
     <span slot="label.Name" slot-scope="{data}">
        我是自定义Name{{data.Name}}
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
             
            Price3: {
              title: '价格3',
              type: 'number',
              // scale: '2',
              format: 'price',
            },
           
            Price4: {
              title: '价格4',
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
            'ui:colspan': 4,
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
          Price3: '啊啊啊',
           Price4: '啊啊啊22',
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


###  属性

| 参数         | 说明             | 类型   | 可选值                | 默认值     |
| ------------ | ---------------- | ------ | --------------------- | ---------- |
| data         | 对象数据         | Object | —                     | —          |
| columns      | 一行要显示列数   | Number | —                     | 3          |
| label-suffix | 表单域标签的后缀 | String | —                     | :          |
| schema       | schema信息       | Object | —                     | —          |
| ui-schema    | ui信息           | Object | —                     | —          |
| direction    | 排列的方向       | String | vertical / horizontal | horizontal |



###  插槽

| name           | 说明                |
| -------------- | ------------------- |
| label.[字段名] | label区域自定义插槽 |
| [字段名]       | 对应字段自定义插槽  |

