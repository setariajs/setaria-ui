## ProTable 高级表格

**开发中，计划使用引入vxe-table以解决数据量大等问题。**

`ProTable` 的诞生是为了解决项目中需要写很多 table 的样板代码的问题，所以在其中做了封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。

依托于 `ProForm` `的能力，ProForm` 拥有多种形态，可以切换查询表单类型，设置变形成为一个简单的 Form 表单，执行新建等功能。

根据 [JSON-Schema](https://json-schema.org/) 可渲染对应的表单用于数据的展示和编辑

### 何时使用

当你的表格需要与服务端进行交互或者需要多种单元格样式时，`ProTable` 是不二选择。

### 基本使用

::: demo
```html
<div>
  <el-pro-table
    ref="proTable"
    collapse
    :schema="schema"
    :ui-schema="uiSchema"
    row-key="id"
    multiple-selection
    :total="totalDataLength"
    :table-data="data"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    @selection-change="handleSelectionChange">
    <template slot="toolbar">
      <el-button size="mini" type="primary" icon="el-icon-plus">新建</el-button>
    </template>
    <template slot="batchControl">
      <el-button type="text" :disabled="!isBatchButtonEnable">批量删除</el-button>
    </template>
    <!-- slot插槽名称需要在schema.properties内进行定义，譬如下例的control -->
    <template slot="control" slot-scope="scope">
      <el-button type="text" @click="handleUpdateButtonClick(scope)">修改</el-button>
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
        schema: {},
        uiSchema: {
          "id": {
            "ui:options": {
              "width": "100px"
            }
          },
          "age": {
            "ui:options": {
              "sortable": true
            }
          },
          "birth": {
            "ui:options": {
              "width": "100px",
              formatter(row, column, value) {
                return value && value.replace && value.replace(/\-/g, '/');
              }
            }
          },
          "interest": {
            "ui:colspan": 2
          },
          "comment": {
            "ui:options": {
              type: 'textarea'
            },
            "ui:colspan": 2
          }
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
      this.schema = {
        "properties": {
          "id": {
            "description": "用户ID",
            "type": "string",
            "title": "用户ID",
            "minLength": 3,
            "maxLength": 6
          },
          "age": {
            "type": "integer",
            "title": "年龄"
          },
          "gender": {
            "type": "integer",
            "title": "性别",
            "oneOf": [
              {"const": 1, "title": "男"},
              {"const": 2, "title": "女"}
            ]
          },
          "birth": {
            "type": "string",
            "title": "出生年月日",
            "format": "date"
          },
          "time": {
            "type": "array",
            "title": "时间",
            "format": "time"
          },
          "dateTime": {
            "type": "string",
            "title": "日期时间",
            "format": "date-time"
          },
          "interest": {
            "type": "array",
            "title": "兴趣",
            "anyOf": [
              {"const": "1", "title": "游戏"},
              {"const": "2", "title": "音乐"},
              {"const": "3", "title": "运动"}
            ]
          },
          "control": {
            "title": "操作"
          }
        }
      };
      const tableData = [];
      for (let i = 0; i < total; i++) {
        tableData.push({
          no: i,
          id: `zhangsan${i + 1}`,
          age: parseInt(Math.random() * 100, 10),
          gender: (parseInt(Math.random() * 10, 10) % 2) + 1,
          birth: '1990-10-01',
          interest: '1'
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
