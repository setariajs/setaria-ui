## JsonForm 动态表单

根据 [JSON-Schema](https://json-schema.org/) 可渲染对应的表单用于数据的展示和编辑

**JSON-Schema 的文档稍后整理，在此之前可参考 [链接](https://imweb.io/topic/56b1b4bb5c49f9d377ed8ee9)**

### 典型表单

动态表单的基本使用

::: demo 根据标准 JSON-Schema 生成对应的表单

```html
<div>
  <div style="margin-bottom: 10px;">
    <el-button @click="onChangeUiSchema">change ui schema</el-button>
  </div>
  <el-json-form
    ref="form1"
    :model="form1"
    :schema="schema"
    :ui-schema="uiSchema"
    :validate-on-rule-change="false"
    :columns="4"
    :rules="rules"
    @submit="onSubmit"
    @change="onChange"
  >
    <div slot="button">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-json-form>
  <p>result:</p>
  <div>
    {{ this.form1 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form1: null,
        rules: {
          comment: [
            {
              validator: (rule, value, callback) => {
                if (value === 'abc') {
                  callback(new Error('不能输入abc'));
                }
                callback();
              }
            }
          ]
        },
        schema: {
          required: ['firstName', 'lastName', 'age', 'comment'],
          properties: {
            firstName: {
              description: 'First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)First Name(名)',
              type: 'string',
              title: 'First name',
              minLength: 3,
              maxLength: 6,
            },
            lastName: {
              type: 'string',
              title: 'Last name',
              editable: false
            },
            password: {
              type: 'string',
              title: 'password',
            },
            age: {
              type: 'integer',
              title: 'Age',
            },
            gender: {
              type: 'integer',
              title: 'gender',
              oneOf: [
                { const: '1', title: 'Male' },
                { const: '2', title: 'FeMale' },
                { const: '3', title: 'Other', disabled: true },
              ],
            },
            comment: {
              type: 'string',
              title: 'comment',
            },
            birth: {
              type: 'string',
              title: 'birth',
              format: 'date',
            },
            time: {
              type: 'array',
              title: 'time',
              format: 'time',
            },
            dateTime: {
              type: 'string',
              title: 'dateTime',
              format: 'date-time',
            },
            interest: {
              type: 'array',
              title: 'interest',
              anyOf: [
                { const: '1', title: 'Game' },
                { const: '2', title: 'Music' },
                { const: '3', title: 'Sport' },
              ],
            },
            profession: {
              type: 'string',
              title: 'profession',
              oneOf: [
                { const: 1, title: 'teacher' },
                { const: 2, title: 'doctor' },
              ],
            },
            agree: {
              type: 'boolean',
              title: 'agree'
            },
            price: {
              type: 'number',
              title: '金额',
              precision: 3,
              format: 'price'
            }
          },
        },
        uiSchema: {
           comment: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 5,
            },
            'ui:placeholder': '111',
            'ui:colspan': 2,
          },
          gender: {
            'ui:widget': 'select'
          }
        },
      }
    },
    mounted() {
      this.form1 = {
        firstName: 'first',
        lastName: 'last',
        password: '',
        age: null,
        gender: 2,
        birth: '',
        interest: [],
        comment: '',
        profession: '',
        dateTime: '',
        time: '',
        agree: true,
        price: 99991.23456
      };
    },
    methods: {
      onChange(key, value, object) {
        const schema = this.schema;
        if (key === 'gender') {
          if (value === 2) {
            const index = schema.required.findIndex(item => item === 'comment');
            if (index > 0) {
              schema.required.splice(index, 1);
            }
          } else {
            const index = schema.required.findIndex(item => item === 'comment');
            if (index === -1) {
              schema.required.push('comment');
            }
          }
        }
      },
      onSubmit() {
        this.$refs.form1.validate((isValid) => {
          if (isValid !== false) {
            this.$message.success('表单提交成功')
          }
        })
      },
      onChangeUiSchema() {
        // this.uiSchema = {};
        this.uiSchema.lastName['ui:disabled'] = !this.uiSchema.lastName['ui:disabled'];
        if (this.uiSchema.gender['ui:widget'] === 'select') {
          this.uiSchema.gender['ui:widget'] = 'radio';
        } else {
          this.uiSchema.gender['ui:widget'] = 'select';
        }
      },
    },
  }
</script>
```
:::

### 定制化表单

可用过传入 ui-schema 属性对表单的项目进行定制化。

请注意: ui-options 中的属性为各组件的独有属性，即只有该组件才具有的属性。disabled 等不在此列。

::: demo 对于日期项目，可以通过设置 type 属性为 array 使用日期/日期时间范围

```html
<div>
  <el-json-form
    ref="form2"
    :model="form2"
    :schema="schema"
    :ui-schema="uiSchema"
    label-width="auto"
    @submit="onSubmitForm2"
    :columns="3"
  >
    <template slot="scopeSlotCustomRender" slot-scope="scope">
      <el-input
        v-model="scope.data.scopeSlotCustomRender"
        suffix-icon="el-icon-user"
      />
    </template>
    <div slot="button">
      <el-button type="primary" @click="onSubmitForm2">提交</el-button>
      <el-button @click="handleToggleHiddenField">显示/隐藏项目</el-button>
    </div>
  </el-json-form>
  <p>result:</p>
  <div>
    {{ this.form2 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form2: {
          firstName: 'first',
          lastName: 'last',
          password: '',
          age: null,
          gender: 1,
          birth: '',
          interest: [],
          comment: '',
          profession: '',
          number: '',
          searchHelp: '',
          jsxCustomRender: '123',
          scopeSlotCustomRender: '456',
        },
        schema: {
          required: ['firstName', 'lastName', 'age', 'ou'],
          properties: {
            firstName: {
              type: 'string',
              title: 'First name',
              minLength: 3,
              maxLength: 6,
            },
            lastName: {
              type: 'string',
              title: 'Last name',
            },
            password: {
              type: 'string',
              title: 'password',
            },
            age: {
              type: 'integer',
              title: 'Age',
            },
            gender: {
              type: 'integer',
              title: 'gender',
              oneOf: [
                { const: 1, title: 'Male' },
                { const: 2, title: 'FeMale' },
              ],
            },
            birth: {
              type: 'string',
              title: 'birth',
              format: 'date',
            },
            interest: {
              type: 'array',
              title: 'interest',
              anyOf: [
                { const: '1', title: 'Game' },
                { const: '2', title: 'Music' },
                { const: '3', title: 'Sport' },
              ],
            },
            hidden: {
              type: 'string',
              title: 'hidden',
            },
            comment: {
              type: 'string',
              title: 'comment',
            },
            profession: {
              type: 'string',
              title: 'profession',
              oneOf: [
                { const: 1, title: 'teacher' },
                { const: 2, title: 'doctor' },
              ],
            },
            number: {
              type: 'string',
              title: 'number(10, 4)',
            },
            searchHelp: {
              type: 'string',
              title: '搜索弹窗',
            },
            jsxCustomRender: {},
            scopeSlotCustomRender: {
              title: '自定义插槽项目',
            },
          },
        },
        uiSchema: {
          lastName: {
            'ui:disabled': true,
          },
          password: {
            'ui:widget': 'password',
            className: 'password-class',
          },
          comment: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 5,
            },
            'ui:placeholder': '111',
            'ui:colspan': 3,
          },
          gender: {
            'ui:widget': 'radio',
          },
          interest: {
            'ui:widget': 'checkbox',
            'ui:colspan': 2,
          },
          profession: {
            'ui:options': {
              clearable: true,
            },
          },
          hidden: {
            'ui:hidden': (val) => { return val.firstName === 'first' },
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
          number: {
            'ui:rules': [
              {
                pattern: /^(\-)?\d{1,10}(\.\d{1,4})?$/,
                message: '数据格式为最多10位整数和4位小数',
              },
            ],
          },
          jsxCustomRender: {
            'ui:colspan': 3,
            'ui:render': (h, scope) => {
              return (
                <el-form-item label="JSX自定义项目">
                  <el-input
                    value={scope.data.jsxCustomRender}
                    on-input={(val) => {
                      scope.data.jsxCustomRender = val
                    }}
                  />
                </el-form-item>
              )
            },
          },
        },
      }
    },
    methods: {
      onSubmitForm2() {
        this.$refs.form2.validate((isValid) => {
          if (isValid) {
            this.$message.success('表单提交成功')
          }
        })
      },
      handleToggleHiddenField() {
        this.uiSchema.hidden['ui:hidden'] = !this.uiSchema.hidden['ui:hidden']
      },
    },
  }
</script>
```

:::

### 表单项目自动布局

开启 `auto-layout` 属性的场合，组件会根据 schema 中的 maxLength 基于`columns`进行自动布局。

::: demo

```html
<div>
  <el-json-form
    ref="form2"
    :model="form2"
    :schema="schema"
    :ui-schema="uiSchema"
    :columns="3"
    :column-max-label-length="10"
    size="small"
  >
    <div slot="button">
      <el-button type="primary" @click="onSubmitForm2">提交</el-button>
      <el-button @click="handleToggleHiddenField">显示/隐藏项目</el-button>
    </div>
  </el-json-form>
  <p>result:</p>
  <div>
    {{ this.form2 }}
  </div>
</div>
<script>
  export default {
    data() {
      return {
        form2: {
          firstName: 'first',
          lastName: 'last',
          password: '',
          age: null,
          gender: '1',
          birth: '',
          interest: [],
          comment: '',
          profession: '',
        },
        schema: {
          required: ['firstName', 'lastName', 'age', 'ou', 'comment'],
          properties: {
            firstName: {
              type: 'string',
              title: 'First name(姓名)(姓名)(姓名)',
              minLength: 3,
              maxLength: 6,
            },
            lastName: {
              type: 'string',
              title: 'Last name',
              maxLength: 6,
            },
            password: {
              type: 'string',
              title: 'password',
              maxLength: 20,
            },
            age: {
              type: 'integer',
              title: 'Age',
            },
            gender: {
              type: 'integer',
              title: 'gender',
              oneOf: [
                { const: 1, title: 'Male' },
                { const: 2, title: 'FeMale' },
              ],
            },
            birth: {
              type: 'string',
              title: 'birth',
              format: 'date',
            },
            interest: {
              type: 'array',
              title: 'interest',
              description: '兴趣选择',
              anyOf: [
                { const: '1', title: 'Game' },
                { const: '2', title: 'Music' },
                { const: '3', title: 'Sport' },
              ],
            },
            hidden: {
              type: 'string',
              title: 'hidden',
            },
            comment: {
              type: 'string',
              title: '1234567890一二三四五六七八九十abcdefg',
              description: '自定义辅助提示',
            },
            profession: {
              type: 'string',
              title: 'profession',
              oneOf: [
                { const: 1, title: 'teacher' },
                { const: 2, title: 'doctor' },
              ],
            },
            searchHelp: {
              type: 'string',
              title: '搜索弹窗',
            },
          },
        },
        uiSchema: {
          lastName: {
            'ui:disabled': true,
          },
          password: {
            'ui:widget': 'password',
            className: 'password-class',
          },
          comment: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 5,
            },
            'ui:colspan': 3,
          },
          gender: {
            'ui:widget': 'radio',
          },
          interest: {
            'ui:widget': 'checkbox',
            'ui:colspan': 2,
          },
          profession: {
            'ui:options': {
              clearable: true,
            },
          },
          hidden: {
            'ui:hidden': true,
          },
          searchHelp: {
            'ui:options': {
              'suffix-icon': 'el-icon-search',
              readonly: true,
            },
            'ui:nativeOn': {
              click: () => {
                this.$message.info('searchHelpclick')
              },
            },
          },
        },
      }
    },
    methods: {
      onSubmitForm2() {
        this.$refs.form2.validate((isValid) => {
          if (isValid) {
            this.$message.success('表单提交成功')
          }
        })
      },
      handleToggleHiddenField() {
        this.uiSchema.hidden['ui:hidden'] = !this.uiSchema.hidden['ui:hidden']
      },
    },
  }
</script>
```
:::

### Form Attributes

| 参数                    | 说明                                                                                                         | 类型    | 可选值         | 默认值 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | ------- | -------------- | ------ |
| model                   | 表单数据对象                                                                                                 | object  | —              | —      |
| rules                   | 表单验证规则                                                                                                 | object  | —              | —      |
| inline                  | 行内表单模式                                                                                                 | boolean | —              | false  |
| disabled                | 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效                            | boolean | —              | false  |
| label-position          | 表单域标签的位置                                                                                             | string  | right/left/top | top    |
| label-width             | 表单域标签的宽度，作为 Form 直接子元素的 form-item 会继承该值                                                | string  | —              | —      |
| label-suffix            | 表单域标签的后缀                                                                                             | string  | —              | —      |
| show-message            | 是否显示校验错误信息                                                                                         | boolean | —              | true   |
| schema                  | JSON Schema 对象                                                                                             | Object  | —              | -      |
| ui-schema               | 用于设置各个表单字段的组件类型(ui:widget)、是否可用(ui:disabled)等属性 (请参照下表)                          | Object  | —              | -      |
| columns                 | 表单的列数。分辨率在 768 像素以下时表单列数固定为 1                                                          | Number  | —              | 5      |
| column-max-label-length | 以 col 为单位的 form-label 的最大长度，超过的部分则截取省略。此时 Label 外增加 `el-TOOLTIP` 可查看全部 Label | Number  | -              | -      |

### UI-Schema Attributes

| 参数        | 说明                   | 类型    | 可选值                                      | 默认值 |
| ----------- | ---------------------- | ------- | ------------------------------------------- | ------ |
| ui:widget   | 表单字段的组件类型     | string  | password, textarea, select, checkbox, radio | —      |
| ui:disabled | 表单字段的组件是否可用 | boolean | -                                           | false  |
| ui:hidden   | 表单字段的组件是否可见 | boolean/function | -                                           | false  |
| ui:options  | 表单字段的组件独有属性 | object  | UI 组件独有属性                             | -      |
| ui:colspan  | 跨越的列数             | number  | -                                           | -      |

### Form Events

| 事件名称 | 说明                 | 回调参数                             |
| -------- | -------------------- | ------------------------------------ |
| change   | 表单字段值变更时回调 | key 表单字段的 Key, val 表单字段的值 |

### Form Methods

| 方法名        | 说明                                                       | 参数                                                             |
| ------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| validate      | 对整个表单进行校验的方法                                   | Function(callback: Function(boolean))                            |
| validateField | 对部分表单字段进行校验的方法                               | Function(prop: string, callback: Function(errorMessage: string)) |
| resetFields   | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | -                                                                |
