## Scehma 属性

框架中围绕这Schema机制来运行的，这里介绍Schema相关内容

### 外层结构

```javascript

const schema = {
  required: ['Name', 'Enum', 'AnyOf', 'Number', 'CustomSlot', 'Date', 'Time'],// 一些必填的字段名
  properties: {// 属性定义明细见下
    index: {
      title: '序号',
      type: 'index'
    },
    Name: {
      title: '名称',
      type: 'string',
    },
    Enum: {
      title: '枚举值',
      type: 'number',
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
      requiredTip: 'select'
    },
    Readonly: {
      title: '只读项目',
      type: 'string',
      editable: false,
    },
    searchHelp: {
      title: '搜索帮助',
      type: 'string'
    },
    formItemHiddenField: {
      title: '动态表单状态下隐藏与否字段',
      type: 'string'
    },
  },
}
```

### Schema.properties  说明

此属性用于支持组件展示相关内容使用，可查看下面对应属性


| 属性名      | 说明                                  | 类型    | 可选值                                                          | 备注                                                                                                               |
| ----------- | ------------------------------------- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| title       | 属性显示名                            | String  | —                                                               | —                                                                                                                  |
| type        | 属性类型                              | String  | index,string,number,array,integer,boolean                       | index被用于表格展示序号功能时使用                                                                                  |
| format      | 格式化                                | String  | price,date,date-time,time,date-range,date-time-range,time-range | 当 此数据为`date,date-time,time,date-range,date-time-range,time-range`值时组件会自动渲染成对应的日期或时间选择组件 |
| editable    | 是否可编辑                            | Boolean | —                                                               | —                                                                                                                  |
| description | 用于label上显示提示文言的内容         | String  | —                                                               | —                                                                                                                  |
| oneOf       | 此数据下可选（单选）的值列            | Array   | —                                                               | 如指定此数据，则组件渲染为下拉组件,示例：[{const: '1',title: '枚举值一' },{const: '2',title: '枚举值二'}]          |
| anyOf       | 此数据下可选（多选）的值列            | Array   | —                                                               | 如指定此数据，则组件渲染为下拉组件,示例：[{const: '1',title: '枚举值一' },{const: '2',title: '枚举值二'}]          |
| scale       | 精确小数位数，当format为`price`时可用 | Number  | —                                                               | —                                                                                                                  |
| pattern     | 正则表达式校验                        | Reg     | —                                                               | —                                                                                                                  |
| minLength   | 属性值的最小长度校验                  | Number  | —                                                               | —                                                                                                                  |
| maxLength   | 属性值的最大长度校验                  | Number  | —                                                               | —                                                                                                                  |
| requiredTip | 必填校验时的提示类型                  | String  | input,select                                                    | 有时必填校验提示的内容会有问题，可使用此属性来指定提示类型                                                         |
| trim        | 是否开启自动删除前后空格功能          | Boolean | —                                                               | —                                                                                                                  |

