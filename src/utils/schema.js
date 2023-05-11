import _ from 'lodash';
import numeral from 'numeral';
import moment from 'moment';
import { JSON_UI_SCHEMA } from 'setaria-ui/src/constants/index';
import { isEmpty } from 'setaria-ui/src/utils/util';
import { t } from 'setaria-ui/src/locale';

export function initialSetariaSchema(schema) {
  let ret = _.cloneDeep(schema);
  if (isEmpty(schema)) {
    return schema;
  }
  const { properties } = ret;
  if (isEmpty(properties)) {
    return schema;
  }
  Object.keys(properties).forEach((key) => {
    const property = properties[key];
    if (property) {
      // 转换字典项目的值类型为property定义的类型
      const { type, oneOf, anyOf } = property;
      let enumArray = oneOf;
      if (isEmpty(oneOf)) {
        enumArray = anyOf;
      }
      if (!isEmpty(enumArray)) {
        enumArray.forEach((item) => {
          if (typeof item.const !== type) {
            if (type === 'number' || type === 'integer') {
              try {
                const func = type === 'number' ? _.toNumber : _.toInteger;
                const val = func(item.const);
                if (!_.isNaN(val)) {
                  item.const = val;
                }
              } catch (err) {
                throw err;
              }
            } else if (type === 'string') {
              item.const = `${item.const}`;
            }
          }
        });
      }
    } else {
      console.warn(`属性[${key}]，未在schema中定义，请先定义属性。`);
    }
  });
  return ret;
}

/**
 * 根据Schema取得Property
 * @param {*} schema
 * @param {*} uiSchema
 * @returns
 */
export function createFormRulesBySchema(schema, uiSchema, requiredTriggerType = 'blur') {
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
        message: getComponentPlaceholder(item, itemName),
        trigger: requiredTriggerType
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
    const customRules = uiSchemaItemObj && uiSchemaItemObj[JSON_UI_SCHEMA.UI_RULE];
    // 自定义rule
    if (customRules) {
      const originRule = ret[key];
      ret[key] = originRule.concat(customRules);
    // 根据schema生成的rule
    } else {
      if (!isEmpty(item.pattern)) {
        const rule = {
          pattern: item.pattern,
          message: t('el.schema.validate1', [item.pattern])
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
          rule.message = t('el.schema.validate2', [minLength]);
        }
        if (typeof maxLength === 'number') {
          rule.max = maxLength;
          if (typeof minLength === 'number') {
            rule.message = t('el.schema.validate3', [minLength, maxLength]);
          } else {
            rule.message = t('el.schema.validate4', [maxLength]);
          }
        }
        if (rule.message !== '' && rule.message !== undefined) {
          if (!ret[key]) {
            ret[key] = [];
          }
          ret[key].push(rule);
        }
      } else if (item.type === 'integer' || item.type === 'number') {
        let message = t('el.schema.validate5', [itemName]);
        if (item.type === 'integer') {
          message = t('el.schema.validate6', [itemName]);
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
          numberRule.message = t('el.schema.validate7', [minimum, item.type === 'integer' ? t('el.schema.int') : t('el.schema.number')]);
        }
        if (typeof maximum === 'number') {
          numberRule.max = maximum;
          if (typeof minimum === 'number') {
            numberRule.message = t('el.schema.validate8', [minimum, maximum, item.type === 'integer' ? t('el.schema.int') : t('el.schema.number')]);
          } else {
            numberRule.message = t('el.schema.validate9', [maximum, item.type === 'integer' ? t('el.schema.int') : t('el.schema.number')]);
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
 * 讲数字转换为字符串金额格式
 * @param {string | number} val
 */
export function priceFormatter(val, config) {
  if (val === null) {
    return val;
  }
  const current = `${val}`;
  if (_.isEmpty(current)) {
    return val;
  }
  const format = (v) => {
    const ret = v.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return ret;
  };
  // 对整数进行格式化
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
  // if (isEmpty(property.title)) {
  //   return componentProps;
  // }
  let componentTagName = '';
  const props = {
    value: model[key]
  };
  if (typeof uiProperty[JSON_UI_SCHEMA.UI_DISABLED] === 'boolean') {
    props.disabled = uiProperty[JSON_UI_SCHEMA.UI_DISABLED];
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
  if (property.editable === false) {
    componentTagName = 'div';
    const formater = createFormatter(property);
    domProps.innerHTML = formater ? formater(props.value) : props.value;
  } else {
    // 因render 函数中没有与 v-model 相应的 api, 实现v-model逻辑。
    events.on.input = (val) => {
      model[key] = val;
      emit('input', key, val, model);
    };
    events.on.change = (val) => {
      emit('change', key, val, model);
    };
    if (property.enum || property.oneOf || property.anyOf) {
      if (property.oneOf && uiProperty[JSON_UI_SCHEMA.UI_WIDGET] === 'radio') {
        componentTagName = 'el-radio-group';
      } else if (property.anyOf && uiProperty[JSON_UI_SCHEMA.UI_WIDGET] === 'checkbox' && property.type === 'array') {
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
      if (uiProperty[JSON_UI_SCHEMA.UI_FORMAT] !== undefined && uiProperty[JSON_UI_SCHEMA.UI_FORMAT] !== null) {
        props['value-format'] = uiProperty[JSON_UI_SCHEMA.UI_FORMAT];
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
      if (uiProperty[JSON_UI_SCHEMA.UI_FORMAT] !== undefined && uiProperty[JSON_UI_SCHEMA.UI_FORMAT] !== null) {
        props['value-format'] = uiProperty[JSON_UI_SCHEMA.UI_FORMAT];
      } else if (property.format === 'time' || property.format === 'time-range') {
        props['value-format'] = DEFAULT_TIME_FORMAT;
      }
    } else if (property.type === 'string') {
      componentTagName = 'el-input';
      // 组件类型
      const widgetType = uiProperty[JSON_UI_SCHEMA.UI_WIDGET];
      if (widgetType !== undefined) {
        if (widgetType === 'password') {
          props.type = 'password';
        } else if (widgetType === 'textarea') {
          props.type = 'textarea';
          const options = uiProperty[JSON_UI_SCHEMA.UI_OPTIONS] || {};
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
      const options = uiProperty[JSON_UI_SCHEMA.UI_OPTIONS] || {};
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
    } else if (property.type === 'boolean' && uiProperty[JSON_UI_SCHEMA.UI_WIDGET] === undefined) {
      componentTagName = 'el-checkbox';
    }
  }
  componentProps.props = props;
  componentProps.on = events.on;
  componentProps.nativeOn = events.nativeOn;
  if (Object.keys(domProps).length > 0) {
    componentProps.domProps = domProps;
  }
  // placeholder处理
  if (isEmpty(attrs.placeholder)) {
    let placeholder = uiProperty[JSON_UI_SCHEMA.UI_PLACEHOLDER];
    if (isEmpty(placeholder) && !props.disabled) {
      placeholder = getComponentPlaceholder(property, property.title);
    }
    attrs.placeholder = placeholder;
  }
  if (Object.keys(attrs).length > 0) {
    componentProps.attrs = attrs;
  }
  if (uiProperty[JSON_UI_SCHEMA.UI_ON]) {
    const uiOn = uiProperty[JSON_UI_SCHEMA.UI_ON];
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
  if (uiProperty[JSON_UI_SCHEMA.UI_NATIVE_ON]) {
    const uiNativeOn = uiProperty[JSON_UI_SCHEMA.UI_NATIVE_ON];
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
  const mergedProps = Object.assign({}, componentProps.props, uiProperty[JSON_UI_SCHEMA.UI_OPTIONS] || {});
  componentProps.props = mergedProps;
  return {
    componentTagName,
    componentProps,
    componentChildrenOptions
  };
}

/**
 * 设置默认formatter
 */
export function createFormatter(property) {
  const {
    format,
    oneOf,
    anyOf,
    type,
    // precision,
    // 小数位
    scale
  } = property;
  // 日期转换
  // if (format === 'date') {
  //   return function formatter(value) {
  //     if (_.isEmpty(value)) {
  //       return '';
  //     }
  //     return odataDateToString(value);
  //   };
  // }
  if (type === 'boolean') {
    return function formatter(value) {
      return value ? t('el.schema.yes') : t('el.schema.no');
    };
  }
  if (format === 'time') {
    return function formatter(value) {
      if (_.isEmpty(value)) {
        return '';
      }
      return value;
    };
  }
  // 枚举值处理
  const dictList = oneOf || anyOf;
  if (!_.isEmpty(dictList)) {
    const getDisplayDictLabel = (val) => {
      const dict = _.find(dictList, (item) => item.const === val);
      return dict ? dict.title : val;
    };
    return function formatter(value) {
      if (Array.isArray(value)) {
        const res = value
          .map((cv) => {
            const displayDictLabel = getDisplayDictLabel(cv);
            return displayDictLabel;
          })
          .join(', ');
        return res;
      } else if (typeof value === 'number' || typeof value === 'string') {
        return getDisplayDictLabel(value);
      }
      return value;
    };
  }
  if (format === 'price') {
    return function formatter(value) {
      // 对于null值，不显示任何值
      if (value === null || value === undefined) {
        return value;
      }
      const config = {};
      let scaleNum = _.toNumber(scale);
      if (typeof scaleNum === 'number' && !isNaN(scaleNum)) {
        config.maximumFractionDigits = scaleNum;
      } else {
        scaleNum = 0;
      }
      const val = _.toNumber(value);
      if (!_.isNumber(val) || isNaN(val)) {
        return value;
      }
      const displayVal = priceFormatter(val, config);
      if (scaleNum === 0) {
        return displayVal;
      }
      // 因numeral在输入框内格式化值存在问题，且inputnumber组件会默认对小数位进行处理
      // 所以此处只处理只读状态下label的显示值
      if (
        (_.isNumber(displayVal) && !_.isNaN(displayVal)) ||
        (!_.isEmpty(displayVal) && displayVal !== 'NaN')
      ) {
        let digitVal = numeral(displayVal).value();
        digitVal = `${digitVal.toFixed(scaleNum)}`;
        return `${displayVal.split('.')[0]}.${digitVal.split('.')[1]}`;
      }
      return value;
    };
  }
  // if (format === 'regex' && !isEmpty(pattern)) {
  //   return function formatter(value) {
  //   };
  // }
  return null;
}

function formatDate(odataDate, format) {
  if (!odataDate) {
    return '';
  }
  const temp = odataDate.match(/^\/Date\((.*)\)\/$/);
  if (!temp || !temp[1]) {
    return odataDate;
  }
  const timestamp = temp[1];
  if (!timestamp) {
    return '';
  }
  return moment(_.toNumber(timestamp)).format(format);
}

export function dateFormatter({ cellValue }) {
  return formatDate(cellValue, 'YYYY-MM-DD');
}

export function dateTimeFormatter({ cellValue }) {
  return formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss');
}

export function booleanFormatter({ cellValue }) {
  if (cellValue === null || cellValue === undefined) {
    return '';
  }
  if (cellValue === true || cellValue === 'true') {
    return '是';
  }
  return '否';
}

/**
 * 取得指定Property的初始值
 * @param {Object} property
 * @returns
 */
function getItemDefaultValue() {
  return null;
}

/**
 * 根据schema定义生成对应的初始化对象
 * @param {Object} schema
 * @returns
 */
export function createDefaultObjectBySchema(schema = {}) {
  const ret = {};
  Object.keys(schema.properties).forEach((key) => {
    ret[key] = getItemDefaultValue(schema.properties[key]);
  });
  return ret;
}

/**
 * 不同组件渲染时的提示信息
 * @param {Object} property
 * @returns
 */
export function getComponentPlaceholder(property, title) {
  if (property.enum ||
    property.oneOf ||
    property.anyOf ||
    property.format === 'date' ||
    property.format === 'date-time' ||
    property.format === 'time' ||
    property.format === 'date-range' ||
    property.format === 'date-time-range' ||
    property.format === 'time-range' ||
    property.type === 'boolean' ||
    property.requiredTip === 'select') {
    return t('el.schema.placeholderBySelect', [title]);
  }
  return t('el.schema.placeholder', [title]);

}

export default {
  createElementByProperty,
  createFormRulesBySchema,
  createDefaultObjectBySchema,
  getComponentPlaceholder
};
