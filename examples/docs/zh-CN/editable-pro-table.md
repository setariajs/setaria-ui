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

:::demo 可通过设置属性`labelMode`控制表格的编辑状态。指定`editConfig`中`trigger`为`manual`的场合，可手动控制行编辑状态。

```html
<template>
  <div>
    <el-button type="primary" @click="() => { this.labelMode = !this.labelMode }">{{ labelMode ? '进入编辑' : '退出编辑' }}</el-button>
    <el-button @click="onChangeColumnVisible">显示第三列</el-button>
    <el-button @click="onGetChangeData">取得当前数据状态</el-button>
    <el-button @click="getTableIsEditStatus">获取当前表格是否在行上编辑模式</el-button>
    <el-button @click="setActiveRowByIndex">设置第一行为编辑状态(先点击'进入编辑')</el-button>
  </div>
  <el-editable-pro-table
    ref="ept"
    :label-mode="labelMode"
    force-edit-on-row
    row-key="id"
    :row-buttons="getRowButton"
    :schema="schema"
    :ui-schema="uiSchema"
    :before-add-row="beforeAddRow"
    :before-update-row="beforeUpdateRow"
    :rules="rules"
    :data="data"
    :save="save"
    stripe
    control-column-width="300px"
    :control-column-config="{collapseButton:false}"
    :valid-config="{message: 'inline'}"
    :edit-config="{trigger: 'manual'}"
    control-column-trigger="hover"
    @cell-dblclick="cellDblclick"
    @selection-change="onSelectionChange"
    @row-button-click="onRowButtonClick"
    @edit-actived="onEditActived"
    @edit-closed="onEditClosed"
    @valid-error="onValidError"
    @column-visible-change="onColumnVisibleChange"
    @column-visible-reset="onColumnVisibleReset"
  >
    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}</el-button>
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
          name: {
            title: '名称',
            type: 'string',
          },
          price: {
            title: '价格',
            type: 'number',
            precision: '16',
            scale: '2',
            format: 'price',
          },
          noReadName: {
            title: '不可编辑\n字段占位',
            type: 'string',
            editable: false,
          },
        },
        required: [ 'name' ],
      },
      uiSchema:{
        price: {
          'ui:options': {
            visible: true,
          },
          'ui:disableColumnControl': true,
        },
        noReadName: {
          'ui:options': {
            visible: false,
          }
        }
      },
      rules:{
        price: [
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
        noReadName: [ 
            {
              validator:(rule, value, callback) => {
                console.log(value)
                if (value === '') {
                  callback(new Error('请输入内容'));
                } else {
                   callback();
                }
              },  
            }
        ],
      },
      data: []
    };
  },
  created() {
    this.headInfoData = {
      name: 'XXX',
      price: null
    };
    for (let i = 0; i < 1; i += 1) {
      const data = {
        ...this.headInfoData
      };
      if (i%2 === 0) {
        data.price = Math.random() * 100000000;
      } else if (i%3 === 0) {
        data.price = 0;
      } else if (i%5 === 0) {
        data.price = -Math.random() * 1000;
      }
      data.name = `${data.name}-${i}`;
      data.noReadName = `${data.name}-${i}`;
      this.data.push({
        id: i,
        ...data
      }); 
    }
  },
  methods: {
    cellDblclick(val){
      console.log('cellDblclick',val)
    },
    beforeAddRow(row) {
      return {
        ...row,
        name: 333444
      };
    },
    beforeUpdateRow(scope) {
      // 自定义返回数据
      return {
        ...scope.row,
      };
    },
    onSelectionChange(val,currentItem) {
      console.log(val, currentItem);
    },
    onRowButtonClick(key, row) {
      console.log(key, row);
    },
    getTableIsEditStatus(){
      console.log(this.$refs.ept.getIsEditOnRow());
    },
    setActiveRowByIndex(){
      this.$refs.ept.setActiveRowByIndex(0);
    },
    onGetChangeData() {
      console.log(this.$refs.ept.getChangedRecords());
    },
    getRowButton({ rowIndex }) {
      return [
        {
          key: 'watch',
          label: '自定义查看',
        },
        {
          key: 'watch1',
          label: 'BTN1',
        },
        {
          key: 'watch2',
          label: 'BTN2',
        },
        {
          key: 'setting',
          label: 'el-icon-setting',
        },
      ];
    },
    save(data, mode) {
      return new window.Promise((resolve, reject) => {
        const loading = this.$loading();
        setTimeout(() => {
          console.log('test',data)
          if(data.name === 'save'){
            this.$message.warning('测试自定义校验拒绝');
            reject();
            loading.close();
            return;
          }
          if (mode === 'delete') {
            const targetIndex = data.findIndex(item => item.id === 1);
            if (targetIndex === -1) {
              resolve();
            } else {
              this.$message.warning('不允许删除id为1的数据');
              reject();
              loading.close();
              return;
            }
          } else {
            console.log(mode, this.data[0], data, this.data[0] === data);
            resolve({});
          }
          loading.close();
          let label = '';
          switch(mode) {
            case 'add':
              label = '新增';
              break;
            case 'update':
              label = '修改';
              break;
            case 'delete':
              label = '删除';
              break;
            default:
              label = '保存';
          }
          const saveData = Array.isArray(data) ? data : [data];
          this.$message.success(`名称为 ${saveData.map(item => item.name).join(',')} 的数据已成功${label}。`);
        }, 500);
      })
    },
    onChangeColumnVisible() {
      this.uiSchema.noReadName['ui:options'].visible = true;
    },
    onEditActived() {
      console.log('onEditActived');
    },
    onEditClosed() {
      console.log('onEditClosed');
    },
    onValidError(scope) {
      console.log('valid-error', scope);
    },
    onColumnVisibleChange(visibleColumnKeys) {
      console.log(visibleColumnKeys);
    },
    onColumnVisibleReset(){
      console.log('onColumnVisibleReset')
    }
  }
};
</script>
```
:::

### 自定义控制按钮

:::demo

```html
<template>
  <div>
  </div>
  <el-editable-pro-table
    v-loading="loading"
    ref="ept"
    :label-mode="false"
    multiple-selection
    row-key="id"
    :schema="schema"
    :ui-schema="uiSchema"
    :before-add-row="beforeAddRow"
    :before-update-row="beforeUpdateRow"
    :rules="rules"
    :data="data"
    :save="save"
    stripe
    control-column-width="300px"
    :control-column-config="{collapseButton:false}"
    :valid-config="{message: 'inline'}"
    @cell-dblclick="cellDblclick"
    @selection-change="onSelectionChange"
    @row-button-click="onRowButtonClick"
  >
    <template slot="addData" slot-scope="scope">
      <el-button size="mini" :disabled="scope.$tableDataEditing">Custom Add</el-button>
    </template>
    <template slot="modifyData" slot-scope="scope">
      <el-button size="mini" :disabled="scope.$tableDataEditing">Custom Modify</el-button>
    </template>
    <template slot="deleteData" slot-scope="scope">
      <el-button size="mini" :disabled="scope.$tableDataEditing">Custom Delete</el-button>
    </template>
    <template slot="saveData" slot-scope="scope">
      <el-button size="mini">Custom Save</el-button>
    </template>
    <template slot="cancelData" slot-scope="scope">
      <el-button size="mini">Custom Cancel</el-button>
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
      loading: false,
      schema: {
        properties: {
          name: {
            title: '名称',
            type: 'string',
          },
          price: {
            title: '价格',
            type: 'number',
            precision: '16',
            scale: '2',
            format: 'price',
          },
          noReadName: {
            title: '不可编辑字段占位',
            type: 'string',
            editable: false,
          },
        },
        required: [ 'name' ],
      },
      uiSchema:{
      },
      rules:{
        price: [
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
        noReadName: [ 
            {
              validator:(rule, value, callback) => {
                console.log(value)
                if (value === '') {
                  callback(new Error('请输入内容'));
                } else {
                   callback();
                }
              },  
            }
        ],
      },
      data: []
    };
  },
  created() {
    this.headInfoData = {
      name: 'XXX',
      price: null
    };
    for (let i = 0; i < 1; i += 1) {
      const data = {
        ...this.headInfoData
      };
      if (i%2 === 0) {
        data.price = Math.random() * 100000000;
      } else if (i%3 === 0) {
        data.price = 0;
      } else if (i%5 === 0) {
        data.price = -Math.random() * 1000;
      }
      data.name = `${data.name}-${i}`;
      data.noReadName = `${data.name}-${i}`;
      this.data.push({
        id: i,
        ...data
      }); 
    }
  },
  methods: {
    cellDblclick(val){
      console.log('cellDblclick',val)
    },
    beforeAddRow(row) {
      // 自定义返回数据 Promise 方式
       return new Promise((resovle)=>{
        this.loading = true;
        setTimeout(()=>{
          this.loading = false;
          resovle({
            ...row,
            ...{
              name: 333444
          }});
        },500);
      });
    },
    beforeUpdateRow(scope) {
      // 自定义返回数据
      return {
        ...scope.row,
        ...{
          name: 13323
        }
      };
    },
    onSelectionChange(val,currentItem) {
      console.log(val, currentItem);
    },
    onRowButtonClick(key, row) {
      console.log(key, row);
    },
    getTableIsEditStatus(){
      console.log(this.$refs.ept.getIsEditOnRow());
    },
    setActiveRowByIndex(){
      this.$refs.ept.setActiveRowByIndex(0);
    },
    onGetChangeData() {
      console.log(this.$refs.ept.getChangedRecords());
    },
    save(data, mode) {
      return new window.Promise((resolve, reject) => {
        const loading = this.$loading();
        setTimeout(() => {
          if(data.name === 'save'){
            this.$message.warning('测试自定义校验拒绝');
            reject();
            loading.close();
            return;
          }
          if (mode === 'delete') {
            const targetIndex = data.findIndex(item => item.id === 1);
            if (targetIndex === -1) {
              resolve();
            } else {
              this.$message.warning('不允许删除id为1的数据');
              reject();
              loading.close();
              return;
            }
          } else {
            console.log(mode, this.data[0], data, this.data[0] === data);
            resolve({});
          }
          loading.close();
          let label = '';
          switch(mode) {
            case 'add':
              label = '新增';
              break;
            case 'update':
              label = '修改';
              break;
            case 'delete':
              label = '删除';
              break;
            default:
              label = '保存';
          }
          const saveData = Array.isArray(data) ? data : [data];
          this.$message.success(`名称为 ${saveData.map(item => item.name).join(',')} 的数据已成功${label}。`);
        }, 500);
      })
    }
  }
};
</script>
```
:::

### 多项目编辑

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
    :row-buttons="getRowButton"
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    :dialog-attrs="dialogAttrs"
    :form-attrs="formAttrs"
    :form-label-suffix="':'"
    :can-add="canAdd"
    :can-update="canUpdate"
    :can-delete="canDelete"
    :can-delete-row="canDeleteRow"
    :can-update-row="canUpdateRow"
    :before-add-row="beforeAddRow"
    :before-update-row="beforeUpdateRow"
    :rules="rules"
    @data-change="onDataChange"
    @row-button-click="onRowButtonClick"
    @selection-change="onSelectionChange"
    :save="save"
    ref="editTable"
  >
    <template slot="batchControl" v-if="!labelMode">
      <el-button type="text" @click="canAdd=!canAdd">{{ canAdd ? '禁止' : '允许' }}新增</el-button>
      <el-button type="text" @click="canUpdate=!canUpdate">{{ canUpdate ? '禁止' : '允许' }}修改</el-button>
      <el-button type="text" @click="canDelete=!canDelete">{{ canDelete ? '禁止' : '允许' }}删除</el-button>
      <el-button type="text" @click="addDataByManual">手动控制新增</el-button>
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
            minWidth: '300px',
            visible: false
          },
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
      canAdd: true,
      canUpdate: true,
      canDelete: true
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
    this.dialogAttrs.beforeClose = (val) => {
      if (val.Name === 'XXX-1') {
        this.$message({
          message: '不允许关闭名称为 XXX-1 的数据',
          type: 'error'
        });
        return false;
      }
      return true;
    }
  },
  methods: {
    addDataByManual(){
      this.$refs.editTable.triggerAddRow({
         Name: 'XXX',
      Price: '22345',
      Enum: 2,
      AnyOf: ['1', '2'],
      MaxLengthString: null,
      Number: 98765,
      })
    },
    canDeleteRow({row}){
      return row.id !== 1
    },
    canUpdateRow({row}){
      return row.id !== 2
    },
    setActiveRowByIndex(){
      this.$refs.editTable.setActiveRowByIndex(0)
    },
    getRowButton({ rowIndex }) {
      return [
        {
          key: '1',
          label: `按钮A${rowIndex}`,
        },
        // {
        //   key: '2',
        //   label: `按钮B${rowIndex}`,
        // },
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
    // beforeAddRow(scope) {
    //   console.log(scope);
    //   return {
    //     ...scope,
    //     ...{
    //       test: 112233
    //     }
    //   };
    // },
    beforeAddRow(scope) {
      // 自定义返回数据 Promise 方式
       return new Promise((resovle)=>{
           setTimeout(()=>{
             resovle({
              ...scope,
              ...{
                test: 222333444
            }});

           },1500);
      });
    },
    beforeUpdateRow(scope) {
      console.log(scope);
      // 自定义返回数据
      return {
        ...scope.row,
        ...{
          test: 13323
        }
      };
    },
    //  beforeUpdateRow(scope) {
    //   // 自定义返回数据 Promise 方式
    //    return new Promise((resovle)=>{
    //        setTimeout(()=>{
    //          resovle({
    //           ...scope.row,
    //           ...{
    //             test: 2222
    //         }});

    //        },1500);
    //   });
    // },
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
            case 'update':
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
    :row-buttons="getRowButton"
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    :can-add="canAdd"
    :can-update="canUpdate"
    :can-delete="canDelete"
    :before-add-row="beforeAddRow"
    :before-update-row="beforeAddRow"
    :control-column-config="{maxDisplayCount:1, width: '200px'}"
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
          'ui:colspan': 2,
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
      Readonly: '信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改信息不可修改',
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
    beforeAddRow({ row }) {
      return {
        ...{
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
        },
        ...row,
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
            case 'update':
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

### 强制行内编辑

通过属性`force-edit-on-row`来控制是否行内编辑

可配合`schema.properties[属性名].editable`为`false` 设置某个字段不可编辑模式


:::demo
```html
<template>
  <el-editable-pro-table
    :label-mode="false"
    column-width="auto"
    :force-edit-on-row="true"
    multiple-selection
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    :save="save"
  >
    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}</el-button>
    </template>
    <template slot="CustomSlot" slot-scope="scope">
      <el-rate :disabled="scope.status !== 'edit'"
               v-model="scope.data.CustomSlotCode"></el-rate>
    </template>
  </el-editable-pro-table>
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
            editable:false,
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
            editable:false,
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
            editable:false,
          },
          Date: {
            title: '日期',
            type: 'string',
            format: 'date',
            editable:false,
          },
          Time: {
            title: '时间',
            type: 'string',
            format: 'time',
            editable:false,
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
          'ui:colspan': 2,
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
            case 'update':
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
| row-key    | 行主键 | String | — | — |
| border    | 是否带有边框 | Boolean | — | true |
| stripe    | 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式） | Boolean | — | false |
| height    | 表格高度 | String | — | — |
| max-height    | 表格最大高度 | String | — | — |
| selection-type    | 列表选择类型 | String | 'radio', 'checkbox', '' | — |
| multiple-selection    | 是否多选 | Boolean | — | false |
| selectable    | 通过返回值来决定这一行的 CheckBox 是否可以勾选 | Function | — | — |
| row-buttons    | 获取行数据操作按钮 | Function | — | — |
| parent-field    | 标识上级节点的字段名 | String | — | — |
| column-width    | 列宽度 | String | — | — |
| auto-pagination    | 前端分页 | Boolean | — | true |
| default-all-column-sort    | 是否所有列默认允许排序 | Boolean | — | false |
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
| control-column-width    | 数据控制列宽度 | String | — | '160' |
| control-column-config    | 数据控制列配置 | Object | — | { label: '操作', width: '', collapseButton: true, maxDisplayCount: 2 } |
| table-id    | 表格ID，主要用于对表格的配置进行缓存 | String | — | — |
| show-expand-all-btn    | 是否显示"全部展开"按钮，：is-tree="true"时生效 | Boolean | — | true |
| show-collapse-all-btn    | 是否显示"全部收缩"按钮，：is-tree="true"时生效 | Boolean | — | true |
| show-column-setting    | 是否显示右上角的列设置 | Boolean | — | true |
| can-add    | 是否可新增数据 | Boolean | — | true |
| can-update    | 是否可修改数据 | Boolean | — | true |
| can-delete    | 是否可删除数据 | Boolean | — | true |
| can-delete-row   | 是否可删除数据(行维度)，需要返回true false | Funciton | — | — |
| can-update-row   | 是否可修改数据(行维度)，需要返回true false | Funciton | — | — |
| row-class-name    | 待补充 | String | — | —  |
| dialog-attrs    | 编辑模式下，Dialog组件的属性 | Object | — | —  |
| form-attrs    | 编辑模式下，表单组件的属性 | Object | — | —  |
| before-add-row    | 新增一行按钮点击时的回调函数，返回新增数据对象或者返回一个Promise对象，用于对新增数据进行默认值设定 | Function | — | —  |
| before-update-row    | 修改按钮点击时的回调函数，返回新增数据对象或者返回一个Promise对象，用于对修改数据进行处理 | Function | — | —  |
| save    | 当操作数据时（新增、更新、删除）触发，回调参数(data->操作的数据,mode->操作类型),需要返回 Promise对象进行数据的下一步操作 | Function | — | —  |
| show-control-column  | 是否显示操作列 | Boolean | — | true  |
| force-edit-on-row  | 是否强制行内编辑 | Boolean | — | false  |
| dialog-form-discard-change-message-setting  | 数据修改对话框的显示消息配置 | Object | — | { message: '是否放弃对数据的更改?', confirmButtonText: '是', cancelButtonText: '否' } |
| default-require-rule-trigger-type  | 默认require rule的触发方式 | String | — | blur |
| control-column-trigger  | 操作列的触发方式 | String | — | click,hover |


### 插槽

| 名称 | 描述 |
|------|--------|
| title | 标题的内容 |
| modifyDialog | 修改点击后显示的弹窗内容 |
| pagerLeft | 分页器左侧内容 |
| pagerRight | 分页器右侧内容 |
| [propertyKey] | 列自定义插槽 |
| controlColumn  | 控制列插槽 |
| addData | 新增按钮插槽 |
| modifyData | 修改按钮作用域插槽 |
| deleteData | 删除按钮作用域插槽 |
| saveData | 保存按钮作用域插槽 |
| cancelData | 保存取消按钮作用域插槽 |

### 事件

| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| current-change  | 当前页变更 | val 当前页变更值 |
| size-change  | pageSize 改变时会触发 | val pageSize变更值 |
| row-button-click | 自定义操作按钮点击事件 | key 定义的key  scope 当前scope信息 |
| select-all | 选中所有 | records 选中所有数据 |
| selection-change | 选中变更 | selectionArray 选中的数据 |
| cell-click | 单元格点击 | val 单元格数据 |
| cell-dblclick | 单元格双击 | val 单元格数据 |
| menu-click | 只对 menu-config 配置时有效，当点击快捷菜单时会触发该事件 | { menu, type, row, rowIndex, column, columnIndex, $event } |
| cell-menu | 只对 menu-config 配置时有效，单元格被鼠标右键时触发该事件 | { type, row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event } |
| sort-change | 当排序条件发生变化时会触发该事件 | { column, property, order, sortBy, sortList, $event } |
| page-change | 分页器内容变更 | val { currentPage, pageSize } |
| data-change | 行项目修改后(原始组件change事件)触发 | key 表单字段的 Key, val 表单字段的值, data 当前修改的数据（行编辑模式时为行数据，弹窗编辑模式时为展开的表单数据）, originData 行编辑前数据，仅为行编辑模式时存在 |
| dialog-open | 表单对话框显示时触发 | val 当前行数据 |
| edit-actived | 行或单元格激活编辑状态时触发 | - |
| edit-closed | 行或单元格编辑状态被关闭时触发 | - |
| cell-mouseenter  | 当鼠标移动到单元格时会触发该事件 | val 当前值 |
| cell-mouseleave  | 当鼠标移开单元格时会触发该事件 | val 当前值 |
| column-visible-change  | 当用户操作右上角显示列功能时的回调 | checkedKeys 显示列的key数组 |
| column-visible-reset  | 当用户操作右上角显示列功能的重置按钮回调 | - |



### 方法

| 方法名        | 说明                                                       | 参数                                                             |
| ------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| getChangedRecords      | 获取有变更的所有记录（含新增、删除、修改）   | Function(callback: {insert,update,delete}) |
| setActiveRowByIndex      | 按照下标激活行   | Function(index,setActiveRowByIndex:激活模式(add,update) 默认add) |
| getIsEditOnRow      | 获取当前表格是否在行上编辑模式   | Function():Boolean) |
| cancelRowEdit      | 移除表格编辑状态  | Function() |
| triggerAddRow      | 手动触发新增按钮逻辑  | Function(appendItem：手动初始化的Item) |


### UI-Schema Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| ui:widget | 表单字段的组件类型 | string | password, textarea, select, checkbox, radio  |  — |
| ui:disabled | 表单字段的组件是否可用 | boolean | - | false |
| ui:hidden | 表单字段的组件是否可见 | boolean | - | false |
| ui:options | 表单字段的组件独有属性 | object | UI组件独有属性 | - |
| ui:colspan | 跨越的列数 | number | - | - |
| ui:disableColumnControl | 默认是否操作列中的checkbox状态disabled | boolean | - | - |

