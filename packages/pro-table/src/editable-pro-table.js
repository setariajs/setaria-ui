import _ from 'lodash';
import Vue from 'vue';
import XEUtils from 'xe-utils';
import { EDIT_TYPE, JSON_FORM_UI } from 'setaria-ui/src/constants/index';
import { callbackExec } from 'setaria-ui/src/utils/util';
import tableMixin from './table-mixin';
import { COMMON_TABLE_PROPS, EDIT_TABLE_PROPS } from './table-props';
import { getEditRenderByProperty, getSchemaDefaultObjectByFormSchema } from './util';

// 可编辑列在三列以上的场合，弹窗编辑
const MAX_ROW_EDIT = 3;
const PRIMARY_ROW_KEY = '_XID';

const BEFORE_CLOSE_PROP_KEY = 'before-close';

export default Vue.extend({
  name: 'ElEditableProTable',
  mixins: [tableMixin],
  props: {
    ...COMMON_TABLE_PROPS,
    ...EDIT_TABLE_PROPS
  },
  data() {
    return {
      isShowForm: false,
      selectRow: null,
      isShowTable: true,
      /* 树形列表绑定到vxe-table的数据 */
      innerTreeDataList: [],
      isSaveLoading: false,
      controlStatus: null
    };
  },
  computed: {
    innerCanDelete() {
      return this.canDelete && this.innerSelection.length >= 1;
    },
    innerCanAddTree() {
      return this.canAdd;
    },
    innerCanAddChild() {
      const { innerSelection } = this;
      return this.canAdd && this.canAddChild && innerSelection.length === 1;
    },
    innerEditConfig() {
      const { editConfig } = this;
      const defaultConfig = {
        trigger: 'manual',
        mode: 'row',
        showIcon: false,
        autoClear: false,
        showAsterisk: false
      };
      if (this.isEditOnRow === true) {
        // 是否显示必填字段的红色星号
        defaultConfig.showAsterisk = true;
        // 是否显示列头编辑图标
        defaultConfig.showIcon = true;
      }
      return _.assign({}, defaultConfig, editConfig);
    },
    innerDefaultEntity() {
      if (this.defaultEntity) {
        return this.defaultEntity;
      }
      return getSchemaDefaultObjectByFormSchema(this.innerSchema);
    },
    innerRowKey() {
      return this.rowKey ? this.rowKey : PRIMARY_ROW_KEY;
    },
    innerDataList() {
      const {
        data,
        changeModeField,
        autoPagination,
        innerCurrentPage,
        innerPageSize,
        total,
        innerSortList,
        isSortAllData,
        sortData,
        showPagination
      } = this;
      if (_.isEmpty(data)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.innerTotal = 0;
        return [];
      }
      let tempList = data.filter(
        (item) => item[changeModeField] !== EDIT_TYPE.DELETE
      );
      tempList.map((item) => {
        const temp = item;
        if (temp && temp.children) {
          delete temp.children;
        }
        if (!temp[changeModeField]) {
          temp[changeModeField] = '';
        }
        return temp;
      });
      // if (tableListTransform) {
      //   tempList = tableListTransform(tempList);
      // }
      // 前端排序逻辑
      if (isSortAllData && !_.isEmpty(innerSortList)) {
        tempList = sortData(tempList, innerSortList);
      }
      // 前端分页逻辑
      if (showPagination && autoPagination && !_.isEmpty(data)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.innerTotal = tempList.length;
        if (tempList && tempList.length && tempList.length > 0) {
          let fromIndex = (innerCurrentPage - 1) * innerPageSize;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
          let toIndex = innerCurrentPage * innerPageSize;
          if (toIndex > total) {
            toIndex = total + 1;
          }
          // 返回新的数组对象
          return tempList.slice(fromIndex, toIndex);
        }
      } else if (_.isEmpty(data)) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.innerTotal = 0;
      }
      return tempList;
    },
    innerRefField() {
      const { isTree, innerRowKey, refField } = this;
      if (!isTree) {
        return innerRowKey;
      }
      return refField || innerRowKey;
    },
    editableColumnCount() {
      const { innerSchema, vxeColumns } = this;
      let editableColumnCount = 0;
      vxeColumns.forEach((column) => {
        const { field } = column;
        const { editable } = innerSchema.properties[field];
        if (editable !== false) {
          editableColumnCount += 1;
        }
      });
      return editableColumnCount;
    },
    isEditOnRow() {
      if (this.forceEditOnRow) {
        return this.forceEditOnRow;
      }
      return this.editableColumnCount <= MAX_ROW_EDIT;
    },
    isEditingOnRow() {
      return !this.labelMode && this.isEditOnRow && this.isRowManualEditing;
    },
    innerTableColumns() {
      const {
        innerUiSchema,
        isEditOnRow,
        forceEditOnRow,
        labelMode,
        innerSchema,
        vxeColumns
      } = this;
      const resultColumns = [];
      const columns = vxeColumns;
      // 取得组件属性
      const getComponentProps = (render, row) => {
        const { props } = render;
        const componentProps = { ...props };
        const { disabledFunction } = componentProps;
        if (typeof disabledFunction === 'function') {
          componentProps.disabled = disabledFunction(row);
        }
        return componentProps;
      };
      const getComponentAttrs = (render) => {
        const ret = {};
        const { attrs } = render;
        const validAttrArray = ['maxlength'];
        validAttrArray.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(attrs, key)) {
            ret[key] = attrs[key];
          }
        });
        return ret;
      };
      columns.forEach((column) => {
        const { field } = column;
        const targetColumn = column;
        const { editable, type } = innerSchema.properties[field];
        let customRender = null;
        if (editable !== false) {
          customRender = getEditRenderByProperty(
            field,
            innerSchema.properties[field],
            innerUiSchema[field]
          );
        }
        let slot = null;
        // vxe-table不支持Element UI的radio和checkbox渲染
        if (
          customRender &&
          (customRender.name === 'el-radio' ||
            customRender.name === 'el-checkbox')
        ) {
          slot = (columnVal) => {
            const { row } = columnVal;
            let render = null;
            const inputEvent = (val) => {
              const currentRow = row;
              currentRow[field] = val;
            };
            const changeEvent = (val) => {
              this.emitDataChange(field, val, row);
            };
            const componentProps = getComponentProps(customRender, row);
            const componentAttrs = getComponentAttrs(customRender);
            componentProps.value = row[field];
            if (customRender.name === 'el-radio') {
              render = (
                <el-radio-group
                  on-input={inputEvent}
                  on-change={changeEvent}
                  {...{
                    attrs: componentAttrs,
                    props: componentProps
                  }}
                >
                  {customRender.options.map((op) => {
                    const jsx = (
                      <el-radio label={op.value}>{op.label}</el-radio>
                    );
                    return jsx;
                  })}
                </el-radio-group>
              );
            } else if (customRender.name.indexOf('el-checkbox') === 0) {
              if (type === 'boolean') {
                render = (
                  <el-checkbox
                    on-input={inputEvent}
                    on-change={changeEvent}
                    {...{
                      attrs: componentAttrs,
                      props: componentProps
                    }}
                  />
                );
              } else {
                render = (
                  <el-checkbox-group
                    on-input={inputEvent}
                    on-change={changeEvent}
                    {...{
                      attrs: componentAttrs,
                      props: componentProps
                    }}
                  >
                    {customRender.options.map((op) => {
                      const jsx = (
                        <el-checkbox label={op.value}>{op.label}</el-checkbox>
                      );
                      return jsx;
                    })}
                  </el-checkbox-group>
                );
              }
            }
            return [render];
          };
        }
        // 使在单元格内直接输入的场合，表头显示必须输入标识
        if (
          !labelMode &&
          customRender &&
          (customRender.name === 'el-select' ||
            customRender.name === 'el-date-picker' ||
            customRender.name === 'el-time-picker' ||
            customRender.name === 'el-input' ||
            customRender.name === 'el-input-number')
        ) {
          slot = ({ row }) => {
            let render = null;
            const inputEvent = (val) => {
              const currentRow = row;
              currentRow[field] = val;
            };
            const changeEvent = (val) => {
              this.emitDataChange(field, val, row);
            };
            const componentProps = getComponentProps(customRender, row);
            const componentAttrs = getComponentAttrs(customRender);
            componentProps.value = row[field];
            if (customRender.name === 'el-select') {
              render = (
                <el-select
                  on-input={inputEvent}
                  on-change={changeEvent}
                  {...{
                    attrs: componentAttrs,
                    props: componentProps
                  }}
                >
                  {customRender.options.map((op) => {
                    const jsx = <el-option value={op.value} label={op.label} />;
                    return jsx;
                  })}
                </el-select>
              );
            } else if (customRender.name === 'el-date-picker') {
              render = (
                <el-date-picker
                  on-input={inputEvent}
                  on-change={changeEvent}
                  {...{
                    attrs: componentAttrs,
                    props: componentProps
                  }}
                />
              );
            } else if (customRender.name === 'el-time-picker') {
              render = (
                <el-time-picker
                  on-input={inputEvent}
                  on-change={changeEvent}
                  {...{
                    attrs: componentAttrs,
                    props: componentProps
                  }}
                />
              );
            } else if (customRender.name === 'el-input') {
              render = (
                <el-input
                  on-input={inputEvent}
                  on-change={changeEvent}
                  {...{
                    attrs: componentAttrs,
                    props: componentProps
                  }}
                />
              );
            } else if (customRender.name === 'el-input-number') {
              render = (
                <el-input-number
                  on-input={inputEvent}
                  on-change={changeEvent}
                  {...{
                    attrs: componentAttrs,
                    props: componentProps
                  }}
                />
              );
            }
            return [render];
          };
        }
        if (slot) {
          const vxeColumnSlots = {
            edit: slot
          };
          if (forceEditOnRow) {
            vxeColumnSlots.default = slot;
          } else {
            // if (vxeColumnSlots.default) {
            //   delete vxeColumnSlots.default;
            // }
            // if (targetColumn.slots.default) {
            //   delete targetColumn.slots.default;
            // }
          }
          targetColumn.slots = _.assign({}, vxeColumnSlots, targetColumn.slots);
          // if (!isEditingOnRow) {
          //   delete targetColumn.slots.default;
          // }
        }
        if (targetColumn.slots) {
          if (labelMode) {
            if (targetColumn.slots.edit) {
              delete targetColumn.slots.edit;
            }
            if (isEditOnRow && targetColumn.slots.default) {
              if (!targetColumn.hasCustomSlot) {
                delete targetColumn.slots.default;
              }
            }
          } else {
            if (targetColumn.slots.srScopedDefault) {
              targetColumn.slots.default = targetColumn.slots.srScopedDefault;
            }
            if (targetColumn.slots.srScopedEdit) {
              targetColumn.slots.edit = targetColumn.slots.srScopedEdit;
            }
          }
        }
        if (customRender) {
          if (labelMode) {
            targetColumn.editRender = null;
          } else {
            targetColumn.editRender = customRender;
          }
        } else if (labelMode && targetColumn.editRender) {
          targetColumn.editRender = null;
        }
        resultColumns.push(targetColumn);
      });
      return resultColumns;
    },
    innerRules() {
      const ret = {};
      const { rules = {}, innerSchema = {}, uiSchema = {} } = this;
      const { required = [], properties = {} } = innerSchema;

      Object.keys(rules).forEach((key) => {
        ret[key] = [...rules[key]];
      });
      if (!_.isEmpty(required)) {
        required.forEach((key) => {
          const property = properties[key] || {};
          const requireRule = {
            required: true,
            message: `请输入${property.title}`,
            trigger: 'blur'
          };
          if (Array.isArray(rules[key])) {
            ret[key] = [].concat(rules[key]);
          } else {
            ret[key] = [];
          }
          ret[key].push(requireRule);
        });
      }
      // 自定义规则
      Object.keys(uiSchema || {}).forEach((key) => {
        const uiProperty = uiSchema[key];
        let uiRules = _.get(uiProperty, JSON_FORM_UI.UI_RULES);
        if (_.isEmpty(ret[key])) {
          ret[key] = [];
        }
        if (!_.isEmpty(uiRules)) {
          uiRules = _.cloneDeep(uiRules);
          uiRules.forEach((rule) => {
            const { validator } = rule;
            if (validator) {
              const transformRule = rule;
              transformRule.validator = (val = {}) => {
                const promise = new window.Promise((resolve, reject) => {
                  validator(
                    val.rule,
                    val.cellValue,
                    (callbackFuncVal) => {
                      if (callbackFuncVal instanceof Error) {
                        reject(callbackFuncVal);
                        return;
                      }
                      resolve(callbackFuncVal);
                    },
                    val.row
                  );
                });
                return promise;
              };
            }
          });
          ret[key] = ret[key].concat(uiRules);
        }
      });
      return ret;
    },
    beforeCloseFunction() {
      const { currentFormData, dialogAttrs = {} } = this;
      const defaultBeforeClose = (customFunc) => {
        return (cbFunc) => {
          this.$confirm('是否保存对数据的更改?', '提示', {
            type: 'warning'
          }).then(() => {
            callbackExec(customFunc, currentFormData)
              .then(() => {
                cbFunc();
              }).catch(() => {
              });
          }).catch(() => {});
        };
      };
      return defaultBeforeClose(dialogAttrs.beforeClose || dialogAttrs[BEFORE_CLOSE_PROP_KEY]);
    },
    innerDialogProps() {
      const { beforeCloseFunction, dialogAttrs = {} } = this;
      const defaultDialogProps = {
        title: '编辑',
        'close-on-click-modal': false
      };
      const ret = _.assign({}, defaultDialogProps, dialogAttrs);
      delete ret[BEFORE_CLOSE_PROP_KEY];
      ret.beforeClose = (cb) => {
        beforeCloseFunction(cb);
      };
      return ret;
    },
    xTableRef() {
      return this.$refs.xTable;
    }
  },
  watch: {
    innerDataList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.isTree) {
          this.innerTreeDataList = val;
        }
      }
    },
    isShowForm(val) {
      // dialog的open在第一次打开窗口时不触发，所以在此处监听dialog显示状态，触发对话框打开逻辑
      if (val) {
        this.handleFormDialogOpen();
      }
    },
    labelMode(val) {
      // 只读场合
      if (val) {
        // 重置行内编辑编辑状态
        this.cancelRowEdit();
      }
    }
  },
  methods: {
    /**
     * 切换所有行的选中状态
     * @public
     */
    toggleAllSelection(val) {
      if (this.xTableRef) {
        this.xTableRef.setAllCheckboxRow(val);
      }
    },
    syncTableDataList(val) {
      this.$emit('update:data', val);
    },
    readFile() {
      // const { afterImport, importSheetName, vxeTableColumnArray } = this;
      // this.xTableRef
      //   .readFile({
      //     types: ['xls', 'xlsx']
      //   })
      //   .then((params) => {
      //     parseExcelByFile(params.file, [importSheetName], false).then(
      //       (parsedData) => {
      //         let ret = [];
      //         if (!_.isEmpty(parsedData)) {
      //           const excelData = parsedData[0];
      //           // 根据table column取得excel中每列的field id
      //           const [titleArr] = excelData.splice(0, 1);
      //           const columnFieldArr = [];
      //           titleArr.forEach((title) => {
      //             const col = _.find(
      //               vxeTableColumnArray,
      //               (tableColumnDef) => tableColumnDef.title === title
      //             );
      //             if (col) {
      //               columnFieldArr.push(col.field);
      //             } else {
      //               columnFieldArr.push(title);
      //             }
      //           });
      //           excelData.forEach((rowData) => {
      //             const item = {};
      //             rowData.forEach((colData, index) => {
      //               const field = columnFieldArr[index];
      //               item[field] = colData;
      //             });
      //             ret.push(item);
      //           });
      //         }
      //         // 处理数据自定义后处理
      //         if (typeof afterImport === 'function') {
      //           const promise = afterImport(ret, params);
      //           if (promise.then) {
      //             promise.then((res) => {
      //               ret = res;
      //               this.syncTableDataList(ret);
      //             });
      //           } else {
      //             ret = promise;
      //             this.syncTableDataList(ret);
      //           }
      //         } else {
      //           this.syncTableDataList(ret);
      //         }
      //       }
      //     );
      //   });
    },
    hideTable(isHide) {
      this.isShowTable = !isHide;
    },
    refreshData() {
      this.xTableRef.updateData();
    },
    removeComponentInnerProps(item) {
      const { changeModeField } = this;
      const ret = {
        ...item
      };
      delete ret[changeModeField];
      return ret;
    },
    /** 获取修改的记录 */
    getUpdateRecords() {
      const { changeModeField } = this;
      return this.data
        .filter((item) => item[changeModeField] === EDIT_TYPE.MODIFY)
        .map((item) => this.removeComponentInnerProps(item));
    },
    /** 获取新增的记录 */
    getInsertRecords() {
      const { changeModeField } = this;
      return this.data
        .filter((item) => item[changeModeField] === EDIT_TYPE.ADD)
        .map((item) => this.removeComponentInnerProps(item));
    },
    /** 获取删除的记录 */
    getDeleteRecords() {
      const { changeModeField, parentField, treeConfig, virtualTree } = this;
      if (virtualTree) {
        const removeList = this.getTableActionRef().getRemoveRecords();
        // !FIXME XEUtil存在bug，filterTree执行后会展开所有节点
        if (!_.isEmpty(parentField)) {
          const filterTreeArray = XEUtils.filterTree(
            removeList,
            (item) => item[changeModeField] !== EDIT_TYPE.ADD,
            {
              children: _.get(treeConfig, 'children', 'children')
            }
          );
          filterTreeArray.forEach((item) => {
            const arrayItem = item;
            arrayItem[changeModeField] = EDIT_TYPE.DELETE;
          });
          const ret = XEUtils.toArrayTree(filterTreeArray, {
            parentKey: parentField
          });
          return ret;
        }
      }
      return this.data
        .filter((item) => item[changeModeField] === EDIT_TYPE.DELETE)
        .map((item) => this.removeComponentInnerProps(item));
    },
    /**
     * 获取有变更的所有记录（含新增、删除、修改）
     * @public
     * @returns { insert: [], update: [], delete: [] }
     */
    getChangedRecords() {
      return {
        insert: this.getInsertRecords(),
        update: this.getUpdateRecords(),
        delete: this.getDeleteRecords()
      };
    },
    getCheckboxRecords() {
      const { isReserve, selectionType } = this;
      if (selectionType !== 'checkbox') {
        return [];
      }
      if (isReserve) {
        return [
          ...this.xTableRef.getCheckboxRecords(),
          ...this.xTableRef.getCheckboxReserveRecords()
        ];
      }
      return this.xTableRef.getCheckboxRecords();
    },
    clearCheckboxRow() {
      const { isReserve, selectionType } = this;
      if (selectionType !== 'checkbox') {
        return;
      }
      if (isReserve) {
        this.xTableRef.clearCheckboxRow();
        this.xTableRef.clearCheckboxReserve();
        return;
      }
      this.xTableRef.clearCheckboxRow();
    },
    /**
     * 设置展开树形节点
     * @param {object | array} rows 想要展开的行
     * @param {boolean} checked 这一行展开与否
     * @returns Promise
     */
    setTreeExpand(rows, checked) {
      return this.xTableRef.setTreeExpand(rows, checked);
    },
    /**
     * 切换展开树形节点的状态
     * @public
     * @param {object} row
     * @returns Promise
     */
    toggleTreeExpand(row) {
      return this.xTableRef.toggleTreeExpand(row);
    },
    /**
     * 根据 row 获取相对于 data 中的索引
     * @param {object} row 行数据对象
     * @returns 索引值
     */
    getRowIndex(row) {
      return this.xTableRef.getRowIndex(row);
    },
    /**
     * 取得所有记录
     * @param {Object} val
     * @returns
     */
    getRecordset(val) {
      const recordSet = this.xTableRef.getRecordset(val) || {};
      // 取得时去除主键字段，减少传输量
      Object.keys(recordSet).forEach((key) => {
        if (!_.isEmpty(recordSet[key])) {
          recordSet[key].forEach((item) => {
            const rowItem = item;
            if (rowItem[PRIMARY_ROW_KEY]) {
              delete rowItem[PRIMARY_ROW_KEY];
            }
          });
        }
      });
      return recordSet;
    },
    isRowActive({ row }) {
      const { xTable } = this.$refs;
      return xTable && xTable.isActiveByRow(row);
    },
    validate() {
      return this.xTableRef.validate(true);
    },
    onTableRowEditorClose({ row }) {
      console.log('editor close', row);
    },
    /**
     * 表格在编辑状态下触发数据变动事件处理
     */
    emitDataChange(key, val, row, originData) {
      this.$emit('data-change', key, val, row, originData);
    },
    /** "新增同级"按钮点击事件 */
    onTableAddCurrentClick() {
      const { onAddCurrentClick } = this;
      if (onAddCurrentClick != null && _.isFunction(onAddCurrentClick)) {
        onAddCurrentClick();
        return;
      }
      this.tableAddCurrent();
    },
    tableAddCurrent() {
      const {
        innerDefaultEntity,
        data,
        innerSelection,
        parentField,
        beforeAddCurrent,
        changeModeField,
        innerRowKey,
        innerRefField,
        virtualTree
      } = this;

      const targetItem = _.cloneDeep(innerDefaultEntity);
      if (beforeAddCurrent && _.isFunction(beforeAddCurrent)) {
        const selected =
          innerSelection && innerSelection.length === 1
            ? innerSelection[0]
            : null;
        beforeAddCurrent(selected, targetItem);
      }

      if (data.length === 0) {
        const defaultItem = {
          ...targetItem,
          [parentField]: '',
          [changeModeField]: EDIT_TYPE.ADD
        };
        data.push(defaultItem);
        return;
      }

      if (!innerSelection || innerSelection.length !== 1) {
        console.error('只能选择一条记录');
        return;
      }

      // 寻找当前选中节点的位置
      const index = data.findIndex(
        (item) =>
          item[innerRowKey] === innerSelection[0][innerRefField] &&
          item[changeModeField] !== EDIT_TYPE.DELETE
      );

      // 构造新的节点
      const defaultItem = {
        ...targetItem,
        [changeModeField]: EDIT_TYPE.ADD
      };
      if (!_.isEmpty(parentField)) {
        defaultItem[parentField] = innerSelection[0][parentField];
      }
      if (virtualTree) {
        this.getTableActionRef().insertAt(defaultItem, innerSelection[0]);
      } else {
        data.splice(index + 1, 0, defaultItem);
      }
    },
    /** "新增子级"按钮点击事件 */
    onTableAddChildClick() {
      const { onAddChildClick } = this;
      if (onAddChildClick != null && _.isFunction(onAddChildClick)) {
        onAddChildClick();
        return;
      }
      this.tableAddChild();
    },
    tableAddChild() {
      const {
        innerDefaultEntity,
        innerSelection,
        innerRefField,
        parentField,
        beforeAddChild,
        changeModeField,
        treeConfig,
        virtualTree
      } = this;
      const tableActionRef = this.getTableActionRef();
      if (!innerSelection || innerSelection.length !== 1) {
        console.error('只能选择一条记录');
      }
      const childrenKey = _.get(treeConfig, 'children', 'children');
      if (!innerSelection[0][childrenKey]) {
        innerSelection[0][childrenKey] = [];
      }
      const targetItem = JSON.parse(JSON.stringify(innerDefaultEntity));
      if (beforeAddChild && _.isFunction(beforeAddChild)) {
        beforeAddChild(innerSelection[0], targetItem);
      }

      const defaultItem = {
        ...targetItem,
        [changeModeField]: EDIT_TYPE.ADD
      };
      if (!_.isEmpty(parentField)) {
        defaultItem[parentField] = innerSelection[0][innerRefField];
      }
      if (virtualTree) {
        // !FIXME 节点展开的场合，新增的子级数据没有显示，此处通过手动收起父节点的方式实现刷新
        if (tableActionRef.isTreeExpandByRow(innerSelection[0])) {
          tableActionRef.setTreeExpand(innerSelection[0], false);
        }
        const { _X_LEVEL } = innerSelection[0];
        // eslint-disable-next-line no-underscore-dangle
        defaultItem._X_LEVEL = _X_LEVEL + 1;
        innerSelection[0][childrenKey].unshift(defaultItem);
      } else {
        this.data.push(defaultItem);
      }
      this.$nextTick(() => {
        // 刷新节点&展开
        tableActionRef.setTreeExpand(innerSelection[0], false);
        tableActionRef.setTreeExpand(innerSelection[0], true);
      });
    },
    /**
     * 新增一条数据
     * ROW-ADD
     */
    onTableAddRowClick() {
      const {
        onAddRowClick,
        isEditOnRow,
        editingRow
      } = this;
      if (isEditOnRow && editingRow) {
        this.$message({
          message: '同时只能编辑一条数据。',
          type: 'error'
        });
        return;
      }
      this.controlStatus = EDIT_TYPE.ADD;
      if (onAddRowClick != null && _.isFunction(onAddRowClick)) {
        onAddRowClick();
        return;
      }
      // 弹窗编辑数据的场合
      if (!isEditOnRow) {
        this.initialDialogFormData(this.createDefaultRowData());
        this.isShowForm = true;
      // 行上直接编辑的场合
      } else {
        const addRow = this.tableAddRow();
        this.editingRow = addRow;
        this.setActiveRow();
      }
    },
    tableAddRow(position) {
      const { changeModeField } = this;

      const item = this.createDefaultRowData();

      const defaultItem = {
        ...item,
        [changeModeField]: EDIT_TYPE.ADD
      };
      this.data.splice(position || 0, 0, defaultItem);
      return defaultItem;
    },
    tableDelete(rows) {
      if (rows && _.isArray(rows) && rows.length > 0) {
        rows.forEach((item) => {
          this.deleteItem(item);
        });
      } else {
        const { innerSelection } = this;
        if (!innerSelection || innerSelection.length <= 0) {
          return;
        }

        innerSelection.forEach((item) => {
          this.deleteItem(item);
        });
      }

      this.xTableRef.updateData();
      this.emitSelectionChange([]);
    },
    deleteItem(item) {
      const { data, changeModeField, innerRowKey, isTree, virtualTree } = this;
      const temp = item;
      if (virtualTree) {
        const primaryKey = _.get(item || {}, innerRowKey, null);
        if (primaryKey === null) {
          this.getTableActionRef().removeCheckboxRow();
        } else {
          this.getTableActionRef().remove([item]);
        }
      } else {
        const index = data.findIndex(
          (obj) =>
            obj[innerRowKey] === temp[innerRowKey] &&
            obj[changeModeField] !== EDIT_TYPE.DELETE
        );
        // 如果是新添加的记录，直接从data中删除
        if (temp[changeModeField] === EDIT_TYPE.ADD) {
          if (index > -1) {
            data.splice(index, 1);
          }
        } else {
          // changeMode标识为 DELETE
          temp[changeModeField] = EDIT_TYPE.DELETE;
          data.splice(index, 1, temp);
        }

        if (isTree) {
          this.deleteChildren(item);
        }
      }
    },
    deleteChildren(item) {
      if (item && item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          this.deleteItem(child);
        });
      }
    },
    /**
     * 对树进行深度搜索
     * @param keyword 搜索关键字
     * @param searchProps 搜索的字段数组
     */
    treeSearch(keyword, searchProps = []) {
      const filterName = XEUtils.toValueString(keyword).trim();
      if (filterName) {
        const options = { children: 'children' };
        // const searchProps = ['name'];
        this.innerTreeDataList = XEUtils.searchTree(
          this.innerDataList,
          (item) =>
            searchProps.some(
              (key) => XEUtils.toValueString(item[key]).indexOf(filterName) > -1
            ),
          options
        );
      } else {
        this.innerTreeDataList = this.innerDataList;
      }
      // 搜索之后默认展开所有子节点
      this.$nextTick(() => {
        this.xTableRef.setAllTreeExpand(true);
      });
    },
    /** 展开层级 */
    onTableExpandRowsClick() {
      this.xTableRef.setAllTreeExpand(true);
    },
    onTableCollapseRowsClick() {
      this.xTableRef.setAllTreeExpand(false);
    },
    onRowDataFormSubmit() {
      return new window.Promise((resolve) => {
        resolve();
      });
    },
    onDialogSaveButtonClick() {
      const {
        controlStatus,
        data,
        dataAddPosition,
        currentFormData,
        originFormData,
        save,
        selectRow
      } = this;
      const afterExec = () => {
        this.syncEditData();
        if (controlStatus === EDIT_TYPE.ADD) {
          if (dataAddPosition === 'begin') {
            data.unshift(originFormData);
          } else {
            data.push(originFormData);
          }
        } else {
          _.assign(selectRow, originFormData);
        }
        this.isShowForm = false;
      };
      if (this.$refs.dialogForm) {
        this.$refs.dialogForm.validate((isValid) => {
          if (isValid) {
            this.isSaveLoading = true;
            if (typeof save === 'function') {
              // 传递编辑中数据以避免失败时需要进行回退
              const res = save(currentFormData, controlStatus, this.$refs.dialogForm);
              if (res.then) {
                res.then(() => {
                  afterExec();
                  this.isSaveLoading = false;
                }).catch(() => {
                  this.isSaveLoading = false;
                });
              } else if (res) {
                afterExec();
                this.isSaveLoading = false;
              }
            } else {
              afterExec();
              this.isSaveLoading = false;
            }
          }
        });
      }
    },
    onDialogCancelButtonClick() {
      const { beforeCloseFunction } = this;
      beforeCloseFunction(() => {
        this.isShowForm = false;
      });
    },
    recalculate(refull) {
      this.xTableRef.recalculate(refull);
    },
    onBatchDeleteData() {
      this.onTableDeleteClick(this.innerSelection);
    },
    handleFormChange(key, val) {
      this.emitDataChange(key, val, this.currentFormData, this.originFormData);
    },
    handleFormDialogOpen() {
      this.$emit('dialog-open', this.currentFormData);
    }
  },
  render() {
    const {
      $slots,
      $scopedSlots,
      innerDataList,
      innerTreeDataList,
      currentFormData,
      isShowForm,
      innerRules,
      innerEditConfig,
      vxeTableColumnArray,
      innerSeqConfig,
      innerCheckboxConfig,
      innerExpandConfig,
      innerRadioConfig,
      innerTreeConfig,
      innerSortConfig,
      innerCustomConfig,
      innerExportConfig,
      innerRowKey,
      height,
      maxHeight,
      innerSchema,
      innerUiSchema,
      onTableCheckboxChange,
      onTableRadioChange,
      onTableCheckboxAll,
      onTableRowEditorClose,
      onDialogSaveButtonClick,
      onDialogCancelButtonClick,
      isTree,
      isShowDefaultBatchControl,
      onTableAddCurrentClick,
      onTableAddChildClick,
      onTableAddRowClick,
      onBatchDeleteData,
      onTableExpandRowsClick,
      onTableCollapseRowsClick,
      innerPageSize,
      innerPageSizes,
      innerCurrentPage,
      innerTotal,
      layouts,
      onPageChange,
      labelMode,
      showPagination,
      isShowTable,
      onCellClick,
      innerMergeCells,
      menuConfig,
      onCellMenu,
      onMenuClick,
      mergeFooterItems,
      footerMethod,
      showFooter,
      virtualTree,
      onSortChange,
      tableId,
      getColumnSettingRender,
      showExpandAllBtn,
      showCollapseAllBtn,
      onGridNativeClick,
      rowClassName,
      isSaveLoading,
      canAdd,
      innerCanDelete,
      innerCanAddTree,
      innerCanAddChild,
      handleFormChange,
      formAttrs,
      innerDialogProps
    } = this;
    const dialogOnListener = {
      'update:visible': (val) => {
        this.isShowForm = val;
      }
    };
    const dialogFormProps = {
      ...formAttrs,
      model: currentFormData
    };
    const getCommonToolbarButton = () => {
      const ret = [];
      if (isShowDefaultBatchControl && !labelMode) {
        // 显示树形结构数据的场合
        if (isTree) {
          // 新增同级按钮
          const addCurrentButton = (
            innerCanAddTree ? (
              <el-button
                type="text"
                on-click={onTableAddCurrentClick}
              >
                新增同级
              </el-button>
            ) : null
          );
          ret.push(addCurrentButton);
          // 新增子级按钮
          const addChildButton = (
            innerCanAddChild ? (
              <el-button
                type="text"
                on-click={onTableAddChildClick}
              >
                新增子级
              </el-button>
            ) : null
          );
          ret.push(addChildButton);
          // 显示flat数据的场合
        } else {
          const addRowButton = (
            canAdd ? (
              <el-button
                type="text"
                on-click={onTableAddRowClick}
              >
                新增数据
              </el-button>
            ) : null
          );
          ret.push(addRowButton);
        }
        const deleteRowButton = (
          innerCanDelete ? (
            <el-button
              type="text"
              on-click={onBatchDeleteData}
            >
              批量删除
            </el-button>
          ) : null
        );
        ret.push(deleteRowButton);
      }
      if (isTree) {
        if (showExpandAllBtn) {
          const expandAllButton = (
            <el-button type="text" on-click={onTableExpandRowsClick}>
              全部展开
            </el-button>
          );
          ret.push(expandAllButton);
        }
        if (showCollapseAllBtn) {
          const collapseAllButton = (
            <el-button type="text" on-click={onTableCollapseRowsClick}>
              全部收缩
            </el-button>
          );
          ret.push(collapseAllButton);
        }
      }
      return ret;
    };
    // 表格工具栏
    const tableToolbar = () => {
      const ret = (
        <div class="el-pro-table__toolbar">
          <div>
            {getCommonToolbarButton()}
            {$slots.batchControl}
          </div>
          <div class="toolbar__table-common">{getColumnSettingRender()}</div>
        </div>
      );
      return ret;
    };
    const tablePagination = () => {
      if (showPagination) {
        return (
          <vxe-pager
            background
            size="small"
            class="el-pro-table__pager"
            current-page={innerCurrentPage}
            layouts={layouts}
            page-size={innerPageSize}
            page-sizes={innerPageSizes}
            total={innerTotal}
            on-page-change={onPageChange}
          />
        );
      }
      return null;
    };
    const grid = (
      <div class="el-table-container">
        {tableToolbar()}
        <div class="el-pro-table__main">
          <vxe-grid
            ref="xTable"
            class="el-pro-table el-editable-pro-table"
            size="mini"
            v-show={isShowTable}
            id={tableId}
            border
            resizable
            auto-resize
            show-overflow
            highlight-hover-row
            highlight-current-row
            keep-source
            edit-config={innerEditConfig}
            data={isTree ? innerTreeDataList : innerDataList}
            height={height}
            max-height={maxHeight}
            edit-rules={innerRules}
            columns={vxeTableColumnArray}
            seq-config={innerSeqConfig}
            checkbox-config={innerCheckboxConfig}
            expand-config={innerExpandConfig}
            radio-config={innerRadioConfig}
            tree-config={innerTreeConfig}
            sort-config={innerSortConfig}
            custom-config={innerCustomConfig}
            menu-config={menuConfig}
            export-config={innerExportConfig}
            row-id={innerRowKey}
            scroll-y={{ gt: 20 }}
            merge-cells={innerMergeCells}
            show-footer={showFooter}
            footer-method={footerMethod}
            merge-footer-items={mergeFooterItems}
            nativeOnClick={onGridNativeClick}
            row-class-name={rowClassName}
            on-cell-click={onCellClick}
            on-radio-change={onTableRadioChange}
            on-checkbox-change={onTableCheckboxChange}
            on-checkbox-all={onTableCheckboxAll}
            on-edit-closed={onTableRowEditorClose}
            on-cell-menu={onCellMenu}
            on-menu-click={onMenuClick}
            on-sort-change={onSortChange}
          />
        </div>
        {currentFormData ? (
          <el-dialog
            class="editable-pro-table__dialog"
            visible={isShowForm}
            {...{ props: innerDialogProps }}
            {...{ on: dialogOnListener }}
          >
            {
              $scopedSlots.modifyDialog ? $scopedSlots.modifyDialog({
                data: currentFormData
              }) : (
                <el-json-form
                  ref="dialogForm"
                  {...{ props: dialogFormProps }}
                  schema={innerSchema}
                  rules={innerRules}
                  ui-schema={innerUiSchema}
                  label-position={dialogFormProps['label-position']} // 不知道为啥，dialogFormProps直接label-position属性不好用。。。。所以补偿下
                  label-width="auto"
                  scopedSlots={$scopedSlots}
                  on-change={handleFormChange}
                />
              )
            }
            <span slot="footer" class="editable-pro-table__dialog-footer">
              <el-button type="primary" loading={isSaveLoading} on-click={onDialogSaveButtonClick}>
                保存
              </el-button>
              <el-button on-click={onDialogCancelButtonClick}>取消</el-button>
            </span>
          </el-dialog>
        ) : null}
        {tablePagination()}
      </div>
    );
    const virtualTreeNode = (
      <div class="el-table-container">
        {tableToolbar()}
        <div class="el-pro-table__main">
          <vxe-virtual-tree
            ref="xTable"
            id={tableId}
            class="el-pro-table el-editable-pro-table"
            size="mini"
            v-show={isShowTable}
            border
            resizable
            auto-resize
            show-overflow
            highlight-hover-row
            highlight-current-row
            edit-config={innerEditConfig}
            data={isTree ? innerTreeDataList : innerDataList}
            height={height}
            max-height={maxHeight}
            edit-rules={innerRules}
            columns={vxeTableColumnArray}
            seq-config={innerSeqConfig}
            checkbox-config={innerCheckboxConfig}
            radio-config={innerRadioConfig}
            custom-config={innerCustomConfig}
            export-config={innerExportConfig}
            row-id={innerRowKey}
            on-radio-change={onTableRadioChange}
            on-checkbox-change={onTableCheckboxChange}
            on-checkbox-all={onTableCheckboxAll}
            on-edit-closed={onTableRowEditorClose}
            tree-config={innerTreeConfig}
            scroll-y={{ gt: 20 }}
            on-cell-click={onCellClick}
            merge-cells={innerMergeCells}
            menu-config={menuConfig}
            on-cell-menu={onCellMenu}
            on-menu-click={onMenuClick}
            show-footer={showFooter}
            footer-method={footerMethod}
            merge-footer-items={mergeFooterItems}
            row-class-name={rowClassName}
          />
        </div>
        {currentFormData ? (
          <el-dialog
            class="editable-pro-table__dialog"
            visible={isShowForm}
            {...{ props: innerDialogProps }}
            {...{ on: dialogOnListener }}
          >
            <el-json-form
              ref="dialogForm"
              {...{ props: dialogFormProps }}
              schema={innerSchema}
              rules={innerRules}
              ui-schema={innerUiSchema}
              label-position={dialogFormProps['label-position']} // 不知道为啥，dialogFormProps直接label-position属性不好用。。。。所以补偿下
              label-width="auto"
            />
            <span slot="footer" class="editable-pro-table__dialog-footer">
              <el-button type="primary" loading={isSaveLoading} on-click={onDialogSaveButtonClick}>
                保存
              </el-button>
              <el-button on-click={onDialogCancelButtonClick}>取消</el-button>
            </span>
          </el-dialog>
        ) : null}
        {tablePagination()}
      </div>
    );
    this.$nextTick(() => {
      // 表格状态发生变化时，临时合并失效，需要重新合并
      this.refreshTempState();
    });
    return !virtualTree ? grid : virtualTreeNode;
  }
});
