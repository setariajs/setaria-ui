## EditableProTable 高级表格

可编辑表格 EditableProTable 与 ProTable 的功能基本相同，为了方便使用 EditableProTable 增加了一些预设，修改了 data 和 onChange 使其可以方便的继承到 setaria-ui 的 JsonForm 中。

### 使用前准备

请先`main.js`中引入 EditableProTable 组件

```java
import EditableProTable from 'setaria-ui/lib/editable-pro-table';
import ProTableCommonInstall from 'setaria-ui/packages/pro-table/src/common-install';
import 'setaria-ui/packages/theme-chalk/src/vxe-table.scss';
import 'setaria-ui/packages/theme-chalk/src/pro-table.scss';

Vue.use(ProTableCommonInstall);
Vue.component('el-editable-pro-table', EditableProTable);


```
### 基本用法

:::demo
```html
<template>
  <div>
    <el-button type="primary" @click="() => { this.labelMode = !this.labelMode }">{{ labelMode ? '进入编辑' : '退出编辑' }}</el-button>
  </div>
  <el-editable-pro-table
    :label-mode="labelMode"
    multiple-selection
    column-width="auto"
    :get-row-button="getRowButton"
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    :dialog-attrs="dialogAttrs"
    :form-attrs="formAttrs"
    :form-label-suffix="':'"
    :can-add="canAdd"
    :can-update="canUpdate"
    :can-delete="canDelete"
    :before-add-row="beforeAddRow"
    :before-modify-row="beforeModifyRow"
    @data-change="onDataChange"
    @row-button-click="onRowButtonClick"
    @selection-change="onSelectionChange"
    :save="save"
  >
    <template slot="batchControl" v-if="!labelMode">
      <el-button type="text" @click="canAdd=!canAdd">{{ canAdd ? '禁止' : '允许' }}新增</el-button>
      <el-button type="text" @click="canUpdate=!canUpdate">{{ canUpdate ? '禁止' : '允许' }}修改</el-button>
      <el-button type="text" @click="canDelete=!canDelete">{{ canDelete ? '禁止' : '允许' }}删除</el-button>
    </template>
    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}</el-button>
    </template>
    <template slot="CustomSlot" slot-scope="scope">
      <el-rate :disabled="scope.status !== 'edit'"
               v-model="scope.data.CustomSlotCode"></el-rate>
    </template>
  </el-editable-pro-table>
  <div>
    <el-json-viewer :data="data"></el-json-viewer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelMode: true,
      formAttrs:{
        columns: 3,
        'label-position': 'top',
        'label-suffix': '：'
      },
      dialogAttrs:{
        title:'自定义标题',
        width:'90%'
      },
      schema: {
        properties: {
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
        },
        required: [ 'Name' ],
      },
      uiSchema: {
        index: {
          'ui:options': {
            fixed: 'left',
            width: '100px'
          }
        },
        Name: {
          'ui:options': {
            fixed: 'left',
          },
        },
        Enum: {
          'ui:options': {
            fixed: 'left',
          },
        },
        searchHelp: {
          'ui:options': {
            'suffix-icon': 'el-icon-search',
            readonly: true,
          },
          'ui:nativeOn': {
            click: () => {
              this.$message.info('searchHelp click')
            },
          },
        }, 
      },
      data: [],
      canAdd: true,
      canUpdate: true,
      canDelete: true
    };
  },
  created() {
    this.headInfoData = {
      Name: 'XXX',
      Price: 12345.678,
      Enum: 2,
      AnyOf: ['1', '2'],
      MaxLengthString: null,
      Number: 98765,
      Date: '2021-08-31',
      Time: '17:18:00',
      Comment: 'setaria-ui',
      'Boolean': true,
      CustomSlotCode: 4.3,
      CustomSlot: '装饰线条',
      Readonly: '信息不可修改'
    };
    for (let i = 0; i < 5; i += 1) {
      const data = {
        ...this.headInfoData
      };
      data.Name = `${data.Name}-${i}`;
      this.data.push({
        id: i,
        ...data
      }); 
    }
  },
  methods: {
    getRowButton({ rowIndex }) {
      return [
        {
          key: '1',
          label: `按钮A${rowIndex}`,
        },
        {
          key: '2',
          label: `按钮B${rowIndex}`,
        },
      ];
    },
    onDataChange(key, val, data, originData) {
      console.log(`项目${key}修改为${val}`, data, originData);
    },
    onRowButtonClick(key, { row }) {
      this.$message.info(`点击按钮的key为:${key}, 行数据为${JSON.stringify(row)}`);
    },
    onSelectionChange(val) {
      console.log(val);
    },
    beforeAddRow() {
      return {
        Name: 'YYY',
        Price: null,
        Enum: null,
        AnyOf: null,
        Number: null,
        Date: null,
        Time: null,
        Comment: null,
        'Boolean': true,
        CustomSlotCode: null,
        CustomSlot: null,
        Readonly: '只读信息只读信息'
      };
    },
    beforeModifyRow(scope) {
      console.log(scope);
      return true;
    },
    save(data, mode) {
      return new window.Promise((resolve, reject) => {
        const loading = this.$loading();
        setTimeout(() => {
          if (mode === 'delete') {
            if (data.findIndex(item => item.id === 1) === -1) {
              resolve();
            } else {
              this.$message.warning('不允许删除id为1的数据');
              reject();
              loading.close();
              return;
            }
          } else {
            resolve({});
          }
          loading.close();
          let label = '';
          switch(mode) {
            case 'add':
              label = '新增';
              break;
            case 'modify':
              label = '修改';
              break;
            case 'delete':
              label = '删除';
              break;
            default:
              label = '保存';
          }
          const saveData = Array.isArray(data) ? data : [data];
          this.$message.success(`id为 ${saveData.map(item => item.id).join(',')} 的数据已成功${label}。`);
        }, 1000);
      })
    }
  }
};
</script>
```
:::

### 项目间联动

:::demo
```html
<template>
  <div>
    <el-button type="primary" @click="() => { this.labelMode = !this.labelMode }">{{ labelMode ? '进入编辑' : '退出编辑' }}</el-button>
  </div>
  <el-editable-pro-table
    :label-mode="labelMode"
    column-width="auto"
    multiple-selection
    :get-row-button="getRowButton"
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    :can-add="canAdd"
    :can-update="canUpdate"
    :can-delete="canDelete"
    :before-add-row="beforeAddRow"
    @data-change="onDataChange"
    @row-button-click="onRowButtonClick"
    @selection-change="onSelectionChange"
    @dialog-open="onDialogOpen"
    :save="save"
  >
    <template slot="batchControl" v-if="!labelMode">
      <el-button type="text" @click="canAdd=!canAdd">{{ canAdd ? '禁止' : '允许' }}新增</el-button>
      <el-button type="text" @click="canUpdate=!canUpdate">{{ canUpdate ? '禁止' : '允许' }}修改</el-button>
      <el-button type="text" @click="canDelete=!canDelete">{{ canDelete ? '禁止' : '允许' }}删除</el-button>
    </template>
    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}</el-button>
    </template>
    <template slot="CustomSlot" slot-scope="scope">
      <el-rate :disabled="scope.status !== 'edit'"
               v-model="scope.data.CustomSlotCode"></el-rate>
    </template>
  </el-editable-pro-table>
  <div>
    <el-json-viewer :data="data"></el-json-viewer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelMode: false,
      schema: {
        properties: {
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
            ]
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
          },
          Readonly: {
            title: '只读项目',
            type: 'string',
            editable: false,
          },
          linkage: {
            title: '联动项目',
            description: '枚举值为1时，显示为输入框，为2时，显示为下拉框',
            type: 'string'
          },
          searchHelp: {
            title: '搜索帮助',
            type: 'string'
          },
        },
        required: [ 'Name' ],
      },
      uiSchema: {
        index: {
          'ui:options': {
            fixed: 'left',
            width: '100px'
          }
        },
        Name: {
          'ui:options': {
            fixed: 'left',
            minWidth: '150px'
          },
        },
        Enum: {
          'ui:options': {
            fixed: 'left',
            width: '150px'
          },
        },
        Comment: {
          'ui:colspan': 2
        },
        searchHelp: {
          'ui:options': {
            'suffix-icon': 'el-icon-search',
            readonly: true,
          },
          'ui:nativeOn': {
            click: () => {
              this.$message.info('searchHelp click')
            },
          },
        },
      },
      lineageEnumArray: [
        {
          const: 'a',
          title: 'AAA',
        },
        {
          const: 'b',
          title: 'BBB',
        }
      ],
      data: [],
      canAdd: true,
      canUpdate: true,
      canDelete: true
    };
  },
  created() {
    this.headInfoData = {
      Name: 'XXX',
      Price: 12345.678,
      Enum: '2',
      AnyOf: ['1', '2'],
      MaxLengthString: null,
      Number: 98765,
      Date: '2021-08-31',
      Time: '17:18:00',
      Comment: 'setaria-ui',
      'Boolean': true,
      CustomSlotCode: 4.3,
      CustomSlot: '装饰线条',
      Readonly: '信息不可修改',
      linkage: 'b'
    };
    for (let i = 0; i < 5; i += 1) {
      const data = {
        ...this.headInfoData
      };
      data.Enum = i % 2 === 0 ? '1' : '2';
      data.Name = `${data.Name}-${i}`;
      this.data.push({
        id: i,
        ...data
      }); 
    }
  },
  methods: {
    reactItem(data) {
      if (data.Enum === '2') {
        this.schema.properties.linkage.oneOf = this.lineageEnumArray;
      } else {
        this.schema.properties.linkage.oneOf = null;
      }
    },
    getRowButton({ rowIndex }) {
      return [
        {
          key: '1',
          label: `按钮A${rowIndex}`,
        },
        {
          key: '2',
          label: `按钮B${rowIndex}`,
        },
      ];
    },
    onDataChange(key, val, data, originData) {
      console.log(`项目${key}修改为${val}`, data, originData);
      if (key === 'Enum') {
        this.reactItem(data);
      }
    },
    onDialogOpen(data) {
      this.reactItem(data);
    },
    onRowButtonClick(key, { row }) {
      this.$message.info(`点击按钮的key为:${key}, 行数据为${JSON.stringify(row)}`);
    },
    onSelectionChange(val) {
      console.log(val);
    },
    beforeAddRow() {
      return {
        Name: 'YYY',
        Price: null,
        Enum: null,
        AnyOf: null,
        Number: null,
        Date: null,
        Time: null,
        Comment: null,
        'Boolean': true,
        CustomSlotCode: null,
        CustomSlot: null,
        Readonly: '只读信息只读信息'
      };
    },
    save(data, mode) {
      return new window.Promise((resolve, reject) => {
        const loading = this.$loading();
        setTimeout(() => {
          if (mode === 'delete') {
            if (data.findIndex(item => item.id === 1) === -1) {
              resolve();
            } else {
              this.$message.warning('不允许删除id为1的数据');
              reject();
              loading.close();
              return;
            }
          } else {
            resolve({});
          }
          loading.close();
          let label = '';
          switch(mode) {
            case 'add':
              label = '新增';
              break;
            case 'modify':
              label = '修改';
              break;
            case 'delete':
              label = '删除';
              break;
            default:
              label = '保存';
          }
          const saveData = Array.isArray(data) ? data : [data];
          this.$message.success(`id为 ${saveData.map(item => item.id).join(',')} 的数据已成功${label}。`);
        }, 1000);
      })
    }
  }
};
</script>
```
:::

### 编辑弹窗完全自定义

:::demo
```html
<template>
  <div>
    <el-button type="primary" @click="() => { this.labelMode = !this.labelMode }">{{ labelMode ? '进入编辑' : '退出编辑' }}</el-button>
  </div>
  <el-editable-pro-table
    :label-mode="labelMode"
    multiple-selection
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    row-key="id"
    :before-add-row="beforeAddRow"
    @row-button-click="onRowButtonClick"
    @selection-change="onSelectionChange"
    :save="save"
  >
    <template slot="batchControl">
      <el-button type="text">自定义按钮</el-button>
    </template>
    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}</el-button>
    </template>
    <template slot="CustomSlot" slot-scope="scope">
      <el-rate :disabled="scope.status !== 'edit'"
               v-model="scope.row.CustomSlotCode"></el-rate>
    </template>
    <template slot="modifyDialog" slot-scope="scope">
      <el-json-viewer :data="scope"></el-json-viewer>
    </template>
  </el-editable-pro-table>
</template>
<script>
export default {
  data() {
    return {
      labelMode: true,
      schema: {
        properties: {
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
          },
          Readonly: {
            title: '只读项目',
            type: 'string',
            editable: false,
          }
        },
        required: [ 'Name' ],
      },
      uiSchema: {
        index: {
          'ui:options': {
            fixed: 'left',
            width: '100px'
          }
        },
        Name: {
          'ui:options': {
            fixed: 'left',
            minWidth: '150px'
          },
        },
        Enum: {
          'ui:options': {
            fixed: 'left',
            width: '150px'
          },
        },
        AnyOf: {
          'ui:options': {
            minWidth: '300px'
          },
        },
        Number: {
          'ui:options': {
            minWidth: '100px'
          },
        },
        Price: {
          'ui:options': {
            minWidth: '100px'
          },
        },
        Date: {
          'ui:options': {
            minWidth: '100px'
          },
        },
        Time: {
          'ui:options': {
            minWidth: '100px'
          },
        },
        Comment: {
          'ui:options': {
            minWidth: '300px'
          },
        },
        Boolean: {
          'ui:options': {
            minWidth: '90px'
          },
        },
        CustomSlot: {
          'ui:options': {
            minWidth: '230px'
          },
        },
        Readonly: {
          'ui:options': {
            minWidth: '150px'
          },
        }
      },
      data: [],
    };
  },
  created() {
    this.headInfoData = {
      Name: 'XXX',
      Price: 12345.678,
      Enum: '2',
      AnyOf: ['1', '2'],
      MaxLengthString: null,
      Number: 98765,
      Date: '2021-08-31',
      Time: '17:18:00',
      Comment: 'setaria-ui',
      'Boolean': true,
      CustomSlotCode: 4.3,
      CustomSlot: '装饰线条',
      Readonly: '信息不可修改'
    };
    for (let i = 0; i < 5; i += 1) {
      const data = {
        ...this.headInfoData
      };
      data.Name = `${data.Name}-${i}`;
      this.data.push({
        id: i,
        ...data
      }); 
    }
  },
  methods: {
    getRowButton({ rowIndex }) {
      return [
        {
          key: '1',
          label: `删除${rowIndex}`,
        },
      ];
    },
    onRowButtonClick(key, { row }) {
      console.log(`点击按钮的key为:${key}, 行数据为${JSON.stringify(row)}`);
    },
    onSelectionChange(val) {
      console.log(val);
    },
    beforeAddRow() {
      return {
        Name: 'YYY',
        Price: null,
        Enum: null,
        AnyOf: null,
        Number: null,
        Date: null,
        Time: null,
        Comment: null,
        'Boolean': true,
        CustomSlotCode: null,
        CustomSlot: null,
        Readonly: '只读信息只读信息'
      };
    },
    save(data, mode) {
      return new window.Promise((resolve) => {
        setTimeout(() => {
          console.log(data, mode);
          resolve({});
        }, 1000);
      })
    }
  }
};
</script>
```
:::

### 属性

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
| controlColumnWidth    | 控制列宽度 | String | — | '160' |
| tableId    | 表格ID，主要用于对表格的配置进行缓存 | String | — | — |
| showExpandAllBtn    | 是否显示"全部展开"按钮，：is-tree="true"时生效 | Boolean | — | true |
| showCollapseAllBtn    | 是否显示"全部收缩"按钮，：is-tree="true"时生效 | Boolean | — | true |
| showColumnSetting    | 是否显示右上角的列设置 | Boolean | — | true |
| can-add    | 是否可新增数据 | Boolean | — | true |
| can-update    | 是否可修改数据 | Boolean | — | true |
| can-delete    | 是否可删除数据 | Boolean | — | true |
| row-class-name    | 待补充 | String | — | —  |
| dialog-attrs    | 编辑模式下，Dialog组件的属性 | Object | — | —  |
| form-attrs    | 编辑模式下，表单组件的属性 | Object | — | —  |
| before-add-row    | 新增一行按钮点击时的回调函数，返回新增数据对象，用于对新增数据进行默认值设定 | Function | — | —  |
| before-modify-row    | 修改按钮点击时的回调函数，返回布尔值，用于对修改数据进行处理 | Function | — | —  |

### 插槽

| 名称 | 描述 |
|------|--------|
| title | 标题的内容 |
| modifyDialog | 修改点击后显示的弹窗内容 |
| [propertyKey] | 列自定义插槽 |

### 事件

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| current-change  | 当前页变更 | val 当前页变更值 |
| size-change  | pageSize 改变时会触发 | val pageSize变更值 |
| row-button-click | 自定义操作按钮点击事件 | key 定义的key  scope 当前scope信息 |
| select-all | 选中所有 | records 选中所有数据 |
| selection-change | 选中变更 | selectionArray 选中的数据 |
| cell-click | 单元格点击 | val 单元格数据 |
| menu-click | 只对 menu-config 配置时有效，当点击快捷菜单时会触发该事件 | { menu, type, row, rowIndex, column, columnIndex, $event } |
| cell-menu | 只对 menu-config 配置时有效，单元格被鼠标右键时触发该事件 | { type, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event } |
| sort-change | 当排序条件发生变化时会触发该事件 | { column, property, order, sortBy, sortList, $event } |
| page-change | 分页器内容变更 | val { currentPage, pageSize } |
| data-change | 行项目修改后(原始组件change事件)触发 | key 表单字段的 Key, val 表单字段的值, data 当前修改的数据（行编辑模式时为行数据，弹窗编辑模式时为展开的表单数据）, originData 行编辑前数据，仅为行编辑模式时存在 |
| dialog-open | 表单对话框显示时触发 | val 当前行数据 |


