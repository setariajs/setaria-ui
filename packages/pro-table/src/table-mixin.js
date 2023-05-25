import _ from 'lodash';
import { EDIT_TYPE, ORIGIN_UI_OPTION, JSON_UI_SCHEMA } from 'setaria-ui/src/constants/index';
import { initialSetariaSchema } from 'setaria-ui/src/utils/schema';
import { arrayFindIndex, callbackExec } from 'setaria-ui/src/utils/util';
import XEUtils from 'xe-utils';
import Locale from 'setaria-ui/src/mixins/locale';
import { defaultControlColumnConfig } from './table-props';
import { convertSchemaToColumns } from './util';
// import { t as localeT } from 'setaria-ui/src/locale';
import merge from 'setaria-ui/src/utils/merge';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];
const MAX_EXPORT_DATA_LENGTH = 10000;
const visibleStorageKey = 'VXE_TABLE_CUSTOM_COLUMN_VISIBLE';
const dragSortStorageKey = 'VXE_TABLE_CUSTOM_COLUMN_DRAG_SORT';

function getCustomStorageMap(key) {
  // const version = GlobalConfig.version
  const rest = XEUtils.toStringJSON(localStorage.getItem(key));
  return rest;
  // return rest && rest._v === version ? rest : { _v: version }
}

function saveCustomDragSort(tableId, list) {
  if (tableId) {
    const columnDragSortStorageMap = getCustomStorageMap(dragSortStorageKey);
    columnDragSortStorageMap[tableId] = list.join(',');
    localStorage.setItem(dragSortStorageKey, XEUtils.toJSONString(columnDragSortStorageMap));
  }
}

function saveCustomVisible(tableId, collectColumn) {
  // const { id, collectColumn, customConfig, customOpts } = this
  // const { checkMethod, storage } = customOpts
  // const isAllStorage = customOpts.storage === true
  // const isVisible = isAllStorage || (storage && storage.visible)
  if (tableId) {
    const columnVisibleStorageMap = getCustomStorageMap(visibleStorageKey);
    const colHides = [];
    const colShows = [];
    XEUtils.eachTree(collectColumn, column => {
      // if (!checkMethod || checkMethod({ column })) {

      if (!column.visible) {
        colHides.push(column.field);
      }
      // else if (column.visible && !column.defaultVisible) {
      //   const colKey = column.getKey()
      //   if (colKey) {
      //     colShows.push(colKey)
      //   }
      // }
      // }
    });
    // if (!targetTableColumn.visible) {
    //   colHides.push(targetTableColumn.field);
    // } else {
    //   // 勾选上的逻辑：现在操作的这条数据需要在隐藏列表中移除
    //   const index = colHides.findIndex(field=>field === targetTableColumn.field);
    //   if (index !== -1) {
    //     colHides.splice(index, 1);
    //   }
    // }
    columnVisibleStorageMap[tableId] = [_.uniq(colHides).join(',')].concat(colShows.length ? [colShows.join(',')] : []).join('|') || undefined;
    localStorage.setItem(visibleStorageKey, XEUtils.toJSONString(columnVisibleStorageMap));
  }
}

export default {
  mixins: [Locale],
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
      innerPageSizes: DEFAULT_PAGE_SIZES,
      /* 分页有关属性 END */
      cloneVxeTableColumnArray: [],
      columnSettingKeys: [],
      // columnSettingCheckedKeys: [],
      columnSettingDefaultCheckedKeys: [],
      columnSettingSortKeys: [], // 表格开启可拖拽之后，存放顺序的拖拽内容
      isParticalColumnShow: false,
      isAllColumnShow: true,
      innerSchema: null,
      editingRow: null,
      isFirstSetColumnSettingDefaultCheckedKeys: false
      // columnVisibleChangeTimestamp: null // 用户在改变当前页面是否隐藏时的时间戳用于刷新底层computed
    };
  },
  watch: {
    schema: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initInnerSchema();
        // this.innerSchema = initialSetariaSchema(val);
      }
    },
    columnSettingSortKeys: {
      immediate: true,
      deep: true,
      handler(val) {
        this.initInnerSchema();
        // this.innerSchema = initialSetariaSchema(val);
      }
    },
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
    },
    innerDataList() {
      this.setSortIconActive();
    }
  },
  computed: {
    COLUMN_CONTROL_TITLE() {
      return this.t('el.protable.operation');
    },
    MODIFY_BUTTON() {
      return {
        key: 'ept-modify',
        label: this.t('el.protable.update')
      };
    },
    DELETE_BUTTON() {
      return {
        key: 'ept-delete',
        label: this.t('el.protable.delete')
      };
    },
    ROW_MANUAL_SAVE_BUTTON() {
      return {
        key: 'ept-row-manual-save',
        label: this.t('el.protable.save')
      };
    },
    ROW_MANUAL_CANCEL_BUTTON() {
      return {
        key: 'ept-row-manual-cancel',
        label: this.t('el.protable.cancel')
      };
    },
    innerUiSchema() {
      return this.uiSchema || {};
    },
    innerUiSchemaForDialogJsonForm() {
      const uiSchema = _.cloneDeep(this.uiSchema || {});
      Object.keys(uiSchema).forEach(key=>{
        const uiItem = uiSchema[key];
        if (uiItem[JSON_UI_SCHEMA.UI_FORM_ITEM_HIDDEN] === true) {
          uiItem[JSON_UI_SCHEMA.UI_HIDDEN] = true;
        } else if (typeof uiItem[JSON_UI_SCHEMA.UI_HIDDEN] === 'boolean') {
          // 短路
        } else {
          uiItem[JSON_UI_SCHEMA.UI_HIDDEN] = false;

        }

      });
      return uiSchema;
    },
    innerControlColumnConfig() {
      const { controlColumnConfig } = this;
      const ret = _.assign({}, defaultControlColumnConfig, controlColumnConfig || {});
      if (_.isEmpty(ret.label)) {
        ret.label = this.t('el.protable.operation');
      }
      if (_.isEmpty(ret.width)) {
        ret.width = this.controlColumnWidth;
      }
      if (_.isEmpty(ret.align)) {
        ret.align = 'center';
      }

      return ret;
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
        innerSchema,
        treeNode,
        uiSchema = {},
        // columnVisibleChangeTimestamp,
        $scopedSlots
      } = this;
      const ret = convertSchemaToColumns(
        innerSchema,
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
      if (this.tableId) {
        // 这个属性 会在用户设置完可见字段之后赋值，用于刷新响应内容
        // 方法名为：onColumnSettingTreeNodeCheck
        // columnVisibleChangeTimestamp;
        const columnVisibleStorage = getCustomStorageMap(visibleStorageKey)[this.tableId];

        if (columnVisibleStorage) {
          // vxetable底层获取数据
          const colVisibles = columnVisibleStorage.split('|');
          let colHides = colVisibles[0] ? colVisibles[0].split(',') : [];
          let colShows = colVisibles[1] ? colVisibles[1].split(',') : [];

          // 需要再次merge现有的显示和隐藏逻辑

          // Object.keys(uiSchema).forEach(key=>{
          //   if (
          //     _.get(uiSchema, `${key}.${JSON_UI_SCHEMA.UI_OPTIONS}.visible`) === true ||
          //     _.get(uiSchema, `${key}.${JSON_UI_SCHEMA.UI_FORM_ITEM_HIDDEN}`) === true
          //   ) {
          //     colShows.push(key);
          //   }

          //   if (
          //     _.get(uiSchema, `${key}.${JSON_UI_SCHEMA.UI_OPTIONS}.visible`) === false ||
          //     _.get(uiSchema, `${key}.${JSON_UI_SCHEMA.UI_FORM_ITEM_HIDDEN}`) === false
          //   ) {
          //     colHides.push(key);
          //   }

          // });

          // colShows = _.uniq(colShows);
          // colHides = _.uniq(colHides);

          ret.forEach(item=>{
            if (colHides.find(field=>item.field === field)) {
              item.visible = false;
            }
            if (colShows.find(field=>item.field === field)) {
              item.visible = true;
            }
          });
        }
      }
      // colHides.forEach(field => {
      //     if (customMap[field]) {
      //       customMap[field].visible = false;
      //     } else {
      //       customMap[field] = { field, visible: false };
      //     }
      // });
      //   // colShows.forEach(field => {
      //   //   if (customMap[field]) {
      //   //     customMap[field].visible = true
      //   //   } else {
      //   //     customMap[field] = { field, visible: true }
      //   //   }
      //   // })
      // }

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
    },
    pagerScopedSlots() {
      const ret = {};
      if (this.$slots.pagerLeft) {
        ret.left = () => (this.$slots.pagerLeft);
      }
      if (this.$slots.pagerRight) {
        ret.right = () => (this.$slots.pagerRight);
      }
      return ret;
    }
  },
  created() {
    const { innerSortConfig } = this;
    const defaultSort = _.get(innerSortConfig, 'defaultSort');
    if (!_.isEmpty(defaultSort)) {
      const { field, order } = defaultSort;
      this.sortList.push({
        property: field,
        field,
        order
      });
    }
    this.initDragSortStorage();

  },
  methods: {
    // 修复开启排序时，用户点击排序UI没响应对应UI的问题
    setSortIconActive() {
      this.$nextTick(()=>{
        // 当有排序项时，且是后端排序时才处理
        if (this.sortList && this.sortList.length && this.innerSortConfig.remote) {
          const xTable = this.getTableRef();
          const domList = Array.from(xTable.$el.querySelectorAll('.vxe-header--row .is--sortable:not(.fixed--hidden)'));
          // 先移除之前设置激活状态的
          Array.from(xTable.$el.querySelectorAll('.vxe-header--row .is--sortable:not(.fixed--hidden) .sort--active')).forEach(domItem=>{
            domItem.classList.remove('sort--active');
          });

          this.sortList.forEach(sortItem=>{

            const findObj = this.vxeTableColumnArray.find(sourceItem =>{
              return sourceItem.field === sortItem.field;
            });

            if (findObj && findObj.title) {
              domList.forEach(domItem=>{
                const titleDom = domItem.querySelector('.vxe-cell--title');

                if (titleDom && titleDom.innerHTML === findObj.title) {

                  const iconDom = domItem.querySelector(`.vxe-sort--${sortItem.order}-btn`);
                  if (iconDom) {
                    this.$nextTick(()=>{
                      iconDom.classList.add('sort--active');
                    });
                  }

                }
              });
            }

          });
        }
      });
    },

    // 初始化获取表格拖拽排序内容
    initDragSortStorage() {
      if (this.tableId) {

        const sortKeys = getCustomStorageMap(dragSortStorageKey)[this.tableId];
        if (sortKeys) {
          this.columnSettingSortKeys = sortKeys.split(',');
        }

      }

    },
    initInnerSchema() {
      let innerSchema = initialSetariaSchema(this.schema);
      // 排序逻辑
      if (this.columnSettingSortKeys.length) {
        const schema = {
          properties: {},
          required: innerSchema.required
        };
        this.columnSettingSortKeys.forEach(key=>{
          schema.properties[key] = innerSchema.properties[key];
        });
        innerSchema = schema;
      }

      this.innerSchema = innerSchema;
    },
    // 获取当前表格是否在行上编辑模式
    getIsEditOnRow() {
      const {
        isEditOnRow,
        editingRow
      } = this;
      if (isEditOnRow && editingRow) {
        return true;
      }
      return false;
    },
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
        this.emitSelectionChange([], {});
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
      const { sortMethod, isTree, innerSchema } = this;
      // 自定义排序函数的场合
      if (typeof sortMethod === 'function') {
        return sortMethod(data, fieldConfs, innerSchema);
      }
      const confs = [];
      // 转换函数
      const orderFunction = XEUtils.orderBy;
      fieldConfs.forEach((item) => {
        const { property, order } = item;
        const key = property;
        let orderKey = key;
        const schemaProperty = innerSchema.properties[key];
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
      const getSelectionColumnTitle = (cbConfig, rConfig, st) => {
        if (st === 'checkbox') {
          return _.get(cbConfig, 'label', '');
        }
        return _.get(rConfig, 'label', '');
      };
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
          title: getSelectionColumnTitle(
            checkboxConfig,
            radioConfig,
            selectionType
          ),
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
    isActiveByRow(row) {
      if (this.editingRow === null) {
        return false;
      }
      if (this.editingRow !== row) {
        return false;
      }
      return this.getTableActionRef().isActiveByRow(row);
    },
    getDefaultControlColumn() {
      const {
        innerControlColumnConfig,
        rowButtons,
        labelMode,
        onCustomButtonClick,
        canUpdate,
        canDelete,
        canDeleteRow,
        canUpdateRow,
        innerEditConfig,
        isActiveByRow,
        editingRow,
        forceEditOnRow,
        getIsEditOnRow,
        t,
        $scopedSlots,
        MODIFY_BUTTON,
        DELETE_BUTTON,
        ROW_MANUAL_CANCEL_BUTTON,
        ROW_MANUAL_SAVE_BUTTON
      } = this;
      // label模式时，直接隐藏操作列
      if (!this.showControlColumn) {
        return;
      }
      return {
        title: innerControlColumnConfig.label,
        fixed: 'right',
        align: innerControlColumnConfig.align,
        width: innerControlColumnConfig.width,
        className: 'control-column',
        slots: {
          default(scope) {
            const controlColumnDefaultSlot = [];
            const maxDisplayCount = innerControlColumnConfig.maxDisplayCount ? innerControlColumnConfig.maxDisplayCount + 1 : innerControlColumnConfig.maxDisplayCount;

            if ($scopedSlots.controlColumn) {
              controlColumnDefaultSlot.push($scopedSlots.controlColumn(scope));
              return controlColumnDefaultSlot;
            }
            let rowButtonList = [];
            // 添加自定义按钮的前提是必须为非行内编辑激活状态
            if (typeof rowButtons === 'function' && !getIsEditOnRow()) {
              rowButtonList = rowButtons(scope) || [];
            }
            if ($scopedSlots.rowButtons && !getIsEditOnRow()) {
              rowButtonList.push({render: (scope) => {
                return (
                  $scopedSlots.rowButtons(scope)
                );
              }});
            }

            if (!labelMode) {
              // 添加删除按钮
              // 当前编辑状态为激活状态时，需要隐藏删除按钮
              // 以行维度控制是否可以显示删除按钮
              if (canDelete && !isActiveByRow(scope.row)) {
                const deleteButtonRender = () => {
                  if ($scopedSlots.deleteData) {
                    DELETE_BUTTON.render = (scope) => {
                      scope.$tableDataEditing = (editingRow !== null);
                      const handleClick = (evt) => {
                        if (scope.$tableDataEditing) {
                          evt.preventDefault();
                          evt.stopPropagation();
                          return () => {};
                        }
                        return onCustomButtonClick(DELETE_BUTTON.key, scope)(evt);
                      };
                      return (
                        <span class="pro-table__control_column_button" on-click={handleClick}>
                          { $scopedSlots.deleteData(scope) }
                        </span>
                      );
                    };
                  }
                  DELETE_BUTTON.disabled = (editingRow !== null);
                  // 删除按钮移动到行尾
                  rowButtonList.push(DELETE_BUTTON);
                };
                if (canDeleteRow) {
                  if (canDeleteRow(scope)) {
                    deleteButtonRender(scope);
                  }
                } else {
                  deleteButtonRender(scope);
                }
              }
              if ((forceEditOnRow !== true) || (forceEditOnRow && innerEditConfig.trigger === 'manual')) {
                if (isActiveByRow(scope.row)) {
                  if ($scopedSlots.cancelData) {
                    ROW_MANUAL_CANCEL_BUTTON.render = (scope) => {
                      return (
                        <span
                          class="pro-table__control_column_button"
                          on-click={onCustomButtonClick(ROW_MANUAL_CANCEL_BUTTON.key, scope)}>
                          { $scopedSlots.cancelData(scope) }
                        </span>
                      );
                    };
                  }
                  rowButtonList.unshift(ROW_MANUAL_CANCEL_BUTTON);
                  if ($scopedSlots.saveData) {
                    ROW_MANUAL_SAVE_BUTTON.render = (scope) => {
                      return (
                        <span class="pro-table__control_column_button" on-click={onCustomButtonClick(ROW_MANUAL_SAVE_BUTTON.key, scope)}>
                          { $scopedSlots.saveData(scope) }
                        </span>
                      );
                    };
                  }
                  rowButtonList.unshift(ROW_MANUAL_SAVE_BUTTON);
                // 以行维度控制是否可以显示修改按钮
                } else if (canUpdate) {
                  const modifyButtonRender = () => {
                    if ($scopedSlots.modifyData) {
                      scope.$tableDataEditing = (editingRow !== null);
                      const handleClick = (evt) => {
                        if (scope.$tableDataEditing) {
                          evt.preventDefault();
                          evt.stopPropagation();
                          return () => {};
                        }
                        return onCustomButtonClick(MODIFY_BUTTON.key, scope)(evt);
                      };
                      MODIFY_BUTTON.render = (scope) => {
                        return (
                          <span class="pro-table__control_column_button" on-click={handleClick}>
                            { $scopedSlots.modifyData(scope, editingRow) }
                          </span>
                        );
                      };
                    }
                    MODIFY_BUTTON.disabled = (editingRow !== null);
                    rowButtonList.unshift(MODIFY_BUTTON);
                  };
                  if (canUpdateRow) {
                    if (canUpdateRow(scope)) {
                      modifyButtonRender();
                    }
                  } else {
                    modifyButtonRender();
                  }
                }
              }
            }
            if (!_.isEmpty(rowButtonList)) {
              if (rowButtonList.length <= (maxDisplayCount) ||
                  !innerControlColumnConfig.collapseButton) {
                rowButtonList.forEach(({ key, label, render, disabled }) => {
                  let ret = {};
                  const classList = [];
                  classList.push('pro-table__control_column_button');
                  if (render) {
                    ret = render(scope);
                  } else if (label && label.indexOf('el-') === 0) {
                    classList.push('pro-table__control_column_icon_button');
                    classList.push(label);
                    ret = (
                      <i class={classList} on-click={onCustomButtonClick(key, scope)}></i>
                    );
                  } else {
                    ret = (
                      <el-button
                        type="text"
                        class={classList}
                        disabled={disabled}
                        on-click={onCustomButtonClick(key, scope)}
                      >
                        {label}
                      </el-button>
                    );
                  }
                  controlColumnDefaultSlot.push(ret);
                });
              } else {
                let i;
                for (i = 0; i < (maxDisplayCount - 1); i += 1) {
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
                const onCommand = (key)=>{
                  onCustomButtonClick(key, scope)();
                };
                const moreElt = (
                  <el-dropdown style="margin-left: 15px" on-command={onCommand}>
                    <el-button type="text">
                      {t('el.protable.more')}<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      {rowButtonList.map(({ key, label }, index) => {
                        if (index >= i) {
                          return (
                            <el-dropdown-item
                              command={key}
                            >
                              <el-button
                                type="text"
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
      this.emitSelectionChange(selection, data);
    },
    reloadColumn() {
      const xTable = this.getTableRef();
      if (xTable) {
        xTable.reloadColumn(this.vxeTableColumnArray);
      }
    },
    initialRowData(data) {
      this.originFormData = data;
      this.currentFormData = _.cloneDeep(this.originFormData);
    },
    syncEditData() {
      _.assign(this.originFormData, this.currentFormData);
    },
    /** "批量删除"按钮点击事件 */
    onTableDeleteClick(val) {
      return new window.Promise((resolve, reject) => {
        const { save, t } = this;
        this.$confirm(t('el.protable.confirmDelete'), t('el.messagebox.title'), {
          type: 'warning'
        }).then(() => {
          callbackExec(save, val, EDIT_TYPE.DELETE)
            .then(() => {
              // 从表格中删除指定行
              this.tableDelete(val);
              resolve();
            });
        }).catch(() => {
          reject();
        });
      });
    },
    /**
     * 创建默认新增对象
     * 默认根据schema创建默认对象
     * 传入defaultEntity的场合，使用defaultEntity
     * 同时支持使用beforeAddRow前置钩子函数对新增的数据进行自定义，此函数接收参数为defaultEntity
     *
     * @returns Object
     */
    createDefaultRowData(appendItem = {}) {
      return new window.Promise((resolve) => {
        const { innerDefaultEntity, beforeAddRow } = this;
        let item = _.cloneDeep(innerDefaultEntity);
        const afterExec = (res) => {
          resolve(merge({}, res, appendItem));
        };
        if (typeof beforeAddRow === 'function') {
          const addRes = beforeAddRow(item);
          if (addRes && addRes.then) {
            addRes.then((res) => {
              afterExec(merge({}, res, appendItem));
            });
          } else {
            afterExec(merge({}, addRes, appendItem));
          }
          // item = beforeAddRow(item);
        } else {
          afterExec(merge({}, item, appendItem));
        }
        // return item;
      });
    },
    cancelRowEdit() {
      const tableRef = this.getTableActionRef();
      // 新增数据的场合
      if (this.controlStatus === EDIT_TYPE.ADD) {
        // 直接移除数据
        if (this.editingRow) {
          this.tableDelete([this.editingRow]);
        }
        tableRef.clearActived();
      } else {
        tableRef.clearActived()
          .then(() => {
            // !FIXME 此处会将数据还原至初始状态
            // tableRef.revertData(scope.row);
            _.assign(this.originFormData, this.currentFormData);
            this.originFormData = null;
          });
      }
      this.editingRow = null;
    },
    /**
     * 激活当前行
     */
    setActiveRow() {
      const tableRef = this.getTableActionRef();
      if (this.editingRow) {
        // !FIXME 后面的逻辑会触发表格列的dom刷新，需要判明原因
        setTimeout(() => {
          tableRef.setActiveRow(this.editingRow).then(() => {
            if (this.controlStatus === EDIT_TYPE.ADD && this.autoFocusOnAdd) {
              // !FIXME vxe-table的focus功能基于未知原因不可用，所以手动进行focus
              const dom = document.querySelector('.el-editable-pro-table .vxe-table--body-wrapper .vxe-table--body .vxe-body--row .el-input__inner');
              if (dom) {
                dom.focus();
              }
            }
          });
        }, 0);
      }
    },
    /**
     * 按照下标激活行
     */
    setActiveRowByIndex(index = -1, controlStatus = EDIT_TYPE.ADD) {
      const tableRef = this.getTableActionRef();
      if (index >= 0) {
        const list = this.isTree ? this.innerTreeDataList : this.innerDataList;
        const item = list[index];
        this.initialRowData(item);
        this.editingRow = item;
        this.controlStatus = controlStatus;
        this.setChangeMode(item, this.controlStatus);
        // !FIXME 后面的逻辑会触发表格列的dom刷新，需要判明原因
        setTimeout(() => {
          tableRef.setActiveRow(item).then(() => {
            // !FIXME vxe-table的focus功能基于未知原因不可用，所以手动进行focus
            const dom = document.querySelector('.el-editable-pro-table .vxe-table--body-wrapper .vxe-table--body .vxe-body--row .el-input__inner');
            if (dom) {
              dom.focus();
            }
          });
        }, 0);
      }
    },
    /**
     * 设置改变数据模式
     */
    setChangeMode(data, controlStatus) {
      const { changeModeField } = this;
      // 新增数据的场合
      if (controlStatus === EDIT_TYPE.ADD) {
        data[changeModeField] = controlStatus;
        // 修改数据的场合
      } else if (controlStatus === EDIT_TYPE.UPDATE) {
        // 新增数据的场合，无需修改状态
        if (data[changeModeField] !== EDIT_TYPE.ADD) {
          data[changeModeField] = controlStatus;
        }
        // 删除数据的场合
      } else {
        // 新增数据的场合无视，数据应直接删除
        if (data[changeModeField] !== EDIT_TYPE.ADD) {
          data[changeModeField] = controlStatus;
        }
      }
    },
    /**
     * 自定义操作按钮点击事件
     * @param {*} key
     * @param {*} scope
     * @returns
     */
    onCustomButtonClick(key, scope) {
      const {
        beforeUpdateRow,
        isEditOnRow,
        onTableDeleteClick,
        // t,
        MODIFY_BUTTON,
        DELETE_BUTTON,
        ROW_MANUAL_SAVE_BUTTON,
        ROW_MANUAL_CANCEL_BUTTON
      } = this;
      const tableRef = this.getTableActionRef();
      return (event) => {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        // 修改按钮点击事件处理
        if (key === MODIFY_BUTTON.key) {
          this.controlStatus = EDIT_TYPE.UPDATE;
          let currentRow = scope.row;
          // 对话框编辑数据的场合
          if (!isEditOnRow) {
            const exec = () => {
              this.isShowForm = true;
              this.$emit('row-button-click', key, scope);
            };
            if (typeof beforeUpdateRow === 'function') {

              const afterExec = (updatedRow) => {
                if (updatedRow) {
                  scope.row = _.assign(scope.row, updatedRow);
                  currentRow = _.assign(currentRow, updatedRow);
                }
                exec();
                this.initialRowData(currentRow);
              };

              const updateRes = beforeUpdateRow(scope);
              if (updateRes && updateRes.then) {
                updateRes.then((res) => {
                  afterExec(res);
                });
              } else {
                afterExec(updateRes);
              }
            } else {
              exec();
              this.initialRowData(currentRow);
            }
          } else {
            // // 行上编辑数据的场合
            // if (this.editingRow) {
            //   this.$message({
            //     message: t('el.protable.onlyEditOne'),
            //     type: 'error'
            //   });
            //   return;
            // }

            const afterExec = (updatedRow) => {
              if (updatedRow) {
                scope.row = _.assign(scope.row, updatedRow);
                currentRow = _.assign(currentRow, updatedRow);
              }

              this.initialRowData(currentRow);
              this.editingRow = scope.row;
              this.setActiveRow();
            };
            if (typeof beforeUpdateRow === 'function') {
              const updateRes = beforeUpdateRow(scope);

              if (updateRes && updateRes.then) {
                updateRes.then((res) => {
                  afterExec(res);
                });
              } else {
                afterExec(updateRes);
              }
            } else {
              afterExec();
            }
          }
          // 删除按钮点击事件处理
        } else if (key === DELETE_BUTTON.key) {
          this.controlStatus = EDIT_TYPE.DELETE;
          onTableDeleteClick([scope.row]).then(() => {
            this.$emit('row-button-click', key, scope);
          });
          // 保存按钮点击事件
        } else if (key === ROW_MANUAL_SAVE_BUTTON.key) {
          tableRef.validate(this.editingRow)
            .then((isNoValid) => {
              if (!isNoValid) {
                const afterExec = () => {
                  tableRef.clearActived().then(() => {
                    this.currentFormData = null;
                    this.editingRow = null;
                    this.setChangeMode(scope.row, this.controlStatus);
                    this.$emit('row-button-click', key, scope);
                  });
                };
                const fun = this.save(scope.row, this.controlStatus, scope);
                if (typeof this.save === 'function' && fun.then) {
                  fun.then(() => {
                    afterExec();
                  });
                } else {
                  afterExec();
                }
              }
            })
            .catch(() => {
              this.$emit('row-button-click', key, scope);
            });
          // 取消按钮点击事件处理
        } else if (key === ROW_MANUAL_CANCEL_BUTTON.key) {
          this.cancelRowEdit();
          this.$emit('row-button-click', key, scope);
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
          this.emitSelectionChange([val.row], val.row);
        }
      } else {
        this.emitSelectionChange([val.row], val.row);
      }
    },
    /** CheckBox 选中事件 */
    onTableCheckboxChange(val) {
      // !FIXME vxe-table bug - 不存在checkbox多选列的情况下，仍然触发了checkbox-change事件
      if (this.isMultipleSelect) {
        this.emitSelectionChange(val.records, val.row);
      }
    },
    // 所有的都被check
    onTableCheckboxAll({ records }) {
      this.emitSelectionChange(records);
      this.$emit('select-all', records);
    },
    emitSelectionChange(val, currentRow = {}) {
      let selectionArray = val;
      if (this.isReserve && this.isMultipleSelect) {
        const reserveArray = this.getTableActionRef().getCheckboxReserveRecords();
        selectionArray = selectionArray.concat(reserveArray);
      }
      this.innerSelection = selectionArray;
      this.$emit('selection-change', selectionArray, currentRow);
    },
    onCellDblClick(val) {
      this.$emit('cell-dblclick', val);
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
                this.getTableActionRef().getCheckboxRecords(true),
                val.row
              );
            }
          });
        }
      }
    },
    onMenuClick(val) {
      this.$emit('menu-click', val);
    },
    onCellMouseenter(val) {
      this.$emit('cell-mouseenter', val);
    },
    onCellMouseleave(val) {
      this.$emit('cell-mouseleave', val);
    },
    onCellMenu(val) {
      this.$emit('cell-menu', val);
    },
    onSortChange(val) {
      const { sortList } = val;
      this.sortList = sortList;
      this.$emit('sort-change', val);
    },
    onFilterChange(val) {
      this.$emit('filter-change', val);
    },
    onPageChange(val) {
      const { currentPage, pageSize } = val;
      this.innerCurrentPage = currentPage;
      this.innerPageSize = pageSize;
      if (!this.isReserve) {
        this.emitSelectionChange([]);
      }
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
      let checkedKeys = [];
      const plainColumnSettingKeyList = XEUtils.toTreeArray(this.columnSettingKeys);
      if (!val) {
        const remainCheckedKeyArray = [];
        this.columnSettingDefaultCheckedKeys.forEach((key) => {
          const index = plainColumnSettingKeyList.findIndex((item) => item.key === key);
          let disabled = false;
          if (index !== -1) {
            disabled = plainColumnSettingKeyList[index].disabled;
          }
          if (!disabled) {
            this.getTableActionRef().hideColumn(key);
          } else {
            remainCheckedKeyArray.push(key);
          }
        });
        this.columnSettingDefaultCheckedKeys = remainCheckedKeyArray;
        checkedKeys = remainCheckedKeyArray;
      } else {
        const keys = [];
        plainColumnSettingKeyList.forEach(({ key, disabled }) => {
          if (!disabled) {
            this.getTableActionRef().showColumn(key);
            keys.push(key);
          } else if (this.columnSettingDefaultCheckedKeys.findIndex((k) => k === key) !== -1) {
            keys.push(key);
          }
        });
        this.columnSettingDefaultCheckedKeys = keys;
        checkedKeys = keys;
      }
      // 更新列设置树的checkbox状态
      this.$refs.columnSettingTree.setCheckedKeys(
        this.columnSettingDefaultCheckedKeys,
        val
      );
      this.$nextTick(() => {
        this.$emit('column-visible-change', checkedKeys);
      });
    },
    /**
     * 点击checkbox时触发
     * @param {*} data 传递给 data 属性的数组中该节点所对应的对象
     * @param {*} option 树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
     */
    onColumnSettingCheck(data, option) {
      const { checkedKeys } = option;
      // data 选择的列节点状态 { isColumnVisible: false, key: 'price', title: '价格' }
      this.$emit('column-visible-change', checkedKeys, data, option);
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
        saveCustomVisible(this.tableId, this.getTableActionRef().getTableColumn().collectColumn);

        if (checked) {
          this.columnSettingDefaultCheckedKeys.push(data.key);
        } else {
          _.remove(this.columnSettingDefaultCheckedKeys, item=>{
            return item === data.key;
          });
        }
        // this.columnVisibleChangeTimestamp = Date.now();
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
      const columnFlatArray = XEUtils.toTreeArray(this.columnSettingKeys)
        .filter((item) => item.disabled === false);
      const settingColumnTotalCount = columnFlatArray.length;
      // const visibleColumnCount = _.filter(columnFlatArray,
      //   (item) => item.isColumnVisible).length;
      let visibleColumnCount = 0;
      this.columnSettingKeys.forEach((cs) => {
        if (this.getTableActionRef()) {
          const column = this.getTableActionRef().getColumnByField(cs.key);
          if (column && column.visible && cs.disabled === false) {
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
      this.columnSettingKeys = [];
      if (_.isEmpty(val)) {
        return;
      }
      const { defaultVisibleColumnKeys } = this;
      this.cloneVxeTableColumnArray = _.cloneDeep(val);
      // 多级表头场合，column为tree结构
      let settings = XEUtils.mapTree(val, (item) => {
        let title = item.title || '';
        if (!title && item.field) {
          console.error(`[${item.field}]字段 未找到！请查看对应Schema并联系后端补全`);
        }
        // 处理column title中的换行符
        if (title.indexOf('<br/>') !== -1) {
          title = title.replace('<br/>', '');
        }
        if (title.indexOf('\n') !== -1) {
          title = title.replace('\n', '');
        }
        let isColumnVisible = item.visible;
        // ui-schema内的定义最优先
        if (item[ORIGIN_UI_OPTION] && typeof item[ORIGIN_UI_OPTION].visible === 'boolean') {
          isColumnVisible = item[ORIGIN_UI_OPTION].visible;
        } else if (item.field && Array.isArray(defaultVisibleColumnKeys) && defaultVisibleColumnKeys.length > 0) {
          const index = arrayFindIndex(defaultVisibleColumnKeys, (key) => key === item.field);
          // 没在defaultVisibleColumnKeys里定义的column默认隐藏
          if (index === -1) {
            isColumnVisible = false;
            item.visible = false;
          }
        }
        let disabled = false;
        if (typeof item.disableColumnControl === 'boolean') {
          disabled = item.disableColumnControl;
        }
        const ret = {
          key: item.field,
          title,
          isColumnVisible,
          disabled
        };
        return ret;
      });
      settings = _.filter(
        settings,
        (item) => !_.isEmpty(item.key) && item.title !== this.COLUMN_CONTROL_TITLE
      );
      this.columnSettingKeys = settings;
      if (!this.isFirstSetColumnSettingDefaultCheckedKeys) {
        const visibleKeys = this.columnSettingKeys.filter(
          (item) => item.isColumnVisible
        );
        this.columnSettingDefaultCheckedKeys = visibleKeys.map(
          (item) => item.key
        );
        this.isFirstSetColumnSettingDefaultCheckedKeys = true;
      }
    },
    getColumnSettingRender() {
      const {
        columnSettingKeys,
        onColumnSettingTreeCheckboxChange,
        onColumnSettingCheck,
        onColumnSettingTreeNodeCheck,
        columnSettingDraggable,
        columnSettingDefaultCheckedKeys,
        isAllColumnShow,
        isParticalColumnShow,
        showColumnSetting,
        t,
        controlColumnTrigger
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
      // const onReset = () => {
      //   this.getTableActionRef()
      //     .resetColumn()
      //     .then(() => {

      //       // 更新列设置树的checkbox状态
      //       this.initialColumnSettingKeys(this.cloneVxeTableColumnArray.map(item=>{
      //         item.visible = true;
      //         return item;
      //       }));
      //       // 更新列设置树的checkbox状态
      //       this.$refs.columnSettingTree.setCheckedKeys(
      //         this.columnSettingDefaultCheckedKeys,
      //         true
      //       );
      //       this.$emit('column-visible-change', this.columnSettingDefaultCheckedKeys);
      //       this.$emit('column-visible-reset');
      //     });
      // };
      const onColumnSettingNodeDragEnd = (e, t, n, a)=>{
        const list = this.columnSettingKeys.map(item=>{
          return item.key;
        });
        this.columnSettingSortKeys = list;
        // 保存自定义的拖拽表格列信息
        saveCustomDragSort(this.tableId, list);

        this.$emit('column-setting-node-drag-end', list, e, t, n, a);
      };
      const columnSettingAllowDrop = (draggingNode, dropNode, type)=>{
        if (type === 'inner') {
          return false;
        }
        return true;

      };
      if (columnSettingKeys.length > 0) {
        this.refreshColumnSettingTopCheckboxStatus();
        return (
          <el-popover
            placement="bottom"
            class="column-setting"
            width="240"
            trigger={controlColumnTrigger}
            popper-class="pro-table__column-setting-tree"
          >
            <div class="column-setting__toolbar">
              <el-checkbox
                indeterminate={isParticalColumnShow}
                value={isAllColumnShow}
                on-change={onColumnSettingTreeCheckboxChange}
              >
                {t('el.protable.allColumns')}
              </el-checkbox>
              {/* <el-button
                type="text"
                class="column-setting__reset-button"
                on-click={onReset}
              >
                {t('el.proform.reset')}
              </el-button> */}
            </div>
            <el-tree
              data={columnSettingKeys}
              node-key="key"
              ref="columnSettingTree"
              props={{ label: 'title' }}
              icon-class={columnSettingDraggable ? 'el-icon-rank' : ' '}
              draggable={columnSettingDraggable}
              default-expand-all={true}
              expand-on-click-node={false}
              default-checked-keys={columnSettingDefaultCheckedKeys}
              allow-drop={columnSettingAllowDrop}
              show-checkbox
              check-on-click-node={!columnSettingDraggable}
              on-check={onColumnSettingCheck}
              on-check-change={onColumnSettingTreeNodeCheck}
              on-node-drag-end={onColumnSettingNodeDragEnd}
              render-content={renderContent}
            />
            <el-button icon="el-icon-setting" type="text" slot="reference">
              {t('el.protable.settingColumns')}
            </el-button>
          </el-popover>
        );
      }
      return null;
    },
    exportData(option) {
      const { getTableActionRef, t, COLUMN_CONTROL_TITLE } = this;
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
        sheetName: t('el.protable.sheetName'),
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
    setFullCheckboxRow(val = true) {
      const {
        data,
        getTableActionRef,
        isMultipleSelect
      } = this;
      if (!isMultipleSelect) {
        return;
      }
      let tableData = data;
      // if (typeof tableListTransform === 'function') {
      //   tableData = tableListTransform(data);
      // }
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
        // 用于单元格内按钮点击后，同时触发行选中的问题排查
        this.$emit('cell-link-click', evt);
      }
    }
  }
};
