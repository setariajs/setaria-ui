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




### 列控制的拖拽和显示隐藏

- 拖拽功能通过`column-setting-draggable`属性并配合`column-setting-node-drag-end`事件来获取拖拽之后的相关数据

- 用户点击了列控制中的checkbox时，通过`column-visible-change`和`column-visible-reset`两个事件来获取相关数据

- 可以指定`table-id`属性来开启本地缓存显示隐藏、宽度存储、拖拽排序存储的功能


:::demo
```html
<template>
  <el-editable-pro-table
    :label-mode="true"
    table-id="helloWould1"
    multiple-selection
    column-width="auto"
    column-setting-draggable
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    :form-label-suffix="':'"
    :control-column-config="{
      align:'left'
    }"
    ref="editTable"
    @column-visible-change="onColumnVisibleChange"
    @column-visible-reset="onColumnVisibleReset"
    @column-setting-node-drag-end="onColumnSettingNodeDragEnd"
    @column-setting-show="testColumnSettingToggle('1')"
    @column-setting-hide="testColumnSettingToggle('2')"
  >

    <template slot="batchControl">
      <el-button type="text"  @click="reloadData">重新获取数据</el-button>
      
    </template>

    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}{{scope.data.test}}</el-button>
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
          formItemHiddenField: {
            title: '动态表单状态下隐藏与否字段',
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
            width: '150px'
          },
        },
        AnyOf: {
          'ui:options': {
            minWidth: '300px',
             visible: false,
          },
        },
        Number: {
          'ui:options': {
            minWidth: '100px',
             visible: false,
          },
        },
        Price: {
          'ui:options': {
            minWidth: '100px'
          },
        },
        Date: {
          'ui:options': {
            minWidth: '100px',
          },
          // 'ui:hidden':true,
        },
        Time: {
          'ui:options': {
            minWidth: '100px',
          },
        },
        Comment: {
          'ui:options': {
            minWidth: '300px',
          },
          visible:false,
          // 'ui:hidden':true
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
        },
        formItemHiddenField: {
          'ui:formItemHidden':false,
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
      rules:{
        Price: [
            { 
              validator:(rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入内容'));
                } else if (value < 0 ){
                  callback(new Error('请输入大于0的数'));
                } else {
                   callback();
                }
              },  
            }
        ],
      },
      data: [],
    };
  },
  created() {
    this.headInfoData = {
      Name: 'XXX',
      Price: '22345',
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
      Readonly: '信息不可修改',
      formItemHiddenField:''
    };
    this.reloadData();
   
  },
  methods: {
    reloadData(){
       for (let i = 0; i < 100; i += 1) {
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
    onSelectionChange(val) {
      console.log(val);
    },
    onColumnVisibleChange(keys){
      console.log(keys)
    },
    onColumnVisibleReset(){
      console.log('onColumnVisibleReset')
    },
    onColumnSettingNodeDragEnd(newList){
      console.log(newList,this.schema)
      // 通过反写scehma来实现排序的功能
      // const schema = {
      //   properties:{}
      // }
      // newList.forEach(key=>{
      //   schema.properties[key] = this.schema.properties[key]
      // })
      // schema.requried =  this.schema.requried
      // console.log(schema)
      // this.schema = schema
    },
    testColumnSettingToggle(type) {
      console.log('testColumnSettingToggle',type);
      console.log(this.$refs.editTable.getColumnVisibleStatus());
    },

  }
};
</script>
```
:::

### 属性

| 参数                                       | 说明                                                                                                                     | 类型     | 可选值                  | 默认值                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------------- | -------------------------------------------------------------------------------------- |
| data                                       | 数据                                                                                                                     | Array    | —                       | —                                                                                      |
| schema                                     | 基于[JSON-Schema]的属性                                                                                                  | Object   | —                       | —                                                                                      |
| ui-schema                                  | 用于设置各个表单字段的组件类型(ui:widget)、是否可用(ui:disabled)等属性 (请参照下表)                                      | Object   | —                       | -                                                                                      |
| row-key                                    | 行主键                                                                                                                   | String   | —                       | —                                                                                      |
| border                                     | 是否带有边框                                                                                                             | Boolean  | —                       | true                                                                                   |
| stripe                                     | 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）                                       | Boolean  | —                       | false                                                                                  |
| height                                     | 表格高度                                                                                                                 | String   | —                       | —                                                                                      |
| max-height                                 | 表格最大高度                                                                                                             | String   | —                       | —                                                                                      |
| selection-type                             | 列表选择类型                                                                                                             | String   | 'radio', 'checkbox', '' | —                                                                                      |
| multiple-selection                         | 是否多选                                                                                                                 | Boolean  | —                       | false                                                                                  |
| selectable                                 | 通过返回值来决定这一行的 CheckBox 是否可以勾选                                                                           | Function | —                       | —                                                                                      |
| row-buttons                                | 获取行数据操作按钮                                                                                                       | Function | —                       | —                                                                                      |
| parent-field                               | 标识上级节点的字段名                                                                                                     | String   | —                       | —                                                                                      |
| column-width                               | 列宽度                                                                                                                   | String   | —                       | —                                                                                      |
| auto-pagination                            | 前端分页                                                                                                                 | Boolean  | —                       | true                                                                                   |
| default-all-column-sort                    | 是否所有列默认允许排序                                                                                                   | Boolean  | —                       | false                                                                                  |
| is-reserve                                 | 是否保留CheckBox选中状态                                                                                                 | Boolean  | —                       | false                                                                                  |
| merge-cells                                | 合并单元格回调方法                                                                                                       | Function | —                       | —                                                                                      |
| loading                                    | 加载状态                                                                                                                 | Boolean  | —                       | —                                                                                      |
| menu-config                                | 获取行数据快捷菜单按钮  menu-button-click                                                                                | Object   | —                       | —                                                                                      |
| check-strictly                             | 待补充                                                                                                                   | Boolean  | —                       | —                                                                                      |
| merge-footer-items                         | 待补充                                                                                                                   | Array    | —                       | —                                                                                      |
| footer-method                              | 待补充                                                                                                                   | Function | —                       | —                                                                                      |
| show-footer                                | 待补充                                                                                                                   | Function | —                       | —                                                                                      |
| seq-config                                 | 序号配置项                                                                                                               | Object   | —                       | —                                                                                      |
| checkbox-config                            | 复选框配置项                                                                                                             | Object   | —                       | —                                                                                      |
| radio-config                               | 单选框配置项                                                                                                             | Object   | —                       | —                                                                                      |
| expand-config                              | 展开行配置项（不能用于虚拟滚动）                                                                                         | Object   | —                       | —                                                                                      |
| tree-config                                | 树形结构配置项                                                                                                           | Object   | —                       | { children: 'children' }                                                               |
| sort-config                                | 排序配置项                                                                                                               | Object   | —                       | —                                                                                      |
| export-config                              | 导出配置项                                                                                                               | Object   | —                       | —                                                                                      |
| proxy-config                               | 数据代理配置项                                                                                                           | Object   | —                       | —                                                                                      |
| tree-node                                  | 指定为树节点                                                                                                             | String   | —                       | —                                                                                      |
| virtual-tree                               | 是否使用虚拟树                                                                                                           | Boolean  | —                       | —                                                                                      |
| sort-method                                | 全表排序自定义函数                                                                                                       | Function | —                       | —                                                                                      |
| show-pagination                            | 是否显示分页                                                                                                             | Boolean  | —                       | true                                                                                   |
| page-num                                   | 当前页号                                                                                                                 | Number   | —                       | —                                                                                      |
| page-size                                  | 每页显示数据数量                                                                                                         | Number   | —                       | —                                                                                      |
| total                                      | 数据总数量                                                                                                               | Number   | —                       | —                                                                                      |
| control-column-width                       | 数据控制列宽度                                                                                                           | String   | —                       | '160'                                                                                  |
| control-column-config                      | 数据控制列配置                                                                                                           | Object   | —                       | { label: '操作', width: '', collapseButton: true, maxDisplayCount: 2, align:'center' } |
| table-id                                   | 表格ID，主要用于对表格的配置进行缓存                                                                                     | String   | —                       | —                                                                                      |
| show-expand-all-btn                        | 是否显示"全部展开"按钮，：is-tree="true"时生效                                                                           | Boolean  | —                       | true                                                                                   |
| show-collapse-all-btn                      | 是否显示"全部收缩"按钮，：is-tree="true"时生效                                                                           | Boolean  | —                       | true                                                                                   |
| show-column-setting                        | 是否显示右上角的列设置                                                                                                   | Boolean  | —                       | true                                                                                   |
| can-add                                    | 是否可新增数据                                                                                                           | Boolean  | —                       | true                                                                                   |
| can-update                                 | 是否可修改数据                                                                                                           | Boolean  | —                       | true                                                                                   |
| can-delete                                 | 是否可删除数据                                                                                                           | Boolean  | —                       | true                                                                                   |
| can-delete-row                             | 是否可删除数据(行维度)，需要返回true false                                                                               | Funciton | —                       | —                                                                                      |
| can-update-row                             | 是否可修改数据(行维度)，需要返回true false                                                                               | Funciton | —                       | —                                                                                      |
| row-class-name                             | 待补充                                                                                                                   | String   | —                       | —                                                                                      |
| dialog-attrs                               | 编辑模式下，Dialog组件的属性                                                                                             | Object   | —                       | —                                                                                      |
| form-attrs                                 | 编辑模式下，表单组件的属性                                                                                               | Object   | —                       | —                                                                                      |
| before-add-row                             | 新增一行按钮点击时的回调函数，返回新增数据对象或者返回一个Promise对象，用于对新增数据进行默认值设定                      | Function | —                       | —                                                                                      |
| before-update-row                          | 修改按钮点击时的回调函数，返回新增数据对象或者返回一个Promise对象，用于对修改数据进行处理                                | Function | —                       | —                                                                                      |
| save                                       | 当操作数据时（新增、更新、删除）触发，回调参数(data->操作的数据,mode->操作类型),需要返回 Promise对象进行数据的下一步操作 | Function | —                       | —                                                                                      |
| show-control-column                        | 是否显示操作列                                                                                                           | Boolean  | —                       | true                                                                                   |
| force-edit-on-row                          | 是否强制行内编辑                                                                                                         | Boolean  | —                       | false                                                                                  |
| dialog-form-discard-change-message-setting | 数据修改对话框的显示消息配置                                                                                             | Object   | —                       | { message: '是否放弃对数据的更改?', confirmButtonText: '是', cancelButtonText: '否' }  |
| default-require-rule-trigger-type          | 默认require rule的触发方式                                                                                               | String   | —                       | blur                                                                                   |
| control-column-trigger                     | 操作列的触发方式                                                                                                         | String   | click,hover             | click                                                                                  |
| show-overflow                              | 单元格内容溢出是否显示省略号                                                                                             | Boolean  | —                       | true                                                                                   |
| tool-bar-button-type                       | 表格顶部操作按钮的显示样式                                                                                               | String   | text,button             | text                                                                                   |
| scroll-x                                   | 横向虚拟滚动配置,配置信息请[vxe-table文档](https://vxetable.cn/v3/#/table/api)                                           | Object   | —                       | —                                                                                      |
| scroll-y                                   | 纵向虚拟滚动配置,配置信息请[vxe-table文档](https://vxetable.cn/v3/#/table/api)                                           | Object   | —                       | { gt: 20 }                                                                             |
| is-show-default-batch-control              | 是否默认显示批量操作等按钮                                                                                               | Boolean  | —                       | true                                                                                   |
| column-setting-draggable                   | 是否开启在列设置的Item拖拽功能                                                                                           | Boolean  | —                       | false                                                                                  |
| max-edit-on-row                            | 行内编辑模式字段临界值数量(如不想行内编辑，可设置成0即Dialog模式编辑)                                                    | Nubmer   | —                       | 3                                                                                      |




### 插槽

| 名称            | 描述                     |
| --------------- | ------------------------ |
| title           | 标题的内容               |
| modifyDialog    | 修改点击后显示的弹窗内容 |
| pagerLeft       | 分页器左侧内容           |
| pagerRight      | 分页器右侧内容           |
| [propertyKey]   | 列自定义插槽             |
| controlColumn   | 控制列插槽               |
| addData         | 新增按钮插槽             |
| modifyData      | 修改按钮作用域插槽       |
| deleteData      | 删除按钮作用域插槽       |
| batchDeleteData | 批量删除按钮作用域插槽   |
| saveData        | 保存按钮作用域插槽       |
| cancelData      | 保存取消按钮作用域插槽   |
| rowButtons      | 自定义行上按钮           |


### 事件

| 事件名称                     | 说明                                                                                 | 回调参数                                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| current-change               | 当前页变更                                                                           | val 当前页变更值                                                                                                                                                 |
| size-change                  | pageSize 改变时会触发                                                                | val pageSize变更值                                                                                                                                               |
| row-button-click             | 自定义操作按钮点击事件                                                               | key 定义的key  scope 当前scope信息                                                                                                                               |
| select-all                   | 选中所有                                                                             | records 选中所有数据                                                                                                                                             |
| selection-change             | 选中变更                                                                             | selectionArray 选中的数据                                                                                                                                        |
| cell-click                   | 单元格点击                                                                           | val 单元格数据                                                                                                                                                   |
| cell-dblclick                | 单元格双击                                                                           | val 单元格数据                                                                                                                                                   |
| menu-click                   | 只对 menu-config 配置时有效，当点击快捷菜单时会触发该事件                            | { menu, type, row, rowIndex, column, columnIndex, $event }                                                                                                       |
| cell-menu                    | 只对 menu-config 配置时有效，单元格被鼠标右键时触发该事件                            | { type, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }                                                                                    |
| sort-change                  | 当排序条件发生变化时会触发该事件                                                     | { column, property, order, sortBy, sortList, $event }                                                                                                            |
| page-change                  | 分页器内容变更                                                                       | val { currentPage, pageSize }                                                                                                                                    |
| data-change                  | 行项目修改后(原始组件change事件)触发                                                 | key 表单字段的 Key, val 表单字段的值, data 当前修改的数据（行编辑模式时为行数据，弹窗编辑模式时为展开的表单数据）, originData 行编辑前数据，仅为行编辑模式时存在 |
| dialog-open                  | 表单对话框显示时触发                                                                 | val 当前行数据                                                                                                                                                   |
| dialog-close                 | 表单对话框关闭时触发                                                                 | val 当前行数据                                                                                                                                                   |
| edit-actived                 | 行或单元格激活编辑状态时触发                                                         | -                                                                                                                                                                |
| edit-closed                  | 行或单元格编辑状态被关闭时触发                                                       | -                                                                                                                                                                |
| cell-mouseenter              | 当鼠标移动到单元格时会触发该事件                                                     | val 当前值                                                                                                                                                       |
| cell-mouseleave              | 当鼠标移开单元格时会触发该事件                                                       | val 当前值                                                                                                                                                       |
| column-visible-change        | 当用户操作右上角显示列功能时的回调                                                   | checkedKeys 显示列的key数组                                                                                                                                      |
| column-visible-reset         | 当用户操作右上角显示列功能的重置按钮回调                                             | -                                                                                                                                                                |
| column-setting-node-drag-end | 当用户操作右上角拖动列功能Item时的回调，需配合`column-setting-draggable`属性一起使用 | list 被拖拽之后的list key数组                                                                                                                                    |
| column-setting-show          | 列设置显示回调                                                                           |                                                                                                                                                                  |
| column-setting-hide          | 列设置隐藏回调                                       |                                                                                                                                                                  |



### 方法

| 方法名               | 说明                                                       | 参数                                                             |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| getChangedRecords    | 获取有变更的所有记录（含新增、删除、修改）                 | Function(callback: {insert,update,delete})                       |
| setActiveRowByIndex  | 按照下标激活行                                             | Function(index,setActiveRowByIndex:激活模式(add,update) 默认add) |
| getIsEditOnRow       | 获取当前表格是否在行上编辑模式                             | Function():Boolean)                                              |
| cancelRowEdit        | 移除表格编辑状态                                           | Function()                                                       |
| triggerAddRow        | 手动触发新增按钮逻辑                                       | Function(appendItem：手动初始化的Item)                           |
| getColumnVisibleStatus | 当开启保存列设置的时候，可通过此方法获取当前表格用户设置的显示&隐藏的列 | Function():{colShows,colHides}                                                  |




### UI-Schema Attributes

| 参数                    | 说明                                   | 类型    | 可选值                                      | 默认值 |
| ----------------------- | -------------------------------------- | ------- | ------------------------------------------- | ------ |
| ui:widget               | 表单字段的组件类型                     | string  | password, textarea, select, checkbox, radio | —      |
| ui:disabled             | 表单字段的组件是否可用                 | boolean | -                                           | false  |
| ui:hidden               | 表单&表格字段的组件是否可见            | boolean | -                                           | false  |
| ui:options              | 表单字段的组件独有属性                 | object  | UI组件独有属性                              | -      |
| ui:colspan              | 跨越的列数                             | number  | -                                           | -      |
| ui:disableColumnControl | 默认是否操作列中的checkbox状态disabled | boolean | -                                           | -      |
| ui:formItemHidden       | 表单字段的组件是否可见                 | boolean | -                                           | false  |


###  Slot
| name           | 说明                |
| -------------- | ------------------- |
| label.[字段名] | label区域自定义插槽 |
| [字段名]       | 对应字段自定义插槽  |
