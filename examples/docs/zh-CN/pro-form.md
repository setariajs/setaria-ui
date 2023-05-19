## ProForm 高级表单

ProForm 在原来的 JsonForm 的基础上增加一些语法糖和更多的布局设置，帮助我们快速的开发一个表单。同时添加一些默认行为，让我们的表单默认好用。

根据 [JSON-Schema](https://json-schema.org/) 可渲染对应的表单用于数据的展示和编辑

### 何时使用

当你想快速实现一个表单但不想花太多时间去布局时 ProForm 是最好的选择。

### 基本使用

与 `JSON-FORM` 的不同之处为在其基础上增加了响应式功能，对于常见的分辨率进行了 `columns` 的预设置

::: demo
```html
<div>
  <el-pro-form
    :model="form1"
    :schema="schema"
    :ui-schema="uiSchema"
    :rules="rules"
    label-width="100px"
    @change="handleChange"
    :before-submit="beforeSubmit"
    :after-submit="onSubmit">
    <template slot="comment" slot-scope="scope">
      <el-input v-model="scope.data.comment" suffix-icon="el-icon-search"/>
    </template>
  </el-pro-form>
  <p>result:</p>
  <div>
    {{ this.form1 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form1: {
          id: '',
          password: '',
          age: null,
          gender: 2,
          birth: '',
          interest: [],
          comment: '',
          profession: '',
          dateTime: '',
          time: '',
        },
        rules: {
          id: [
            {
              validator: (rule, value, callback) => {
                if (value !== 'abc') {
                  callback(new Error('必须输入abc'));
                }
                callback();
              },
              trigger: 'blur'
            }
          ]
        },
        schema: {
          "required": [
            "id",
            'gender',
            'birth',
            'time',
            'dateTime',
            'interest',
            'age'
          ],
          "properties": {
            "id": {
              "description": "用户ID",
              "type": "string",
              "title": "用户ID",
              "minLength": 3,
              "maxLength": 6
            },
            "password": {
              "type": "string",
              "title": "密码"
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
            "comment": {
              "type": "string",
              "title": "备注"
            }
          }
        },
        uiSchema: {
          "interest": {
            "ui:colspan": 2
          }
        }
      }
    },
    methods: {
      handleChange(key, value, model) {
        console.log('change', key, value, model);
      },
      beforeSubmit() {
        return new Promise((resolve) => {
          this.$confirm('确认提交吗？', '提示', {
            type: 'warning'
          }).then(() => {
            resolve();
          }).catch(() => {});
        });
      },
      onSubmit() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('abc'))
          }, 1000);
        });
      }
    }
  }
</script>
```
:::

### 查询筛选

::: demo 设置 `type` 为 `queryFilter` 即可渲染查询筛选，主要用于查询页面的筛选条件。
```html
<div>
  <el-pro-form
    type="queryFilter"
    :model="form1"
    :schema="schema"
    :ui-schema="uiSchema"
    label-width="100px"
    label-position="top"
    :after-submit="onSubmit"
    :expand="expand"
    @expandChange="hanlderExpand"
    @change="dataChange">
    
  </el-pro-form>
  <p>result:</p>
  <div>
    {{ this.form1 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        expand:true,
        form1: {
          id: '',
          password: '',
          age: null,
          gender: 2,
          birth: '',
          interest: [],
          comment: '',
          profession: '',
          dateTime: '',
          time: '',
        },
        schema: {
          "required": [
            "id"
          ],
          "properties": {
            "interest": {
              "type": "array",
              "title": "兴趣",
              "oneOf": [
                {"const": "1", "title": "游戏"},
                {"const": "2", "title": "音乐"},
                {"const": "3", "title": "运动"}
              ]
            },
            "id": {
              "description": "此处可定义额外辅助信息",
              "type": "string",
              "title": "用户ID",
              "minLength": 3,
              "maxLength": 6
            },
            "password": {
              "type": "string",
              "title": "密码"
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
            
            "comment": {
              "type": "string",
              "title": "备注"
            }
          }
        },
        uiSchema: {
           "id": {
             
            },
            "password": {
              'ui:hidden':false,
            },
            "age": {
             'ui:hidden':false,
            },
            "gender": {
              'ui:hidden':false,
            },
            "birth": {
            'ui:hidden':false,
            },
            "time": {
              'ui:hidden':false,
            },
            "dateTime": {
              'ui:hidden':false,
            },
            "interest": {
              // "ui:colspan": 2
            },
            "comment": {
                "ui:options": {
              type: 'textarea'
            },
            "ui:colspan": 2
            }


        }
      }
    },
    methods: {
      onSubmit() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$message.success('查询执行成功');
            resolve();
          }, 1000);
        });
      },
      hanlderExpand(val){
        console.log('hanlderExpand',val)
      },
      dataChange(key,value){
        if(key === 'interest'){
          if(value === '1'){

            this.uiSchema.password['ui:hidden']= true
            this.uiSchema.age['ui:hidden']= true
            this.uiSchema.gender['ui:hidden']= true
            this.uiSchema.birth['ui:hidden']= true
            this.uiSchema.time['ui:hidden']= true
            this.uiSchema.dateTime['ui:hidden']= true
            this.uiSchema.comment['ui:hidden']= true

          }else{
            this.uiSchema.password['ui:hidden']= false
            this.uiSchema.age['ui:hidden']= false
            this.uiSchema.gender['ui:hidden']= false
            this.uiSchema.birth['ui:hidden']= false
            this.uiSchema.time['ui:hidden']= false
            this.uiSchema.dateTime['ui:hidden']= false
            this.uiSchema.comment['ui:hidden']= false
          }

        }

      }
    }
  }
</script>
```
:::

### Card表单

::: demo
```html
<div>
  <el-pro-form
    type="cardForm"
    :model="form1"
    :schema="schema"
    :ui-schema="uiSchema"
    label-width="100px"
    :after-submit="onSubmit"
    title="Card表单"
    :card-attrs="{shadow: 'hover'}">

  </el-pro-form>
  <p>result:</p>
  <div>
    {{ this.form1 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form1: {
          id: '',
          password: '',
          age: null,
          gender: 2,
          birth: '',
          interest: [],
          comment: '',
          profession: '',
          dateTime: '',
          time: '',
        },
        schema: {
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "description": "用户ID",
              "type": "string",
              "title": "用户ID",
              "minLength": 3,
              "maxLength": 6
            },
            "password": {
              "type": "string",
              "title": "密码"
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
            "comment": {
              "type": "string",
              "title": "备注"
            }
          }
        },
        uiSchema: {
          "interest": {
            "ui:colspan": 2
          },
          "comment": {
            "ui:options": {
              type: 'textarea'
            },
            "ui:colspan": 2
          }
        }
      }
    },
    methods: {
      onSubmit() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$message.success('表单提交成功');
            resolve();
          }, 1000);
        });
      }
    }
  }
</script>
```
:::

### Modal表单

::: demo
```html
<div>
  <el-pro-form
    type="modalForm"
    :model="form1"
    :schema="schema"
    :ui-schema="uiSchema"
    label-width="100px"
    :after-submit="onSubmit"
    title="表单"
    :dialog-attrs="{width: '80%'}">
    <el-button type="primary">新建表单</el-button>

  </el-pro-form>
  <p>result:</p>
  <div>
    {{ this.form1 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form1: {
          id: '',
          password: '',
          age: null,
          gender: 2,
          birth: '',
          interest: [],
          comment: '',
          profession: '',
          dateTime: '',
          time: '',
        },
        schema: {
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "description": "用户ID",
              "type": "string",
              "title": "用户ID",
              "minLength": 3,
              "maxLength": 6
            },
            "password": {
              "type": "string",
              "title": "密码"
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
            "comment": {
              "type": "string",
              "title": "备注"
            }
          }
        },
        uiSchema: {
          "interest": {
            "ui:colspan": 2
          },
          "comment": {
            "ui:options": {
              type: 'textarea'
            },
            "ui:colspan": 2
          }
        }
      }
    },
    methods: {
      onSubmit() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$message.success('表单提交成功');
            resolve();
          }, 1000);
        });
      }
    }
  }
</script>
```
:::


### 按钮控制

设置 `control-button-layout` 来控制按钮显示的顺序和显示与否

可通过`slot`并配置插槽`controlButtons`来自定义按钮内容

::: demo 

```html
<div>
  <el-pro-form
    type="queryFilter"
    :model="form1"
    :schema="schema"
    :ui-schema="uiSchema"
    :control-button-layout="['slot','search']"
    label-width="100px"
    label-position="top"
    :after-submit="onSubmit">
     <template slot="controlButtons">
        <el-button type="primary">Test1</el-button>
        <el-button type="primary">Test2</el-button>
    </template>
  </el-pro-form>
  <p>result:</p>
  <div>
    {{ this.form1 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form1: {
          id: '',
          password: '',
          age: null,
          gender: 2,
          birth: '',
          interest: [],
          comment: '',
          profession: '',
          dateTime: '',
          time: '',
        },
        schema: {
          "required": [
            "id"
          ],
          "properties": {
            "id": {
              "description": "此处可定义额外辅助信息",
              "type": "string",
              "title": "用户ID",
              "minLength": 3,
              "maxLength": 6
            },
            "password": {
              "type": "string",
              "title": "密码"
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
            "comment": {
              "type": "string",
              "title": "备注"
            }
          }
        },
        uiSchema: {
          "interest": {
            "ui:colspan": 2
          },
          "comment": {
            "ui:options": {
              type: 'textarea'
            },
            "ui:colspan": 2
          }
        }
      }
    },
    methods: {
      onSubmit() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$message.success('查询执行成功');
            resolve();
          }, 1000);
        });
      }
    }
  }
</script>
```
:::




### ProForm Attributes

**此处只列出ElProForm独有属性，其他属性请参考ElJsonForm**

| 参数                   | 说明                                                                                                     | 类型     | 可选值                                                                    | 默认值                                                                                                                                                             |
|------------------------|--------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| model                  | 表单数据对象                                                                                             | object   | —                                                                         | —                                                                                                                                                                  |
| rules                  | 表单验证规则                                                                                             | object   | —                                                                         | —                                                                                                                                                                  |
| type                   | 高级表单的类型                                                                                           | string   | queryFilter/modalForm/cardForm                                            | —                                                                                                                                                                  |
| schema                 | JSON Schema对象                                                                                          | object   | —                                                                         | -                                                                                                                                                                  |
| ui-schema              | 用于设置各个表单字段的组件类型(ui:widget)、是否可用(ui:disabled)等属性 (请参照下表)                       | Object   | —                                                                         | —                                                                                                                                                                  |
| before-submit          | 表单提交前回调，支持返回Promise                                                                           | Function | —                                                                         | —                                                                                                                                                                  |
| after-submit           | 表单提交时回调，需要返回Promise                                                                           | Function | —                                                                         | —                                                                                                                                                                  |
| expand                 | `type` 为 `queryFilter` 时有效，是否显示全部查询条件。                                                     | Boolean  | false                                                                     | -                                                                                                                                                                  |
| title                  | `type` 为 `cardForm` 或 `modalForm` 时有效，优先级比 `card-attrs` 或 `modal-attrs` 内定义对应的标题属性低 | string   | —                                                                         | —                                                                                                                                                                  |
| submitter              | 提交按钮相关配置                                                                                         | Boolean  | —                                                                         | true                                                                                                                                                               |
| card-attrs             | `type` 为 `cardForm` 时有效，值为ElCard的Props                                                            | object   | —                                                                         | —                                                                                                                                                                  |
| modal-attrs            | `type` 为 `modalForm` 时有效，值为ElDialog的Props                                                         | object   | —                                                                         | —                                                                                                                                                                  |
| collapse               | `type` 为 `queryFilter` 时有效，是否开启查询条件折叠功能                                                  | boolean  | —                                                                         | true                                                                                                                                                               |
| control-button-layout  | 按钮组件布局                                                                                             | Array    | `search`, `searchReset`, `submit` , `reset`, `cancel` , `slot`,`collapse` | `type` 为 `queryFilter`默认值为['search','searchReset','collapse'] ,  `type` 为 空 默认值为['submit','reset'] ,  `type` 为 `modalForm` 默认值为['submit','cancel'] |
| force-collapse-columns | 收起模式下，强制显示表单项的个数                                                                          | number   | —                                                                         | —                                                                                                                                                                  |
| columns                | 表单组件一行显示几个表单项                                                                               | number   | —                                                                         | 3                                                                                                                                                                  |
| submit-propagation     | 是否开启回车事件冒泡                                                                                     | Boolean  | -                                                                         | true                                                                                                                                                               |


### ProForm Events

| 事件名称      | 说明                                                       | 回调参数                             |
|---------------|----------------------------------------------------------|--------------------------------------|
| visibleChange | `type` 为 `modalForm` 时有效，对话框显示/隐藏状态变更时触发 | key 表单字段的Key, val 表单字段的值  |
| clear         | 表单重置按钮点击后触发                                     | —                                    |
| change        | 表单字段值变更时回调                                       | key 表单字段的 Key, val 表单字段的值 |
| expandChange  | 表单折叠状态变更                                           | val 表单字段的值                     |
| submit        | 表单提交                                                   | val 表单字段的值                     |


### ProForm Slot
| name           | 说明                                              |
|----------------|-------------------------------------------------|
| —              | 默认的内容                                        |
| controlButtons | 需要配合`control-button-layout`来显示插槽中的内容 |

