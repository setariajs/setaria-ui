import { JSON_FORM_UI, JSON_FORM_PROPERTY_CLASS } from 'setaria-ui/src/constants/index';
import ElForm from 'setaria-ui/packages/form/src/form';
import ElFormItem from 'setaria-ui/packages/form/src/form-item';
import ElSelect from 'setaria-ui/packages/select';
import ElInput from 'setaria-ui/packages/input';
import merge from 'setaria-ui/src/utils/merge';
import { createElementByProperty, createFormRulesBySchema, initialSetariaSchema } from 'setaria-ui/src/utils/schema';
import { hasClass } from 'setaria-ui/src/utils/dom';
import { arrayFind, isEmpty } from 'setaria-ui/src/utils/util';

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
    rules: Object,
    labelSuffix: String,
    requiredTriggerType: {
      type: String,
      default: 'change'
    }
  },
  data() {
    return {
      innerSchema: null
    };
  },
  watch: {
    schema: {
      immediate: true,
      deep: true,
      handler(val) {
        this.innerSchema = initialSetariaSchema(val);
      }
    }
  },
  computed: {
    formRef() {
      return this.$refs.form;
    },
    innerRules() {
      const { rules = {} } = this;
      const ret = createFormRulesBySchema(this.innerSchema, this.uiSchema, this.requiredTriggerType);
      return merge({}, ret, rules);
    },
    fields() {
      if (this.formRef) {
        return this.formRef.fields;
      }
      return [];
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    /**
     * 仅当使用默认处理时，返回表单输入项目的实例
     * @param {*} propertyKey
     * @returns
     */
    getComponent(propertyKey) {
      const { fields } = this;
      if (fields && fields.length > 0) {
        const formItem = arrayFind(fields, (f) => f.prop === propertyKey);
        if (formItem &&
            formItem.$children &&
            typeof formItem.$children.length === 'number' &&
            formItem.$children.length > 0) {
          return formItem.$children.filter((child) => hasClass(child.$el, JSON_FORM_PROPERTY_CLASS));
        }
      }
      return null;
    },
    handleSubmit() {
      this.$emit('submit');
    },
    validate(callback) {
      return this.formRef.validate(callback);
    },
    validateField(props, cb) {
      return this.formRef.validateField(props, cb);
    },
    resetFields() {
      this.formRef.resetFields();
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
        if (this.labelSuffix) {
          slotChildren.push(h('span', {
            domProps: {
              innerHTML: this.labelSuffix
            }
          }));
        }
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
    const { innerSchema } = this;
    if (innerSchema && innerSchema.properties) {
      Object.keys(innerSchema.properties).forEach(key => {
        const ui = this.uiSchema[key] || {};
        let formItem = null;
        const property = self.innerSchema.properties[key];
        // title不为空的场合，基于schema进行渲染
        if (!isEmpty(property.title)) {
          const formItemChildren = [];
          if (typeof $scopedSlots[key] === 'function') {
            const childrenCustomRender = $scopedSlots[key]({
              data: model,
              status: 'edit'
            });
            formItemChildren.push(childrenCustomRender);
          } else {
            const className = ui[CLASSNAME] || '';
            const component = createElementByProperty(key, property, ui, model, this.$emit);
            if (component) {
              component.componentProps.class = `el-json-form__component ${JSON_FORM_PROPERTY_CLASS} ${className}`;
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
              if (this.$slots) {
                Object.keys(this.$slots).forEach((slotKey) => {
                  const prefix = `${key}.`;
                  if (slotKey.indexOf(prefix) === 0) {
                    componentChildren.push(
                      h('template', {
                        slot: slotKey.replace(prefix, '')
                      }, [this.$slots[slotKey][0]])
                    );
                  }
                });
              }
              // if (this.$scopedSlots) {
              //   Object.keys(this.$scopedSlots).forEach((slotKey) => {
              //     const prefix = `${key}.`;
              //     if (slotKey.indexOf(prefix) === 0) {
              //       if (componentProps.scopedSlots === undefined) {
              //         componentProps.scopedSlots = {};
              //       }
              //       componentProps.scopedSlots[slotKey.replace(prefix, '')] =
              //         (props) => this.$scopedSlots[slotKey](props);
              //     }
              //   });
              // }
              formItemChildren.push(h(componentTagName, componentProps, componentChildren));
            }
          }
          const labelSlot = self.getFormLabelSlot(h, property, self.columnMaxLabelLength, colSpan);
          const colSpan = ui[JSON_FORM_UI.UI_COLSPAN];
          formItem = h(
            `${componentPrefix}-form-item`,
            {
              'class': [
                `el-form-item-${key}`,
                'el-json-form-item',
                'json-schema__wrapper'
              ],
              props: {
                label: property.title,
                prop: key,
                ...ui[JSON_FORM_UI.UI_WRAPPER_OPTIONS] || {}
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
      isPrevent: self.isPrevent,
      labelSuffix: self.labelSuffix
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
