## ProTable 高级表格

`ProTable` 的诞生是为了解决项目中需要写很多 table 的样板代码的问题，所以在其中做了封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。

根据 [JSON-Schema](https://json-schema.org/) 可渲染对应的表单用于数据的展示和编辑。

### 何时使用

当希望使用JsonSchema快速渲染表格数据时，`ProTable` 是不二选择。

### 基本使用

::: demo
```html
<div>
  <el-pro-table
    :schema="schema"
    :ui-schema="uiSchema"
    row-key="id"
    multiple-selection
    :data="data"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    @selection-change="handleSelectionChange">
    <template slot="batchControl">
      <el-button type="text" :disabled="!isBatchButtonEnable">批量删除</el-button>
    </template>
  </el-pro-table>
</div>
<script>
  const total = parseInt(Math.random() * 100, 10);

  export default {
    data() {
      return {
        tableData: [],
        multipleSelection: [],
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
              updatable: true,
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
              updatable: true,
            },
            MaxLengthString: {
              title: '字符串输入',
              type: 'string',
              updatable: true,
              maxLength: 5
            },
            Number: {
              title: '数字',
              type: 'number',
              updatable: true,
            },
            Price: {
              title: '价格',
              type: 'number',
              precision: '16',
              scale: '2',
              format: 'price',
              updatable: true,
            },
            Comment: {
              title: '备注',
              type: 'string',
              updatable: true,
            },
            Date: {
              title: '日期',
              type: 'string',
              format: 'date',
              updatable: true,
            },
            Time: {
              title: '时间',
              type: 'string',
              format: 'time',
              updatable: true,
            },
            Boolean: {
              title: '布尔值',
              type: 'boolean',
              updatable: true,
            },
            CustomSlot: {
              title: '自定义插槽',
              type: 'string',
              updatable: true,
            },
            HtmlContent: {
              title: '自定义渲染',
              type: 'string'
            }
          },
          required: [ 'MaxLengthString' ],
        },
        uiSchema: {
        },
        data: null,
        totalDataLength: total
      }
    },
    computed: {
      isBatchButtonEnable() {
        return this.multipleSelection.length > 0;
      }
    },
    mounted() {
      const tableData = [];
      for (let i = 0; i < total; i++) {
        tableData.push({
          Name: 'XXX',
          Price: 12345.678,
          Enum: '2',
          AnyOf: ['1', '2'],
          MaxLengthString: null,
          Number: 98765,
          Date: '2021-08-31',
          Time: '11:29:00',
          Comment: 'setaria-ui',
          'Boolean': true,
          CustomSlotCode: '4104.01.03.01.02.05.10',
          CustomSlot: '装饰线条',
          HtmlContent: 'Link'
        });
      }
      this.data = tableData;
    },
    methods: {
      onRequest(params) {
        const { pageNum, pageSize } = params;
        const tableData = [];
        const startIndex = ((pageNum - 1) * pageSize) + 1;
        const endIndex = (pageNum * pageSize) > total ? total : (pageNum * pageSize);
        for (let i = startIndex; i <= endIndex; i++) {
          tableData.push({
            no: i,
            id: `zhangsan${i}`,
            age: parseInt(Math.random() * 100, 10),
            gender: (parseInt(Math.random() * 10, 10) % 2) + 1,
            birth: '1990-10-01',
            interest: '1'
          });
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: tableData,
              total
            });
          }, 2000);
        });
      },
      handleUpdateButtonClick({ row }) {
        this.$message.warning(`修改 ${row.id} 数据!`);
      },
      handleCurrentChange(val) {
        this.$message.info(`跳转至 ${val} 页`);
      },
      handleSizeChange(val) {
        this.$message.info(`每页数据显示数量改为 ${val}`);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
```
:::

### ProTable Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| model   | 表单数据对象 | object      |                  —                |  — |
| rules    | 表单验证规则 | object | — | — |
| inline    | 行内表单模式 | boolean | — | false |
| disabled | 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效 | boolean | — | false |
| label-position | 表单域标签的位置 | string |  right/left/top            | top |
| label-width | 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值 | string | — | — |
| label-suffix | 表单域标签的后缀 | string | — | — |
| show-message  | 是否显示校验错误信息 | boolean | — | true |
| schema | JSON Schema对象 | Object | — | - |
| ui-schema | 用于设置各个表单字段的组件类型(ui:widget)、是否可用(ui:disabled)等属性 (请参照下表) | Object | — | - |
| columns | 表单的列数。分辨率在768像素以下时表单列数固定为1 | Number | — | 5 |
| column-max-label-length | 以col为单位的form-label的最大长度，超过的部分则截取省略。此时Label外增加 `el-TOOLTIP` 可查看全部Label | Number | - | - |

### UI-Schema Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| ui:widget | 表单字段的组件类型 | string | password, textarea, select, checkbox, radio  |  — |
| ui:disabled | 表单字段的组件是否可用 | boolean | - | false |
| ui:hidden | 表单字段的组件是否可见 | boolean | - | false |
| ui:options | 表单字段的组件独有属性 | object | UI组件独有属性 | - |
| ui:colspan | 跨越的列数 | number | - | - |

### ProTable Events

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| change  | 表单字段值变更时回调 | key 表单字段的Key, val 表单字段的值 |

### ProTable Methods

| 方法名      | 说明          | 参数
|---------- |-------------- | --------------
| validate | 对整个表单进行校验的方法 | Function(callback: Function(boolean))
| validateField | 对部分表单字段进行校验的方法 | Function(prop: string, callback: Function(errorMessage: string))
| resetFields | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | -
