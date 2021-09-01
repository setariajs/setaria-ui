import _ from 'lodash';
import { JSON_FORM_UI } from 'setaria-ui/src/constants/index';
import { isEmpty } from 'setaria-ui/src/utils/util';

/**
 * 根据Schema取得Property
 * @param {*} schema
 * @param {*} uiSchema
 * @returns
 */
export function createFormRulesBySchema(schema, uiSchema) {
  const ret = {};
  const { required = [], properties = {} } = schema;
  // 优化当实时change schema.required时errorMessage未刷新的问题
  Object.keys(properties).forEach(key => {
    const item = properties[key];
    let itemName = '';
    if (item) {
      itemName = item.title;
    }
    ret[key] = [];
    if (required.includes(key)) {
      ret[key].push({
        required: true,
        message: `请输入${itemName}`,
        trigger: 'blur'
      });
    }
  });
  // 文本框长度限制&类型
  Object.keys(properties).forEach(key => {
    const item = properties[key];
    let itemName = '';
    if (item) {
      itemName = item.title;
    }
    const uiSchemaItemObj = uiSchema[key];
    const customRules = uiSchemaItemObj && uiSchemaItemObj[JSON_FORM_UI.UI_RULE];
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
}

/**
 * 转换为金额格式
 * @param {string | number} val
 */
export function priceFormatter(val, config) {
  const current = `${val}`;
  if (_.isEmpty(current)) {
    return val;
  }
  const format = (v) => {
    const ret = v.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return ret;
  };
  if (current.indexOf('.')) {
    const arr = current.split('.');
    arr[0] = format(arr[0]);
    return arr.join('.');
  }
  return format(current);
}

/**
 * 将字符串格式金额转换为数字格式
 * @param {string} val
 * @returns
 */
export function priceParser(val) {
  return val.replace(/(,*)/g, '');
}

/**
 * 根据property取得Element信息
 * @param {*} key
 * @param {*} property
 * @param {*} uiProperty
 * @param {*} model
 * @param {*} h
 * @returns
 */
export function createElementByProperty(key, property, uiProperty, model, emit) {
  // 默认日期格式
  const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
  const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} HH:mm:ss`;
  // 默认时间格式
  const DEFAULT_TIME_FORMAT = 'HH:mm:ss';
  let componentProps = {};
  // const componentChildren = [];
  // title为空的场合
  if (isEmpty(property.title)) {
    return componentProps;
  }
  let componentTagName = '';
  const props = {
    value: model[key]
  };
  if (typeof uiProperty[JSON_FORM_UI.UI_DISABLED] === 'boolean') {
    props.disabled = uiProperty[JSON_FORM_UI.UI_DISABLED];
  }
  // DOM 属性
  const domProps = {};
  // 普通的 HTML attribute
  const attrs = {};
  const events = {
    on: {},
    nativeOn: {}
  };
  const componentChildrenOptions = [];
  // 因render 函数中没有与 v-model 相应的 api, 实现v-model逻辑。
  events.on.input = (val) => {
    model[key] = val;
    emit('input', key, val, model);
  };
  events.on.change = (val) => {
    emit('change', key, val, model);
  };
  if (property.enum || property.oneOf || property.anyOf) {
    if (property.oneOf && uiProperty[JSON_FORM_UI.UI_WIDGET] === 'radio') {
      componentTagName = 'el-radio-group';
    } else if (property.anyOf && uiProperty[JSON_FORM_UI.UI_WIDGET] === 'checkbox' && property.type === 'array') {
      componentTagName = 'el-checkbox-group';
    } else {
      componentTagName = 'el-select';
      props.multiple = false;
    }
    // 取得选择项一览
    let list = null;
    if (property.oneOf) {
      list = property.oneOf;
    } else if (property.anyOf) {
      list = property.anyOf;
      if (componentTagName === 'el-select') {
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
    if (componentTagName === 'el-select') {
      optionList.forEach(item => {
        componentChildrenOptions.push({
          label: item.label,
          value: item.value,
          disabled: item.disabled
        });
      });
    } else if (componentTagName === 'el-radio-group') {
      optionList.forEach(item => {
        componentChildrenOptions.push({
          label: item.label,
          value: item.value
        });
      });
    } else if (componentTagName === 'el-checkbox-group') {
      optionList.forEach(item => {
        componentChildrenOptions.push({
          label: item.label,
          value: item.value
        });
      });
    }
  } else if (property.format === 'date' ||
    property.format === 'date-time') {
    componentTagName = 'el-date-picker';
    if (property.type === 'string') {
      props.type = property.format.replace(/-/g, '');
    } else if (property.type === 'array') {
      props.type = `${property.format}-range`.replace(/-/g, '');
    }
    if (uiProperty[JSON_FORM_UI.UI_FORMAT] !== undefined && uiProperty[JSON_FORM_UI.UI_FORMAT] !== null) {
      props['value-format'] = uiProperty[JSON_FORM_UI.UI_FORMAT];
    } else if (property.format === 'date' || property.format === 'date-range') {
      props['value-format'] = DEFAULT_DATE_FORMAT;
    } else if (property.format === 'date-time' || property.format === 'date-time-range') {
      props['value-format'] = DEFAULT_DATE_TIME_FORMAT;
    }
  } else if (property.format === 'time') {
    componentTagName = 'el-time-picker';
    if (property.type === 'array') {
      props['is-range'] = true;
    }
    if (uiProperty[JSON_FORM_UI.UI_FORMAT] !== undefined && uiProperty[JSON_FORM_UI.UI_FORMAT] !== null) {
      props['value-format'] = uiProperty[JSON_FORM_UI.UI_FORMAT];
    } else if (property.format === 'time' || property.format === 'time-range') {
      props['value-format'] = DEFAULT_TIME_FORMAT;
    }
  } else if (property.type === 'string') {
    componentTagName = 'el-input';
    // 组件类型
    const widgetType = uiProperty[JSON_FORM_UI.UI_WIDGET];
    if (widgetType !== undefined) {
      if (widgetType === 'password') {
        props.type = 'password';
      } else if (widgetType === 'textarea') {
        props.type = 'textarea';
        const options = uiProperty[JSON_FORM_UI.UI_OPTIONS] || {};
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
      emit('input', key, ret, model);
    };
    const options = uiProperty[JSON_FORM_UI.UI_OPTIONS] || {};
    // 小数位
    const { format, precision, scale } = property;
    const scaleNum = _.toNumber(scale);
    if (typeof precision === 'number') {
      props.precision = precision;
    }
    // ui:options的precision属性为最优先
    const originPrecision = _.get(options, 'precision', '');
    if (originPrecision === '' && (_.isNumber(scaleNum) && !Number.isNaN(scaleNum))) {
      props.precision = scaleNum;
    }
    // 金额格式
    if (format === 'price') {
      const formatter = _.get(options, 'formatter');
      // 没有进行自定义组件formatter属性的场合
      if (typeof formatter !== 'function') {
        const config = {};
        // 已定义小数位的场合
        if (_.isNumber(props.precision)) {
          config.maximumFractionDigits = props.precision;
        }
        props.formatter = (val) => {
          const result = priceFormatter(val, config);
          return result;
        };
      }
      const parser = _.get(options, 'parser');
      // 没有进行自定义组件parser属性的场合
      if (typeof parser !== 'function') {
        props.parser = priceParser;
      }
    }
    componentTagName = 'el-input-number';
  } else if (property.type === 'boolean' && uiProperty[JSON_FORM_UI.UI_WIDGET] === undefined) {
    componentTagName = 'elCheckbox';
  }
  componentProps.props = props;
  componentProps.on = events.on;
  componentProps.nativeOn = events.nativeOn;
  if (Object.keys(domProps).length > 0) {
    componentProps.domProps = domProps;
  }
  // placeholder处理
  if (isEmpty(attrs.placeholder)) {
    let placeholder = uiProperty[JSON_FORM_UI.UI_PLACEHOLDER];
    if (isEmpty(placeholder)) {
      placeholder = `请输入${property.title}`;
    }
    attrs.placeholder = placeholder;
  }
  if (Object.keys(attrs).length > 0) {
    componentProps.attrs = attrs;
  }
  if (uiProperty[JSON_FORM_UI.UI_ON]) {
    const uiOn = uiProperty[JSON_FORM_UI.UI_ON];
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
  if (uiProperty[JSON_FORM_UI.UI_NATIVE_ON]) {
    const uiNativeOn = uiProperty[JSON_FORM_UI.UI_NATIVE_ON];
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
  const mergedProps = Object.assign({}, componentProps.props, uiProperty[JSON_FORM_UI.UI_OPTIONS] || {});
  componentProps.props = mergedProps;
  return {
    componentTagName,
    componentProps,
    componentChildrenOptions
  };
}

export default {
  createElementByProperty,
  createFormRulesBySchema
};
