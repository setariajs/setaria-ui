import _ from 'lodash';
import { EDIT_TYPE } from 'setaria-ui/src/constants/index';
import XEUtils from 'xe-utils';
import { convertSchemaToColumns } from './util';

const COLUMN_CONTROL_TITLE = '操作';
const MODIFY_BUTTON = {
  key: 'ept-modify',
  label: '修改'
};
const DELETE_BUTTON = {
  key: 'ept-delete',
  label: '删除'
};
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZES = [1, 10, 20, 50, 100];
const MAX_EXPORT_DATA_LENGTH = 10000;

export default {
  props: {
    labelMode: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      originFormData: null,
      currentFormData: null,
      // 当前选中的行
      innerSelection: [],
      // 当前排序状态
      sortList: [],
      /* 分页有关属性 BEGIN */
      innerCurrentPage: 1,
      innerPageSize: DEFAULT_PAGE_SIZE,
      innerTotal: 0,
      layouts: [
        'Total',
        'Sizes',
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump'
      ],
      innerPageSizes: DEFAULT_PAGE_SIZES,
      /* 分页有关属性 END */
      cloneVxeTableColumnArray: [],
      columnSettingKeys: [],
      columnSettingCheckedKeys: [],
      columnSettingDefaultCheckedKeys: [],
      isParticalColumnShow: false,
      isAllColumnShow: true
    };
  },
  watch: {
    pageNum: {
      immediate: true,
      handler(val) {
        this.innerCurrentPage = val || 1;
      }
    },
    pageSize: {
      immediate: true,
      handler(val) {
        this.innerPageSize = val || DEFAULT_PAGE_SIZE;
      }
    },
    pageSizes: {
      immediate: true,
      handler(val) {
        this.innerPageSizes = val || DEFAULT_PAGE_SIZES;
      }
    },
    total: {
      immediate: true,
      handler(val) {
        this.innerTotal = val;
      }
    },
    innerCurrentPage(val) {
      this.$emit('current-change', val);
      this.$emit('update:page-num', val);
    },
    innerPageSize(val) {
      this.$emit('size-change', val);
      this.$emit('update:page-size', val);
    }
  },
  computed: {
    innerUiSchema() {
      return this.uiSchema || {};
    },
    innerSeqConfig() {
      const {
        innerCurrentPage,
        innerPageSize,
        innerTableColumns,
        seqConfig,
        showPagination,
        uiSchema
      } = this;
      const startIndex = showPagination
        ? (innerCurrentPage - 1) * innerPageSize
        : 0;
      const defaultConfig = {
        startIndex
      };
      const index = _.findIndex(
        innerTableColumns,
        (item) => item.type === 'seq'
      );
      if (index !== -1) {
        const seqColumn = innerTableColumns[index];
        const { formatter } = uiSchema[seqColumn.field] || {};
        if (typeof formatter === 'function') {
          defaultConfig.seqMethod = formatter;
        }
        return _.assign({}, defaultConfig, seqConfig);
      }
      return {};
    },
    isTree() {
      return !_.isEmpty(this.treeNode);
    },
    isSortAllData() {
      // 前端分页并且渲染非树形数据的场合
      if (this.autoPagination && !this.isTree) {
        // 列开启了排序功能的场合
        if (this.defaultAllColumnSort) {
          return true;
        }
      }
      return false;
    },
    innerCheckboxConfig() {
      let ret = {};
      const {
        labelMode,
        isReserve,
        selectable,
        isMultipleSelect,
        checkStrictly,
        checkboxConfig = {}
      } = this;
      const defaultCheckboxConfig = {
        reserve: isReserve,
        checkStrictly
      };
      if (labelMode !== false) {
        defaultCheckboxConfig.trigger = 'row';
      }
      if (isMultipleSelect || !_.isEmpty(checkboxConfig)) {
        if (typeof selectable === 'function') {
          defaultCheckboxConfig.checkMethod = selectable;
        }
        ret = _.assign({}, defaultCheckboxConfig, checkboxConfig);
      }
      return ret;
    },
    innerRadioConfig() {
      const {
        isReserve,
        labelMode,
        radioConfig = {},
        selectable,
        selectionType
      } = this;
      // TODO 单选项保留状态没有起作用
      const defaultRadioConfig = {
        reserve: isReserve
      };
      if (labelMode !== false) {
        defaultRadioConfig.trigger = 'row';
      }
      if (selectionType === 'radio') {
        if (typeof selectable === 'function') {
          defaultRadioConfig.checkMethod = selectable;
        }
        return _.assign({}, defaultRadioConfig, radioConfig);
      }
      return {};
    },
    innerExpandConfig() {
      const { expandConfig = {} } = this;
      const defaultConfig = {};
      return _.assign({}, defaultConfig, expandConfig);
    },
    innerTreeConfig() {
      const { expandRowKeys, isTree, treeConfig } = this;
      if (!isTree) {
        return null;
      }
      const defaultConfig = {};
      if (!_.isEmpty(expandRowKeys)) {
        defaultConfig.expandRowKeys = expandRowKeys;
      }
      const ret = _.assign({}, defaultConfig, treeConfig);
      return ret;
    },
    innerSortConfig() {
      const { isSortAllData, isTree, sortConfig } = this;
      // 树形结构不支持排序
      if (isTree) {
        return null;
      }
      const defaultConfig = {
        trigger: 'cell',
        orders: ['asc', 'desc'],
        // 前端对全部数据进行排序的场合，需要关闭当前页的默认排序逻辑
        remote: isSortAllData
      };
      const ret = _.assign({}, defaultConfig, sortConfig);
      return ret;
    },
    innerCustomConfig() {
      const { customConfig, tableId } = this;
      const isStorageConfig = !_.isEmpty(tableId);
      const defaultConfig = {
        storage: {
          visible: isStorageConfig,
          resizable: isStorageConfig
        },
        checkMethod(val) {
          return true;
        }
      };
      return _.assign({}, defaultConfig, customConfig);
    },
    innerExportConfig() {
      const { exportConfig, getTableActionRef, innerTableColumns } = this;
      const defaultConfig = {
        types: ['csv'],
        modes: ['all'],
        beforeExportMethod(opt) {
          const { options } = opt;
          options.data = getTableActionRef().getFullData();
          options.columns = innerTableColumns;
          return opt;
        }
      };
      return _.assign({}, defaultConfig, exportConfig);
    },
    innerProxyConfig() {
      const { proxyConfig } = this;
      const defaultConfig = {
        ajax: {
          queryAll() {
            return [];
          }
        }
      };
      return _.assign({}, defaultConfig, proxyConfig);
    },
    innerDefaultAllColumnSort() {
      const { autoPagination, defaultAllColumnSort, isTree } = this;
      // 后端分页的场合，不开启所有列的默认排序
      if (!autoPagination) {
        return false;
      }
      // 树形数据的场合，不开启所有列的默认排序
      if (isTree) {
        return false;
      }
      return defaultAllColumnSort;
    },
    vxeColumns() {
      const {
        columnWidth,
        expandConfig,
        innerDefaultAllColumnSort,
        isTree,
        schema,
        treeNode,
        uiSchema = {},
        $scopedSlots
      } = this;
      const ret = convertSchemaToColumns(
        schema,
        uiSchema,
        $scopedSlots,
        columnWidth,
        {
          expand: expandConfig,
          defaultAllColumnSort: innerDefaultAllColumnSort
        }
      );
      if (isTree) {
        const treeColumn = _.find(ret, (col) => col.field === treeNode);
        if (treeColumn) {
          treeColumn.treeNode = true;
        }
      }
      return ret;
    },
    /**
     * 处理公共列(首列选择列和尾列操作按钮列)
     * @returns
     */
    vxeTableColumnArray() {
      const {
        getDefaultControlColumn,
        multipleSelection,
        selectionType,
        innerDefaultAllColumnSort
      } = this;
      let columns = this.innerTableColumns || [];
      let selectColumn = selectionType;
      if (multipleSelection) {
        selectColumn = 'checkbox';
      }
      const selectionColumn = this.createSelectionColumn(selectColumn);
      if (columns && selectionColumn) {
        // !FIXME 组件创建后，更改selectionType时不会触发重新构建VxeColumn计算属性。
        const index = _.findIndex(
          columns,
          (col) => col.type === 'checkbox' || col.type === 'radio'
        );
        // 更新选择方式(多选/单选)
        if (index !== -1 && columns[index].type !== selectionColumn.type) {
          columns[index].type = selectionColumn.type;
          // 新增选择列
        } else if (index === -1) {
          columns.unshift(selectionColumn);
        }
      }
      const isMultipleLevelHeader = columns.some((column) => {
        const { srParentField } = column;
        // 存在复合表头的场合
        if (!_.isEmpty(srParentField)) {
          return true;
        }
        return false;
      });
      // 存在多级表头的场合
      if (isMultipleLevelHeader) {
        columns = XEUtils.toArrayTree(_.cloneDeep(columns), {
          parentKey: 'srParentField',
          key: 'field'
        });
        columns.forEach((col) => {
          const parentColumn = col;
          // 复合表头不进行排序
          if (innerDefaultAllColumnSort && !_.isEmpty(col.children)) {
            parentColumn.sortable = false;
          }
        });
      }
      const controlColumn = getDefaultControlColumn();
      if (!_.isEmpty(controlColumn)) {
        columns = columns.concat([controlColumn]);
      }
      this.initialColumnSettingKeys(columns);
      return columns;
    },
    isMultipleSelect() {
      if (this.multipleSelection || this.selectionType === 'checkbox') {
        return true;
      }
      const index = this.vxeTableColumnArray.findIndex((col) => col.type === 'checkbox');
      const ret = index !== -1;
      return ret;
    },
    innerSortList() {
      const { sortList } = this;
      return sortList;
    },
    innerPaginationTotal() {
      const {
        autoPagination,
        showPagination,
        isTree,
        innerDataList,
        innerTotal,
        innerTreeDataList
      } = this;
      if (showPagination) {
        if (autoPagination) {
          if (isTree) {
            return innerTreeDataList.length;
          }
          return innerDataList.length;
        }
        return innerTotal;
      }
      return innerDataList.length;
    },
    innerMergeCells() {
      const {
        mergeCells,
        innerCurrentPage,
        innerPageSize,
        innerDataList
      } = this;
      if (mergeCells && _.isFunction(mergeCells)) {
        return mergeCells(innerDataList, innerCurrentPage, innerPageSize);
      }
      return null;
    }
  },
  created() {
    const { innerSortConfig } = this;
    const defaultSort = _.get(innerSortConfig, 'defaultSort');
    if (!_.isEmpty(defaultSort)) {
      const { field, order } = defaultSort;
      this.sortList.push({
        property: field,
        order
      });
    }
  },
  methods: {
    /**
     * 用于 type=checkbox，切换某一行的选中状态
     * @public
     * @param {object} row
     */
    toggleCheckboxRow(row) {
      this.getTableRef().toggleCheckboxRow(row);
    },
    /**
     * 用于多选表格，清空全部用户选择项（当前页和保留的选择项）
     * @public
     */
    clearSelection() {
      if (this.isMultipleSelect) {
        this.getTableActionRef().clearCheckboxRow();
        this.getTableActionRef().clearCheckboxReserve();
      } else if (this.selectionType === 'radio') {
        this.getTableActionRef().clearRadioRow();
        this.getTableActionRef().clearRadioReserve();
      }
    },
    /**
     * 排序
     * @param {*} data
     * @param {array} fieldConfs {property, order}
     */
    sortData(data, fieldConfs) {
      if (_.isEmpty(data)) {
        return data;
      }
      const { sortMethod, isTree, schema } = this;
      // 自定义排序函数的场合
      if (typeof sortMethod === 'function') {
        return sortMethod(data, fieldConfs, schema);
      }
      const confs = [];
      // 转换函数
      const orderFunction = XEUtils.orderBy;
      fieldConfs.forEach((item) => {
        const { property, order } = item;
        const key = property;
        let orderKey = key;
        const schemaProperty = schema.properties[key];
        if (schemaProperty) {
          if (schemaProperty.format === 'price') {
            orderKey = (rowItem) => {
              let ret = rowItem[key];
              ret = _.toNumber(ret);
              if (_.isNaN(ret)) {
                ret = 0;
              }
              return ret;
            };
          }
        }
        confs.push([orderKey, order]);
      });
      // 暂不处理树形结构数据
      if (!isTree) {
        const ret = orderFunction(data, confs);
        return ret;
      }
      return data;
    },
    /**
     * editable-pro-table
     * 获取当前表格的深拷贝数据
     * 数据源为data
     * 用于过滤掉表格渲染用字段
     * @param {excludeFunction} Function 自定义过滤函数
     */
    getFullData(excludeFunction) {
      const { data, treeConfig } = this;
      if (_.isEmpty(data)) {
        return data;
      }
      const config = _.assign({}, treeConfig, {
        // 移除子节点
        clear: true
      });
      let currentData = _.cloneDeep(data);
      const VXETABLE_ITEM_PREFIX = '_X';
      // 移除表格渲染用字段
      currentData = XEUtils.mapTree(
        currentData,
        (item) => {
          const ret = {};
          Object.keys(item).forEach((key) => {
            let isNeedExclude = false;
            // 自定义过滤
            if (typeof excludeFunction === 'function' && excludeFunction(key)) {
              isNeedExclude = true;
              // 默认过滤
            } else if (key.indexOf(VXETABLE_ITEM_PREFIX) === 0) {
              isNeedExclude = true;
            }
            if (!isNeedExclude) {
              ret[key] = item[key];
            }
          });
          return ret;
        },
        config
      );
      return currentData;
    },
    /**
     * VxeTable子组件函数调用代理实例
     * @public
     * @returns
     */
    getTableActionRef() {
      const ret = this.getTableRef();
      if (ret) {
        ret.clearSelection = () => {
          this.clearSelection();
        };
        ret.getFullData = (val) => this.getFullData(val);
        ret.setFullCheckboxRow = (val) => {
          this.setFullCheckboxRow(val);
        };
        ret.getAllCheckboxRecords = () => this.getAllCheckboxRecords();
      }
      return ret;
    },
    /**
     * 取得VxeTable实例
     * @public
     * @returns
     */
    getTableRef() {
      return this.$refs.xTable;
    },
    createSelectionColumn(selectionType) {
      const { checkboxConfig, radioConfig } = this;
      const getSelectionColumnWidth = (cbConfig, rConfig, st) => {
        const DEFAULT_WIDTH = 40;
        if (st === 'checkbox') {
          return _.get(cbConfig, 'width', DEFAULT_WIDTH);
        }
        return _.get(rConfig, 'width', DEFAULT_WIDTH);
      };
      // 选择列（单选、复选）
      let selectionColumn = null;
      if (selectionType) {
        selectionColumn = {
          type: selectionType,
          title: '',
          width: getSelectionColumnWidth(
            checkboxConfig,
            radioConfig,
            selectionType
          ),
          align: 'center',
          fixed: 'left',
          field: ''
        };
      }
      return selectionColumn;
    },
    getDefaultControlColumn() {
      const {
        controlColumnWidth,
        getRowButton,
        labelMode,
        onCustomButtonClick,
        canUpdate,
        canDelete
      } = this;
      if (typeof getRowButton !== 'function') {
        return null;
      }
      return {
        title: COLUMN_CONTROL_TITLE,
        fixed: 'right',
        align: 'center',
        width: controlColumnWidth,
        slots: {
          default(scope) {
            const controlColumnDefaultSlot = [];
            const rowButtonList = getRowButton(scope) || [];
            if (labelMode !== true) {
              if (canDelete) {
                rowButtonList.unshift(DELETE_BUTTON);
              }
              if (canUpdate) {
                rowButtonList.unshift(MODIFY_BUTTON);
              }
            }
            if (!_.isEmpty(rowButtonList)) {
              if (rowButtonList.length <= 3) {
                rowButtonList.forEach(({ key, label }) => {
                  controlColumnDefaultSlot.push(
                    <el-button
                      type="text"
                      on-click={onCustomButtonClick(key, scope)}
                    >
                      {label}
                    </el-button>
                  );
                });
              } else {
                let i;
                for (i = 0; i < 2; i += 1) {
                  const btnFirst = rowButtonList[i];
                  controlColumnDefaultSlot.push(
                    <el-button
                      type="text"
                      on-click={onCustomButtonClick(btnFirst.key, scope)}
                    >
                      {btnFirst.label}
                    </el-button>
                  );
                }
                const moreElt = (
                  <el-dropdown style="margin-left: 15px">
                    <el-button type="text">
                      更多<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      {rowButtonList.map(({ key, label }, index) => {
                        if (index >= i) {
                          return (
                            <el-dropdown-item>
                              <el-button
                                type="text"
                                on-click={onCustomButtonClick(key, scope)}
                              >
                                {label}
                              </el-button>
                            </el-dropdown-item>
                          );
                        }
                        return null;
                      })}
                    </el-dropdown-menu>
                  </el-dropdown>
                );
                controlColumnDefaultSlot.push(moreElt);
              }
            }
            return controlColumnDefaultSlot;
          }
        }
      };
    },
    /**
     * 选中指定行
     * @public
     * @param {Object} data 选中行的数据
     * @param {*} checked 选中状态，默认为true
     */
    setSelection(data, checked = true) {
      const xTable = this.getTableRef();
      let selection = [];
      if (this.isMultipleSelect) {
        xTable.setCheckboxRow(data, checked);
        selection = this.getTableActionRef().getCheckboxRecords(true);
      } else if (this.selectionType === 'radio') {
        if (!checked) {
          xTable.clearRadioRow(data);
        } else {
          xTable.setRadioRow(data);
          selection = [data];
        }
      }
      this.emitSelectionChange(selection);
    },
    reloadColumn() {
      const xTable = this.getTableRef();
      if (xTable) {
        xTable.reloadColumn(this.vxeTableColumnArray);
      }
    },
    initialDialogFormData(data) {
      this.originFormData = data;
      this.currentFormData = _.cloneDeep(this.originFormData);
    },
    syncEditData() {
      _.assign(this.originFormData, this.currentFormData);
    },
    /**
     * 自定义操作按钮点击事件
     * @param {*} key
     * @param {*} scope
     * @returns
     */
    onCustomButtonClick(key, scope) {
      return (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (key === MODIFY_BUTTON.key) {
          this.controlStatus = EDIT_TYPE.MODIFY;
          this.isShowForm = true;
          this.initialDialogFormData(scope.row);
          this.$emit('row-button-click', key, scope);
        } else if (key === DELETE_BUTTON.key) {
          this.$confirm('确认删除数据吗？', '提示', {
            type: 'warning'
          }).then(() => {
            this.controlStatus = EDIT_TYPE.DELETE;
            this.deleteItem(scope.row);
            this.$emit('row-button-click', key, scope);
          }).catch(() => {});
        } else {
          this.$emit('row-button-click', key, scope);
        }
      };
    },
    /**
     * Radio单选框选中事件处理
     * @event
     * @param {Object} param
     */
    onTableRadioChange(val) {
      const { innerRadioConfig } = this;
      if (innerRadioConfig && _.isFunction(innerRadioConfig.checkMethod)) {
        if (val && innerRadioConfig.checkMethod(val)) {
          this.emitSelectionChange([val.row]);
        }
      } else {
        this.emitSelectionChange([val.row]);
      }
    },
    /** CheckBox 选中事件 */
    onTableCheckboxChange(val) {
      // !FIXME vxe-table bug - 不存在checkbox多选列的情况下，仍然触发了checkbox-change事件
      if (this.isMultipleSelect) {
        this.emitSelectionChange(val.records);
      }
    },
    onTableCheckboxAll({ records }) {
      this.emitSelectionChange(records);
      this.$emit('select-all', records);
    },
    emitSelectionChange(val) {
      let selectionArray = val;
      if (this.isReserve && this.isMultipleSelect) {
        const reserveArray = this.getTableActionRef().getCheckboxReserveRecords();
        selectionArray = selectionArray.concat(reserveArray);
      }
      this.innerSelection = selectionArray;
      this.$emit('selection-change', selectionArray);
    },
    onCellClick(val) {
      this.$emit('cell-click', val);
      const isTriggerBySelectColumn = (target) => {
        const ret =
          target.triggerCheckbox ||
          target.triggerExpandNode ||
          target.triggerRadio ||
          target.triggerTreeNode;
        return ret;
      };
      // 表格处于可编辑状态下，点击不可编辑单元格后，触发选中事件的场合
      if (
        this.labelMode === false &&
        !isTriggerBySelectColumn(val) &&
        typeof _.get(val, 'column.slots.edit') !== 'function'
      ) {
        if (this.selectionType === 'radio') {
          this.setSelection(val.row, true);
        } else if (this.isMultipleSelect) {
          if (this.virtualTree) {
            // !FIXME 需要确认为何此处必须传入数组
            this.toggleCheckboxRow([val.row]);
          } else {
            this.toggleCheckboxRow(val.row);
          }
          this.$nextTick(() => {
            // 手动触发selectionChange
            if (
              typeof this.getTableActionRef().getCheckboxRecords === 'function'
            ) {
              this.emitSelectionChange(
                this.getTableActionRef().getCheckboxRecords(true)
              );
            }
          });
        }
      }
    },
    onMenuClick(val) {
      this.$emit('menu-click', val);
    },
    onCellMenu(val) {
      this.$emit('cell-menu', val);
    },
    onSortChange(val) {
      const { sortList } = val;
      this.sortList = sortList;
      this.$emit('sort-change', val);
    },
    onPageChange(val) {
      const { currentPage, pageSize } = val;
      this.innerCurrentPage = currentPage;
      this.innerPageSize = pageSize;
      this.$emit('page-change', val);
    },
    refreshTempState() {
      const tableActionRef = this.getTableActionRef();
      if (tableActionRef) {
        const { innerMergeCells, mergeFooterItems } = this;
        // 自动刷新合并状态
        if (!_.isEmpty(innerMergeCells)) {
          tableActionRef.setMergeCells(innerMergeCells);
        }
        // 重新合并表尾合计行
        if (!_.isEmpty(mergeFooterItems)) {
          this.$nextTick(() => {
            tableActionRef.setMergeFooterItems(mergeFooterItems);
          });
        }
      }
    },
    onColumnSettingTreeCheckboxChange(val) {
      this.isAllColumnShow = val;
      if (!val) {
        this.columnSettingDefaultCheckedKeys.forEach((key) => {
          this.getTableActionRef().hideColumn(key);
        });
        this.columnSettingDefaultCheckedKeys = [];
      } else {
        const keys = XEUtils.toTreeArray(this.columnSettingKeys).map(
          (item) => item.key
        );
        this.columnSettingDefaultCheckedKeys = keys;
        this.columnSettingDefaultCheckedKeys.forEach((key) => {
          this.getTableActionRef().showColumn(key);
        });
      }
      // 更新列设置树的checkbox状态
      this.$refs.columnSettingTree.setCheckedKeys(
        this.columnSettingDefaultCheckedKeys,
        val
      );
    },
    onColumnSettingTreeNodeCheck(data, checked, indeterminate) {
      const nodeData = data;
      const { key } = nodeData;
      // 忽略父节点
      if (indeterminate) {
        return;
      }
      const targetTableColumn = this.getTableActionRef().getColumnByField(key);
      if (targetTableColumn) {
        // vxe-table在分组表头的场合，父表头的显示隐藏需要通过子表头的状态进行控制
        if (!_.isEmpty(targetTableColumn.children)) {
          targetTableColumn.children.forEach((col) => {
            const colItem = col;
            colItem.visible = checked;
          });
        } else {
          targetTableColumn.visible = checked;
        }
      }
      // 更新表格列状态
      this.getTableActionRef()
        .refreshColumn()
        .then(() => {
          // 更新表格的临时状态
          this.refreshTempState();
          this.refreshColumnSettingTopCheckboxStatus();
        });
    },
    refreshColumnSettingTopCheckboxStatus() {
      const columnFlatArray = XEUtils.toTreeArray(this.columnSettingKeys);
      const settingColumnTotalCount = columnFlatArray.length;
      // const visibleColumnCount = _.filter(columnFlatArray,
      //   (item) => item.isColumnVisible).length;
      let visibleColumnCount = 0;
      this.columnSettingKeys.forEach((cs) => {
        if (this.getTableActionRef()) {
          const column = this.getTableActionRef().getColumnByField(cs.key);
          if (column && column.visible) {
            visibleColumnCount += 1;
          }
        }
      });
      // 更新checkbox indeterminate 状态
      this.isParticalColumnShow =
        visibleColumnCount > 0 && visibleColumnCount < settingColumnTotalCount;
      // 更新checkbox选中状态
      this.isAllColumnShow = visibleColumnCount === settingColumnTotalCount;
    },
    initialColumnSettingKeys(val) {
      if (_.isEmpty(val)) {
        this.columnSettingKeys = [];
        return;
      }
      this.cloneVxeTableColumnArray = _.cloneDeep(val);
      this.columnSettingKeys = [];
      let settings = XEUtils.mapTree(val, (item) => {
        const ret = {
          key: item.field,
          title: item.title,
          isColumnVisible: item.visible
        };
        return ret;
      });
      settings = _.filter(
        settings,
        (item) => !_.isEmpty(item.key) && item.title !== COLUMN_CONTROL_TITLE
      );
      this.columnSettingKeys = settings;
      const visibleKeys = this.columnSettingKeys.filter(
        (item) => item.isColumnVisible
      );
      this.columnSettingDefaultCheckedKeys = visibleKeys.map(
        (item) => item.key
      );
    },
    getColumnSettingRender() {
      const {
        columnSettingKeys,
        onColumnSettingTreeCheckboxChange,
        onColumnSettingTreeNodeCheck,
        columnSettingDefaultCheckedKeys,
        isAllColumnShow,
        isParticalColumnShow,
        showColumnSetting
      } = this;
      if (showColumnSetting === false) {
        return null;
      }
      const renderContent = (h, { node }) => {
        const ret = (
          <span class="custom-tree-node">
            <span>{node.data.title}</span>
          </span>
        );
        return ret;
      };
      const onReset = () => {
        this.getTableActionRef()
          .resetColumn()
          .then(() => {
            // 更新列设置树的checkbox状态
            this.initialColumnSettingKeys(this.cloneVxeTableColumnArray);
            // 更新列设置树的checkbox状态
            this.$refs.columnSettingTree.setCheckedKeys(
              this.columnSettingDefaultCheckedKeys,
              true
            );
          });
      };
      if (columnSettingKeys.length > 0) {
        this.refreshColumnSettingTopCheckboxStatus();
        return (
          <el-popover
            placement="bottom"
            class="column-setting"
            width="240"
            trigger="hover"
            popper-class="pro-table__column-setting-tree"
          >
            <div class="column-setting__toolbar">
              <el-checkbox
                indeterminate={isParticalColumnShow}
                value={isAllColumnShow}
                on-change={onColumnSettingTreeCheckboxChange}
              >
                所有列
              </el-checkbox>
              <el-button
                type="text"
                class="column-setting__reset-button"
                on-click={onReset}
              >
                重置
              </el-button>
            </div>
            <el-tree
              data={columnSettingKeys}
              node-key="key"
              ref="columnSettingTree"
              icon-class="el-icon-rank"
              props={{ label: 'title' }}
              default-expand-all={true}
              expand-on-click-node={false}
              default-checked-keys={columnSettingDefaultCheckedKeys}
              show-checkbox
              check-on-click-node
              on-check-change={onColumnSettingTreeNodeCheck}
              render-content={renderContent}
            />
            <el-tooltip content="列设置" placement="top" slot="reference">
              <el-button icon="el-icon-setting" type="text">
                列设置
              </el-button>
            </el-tooltip>
          </el-popover>
        );
      }
      return null;
    },
    exportData(option) {
      const { getTableActionRef } = this;
      let columns = _.filter(
        getTableActionRef().getColumns(),
        (item) =>
          !_.isEmpty(item.property) &&
          item.title !== COLUMN_CONTROL_TITLE &&
          item.visible
      );
      columns = columns.map((item) => {
        const ret = {
          field: item.property
        };
        return ret;
      });
      const defaultConfig = {
        sheetName: '数据',
        type: 'xlsx',
        mode: 'all',
        columns,
        beforeExportMethod(opt) {
          const { options } = opt;
          let data = getTableActionRef().getFullData();
          if (data && data.length > MAX_EXPORT_DATA_LENGTH) {
            options.isSlice = true;
            data = _.slice(data, 0, MAX_EXPORT_DATA_LENGTH);
          }
          if (options.mode === 'all') {
            options.data = data;
          }
          return opt;
        }
      };
      getTableActionRef().exportData(_.assign({}, defaultConfig, option));
    },
    /**
     * 设置所有数据（包含分页场景下的其他页数据）的选择状态
     * @param val
     */
    setFullCheckboxRow(val) {
      const {
        data,
        getTableActionRef,
        isMultipleSelect,
        tableListTransform
      } = this;
      if (!isMultipleSelect) {
        return;
      }
      let tableData = data;
      if (typeof tableListTransform === 'function') {
        tableData = tableListTransform(data);
      }
      if (getTableActionRef()) {
        getTableActionRef().setCheckboxRow(tableData, val);
        this.emitSelectionChange(tableData);
      }
    },
    getAllCheckboxRecords() {
      const { getTableActionRef, isMultipleSelect } = this;
      const tableActionRef = getTableActionRef();
      if (isMultipleSelect && tableActionRef) {
        const currentPageCheckboxRecords = tableActionRef.getCheckboxRecords();
        const reserveCheckboxRecords = tableActionRef.getCheckboxReserveRecords();
        return currentPageCheckboxRecords.concat(reserveCheckboxRecords);
      }
      return null;
    },
    isCellButtonClick(evt) {
      if (evt && evt.path && Array.isArray(evt.path) && evt.path.length > 3) {
        const [c0, c1, c2] = evt.path;
        if (c0 && c1 && c2) {
          const c0ClassList = _.toArray(c0.classList);
          const c1ClassList = _.toArray(c1.classList);
          const c2ClassList = _.toArray(c2.classList);
          if (
            c0.tagName === 'SPAN' &&
            c1ClassList.includes('el-button') &&
            c2ClassList.includes('vxe-cell') &&
            c2ClassList.includes('c--tooltip')
          ) {
            return true;
          }
          if (
            c0ClassList.includes('el-button') &&
            c1ClassList.includes('vxe-cell') &&
            c1ClassList.includes('c--tooltip')
          ) {
            return true;
          }
          return false;
        }
      }
      return false;
    },
    onGridNativeClick(evt) {
      if (this.isCellButtonClick(evt)) {
        this.$emit('cell-link-click');
      }
    }
  }
};
