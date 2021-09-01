## EditableProTable 高级表格

可编辑表格 EditableProTable 与 ProTable 的功能基本相同，为了方便使用 EditableProTable 增加了一些预设，修改了 data 和 onChange 使其可以方便的继承到 setaria-ui 的 JsonForm 中。

### 基本用法

:::demo
```html
<template>
  <div>
    <el-button type="primary" @click="() => { this.labelMode = !this.labelMode }">{{ labelMode ? '进入编辑' : '退出编辑' }}</el-button>
  </div>
  <el-editable-pro-table
    :label-mode="labelMode"
    :get-row-button="getRowButton"
    :schema="schema"
    :ui-schema="uiSchema"
    :data="data"
    row-key="id"
    multiple-selection
    @row-button-click="onRowButtonClick"
    @selection-change="onSelectionChange"
  >
    <template slot="batchControl">
      <el-button type="text">自定义按钮</el-button>
    </template>
    <template slot="index" slot-scope="scope">
      <el-button type="text">{{ scope.rowIndex }}</el-button>
    </template>
    <template slot="CustomSlot" slot-scope="scope">
      <el-rate :disabled="scope.rowStatus !== 'edit'"
               v-model="scope.row.CustomSlotCode"></el-rate>
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
            editable: true,
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
            editable: true,
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
            editable: true,
          },
          Number: {
            title: '数字',
            type: 'number',
            editable: true,
          },
          Price: {
            title: '价格',
            type: 'number',
            precision: '16',
            scale: '2',
            format: 'price',
            editable: true,
          },
          Comment: {
            title: '备注',
            type: 'string',
            editable: true,
          },
          Date: {
            title: '日期',
            type: 'string',
            format: 'date',
            editable: true,
          },
          Time: {
            title: '时间',
            type: 'string',
            format: 'time',
            editable: true,
          },
          Boolean: {
            title: '布尔值',
            type: 'boolean',
            editable: true,
          },
          CustomSlot: {
            title: '自定义插槽',
            type: 'string',
            editable: true,
          }
        },
        required: [ 'Enum' ],
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
      CustomSlot: '装饰线条'
    };
    for (let i = 0; i < 5; i += 1) {
      this.data.push({
        id: i,
        ...this.headInfoData
      }); 
    }
  },
  methods: {
    getRowButton({ rowIndex }) {
      return [
        {
          key: '1',
          label: `修改${rowIndex}`,
        },
      ];
    },
    onRowButtonClick(key, { row }) {
      this.$message.info(`点击按钮的key为:${key}, 行数据为${JSON.stringify(row)}`);
    },
    onSelectionChange(val) {
      console.log(val);
    }
  }
};
</script>
```
:::

### 属性

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title     | 标题           | string | — | — |

### 插槽

| 名称 | 描述 |
|------|--------|
| title | 标题的内容 |

### 事件

| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| close | 关闭alert时触发的事件 | — |
