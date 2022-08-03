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
    :default-visible-column-keys="defaultVisibleColumnKeys"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    @selection-change="handleSelectionChange"
    @filter-change="handleFilterChange">
    <template slot="batchControl">
      <el-button type="text" :disabled="!isBatchButtonEnable">批量删除</el-button>
    </template>
    <template slot="num1_filter" slot-scope="{ column, $panel }">
      <div style="padding: 0 5px;height: 40px;display: flex;align-items: center;">
        <div v-for="(option, index) in column.filters" :key="index">
          <el-input v-model="option.data"
                    @input="$panel.changeOption($event, !!option.data, option)"
                    @keyup.enter="$panel.confirmFilter()"/>
        </div>
      </div>
    </template>
  </el-pro-table>
</div>
<script>
  const total = parseInt(Math.random() * 100, 10);

  export default {
    data() {
      const properties = {
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
          title: '字符串\n输入',
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
          title: '自定义渲染<br/>111',
          type: 'string'
        }
      };
      return {
        tableData: [],
        multipleSelection: [],
        schema: {
          properties,
          required: [ 'MaxLengthString' ],
        },
        uiSchema: {
          Enum: {
            'ui:options': {
              filters: [
                {
                  value: '1',
                  label: '枚举值一'
                },
                {
                  value: '2',
                  label: '枚举值二'
                }
              ],
              filterMethod: () => {
                return true;
              }
            },
          },
          Number: {
            'ui:options': {
              filters: [{data: ''}],
              // filterRender: {
              //   name: 'input',
              //   class: '11222'
              // },
              slots: {
                filter: 'num1_filter'
              },
              filterMethod(val) {
                if (val.option.data === undefined || val.option.data === null || val.option.data === '') {
                  return true;
                } else if (`${val.cellValue}` === val.option.data) {
                  return true;
                }
                return false;
              }
            }
          },
          HtmlContent: {
            'ui:options': {
              type: 'html',
            },
          },
        },
        data: null,
        totalDataLength: total,
        defaultVisibleColumnKeys: Object.keys(properties).filter((key) => key !== 'Price')
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
          Number: i % total,
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
      handleSelectionChange(val, currentItem) {
        console.log(val, currentItem)
        this.multipleSelection = val;
      },
      handleFilterChange(val) {
        console.log(val);
      }
    }
  }
</script>
```
:::

<!-- ### 多级表头

TODO: 多级表头下筛选存在问题

::: demo
```html
<div>
  <el-pro-table
    :schema="schema"
    :ui-schema="uiSchema"
    row-key="id"
    multiple-selection
    :data="data"
    :default-visible-column-keys="defaultVisibleColumnKeys"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    @selection-change="handleSelectionChange"
    @filter-change="handleFilterChange">
    <template slot="batchControl">
      <el-button type="text" :disabled="!isBatchButtonEnable">批量删除</el-button>
    </template>
  </el-pro-table>
</div>
<script>
  const total = parseInt(Math.random() * 100, 10);

  export default {
    data() {
      const properties = {
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
          title: '字符串\n输入',
          type: 'string',
          updatable: true,
          maxLength: 5
        },
        NumberParent: {
          title: '数字一级表头'
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
          title: '自定义渲染<br/>111',
          type: 'string'
        }
      };
      return {
        tableData: [],
        multipleSelection: [],
        schema: {
          properties,
          required: [ 'MaxLengthString' ],
        },
        uiSchema: {
          Number: {
            'ui:parentColumnId': 'NumberParent'
          },
          Price: {
            'ui:parentColumnId': 'NumberParent'
          },
          Enum: {
            'ui:options': {
              filters: [
                {
                  value: '1',
                  label: '枚举值一'
                },
                {
                  value: '2',
                  label: '枚举值二'
                }
              ],
              filterMethod: () => {
                return true;
              }
            },
          },
          HtmlContent: {
            'ui:options': {
              type: 'html',
            },
          },
        },
        data: null,
        totalDataLength: total,
        defaultVisibleColumnKeys: Object.keys(properties).filter((key) => key !== 'Price')
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
      handleSelectionChange(val, currentItem) {
        console.log(val, currentItem)
        this.multipleSelection = val;
      },
      handleFilterChange(val) {
        console.log(val);
      }
    }
  }
</script>
```
::: -->

### 行选择

通过设置 `selection-type` 属性为 `radio` 或 `checkbox`， 在表格首列显示单选框/复选框。

设置 `selectable` 属性，可控制单选框/复选框是否禁用。

设置 `is-reserve` 属性，可保留当前行的选择状态。

:::demo
```html
<template>
  <div class="pro-table__row-select">
    <el-radio-group v-model="currentSelectionType" @change="onChangeRowSelectionType">
      <el-radio label="radio">单选框</el-radio>
      <el-radio label="checkbox">复选框</el-radio>
    </el-radio-group>
    <el-button type="primary" @click="onSelectRow">选择第三行</el-button>
    <el-button type="primary" @click="onUnSelectRow">取消选择第三行</el-button>
    <el-button type="primary" @click="onSelectMultiRow" :disabled="currentSelectionType === 'radio'">选择第四行和第五行</el-button>
    <el-button type="primary" @click="onSelectAll" :disabled="currentSelectionType === 'radio'">选择所有</el-button>
    <el-button type="primary" @click="onClearMultiRow">清空选择行</el-button>
  </div>
  <div style="margin-bottom: 10px;" v-if="selectionArray.length > 0">
    <el-alert :title="selectionResult" type="info"></el-alert>
  </div>
  <el-pro-table
    ref="table"
    show-overflow
    :selectable="selectable"
    :schema="schema"
    :data="data"
    row-key="id"
    :checkbox-config="{ reserve: true }"
    :selection-type="selectionType"
    @selection-change="onSelectionChange"
  >
  </el-pro-table>
</template>
<script>
export default {
  data() {
    return {
      currentSelectionType: 'checkbox',
      selectionType: 'checkbox',
      schema: {
        "properties": {
          "id": {
            "type": "number",
            "title": "ID"
          },
          "item1": {
            "type": "string",
            "title": "项目一",
          },
          "item2": {
            "type": "string",
            "title": "项目二",
          },
        }
      },
      data: [],
      selectionArray: [],
    };
  },
  computed: {
    selectionResult() {
      return `已选择 ${this.selectionArray.length} 条数据。`;
    }
  },
  created() {
    let parentId = 0;
    for (let i = 0; i < 5000; i += 1) {
      this.data.push({
        id: i,
        item1: `项目一-${i}`,
        item2: `项目二-${i}`
      });
    }
  },
  methods: {
    selectable({ row }) {
      if (row.id === 0) {
        return false;
      }
      return true;
    },
    onChangeRowSelectionType() {
      this.selectionType = this.currentSelectionType;
      this.$nextTick(() => {
        this.$refs.table.reloadColumn();
      });
    },
    onSelectRow() {
      this.$refs.table.setSelection(this.data[2]);
    },
    onUnSelectRow() {
      this.$refs.table.setSelection(this.data[2], false);
    },
    onSelectMultiRow() {
      this.$refs.table.setSelection([this.data[3], this.data[4]]);
    },
    onSelectionChange(val) {
      console.log(val);
      this.selectionArray = val;
    },
    onClearMultiRow() {
      this.$refs.table.getTableActionRef().clearSelection();
      this.selectionArray = [];
    },
    onSelectAll() {
      this.$refs.table.getTableActionRef().setFullCheckboxRow(true);
      this.$nextTick(() => {
        console.log(this.$refs.table.getTableActionRef().getAllCheckboxRecords());  
      });
    }
  },
};
</script>
```
:::


### 树形态


:::demo
```html
<template>
  <el-pro-table
    ref="table"
    show-overflow
    :schema="schema"
    :data="data"
    :tree-config="{ children: 'childs' }"
    :treeNode="'id'"
    row-key="id"
  >
  </el-pro-table>
</template>
<script>
export default {
  data() {
    return {
      schema: {
        "properties": {
          "id": {
            "type": "string",
            "title": "ID"
          },
          "name": {
            "type": "string",
            "title": "名称",
          },
          "type": {
            "type": "string",
            "title": "类型",
          },
          "size": {
            "type": "string",
            "title": "长度",
          },
          "date": {
            "type": "string",
            "title": "日期",
          },
        }
      },
      data: [],
    };
  },
  computed: {
    selectionResult() {
      return `已选择 ${this.selectionArray.length} 条数据。`;
    }
  },
  created() {
   this.data = [
     { id: 1000, name: 'vxe-table 从入门到放弃1', type: 'mp3', size: 1024, date: '2020-08-01' },
                {
                  id: 1005,
                  name: 'Test2',
                  type: 'mp4',
                  size: null,
                  date: '2021-04-01',
                  childs: [
                    { id: 24300, name: 'Test3', type: 'avi', size: 1024, date: '2020-03-01' },
                    { id: 20045, name: 'vxe-table 从入门到放弃4', type: 'html', size: 600, date: '2021-04-01' },
                    {
                      id: 10053,
                      name: 'vxe-table 从入门到放弃96',
                      type: 'avi',
                      size: null,
                      date: '2021-04-01',
                      childs: [
                        { id: 24330, name: 'vxe-table 从入门到放弃5', type: 'txt', size: 25, date: '2021-10-01' },
                        { id: 21011, name: 'Test6', type: 'pdf', size: 512, date: '2020-01-01' },
                        { id: 22200, name: 'Test7', type: 'js', size: 1024, date: '2021-06-01' }
                      ]
                    }
                  ]
                },
                { id: 23666, name: 'Test8', type: 'xlsx', size: 2048, date: '2020-11-01' },
                { id: 24555, name: 'vxe-table 从入门到放弃9', type: 'avi', size: 224, date: '2020-10-01' }
   ]
  },
  methods: {
  },
};
</script>
```
:::

### ProTable Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| data    | 数据 | Array | — | — |
| schema    | 基于[JSON-Schema]的属性 | Object | — | — |
| ui-schema | 用于设置各个表单字段的组件类型(ui:widget)、是否可用(ui:disabled)等属性 (请参照下表) | Object | — | - |
| row-key    | 行主键 | String | — | — |
| height    | 表格高度 | String | — | — |
| max-height    | 表格最大高度 | String | — | — |
| selection-type    | 列表选择类型 | String | 'radio', 'checkbox', '' | — |
| multiple-selection    | 是否多选 | Boolean | — | false |
| selectable    | 通过返回值来决定这一行的 CheckBox 是否可以勾选 | Function | — | — |
| row-buttons    | 获取行数据操作按钮 | Function | — | — |
| tableList-transform    | 列表数据转换函数 | Function | — | — |
| parent-field    | 标识上级节点的字段名 | String | — | — |
| column-width    | 列宽度 | String | — | — |
| auto-pagination    | 前端分页 | Boolean | — | true |
| default-all-columnSort    | 是否所有列默认允许排序 | Boolean | — | false |
| is-reserve    | 是否保留CheckBox选中状态 | Boolean | — | false |
| merge-cells    | 合并单元格回调方法 | Function | — | —  |
| loading    | 加载状态 | Boolean | — | —  |
| menu-config    |  获取行数据快捷菜单按钮  menu-button-click | Object | — | —  |
| check-strictly    | 待补充 | Boolean | — | —  |
| merge-footer-items    | 待补充 | Array | — | —  |
| footer-method    | 待补充 | Function | — | —  |
| show-footer    | 待补充 | Function | — | —  |
| seq-config    | 序号配置项 | Object | — | —  |
| checkbox-config    | 复选框配置项 | Object | — | —  |
| radio-config    | 单选框配置项 | Object | — | —  |
| expand-config    | 展开行配置项（不能用于虚拟滚动） | Object | — | —  |
| tree-config    | 树形结构配置项 | Object | — | { children: 'children' }  |
| sort-config    | 排序配置项 | Object | — | — |
| export-config    | 导出配置项 | Object | — | — |
| proxy-config    | 数据代理配置项 | Object | — | — |
| tree-node    | 指定为树节点 | String | — | — |
| virtual-tree    | 是否使用虚拟树 | Boolean | — | — |
| sort-method    | 全表排序自定义函数 | Function | — | — |
| show-pagination    | 是否显示分页 | Boolean | — | true |
| page-num    | 当前页号 | Number | — | — |
| page-size    | 每页显示数据数量 | Number | — | — |
| total    | 数据总数量 | Number | — | — |
| control-column-width    | 控制列宽度 | String | — | '120' |
| table-id    | 表格ID，主要用于对表格的配置进行缓存 | String | — | — |
| show-expand-all-btn    | 是否显示"全部展开"按钮，：is-tree="true"时生效 | Boolean | — | true |
| show-collapseall-btn    | 是否显示"全部收缩"按钮，：is-tree="true"时生效 | Boolean | — | true |
| show-column-setting    | 是否显示右上角的列设置 | Boolean | — | true |
| row-class-name    | 待补充 | String | — | —  |

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
| filter-change  | 筛选条件变更 | val 当前值 |

### ProTable Methods

待补充

### 插槽(Slot)

| 名称 | 描述 |
|------|--------|
| pagerLeft | 分页器左侧内容 |
| pagerRight | 分页器右侧内容 |

