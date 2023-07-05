import _ from 'lodash';
import { COLUMN_TYPE, JSON_UI_SCHEMA, ORIGIN_UI_OPTION } from 'setaria-ui/src/constants/index';
import {
  createElementByProperty,
  createFormatter,
  booleanFormatter,
  dateFormatter,
  dateTimeFormatter
} from 'setaria-ui/src/utils/schema';
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

function byteLength(str = '') {
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
    if (property) {
      const uiProperty = currentUiSchema[key] || {};
      const column = new VxeColumn();
      // 列字段名
      column.field = key;
      if (!_.isEmpty(uiProperty[JSON_UI_SCHEMA.UI_PARENT_COLUMN_ID])) {
        column.srParentField = uiProperty[JSON_UI_SCHEMA.UI_PARENT_COLUMN_ID];
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
      // if (property.type === 'number' || property.type === 'integer') {
      //   column.headerAlign = 'right';
      //   column.align = 'right';
      // }
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
          JSON_UI_SCHEMA.UI_OPTIONS,
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
          const formatter = createFormatter(property);
          if (formatter) {
            column.formatter = ({ cellValue }) => {
              return formatter(cellValue);
            };
          }
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
          s.data = s.row;
          s.status = 'default';
          const render = scopedSlots[key](s);
          return render;
        };
        const editSlot = (scope) => {
          const s = scope;
          s.data = s.row;
          s.status = 'edit';
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
      if (!_.isEmpty(uiProperty[JSON_UI_SCHEMA.UI_OPTIONS])) {
        Object.keys(uiProperty[JSON_UI_SCHEMA.UI_OPTIONS]).forEach((optionKey) => {
          if (_.has(column, optionKey)) {
            column[optionKey] = uiProperty[JSON_UI_SCHEMA.UI_OPTIONS][optionKey];
          }
        });
        if (typeof uiProperty[JSON_UI_SCHEMA.UI_OPTIONS].visible === 'boolean') {
          column[ORIGIN_UI_OPTION] = uiProperty[JSON_UI_SCHEMA.UI_OPTIONS];
        }
      }
      // 禁止手动更改列的显示/隐藏
      if (typeof uiProperty[JSON_UI_SCHEMA.UI_DISABLE_COLUMN_CONTROL] === 'boolean') {
        column.disableColumnControl = uiProperty[JSON_UI_SCHEMA.UI_DISABLE_COLUMN_CONTROL];
      }
      if (!uiProperty[JSON_UI_SCHEMA.UI_HIDDEN]) {
        ret.push(column);
      }
      if (uiProperty[JSON_UI_SCHEMA.UI_OPTIONS] && uiProperty[JSON_UI_SCHEMA.UI_OPTIONS].slots) {
        if (uiProperty[JSON_UI_SCHEMA.UI_OPTIONS].slots.filter) {
          column.slots.filter = uiProperty[JSON_UI_SCHEMA.UI_OPTIONS].slots.filter;
        }
      }
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
    events: {},
    nativeEvents: {}
  };
  if (typeof uiProperty[JSON_UI_SCHEMA.UI_DISABLED] === 'function') {
    props.disabledFunction = uiProperty[JSON_UI_SCHEMA.UI_DISABLED];
  } else if (typeof uiProperty[JSON_UI_SCHEMA.UI_DISABLED] === 'boolean') {
    props.disabled = uiProperty[JSON_UI_SCHEMA.UI_DISABLED];
  }
  const component = createElementByProperty(key, property, uiProperty, {}, () => { });
  props = Object.assign({}, props, component.componentProps.props);
  if (uiProperty[JSON_UI_SCHEMA.UI_ON]) {
    const uiOn = uiProperty[JSON_UI_SCHEMA.UI_ON];
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
  if (uiProperty[JSON_UI_SCHEMA.UI_NATIVE_ON]) {
    const uiNativeOn = uiProperty[JSON_UI_SCHEMA.UI_NATIVE_ON];
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
    options: component.componentChildrenOptions,
    autofocus: component.componentTagName
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

export default {
  convertSchemaToColumns,
  getEditRenderByProperty,
  calculateSchema
};
