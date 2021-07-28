import ElForm from 'setaria-ui/packages/form/src/form';
import ElFormItem from 'setaria-ui/packages/form/src/form-item';
import ElSelect from 'setaria-ui/packages/select';
import ElInput from 'setaria-ui/packages/input';
import { isEmpty } from 'setaria-ui/src/utils/util';

const NON_INITIAL = 'nonInitial';
// const INITIALED = 'initialed';

const CLASSNAME = 'className';
// UI Property
const UI_WIDGET = 'ui:widget';
const UI_OPTIONS = 'ui:options';
const UI_DISABLED = 'ui:disabled';
const UI_PLACEHOLDER = 'ui:placeholder';
const UI_HIDDEN = 'ui:hidden';
const UI_FORMAT = 'ui:format';
const UI_COLSPAN = 'ui:colspan';
const UI_ON = 'ui:on';
const UI_NATIVE_ON = 'ui:nativeOn';
const UI_RULE = 'ui:rules';
const UI_RENDER = 'ui:render';
// 默认日期格式
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} HH:mm:ss`;
// 默认时间格式
const DEFAULT_TIME_FORMAT = 'HH:mm:ss';

export default {
  name: 'ElJsonForm',
  componentName: 'ElJsonForm',
  props: {
    model: Object,
    // !FIXME 使用jsx的某些情况下，无法取得model值，问题原因待查
    modelData: Object,
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
      formRenderKey: NON_INITIAL
    };
  },
  computed: {
    innerRules() {
      const ret = {};
      const { rules = {} } = this;
      const { required = [], properties = {} } = this.schema;
      // 优化当实时change schema.required时errorMessage未刷新的问题
      Object.keys(properties).forEach(key => {
        const item = properties[key];
        let itemName = '';
        if (item) {
          itemName = item.title;
        }
        ret[key] = [];
        if (rules[key] && rules[key].length > 0) {
          rules[key].forEach(rule => {
            ret[key].push({
              ...rule
            });
          });
        }
        if (required.includes(key)) {
          ret[key].push({
            required: true,
            message: `请输入${itemName}`,
            trigger: 'blur'
          });
        }
      });
      const uiSchema = this.uiSchema;
      // 文本框长度限制&类型
      Object.keys(properties).forEach(key => {
        const item = properties[key];
        let itemName = '';
        if (item) {
          itemName = item.title;
        }
        const uiSchemaItemObj = uiSchema[key];
        const customRules = uiSchemaItemObj && uiSchemaItemObj[UI_RULE];
        // 自定义rule
        if (customRules) {
          const originRule = ret[key];
          ret[key] = originRule.concat(customRules);
        // 根据schema生成的rule
        } else {
          if (!isEmpty(item.pattern)) {
            const rule = {
              pattern: item.pattern,
              message: `输入格式必须符合${item.pattern}`
            };
            if (!ret[key]) {
              ret[key] = [];
            }
            ret[key].push(rule);
          } else if (item.type === 'string') {
            const rule = {
              trigger: 'blur'
            };
            const minLength = item.minLength;
            const maxLength = item.maxLength;
            if (typeof minLength === 'number') {
              rule.min = minLength;
              rule.message = `长度必须大于${minLength}个字符`;
            }
            if (typeof maxLength === 'number') {
              rule.max = maxLength;
              if (typeof minLength === 'number') {
                rule.message = `长度只能在${minLength}-${maxLength}个字符之间`;
              } else {
                rule.message = `长度必须小于${maxLength}个字符`;
              }
            }
            if (rule.message !== '' && rule.message !== undefined) {
              if (!ret[key]) {
                ret[key] = [];
              }
              ret[key].push(rule);
            }
          } else if (item.type === 'integer' || item.type === 'number') {
            let message = `${itemName}必须为数字`;
            if (item.type === 'integer') {
              message = `${itemName}必须为整数`;
            }
            const numberRule = {
              type: item.type,
              message: message,
              trigger: 'blur'
            };
            const minimum = item.minimum;
            const maximum = item.maximum;
            if (typeof minimum === 'number') {
              numberRule.min = minimum;
              numberRule.message = `请输入大于${minimum}的${item.type === 'integer' ? '整数' : '数字'}`;
            }
            if (typeof maximum === 'number') {
              numberRule.max = maximum;
              if (typeof minimum === 'number') {
                numberRule.message = `请输入${minimum} - ${maximum}之间的${item.type === 'integer' ? '整数' : '数字'}`;
              } else {
                numberRule.message = `请输入小于${maximum}的${item.type === 'integer' ? '整数' : '数字'}`;
              }
            }
            let isRequiredRuleExist = false;
            if (!ret[key]) {
              ret[key] = [];
            } else {
              isRequiredRuleExist = ret[key].some(newRule => {
                // 因async-validator无法正常处理数字类型的required:true规则，
                // 因此暂时移除数字类型的required:true规则
                if (newRule.required === true) {
                  newRule.type = item.type;
                  return true;
                }
              });
            }
            if (isRequiredRuleExist) {
              // 在规则头部生成数字校验规则以规避上述问题
              ret[key].unshift(numberRule);
            } else {
              // 在规则末尾生成数字校验规则
              ret[key].push(numberRule);
            }
          }
        }
      });
      return ret;
    },
    fields() {
      return this.$refs.form.fields;
    }
  },
  created() {
  },
  mounted() {
    // 初始化时，需要等自组件渲染完才能从子组件取得当前选择值
    this.$nextTick(() => {
      // this.formRenderKey = INITIALED;
    });
  },
  methods: {
    refresh() {
      // if (this.formRenderKey === NON_INITIAL) {
      //   this.formRenderKey = INITIALED;
      // }
    },
    handleSubmit() {
      this.$emit('submit');
    },
    validate(callback) {
      this.$refs.form.validate(callback);
    },
    validateField(props, cb) {
      this.$refs.form.validateField(props, cb);
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
    const self = this;
    const { componentPrefix, $scopedSlots } = self;
    const formItemArray = [];
    const formEvents = {
      on: {}
    };
    formEvents.on.submit = () => {
      this.handleSubmit();
    };
    const model = this.model || this.modelData;
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
            let componentTagName = '';
            let componentProps = {
              'class': `el-json-form__component ${className}`
            };
            const componentChildren = [];
            const props = {
              value: model[key],
              disabled: ui[UI_DISABLED] === true
            };
            // DOM 属性
            const domProps = {};
            // 普通的 HTML attribute
            const attrs = {};
            const events = {
              on: {},
              nativeOn: {}
            };
            // 因render 函数中没有与 v-model 相应的 api, 实现v-model逻辑。
            events.on.input = (val) => {
              model[key] = val;
              this.$emit('input', key, val, model);
            };
            events.on.change = (val) => {
              this.$emit('change', key, val, model);
            };
            if (property.enum || property.oneOf || property.anyOf) {
              if (property.oneOf && ui[UI_WIDGET] === 'radio') {
                componentTagName = `${componentPrefix}-radio-group`;
              } else if (property.anyOf && ui[UI_WIDGET] === 'checkbox' && property.type === 'array') {
                componentTagName = `${componentPrefix}-checkbox-group`;
              } else {
                componentTagName = `${componentPrefix}-select`;
                props.multiple = false;
              }
              // 取得选择项一览
              let list = null;
              if (property.oneOf) {
                list = property.oneOf;
              } else if (property.anyOf) {
                list = property.anyOf;
                if (componentTagName === `${componentPrefix}-select`) {
                  props.multiple = true;
                }
              } else {
                list = property.enum.map(e => {
                  return { title: e, 'const': e };
                });
              }
              const optionList = [];
              list.forEach(item => {
                optionList.push({
                  label: item.title,
                  value: item.const,
                  disabled: item.disabled
                });
              });
              if (componentTagName === `${componentPrefix}-select`) {
                optionList.forEach(item => {
                  componentChildren.push(h(
                    `${componentPrefix}-option`,
                    {
                      props: {
                        label: item.label,
                        value: item.value,
                        disabled: item.disabled
                      }
                    }
                  ));
                });
              } else if (componentTagName === `${componentPrefix}-radio-group`) {
                optionList.forEach(item => {
                  componentChildren.push(h(
                    `${componentPrefix}-radio`,
                    {
                      props: {
                        label: item.value
                      }
                    },
                    [item.label]
                  ));
                });
              } else if (componentTagName === `${componentPrefix}-checkbox-group`) {
                optionList.forEach(item => {
                  componentChildren.push(h(
                    `${componentPrefix}-checkbox`,
                    {
                      props: {
                        label: item.value
                      }
                    },
                    [item.label]
                  ));
                });
              }
            } else if (property.format === 'date' ||
              property.format === 'date-time') {
              componentTagName = `${componentPrefix}-date-picker`;
              if (property.type === 'string') {
                props.type = property.format.replace(/-/g, '');
              } else if (property.type === 'array') {
                props.type = `${property.format}-range`.replace(/-/g, '');
              }
              if (ui[UI_FORMAT] !== undefined && ui[UI_FORMAT] !== null) {
                props['value-format'] = ui[UI_FORMAT];
              } else if (property.format === 'date' || property.format === 'date-range') {
                props['value-format'] = DEFAULT_DATE_FORMAT;
              } else if (property.format === 'date-time' || property.format === 'date-time-range') {
                props['value-format'] = DEFAULT_DATE_TIME_FORMAT;
              }
            } else if (property.format === 'time') {
              componentTagName = `${componentPrefix}-time-picker`;
              if (property.type === 'array') {
                props['is-range'] = true;
              }
              if (ui[UI_FORMAT] !== undefined && ui[UI_FORMAT] !== null) {
                props['value-format'] = ui[UI_FORMAT];
              } else if (property.format === 'time' || property.format === 'time-range') {
                props['value-format'] = DEFAULT_TIME_FORMAT;
              }
            } else if (property.type === 'string') {
              componentTagName = `${componentPrefix}-input`;
              // 组件类型
              const widgetType = ui[UI_WIDGET];
              if (widgetType !== undefined) {
                if (widgetType === 'password') {
                  props.type = 'password';
                } else if (widgetType === 'textarea') {
                  props.type = 'textarea';
                  const options = ui[UI_OPTIONS] || {};
                  if (typeof options.rows === 'number') {
                    attrs.rows = options.rows;
                  }
                }
              }
              if (typeof property.maxLength === 'number') {
                attrs.maxlength = property.maxLength;
              }
              componentProps.style = {
                width: '100%'
              };
            } else if (property.type === 'integer' || property.type === 'number') {
              events.on.input = (val) => {
                let ret = val;
                if (typeof val === 'string') {
                  ret = parseFloat(val);
                  if (isNaN(ret)) {
                    ret = null;
                  }
                }
                model[key] = ret;
                this.$emit('input', key, ret, model);
              };
              // TODO 小数位设置
              componentTagName = `${componentPrefix}-input-number`;
            } else if (property.type === 'boolean' && ui[UI_WIDGET] === undefined) {
              componentTagName = `${componentPrefix}Checkbox`;
            }
            componentProps.props = props;
            componentProps.on = events.on;
            componentProps.nativeOn = events.nativeOn;
            if (Object.keys(domProps).length > 0) {
              componentProps.domProps = domProps;
            }
            // placeholder处理
            if (isEmpty(attrs.placeholder)) {
              let placeholder = ui[UI_PLACEHOLDER];
              if (isEmpty(placeholder)) {
                placeholder = `请输入${property.title}`;
              }
              attrs.placeholder = placeholder;
            }
            if (Object.keys(attrs).length > 0) {
              componentProps.attrs = attrs;
            }
            if (ui[UI_ON]) {
              const uiOn = ui[UI_ON];
              // 合并事件定义
              Object.keys(uiOn).forEach(uiOnKey => {
                // 自定义事件已被注册的场合，把注册的事件和自定义的事件按顺序执行
                if (typeof events.on[uiOnKey] === 'function') {
                  events.on[uiOnKey] = () => {
                    events.on[uiOnKey]();
                    uiOn[uiOnKey]();
                  };
                } else {
                  events.on[uiOnKey] = uiOn[uiOnKey];
                }
              });
            }
            if (ui[UI_NATIVE_ON]) {
              const uiNativeOn = ui[UI_NATIVE_ON];
              // 合并事件定义
              Object.keys(uiNativeOn).forEach(uiOnKey => {
                // 自定义事件已被注册的场合，把注册的事件和自定义的事件按顺序执行
                if (typeof events.on[uiOnKey] === 'function') {
                  events.nativeOn[uiOnKey] = () => {
                    events.nativeOn[uiOnKey]();
                    uiNativeOn[uiOnKey]();
                  };
                } else {
                  events.nativeOn[uiOnKey] = uiNativeOn[uiOnKey];
                }
              });
            }
            // 合并ui:options属性至组件属性中
            // 用户自定义的options属性为最优先
            const mergedProps = Object.assign({}, componentProps.props, ui[UI_OPTIONS] || {});
            componentProps.props = mergedProps;
            formItemChildren.push(h(componentTagName, componentProps, componentChildren));
          } else {
            const childrenCustomRender = $scopedSlots[key]({data: model});
            formItemChildren.push(childrenCustomRender);
          }
          const labelSlot = self.getFormLabelSlot(h, property, self.columnMaxLabelLength, colSpan);
          const colSpan = ui[UI_COLSPAN];
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
        } else if (typeof ui[UI_RENDER] === 'function') {
          formItem = ui[UI_RENDER](h, { data: model });
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
        let uiColspan = itemUISchema[UI_COLSPAN];
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
        let isDisplay = itemUISchema[UI_HIDDEN];
        if (typeof itemUISchema[UI_HIDDEN] === 'function') {
          isDisplay = itemUISchema[UI_HIDDEN](model);
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
