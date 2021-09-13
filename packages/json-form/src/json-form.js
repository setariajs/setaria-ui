import { JSON_FORM_UI } from 'setaria-ui/src/constants/index';
import ElForm from 'setaria-ui/packages/form/src/form';
import ElFormItem from 'setaria-ui/packages/form/src/form-item';
import ElSelect from 'setaria-ui/packages/select';
import ElInput from 'setaria-ui/packages/input';
import merge from 'setaria-ui/src/utils/merge';
import { createElementByProperty, createFormRulesBySchema } from 'setaria-ui/src/utils/schema';
import { isEmpty } from 'setaria-ui/src/utils/util';

const CLASSNAME = 'className';

export default {
  name: 'ElJsonForm',
  componentName: 'ElJsonForm',
  props: {
    model: Object,
    // 表单提交是否重载页面
    isPrevent: {
      type: Boolean,
      default: true
    },
    schema: {
      type: Object,
      required: true
    },
    uiSchema: {
      type: Object,
      default() {
        return {
        };
      }
    },
    columns: {
      type: Number,
      default: 4
    },
    componentPrefix: {
      type: String,
      default: 'el'
    },
    columnMaxLabelLength: Number,
    rules: Object
  },
  data() {
    return {
    };
  },
  computed: {
    innerRules() {
      const { rules = {} } = this;
      const ret = createFormRulesBySchema(this.schema, this.uiSchema);
      return merge({}, ret, rules);
    },
    fields() {
      if (this.$refs.form) {
        return this.$refs.form.fields;
      }
      return [];
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    handleSubmit() {
      this.$emit('submit');
    },
    validate(callback) {
      return this.$refs.form.validate(callback);
    },
    validateField(props, cb) {
      return this.$refs.form.validateField(props, cb);
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
    getFormLabelSlot(h, property, columnMaxLabelLength, colSpan) {
      const { componentPrefix } = this;
      let span = typeof colSpan === 'number' ? colSpan : 1;
      let ret = null;
      let textSpan = null;
      let tooltip = null;
      const slotChildren = [];
      if (typeof columnMaxLabelLength === 'number') {
        const ellipsis = h(
          `${componentPrefix}-ellipsis`,
          {
            props: {
              tooltip: true,
              'full-width-recognition': true,
              length: columnMaxLabelLength * span
            }
          },
          [property.title]
        );
        textSpan = h(
          'div',
          {
            'class': ['label-inner__ellipsis']
          },
          [ellipsis]
        );
      }
      if (!isEmpty(property.description)) {
        if (textSpan === null) {
          textSpan = h(
            'span',
            {
              domProps: {
                innerHTML: property.title
              }
            }
          );
        }
        const icon = h(
          `${componentPrefix}-icon`,
          {
            props: {
              name: 'warning-outline',
              tooltip: false
            },
            style: {
              cursor: 'auto'
            }
          }
        );
        tooltip = h(
          `${componentPrefix}-tooltip`,
          {
            props: {
              placement: 'top'
            },
            style: {
              marginLeft: '5px'
            }
          },
          [icon, h('span', {
            domProps: {
              innerHTML: property.description
            },
            slot: 'content',
            style: {
              display: 'inline-block',
              maxWidth: '400px'
            }
          })]
        );
      }
      if (textSpan) {
        slotChildren.push(textSpan);
      }
      if (tooltip) {
        slotChildren.push(tooltip);
      }
      if (slotChildren.length > 0) {
        ret = (props) => h(
          'div', {
            class: {
              'el-json-form__label-inner': true
            }
          }, slotChildren
        );
      }
      return ret;
    }
  },
  render(h) {
    // model属性必须设置，否则表单内组件无法正确进行相应
    if (isEmpty(this.model)) {
      console.warn('表单组件的model属性需要设置非空值。');
      return null;
    }
    const self = this;
    const { componentPrefix, $scopedSlots } = self;
    const formItemArray = [];
    const formEvents = {
      on: {}
    };
    formEvents.on.submit = () => {
      this.handleSubmit();
    };
    const model = this.model;
    if (this.schema && this.schema.properties) {
      Object.keys(this.schema.properties).forEach(key => {
        const ui = this.uiSchema[key] || {};
        let formItem = null;
        const property = self.schema.properties[key];
        // title不为空的场合，基于schema进行渲染
        if (!isEmpty(property.title)) {
          const formItemChildren = [];
          if ($scopedSlots[key] === undefined) {
            const className = ui[CLASSNAME] || '';
            const component = createElementByProperty(key, property, ui, model, this.$emit);
            if (component) {
              component.componentProps.class = `el-json-form__component ${className}`;
              const { componentTagName, componentProps, componentChildrenOptions } = component;
              const componentChildren = [];
              componentChildrenOptions.forEach((item) => {
                if (componentTagName === 'el-select') {
                  componentChildren.push(h(
                    'el-option',
                    {
                      props: {
                        label: item.label,
                        value: item.value,
                        disabled: item.disabled
                      }
                    }
                  ));
                } else if (componentTagName === 'el-radio-group') {
                  componentChildren.push(h(
                    'el-radio',
                    {
                      props: {
                        label: item.value
                      }
                    },
                    [item.label]
                  ));
                } else if (componentTagName === 'el-checkbox-group') {
                  componentChildren.push(h(
                    'el-checkbox',
                    {
                      props: {
                        label: item.value
                      }
                    },
                    [item.label]
                  ));
                }
              });
              formItemChildren.push(h(componentTagName, componentProps, componentChildren));
            }
          } else {
            const childrenCustomRender = $scopedSlots[key]({data: model});
            formItemChildren.push(childrenCustomRender);
          }
          const labelSlot = self.getFormLabelSlot(h, property, self.columnMaxLabelLength, colSpan);
          const colSpan = ui[JSON_FORM_UI.UI_COLSPAN];
          formItem = h(
            `${componentPrefix}-form-item`,
            {
              'class': [
                `el-form-item-${key}`,
                'el-json-form-item'
              ],
              props: {
                label: property.title,
                prop: key
              },
              scopedSlots: {
                label: labelSlot
              }
            },
            [formItemChildren]
          );
        } else if (typeof ui[JSON_FORM_UI.UI_RENDER] === 'function') {
          formItem = ui[JSON_FORM_UI.UI_RENDER](h, { data: model });
        }
        if (!isEmpty(formItem)) {
          formItemArray.push({
            id: key,
            component: formItem
          });
        }
      });
    }
    const { $attrs } = this;
    const formProps = {
      ...$attrs,
      model: model,
      rules: self.innerRules,
      isPrevent: self.isPrevent
    };
    let formComponents = formItemArray;
    // inline模式的场合不使用自适应
    if (this.$attrs.inline !== true) {
      // 自适应设置
      const rowArray = [];
      let colArray = [];
      // let totalSpanCount = 0;
      for (let index = 0; index < formItemArray.length; index += 1) {
        const formItem = formItemArray[index];
        const itemUISchema = this.uiSchema[formItem.id] || {};
        let uiColspan = itemUISchema[JSON_FORM_UI.UI_COLSPAN];
        uiColspan = uiColspan > self.columns ? self.columns : uiColspan;
        let spanProp = null;
        const span = typeof uiColspan === 'number' ? ((24 / self.columns) * uiColspan) : (24 / self.columns);
        // 考虑columns属性为5的场合
        if (self.columns === 5) {
          switch (uiColspan) {
            case 1:
              spanProp = '4-8';
              break;
            case 2:
              spanProp = '9-6';
              break;
            case 3:
              spanProp = '14-4';
              break;
            case 4:
              spanProp = '19-2';
              break;
            case 5:
              spanProp = '24';
              break;
            default:
              spanProp = '4-8';
          }
        } else {
          spanProp = span;
        }
        let isDisplay = itemUISchema[JSON_FORM_UI.UI_HIDDEN];
        if (typeof itemUISchema[JSON_FORM_UI.UI_HIDDEN] === 'function') {
          isDisplay = itemUISchema[JSON_FORM_UI.UI_HIDDEN](model);
        }
        let column = h(
          `${componentPrefix}-col`,
          {
            props: {
              span: spanProp,
              xs: 24
            },
            style: {
              display: isDisplay ? 'none' : ''
            }
          },
          [formItem.component]
        );
        colArray.push(column);
      }
      if (this.$slots.formItems) {
        colArray.push(this.$slots.formItems);
      }
      const labelWidth = self.$attrs['label-width'];
      const gutter = (labelWidth === undefined || labelWidth === null) ? 10 : 20;
      const row = h(
        `${componentPrefix}-row`,
        {
          props: {
            gutter: gutter
          }
        },
        [...colArray]
      );
      rowArray.push(row);
      formComponents = rowArray;
    } else {
      formComponents = formItemArray.map(item => item.component);
    }
    return h(
      `${componentPrefix}-form`,
      {
        'class': 'el-json-form',
        props: formProps,
        on: formEvents.on,
        ref: 'form'
      },
      [...formComponents, self.$slots.default, self.$slots.button]
    );
  },
  components: {
    ElForm,
    ElFormItem,
    ElSelect,
    ElInput
  }
};
