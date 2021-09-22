## ProTable 高级表格

`ProTable` 的诞生是为了解决项目中需要写很多 table 的样板代码的问题，所以在其中做了封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。

根据 [JSON-Schema](https://json-schema.org/) 可渲染对应的表单用于数据的展示和编辑。

### 何时使用

当希望使用JsonSchema快速渲染表格数据时，`ProTable` 是不二选择。

### 使用前准备

请先`main.js`中引入ProTable 组件

```java
import ProTable from 'setaria-ui/lib/pro-table';
import ProTableCommonInstall from 'setaria-ui/packages/pro-table/src/common-install';
import 'setaria-ui/packages/theme-chalk/src/vxe-table.scss';
import 'setaria-ui/packages/theme-chalk/src/pro-table.scss';


Vue.use(ProTableCommonInstall);
Vue.component('el-pro-table', ProTable);


```


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
| data    | 数据 | Array | — | — |
| schema    | 基于[JSON-Schema]的属性 | Object | — | — |
| ui-schema | 用于设置各个表单字段的组件类型(ui:widget)、是否可用(ui:disabled)等属性 (请参照下表) | Object | — | - |
| rowKey    | 行主键 | String | — | — |
| height    | 表格高度 | String | — | — |
| maxHeight    | 表格最大高度 | String | — | — |
| selectionType    | 列表选择类型 | String | 'radio', 'checkbox', '' | — |
| multipleSelection    | 是否多选 | Boolean | — | false |
| selectable    | 通过返回值来决定这一行的 CheckBox 是否可以勾选 | Function | — | — |
| getRowButton    | 获取行数据操作按钮 | Function | — | — |
| tableListTransform    | 列表数据转换函数 | Function | — | — |
| parentField    | 标识上级节点的字段名 | String | — | — |
| columnWidth    | 列宽度 | String | — | — |
| autoPagination    | 前端分页 | Boolean | — | true |
| defaultAllColumnSort    | 是否所有列默认允许排序 | Boolean | — | false |
| isReserve    | 是否保留CheckBox选中状态 | Boolean | — | false |
| mergeCells    | 合并单元格回调方法 | Function | — | —  |
| loading    | 加载状态 | Boolean | — | —  |
| menuConfig    |  获取行数据快捷菜单按钮  menu-button-click | Object | — | —  |
| checkStrictly    | 待补充 | Boolean | — | —  |
| mergeFooterItems    | 待补充 | Array | — | —  |
| footerMethod    | 待补充 | Function | — | —  |
| showFooter    | 待补充 | Function | — | —  |
| seqConfig    | 序号配置项 | Object | — | —  |
| checkboxConfig    | 复选框配置项 | Object | — | —  |
| radioConfig    | 单选框配置项 | Object | — | —  |
| expandConfig    | 展开行配置项（不能用于虚拟滚动） | Object | — | —  |
| treeConfig    | 树形结构配置项 | Object | — | { children: 'children' }  |
| sortConfig    | 排序配置项 | Object | — | — |
| exportConfig    | 导出配置项 | Object | — | — |
| proxyConfig    | 数据代理配置项 | Object | — | — |
| treeNode    | 指定为树节点 | String | — | — |
| virtualTree    | 是否使用虚拟树 | Boolean | — | — |
| sortMethod    | 全表排序自定义函数 | Function | — | — |
| showPagination    | 是否显示分页 | Boolean | — | true |
| pageNum    | 当前页号 | Number | — | — |
| pageSize    | 每页显示数据数量 | Number | — | — |
| total    | 数据总数量 | Number | — | — |
| controlColumnWidth    | 控制列宽度 | String | — | '120' |
| tableId    | 表格ID，主要用于对表格的配置进行缓存 | String | — | — |
| showExpandAllBtn    | 是否显示"全部展开"按钮，：is-tree="true"时生效 | Boolean | — | true |
| showCollapseAllBtn    | 是否显示"全部收缩"按钮，：is-tree="true"时生效 | Boolean | — | true |
| showColumnSetting    | 是否显示右上角的列设置 | Boolean | — | true |
| rowClassName    | 待补充 | String | — | —  |

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
| current-change  | 当前页变更 | val 当前页变更值 |
| size-change  | pageSize 改变时会触发 | val pageSize变更值 |
| row-button-click | 自定义操作按钮点击事件 | key 定义的key  scope 当前scope信息 |
| select-all | 选中所有 | records 选中所有数据 |
| selection-change | 选中变更 | selectionArray 选中的数据 |
| cell-click | 单元格点击 | val 单元格数据 |
| menu-click | 待补充 | val 待补充 |
| cell-menu | 待补充 | val 待补充 |
| sort-change | 待补充 | val 待补充 |
| page-change | 分页器内容变更 | val { currentPage, pageSize } |
| cell-link-click | 待补充 | - |

### ProTable Methods

待补充

### 插槽

待补充

