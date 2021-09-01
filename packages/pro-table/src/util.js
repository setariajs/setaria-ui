import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { COLUMN_TYPE, JSON_FORM_UI } from 'setaria-ui/src/constants/index';
import { createElementByProperty } from 'setaria-ui/src/utils/schema';
import VxeColumn from './vxe-column';

// SLOT_EXPAND
const SLOT_NAME_EXPAND_CONTENT = 'content';
const SLOT_NAME_HEADER_PREFIX = 'header.';

/**
 * 根据字符串数组取得对应的schema对象
 * @param {Object} schema
 * @param {Array} arr
 * @returns
 */
export function getSchemaByKeyArray(schema, arr) {
  const ret = {};
  if (schema && schema.properties && arr.length > 0) {
    arr.forEach((key) => {
      if (typeof key === 'string') {
        const prop = schema.properties[key];
        if (prop === undefined) {
          console.log('当前使用的Schema为', schema);
          console.error(`Schema内不存在设定的 ${key} 的项目。`);
        }
        if (prop) {
          ret[key] = prop;
        }
      } else {
        ret[key.key] = key;
      }
    });
  }
  return {
    properties: {
      ...ret
    }
  };
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
  //   return function formatter({ cellValue }) {
  //     if (_.isEmpty(cellValue)) {
  //       return '';
  //     }
  //     return odataDateToString(cellValue);
  //   };
  // }
  if (type === 'boolean') {
    return function formatter({ cellValue }) {
      return cellValue ? '是' : '否';
    };
  }
  if (format === 'time') {
    return function formatter({ cellValue }) {
      if (_.isEmpty(cellValue)) {
        return '';
      }
      return cellValue;
    };
  }
  // 枚举值处理
  const dictList = oneOf || anyOf;
  if (!_.isEmpty(dictList)) {
    const getDisplayDictLabel = (val) => {
      const dict = _.find(dictList, (item) => item.const === val);
      return dict ? dict.title : val;
    };
    return function formatter({ cellValue }) {
      if (typeof cellValue === 'string') {
        return getDisplayDictLabel(cellValue);
      }
      if (Array.isArray(cellValue)) {
        const res = cellValue
          .map((cv) => {
            const displayDictLabel = getDisplayDictLabel(cv);
            return displayDictLabel;
          })
          .join(', ');
        return res;
      }
      return cellValue;
    };
  }
  if (format === 'price') {
    return function formatter({ cellValue }) {
      const config = {};
      let scaleNum = _.toNumber(scale);
      if (typeof scaleNum === 'number') {
        config.maximumFractionDigits = scaleNum;
      } else {
        scaleNum = 0;
      }
      const val = _.toNumber(cellValue);
      if (!_.isNumber) {
        return cellValue;
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
      return cellValue;
    };
  }
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

function dateFormatter({ cellValue }) {
  return formatDate(cellValue, 'YYYY-MM-DD');
}

function dateTimeFormatter({ cellValue }) {
  return formatDate(cellValue, 'YYYY-MM-DD HH:mm:ss');
}

function booleanFormatter({ cellValue }) {
  if (cellValue === null || cellValue === undefined) {
    return '';
  }
  if (cellValue === true || cellValue === 'true') {
    return '是';
  }
  return '否';
}

function byteLength(str) {
  let length = 0;
  Array.from(str).forEach((char) => {
    if (char.charCodeAt(0) > 255) {
      // 字符编码大于255，说明是双字节字符
      length += 2;
    } else {
      length += 1;
    }
  });

  return length;
}

export function convertSchemaToColumns(
  schema,
  uiSchema = {},
  scopedSlots,
  columnWidth,
  config = {}
) {
  const ret = [];
  const { properties } = schema;
  if (!properties) {
    return ret;
  }
  const currentUiSchema = uiSchema || {};
  Object.keys(properties).forEach((key) => {
    const property = properties[key];
    const uiProperty = currentUiSchema[key] || {};
    const column = new VxeColumn();
    // 列字段名
    column.field = key;
    if (!_.isEmpty(uiProperty[JSON_FORM_UI.UI_PARENT_COLUMN_ID])) {
      column.srParentField = uiProperty[JSON_FORM_UI.UI_PARENT_COLUMN_ID];
    }
    // 列提示
    if (!_.isEmpty(property.description)) {
      column.titleHelp = {
        message: property.description
      };
    }
    // INDEX序号列的场合
    if (property.type === COLUMN_TYPE.INDEX) {
      column.type = 'seq';
    }
    column.headerAlign = 'left';
    // 列标题
    column.title = property.title;
    if (property.type === 'number' || property.type === 'integer') {
      column.headerAlign = 'right';
      column.align = 'right';
    }
    // 列宽度
    let { width } = uiProperty;
    if (!_.isEmpty(width) && width.indexOf('px')) {
      width = width.replace('px', '');
      // 根据字符数量计算列的宽度 FIXME 列和标题字数较少时的处理
    } else if (columnWidth === 'auto') {
      let defaultMinWidth = byteLength(column.title) * 20;
      if (defaultMinWidth < 100) {
        defaultMinWidth = 100;
      }
      column.minWidth = `${defaultMinWidth}px`;
    } else if (!_.isEmpty(columnWidth)) {
      width = columnWidth;
    }
    if (width) {
      column.width = `${width}`;
    }
    // 序号列不进行排序
    if (column.field !== 'index') {
      // 排序
      let { sortable } = property;
      const uiSchemaOptionsSortable = _.get(uiProperty, [
        JSON_FORM_UI.UI_OPTIONS,
        'sortable'
      ]);
      // ui-schema内的属性最优先
      if (typeof uiSchemaOptionsSortable === 'boolean') {
        sortable = uiSchemaOptionsSortable;
        // 默认排序设置次优先
      } else if (config.defaultAllColumnSort) {
        sortable = true;
      }
      // metadata内的sortable优先级最低
      column.sortable = sortable;
    }
    // 格式化显示内容
    const { formatter } = uiProperty;
    if (property.type !== COLUMN_TYPE.INDEX) {
      if (typeof formatter === 'function') {
        // eslint-disable-next-line no-shadow
        column.formatter = ({ row, col, cellValue }) =>
          formatter(row, col, cellValue);
      } else if (formatter && typeof formatter === 'string') {
        if (formatter === 'date') {
          column.formatter = dateFormatter;
        } else if (formatter === 'datetime') {
          column.formatter = dateTimeFormatter;
        } else if (formatter === 'boolean') {
          column.formatter = booleanFormatter;
        }
      } else {
        // 设置默认formatter
        column.formatter = createFormatter(property);
      }
    }
    if (uiProperty.fixed) {
      column.fixed = uiProperty.fixed;
    }
    // 列插槽处理
    column.slots = {};
    if (scopedSlots[key]) {
      column.hasCustomSlot = true;
      const defaultSlot = (scope) => {
        const s = scope;
        s.rowStatus = 'default';
        const render = scopedSlots[key](s);
        return render;
      };
      const editSlot = (scope) => {
        const s = scope;
        s.rowStatus = 'edit';
        const render = scopedSlots[key](s);
        return render;
      };
      // 单元格内容渲染配置项
      column.slots = {
        default: defaultSlot,
        srScopedDefault: defaultSlot,
        // 默认设置编辑状态插槽
        // 默认插槽内容可通过formatter进行设置
        edit: editSlot,
        srScopedEdit: editSlot
      };
    }
    const headerSlotKey = `${SLOT_NAME_HEADER_PREFIX}${key}`;
    // 表格头部自定义插槽
    if (scopedSlots[headerSlotKey]) {
      const headerSlot = (scope) => {
        const s = scope;
        const render = scopedSlots[headerSlotKey](s);
        return render;
      };
      column.slots.header = headerSlot;
    }
    // 展开行
    if (
      scopedSlots[SLOT_NAME_EXPAND_CONTENT] &&
      config &&
      config.expand &&
      config.expand.labelField &&
      config.expand.labelField === key
    ) {
      column.slots.content = scopedSlots[SLOT_NAME_EXPAND_CONTENT];
    }
    if (!_.isEmpty(uiProperty[JSON_FORM_UI.UI_OPTIONS])) {
      Object.keys(uiProperty[JSON_FORM_UI.UI_OPTIONS]).forEach((optionKey) => {
        if (_.has(column, optionKey)) {
          column[optionKey] = uiProperty[JSON_FORM_UI.UI_OPTIONS][optionKey];
        }
      });
    }
    if (!uiProperty[JSON_FORM_UI.UI_HIDDEN]) {
      ret.push(column);
    }
  });
  return ret;
}

/**
 * 根据Property取得EditRender内容
 * @param {*} property
 * @param {*} uiProperty
 */
export function getEditRenderByProperty(key, property = {}, uiProperty = {}) {
  let props = {
    events: {}
  };
  if (typeof uiProperty[JSON_FORM_UI.UI_DISABLED] === 'function') {
    props.disabledFunction = uiProperty[JSON_FORM_UI.UI_DISABLED];
  } else if (typeof uiProperty[JSON_FORM_UI.UI_DISABLED] === 'boolean') {
    props.disabled = uiProperty[JSON_FORM_UI.UI_DISABLED];
  }
  const component = createElementByProperty(key, property, uiProperty, {}, () => {});
  props = Object.assign({}, props, component.componentProps.props);
  if (uiProperty[JSON_FORM_UI.UI_ON]) {
    const uiOn = uiProperty[JSON_FORM_UI.UI_ON];
    // 合并事件定义
    Object.keys(uiOn).forEach((uiOnKey) => {
      // 自定义事件已被注册的场合，把注册的事件和自定义的事件按顺序执行
      if (typeof props.events[uiOnKey] === 'function') {
        props.events[uiOnKey] = () => {
          props.events[uiOnKey]();
          uiOn[uiOnKey]();
        };
      } else {
        props.events[uiOnKey] = uiOn[uiOnKey];
      }
    });
  }
  if (uiProperty[JSON_FORM_UI.UI_NATIVE_ON]) {
    const uiNativeOn = uiProperty[JSON_FORM_UI.UI_NATIVE_ON];
    // 合并事件定义
    Object.keys(uiNativeOn).forEach((uiOnKey) => {
      // 自定义事件已被注册的场合，把注册的事件和自定义的事件按顺序执行
      if (typeof props.events[uiOnKey] === 'function') {
        props.nativeEvents[uiOnKey] = () => {
          props.nativeEvents[uiOnKey]();
          uiNativeOn[uiOnKey]();
        };
      } else {
        props.nativeEvents[uiOnKey] = uiNativeOn[uiOnKey];
      }
    });
  }
  return {
    name: component.componentTagName,
    attrs: component.componentProps.attrs,
    props,
    options: component.componentChildrenOptions
  };
}

/**
 * 根据 schemaArray 数组及 excludeSchemaArray 计算真实的schema
 * @param schema 完整的schema
 * @param schemaArray 需展示的字段列表（字符串或对象列表） (对应的formSchema、tableSchema属性)
 * @param excludeSchemaArray 不需展示的字段列表（字符串列表）
 *
 * @return {*} 最终的 JSON Schema
 */
export function calculateSchema(schema, schemaArray, excludeSchemaArray) {
  if (!schema || !schema.properties) {
    return { properties: {} };
  }
  // if (schemaArray && _.isArray(schemaArray) && schemaArray.length > 0) {
  if (schemaArray && _.isArray(schemaArray)) {
    return {
      ...schema,
      properties: getSchemaByKeyArray(schema, schemaArray).properties
    };
  }

  const remainKeys = Object.keys(schema.properties);
  if (
    excludeSchemaArray &&
    _.isArray(excludeSchemaArray) &&
    excludeSchemaArray.length > 0
  ) {
    _.remove(remainKeys, (key) => excludeSchemaArray.indexOf(key) >= 0);
  }
  return {
    ...schema,
    properties: getSchemaByKeyArray(schema, remainKeys).properties
  };
}

function getItemDefaultValue(schemaItem = {}) {
  const val = schemaItem.nullable;
  if (val === undefined || val === true) {
    return null;
  }
  return '';
}

/**
 * 根据schema定义生成指定初始化对象
 * @param {Object} schema
 * @returns
 */
export function getSchemaDefaultObject(schema = {}) {
  const ret = {};
  Object.keys(schema.properties).forEach((key) => {
    ret[key] = getItemDefaultValue(schema.properties[key]);
  });
  return ret;
}

/**
 * 根据formSchema生成初始化对象
 * @param formSchema 对象或数组
 * @param schema 完整schema对象
 * @returns {{}}
 */
export function getSchemaDefaultObjectByFormSchema(formSchema, schema) {
  let ret = {};
  if (formSchema) {
    if (_.isPlainObject(formSchema)) {
      ret = getSchemaDefaultObject(formSchema);
    } else if (_.isArray(formSchema)) {
      if (schema) {
        formSchema.forEach((key) => {
          ret[key] = getItemDefaultValue(schema.properties[key]);
        });
      } else {
        formSchema.forEach((key) => {
          ret[key] = '';
        });
      }
    }
  }
  return ret;
}

// /**
//  * 解析excel文件
//  * @return 数据数组
//  */
// export function parseExcelByFile(file, sheetNameArray, ignoreHeaderRow = true) {
//   return new window.Promise((resolve, reject) => {
//     const fileReader = new FileReader();
//     fileReader.onload = (ev) => {
//       const ret = [];
//       try {
//         const data = ev.target.result;
//         const workbook = xlsx.read(data, { type: 'binary' });
//         console.log(workbook);
//         const { Sheets } = workbook;
//         sheetNameArray.forEach((sheetName) => {
//           const targetSheet = Sheets[sheetName];
//           const FS = '^%_&_&';
//           const RS = '__(_&)';
//           const csvData = xlsx.utils.sheet_to_csv(targetSheet, {
//             FS,
//             RS,
//           });
//           const tableData = [];
//           // 解析数据
//           csvData.split(RS).forEach((vRow, index) => {
//             if (!(ignoreHeaderRow && index === 0)) {
//               if (vRow) {
//                 tableData.push(vRow.split(FS));
//               }
//             }
//           });
//           ret.push(tableData);
//         });
//         console.log(ret);
//         resolve(ret);
//       } catch (err) {
//         reject(err);
//       }
//     };
//     fileReader.readAsBinaryString(file);
//   });
// }

// /**
//  * 将sap odata date转换为格林威治时间数值
//  */
// export function odataDate2TimeNumber(val) {
//   if (_.isEmpty(val)) {
//     return 0;
//   }
//   const date = odataDateToString(val);
//   return new Date(date).getTime();
// }

export default {
  convertSchemaToColumns,
  getEditRenderByProperty,
  calculateSchema
  // odataDate2TimeNumber
};
