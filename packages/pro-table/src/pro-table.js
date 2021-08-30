import ElButton from 'setaria-ui/packages/button';
import ElCard from 'setaria-ui/packages/card';
import ElCheckbox from 'setaria-ui/packages/checkbox';
import ElPagination from 'setaria-ui/packages/pagination';
import ElPopover from 'setaria-ui/packages/popover';
import ElTable from 'setaria-ui/packages/table';
import ElTableColumn from 'setaria-ui/packages/table-column';
import ElTooltip from 'setaria-ui/packages/tooltip';
import ElTree from 'setaria-ui/packages/tree';
import { arrayFind, getValueByPath, isEmpty } from 'setaria-ui/src/utils/util';

const PRO_TABLE_INDEX = 'proTableIndex';
const UI_OPTIONS = 'ui:options';
const UI_RENDER = 'ui:render';

// 重构pro-table

/**
 * 根据oneOf或anyOf结构取得值对应的label
 */
function createFormatter(schema) {
  const { oneOf, anyOf } = schema;
  let dictList = null;
  if (!isEmpty(oneOf)) {
    dictList = oneOf;
  } else {
    dictList = anyOf;
  }
  if (!isEmpty(dictList)) {
    return function(row, column, cellValue) {
      const dict = arrayFind(dictList, dict => dict.const === cellValue);
      return dict ? dict.title : cellValue;
    };
  }
}

/**
 * 动态表格，可根据传入的columns设置进行表格列内容的渲染
 */
export default {
  name: 'ElProTable',
  components: {
    ElButton,
    ElCard,
    ElCheckbox,
    ElPagination,
    ElPopover,
    ElTable,
    ElTableColumn,
    ElTooltip,
    ElTree
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    uiSchema: {
      type: Object,
      default() {
        return {};
      }
    },
    collapse: Boolean,
    // 查询结果数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否显示pager组件
    isShowPager: {
      type: Boolean,
      default: true
    },
    height: {
      type: String
    },
    maxHeight: {
      type: String
    },
    // 查询结果总数量
    total: null,
    // 当前显示页号
    pageNum: {
      type: Number,
      default: 1
    },
    // 当前每页显示数据数量
    pageSize: {
      type: Number,
      default: 10
    },
    // rowKey，用于展开和树形结构显示
    rowKey: null,
    // 是否开启多选，与type="selection"相同
    multipleSelection: Boolean,
    rowClassName: null,
    // 获取表格数据
    request: Function,
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    indexTitle: {
      type: String,
      default: '序号'
    },
    headerTitle: {
      type: String,
      default: '查询结果'
    },
    defaultSort: Object,
    pagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageSizes: [10, 20, 50, 100],
      innerData: [],
      innerTotal: 0,
      current: 0,
      currentPageSize: 0,
      isLoading: false,
      columnSettingKeys: [],
      columnSettingCheckedKeys: [],
      dragNodeChecked: null
    };
  },
  watch: {
    schema: {
      immediate: true,
      deep: true,
      handler(val) {
        if (isEmpty(val)) {
          return;
        }
        const { columnSettingKeys, indexTitle, showIndex } = this;
        if (columnSettingKeys.length === 0) {
          this.columnSettingKeys = Object.keys(val.properties).map((key) => {
            return {
              key,
              title: val.properties[key].title
            };
          });
          if (showIndex && this.columnSettingKeys.length > 0) {
            this.columnSettingKeys.unshift({
              key: PRO_TABLE_INDEX,
              title: indexTitle
            });
          }
        }
        if (this.columnSettingCheckedKeys.length === 0) {
          // 初始化，默认显示全部列
          this.columnSettingCheckedKeys = this.getAllColumnKeys();
        }
        // !FIXME 如果不定义$nextTick，在某些情况下列设置的checkbox状态没有正常渲染
        this.$nextTick(() => {
          this.reactColumnSettingTree();
        });
      }
    },
    total: {
      immediate: true,
      handler(val) {
        this.innerTotal = val;
      }
    },
    pageNum: {
      immediate: true,
      handler(val) {
        this.current = val;
      }
    },
    pageSize: {
      immediate: true,
      handler(val) {
        this.currentPageSize = val;
      }
    },
    current(val) {
      this.$emit('update:pageNum', val);
    },
    currentPageSize(val) {
      this.$emit('update:pageSize', val);
    },
    innerData(val) {
      this.$emit('update:tableData', val);
    },
    innerTotal(val) {
      this.$emit('update:total', val);
    }
  },
  computed: {
    columns() {
      const ret = [];
      const { indexTitle, multipleSelection, schema, uiSchema } = this;
      const { properties } = schema;
      // rowKey存在的场合，开启multiple支持
      if (multipleSelection) {
        ret.push({
          title: '',
          width: '45px',
          type: 'selection'
        });
      }
      this.columnSettingCheckedKeys.forEach((key) => {
        const property = properties[key];
        const render = getValueByPath(uiSchema, `${key}.${UI_RENDER}`);
        const options = getValueByPath(uiSchema, `${key}.${UI_OPTIONS}`) || {};
        // formatter
        let { formatter, sortable } = options;
        if (typeof formatter !== 'function' && property) {
          // 根据oneOf或anyOf结构取得值对应的label
          formatter = createFormatter(property);
        }
        if (arrayFind(this.columnSettingCheckedKeys, checkedKey => key === checkedKey)) {
          let title = property ? property.title : null;
          if (key === PRO_TABLE_INDEX) {
            title = indexTitle;
            options.width = '55px';
          }
          ret.push({
            title,
            ...options,
            key,
            formatter,
            render,
            sortable
          });
        }
      });
      return ret;
    },
    isAllColumnShow() {
      return this.columnSettingCheckedKeys.length === this.columnSettingKeys.length;
    },
    isNeedAutoPagination() {
      const { pagination, tableData } = this;
      // 判断是否进行前端分页
      return pagination && tableData && tableData.length > 0 && typeof request !== 'function';
    },
    currentPageData() {
      const { current, currentPageSize, tableData, total } = this;
      if (tableData && tableData.length && tableData.length > 0) {
        let fromIndex = (current - 1) * currentPageSize;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
        let toIndex = current * currentPageSize;
        if (toIndex > total) {
          toIndex = total + 1;
        }
        return tableData.slice(fromIndex, toIndex);
      }
      return tableData;
    }
  },
  created() {
    const { isNeedAutoPagination, tableData } = this;
    let targetInstance = window;
    if (window.top !== targetInstance) {
      targetInstance = window.top;
    }
    if (
      targetInstance.proTablePageSizes &&
      typeof targetInstance.proTablePageSizes === 'string'
    ) {
      this.pageSizes = targetInstance.proTablePageSizes.split(',');
    }
    // 判断是否进行前端分页
    if (isNeedAutoPagination) {
      this.total = tableData.length;
    }
  },
  mounted() {
    this.reactColumnSettingTree();
  },
  methods: {
    reactColumnSettingTree() {
      if (this.$refs.columnSettingTree) {
        // 默认显示全部列
        this.$refs.columnSettingTree.setCheckedKeys(this.columnSettingCheckedKeys);
      }
    },
    getAllColumnKeys() {
      return this.columnSettingKeys.map(item => item.key);
    },
    fetch() {
      const {
        current,
        currentPageSize,
        params,
        request
      } = this;
      if (typeof request === 'function') {
        const requestParams = {
          pageNum: current,
          pageSize: currentPageSize,
          ...params
        };
        this.isLoading = true;
        request(requestParams).then((res = {}) => {
          const { data, total } = res;
          this.innerData = data;
          this.innerTotal = total;
          this.isLoading = false;
        }).catch((error) => {
          this.isLoading = false;
          throw error;
        });
      }
    },
    toggleRowSelection(row, selected) {
      this.$refs.proTable.toggleRowSelection(row, selected);
    },
    clearSelection() {
      this.$refs.proTable.clearSelection();
    },
    /**
     * 当前页号变更事件处理
     * @event
     * @param {Number} val 变更后的页号
     */
    handleCurrentChange(val) {
      this.current = val;
      this.fetch();
      this.$emit('current-change', val);
    },
    /**
     * 当前表格数据显示数量变更事件处理
     * @event
     * @param {Number} val 变更后的表格数据显示数量
     */
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.fetch();
      this.$emit('size-change', val);
    },
    /**
     * 当某一行被点击时会触发该事件
     * @event
     * @param {Object} row
     * @param {Object} event
     * @param {Object} column
     */
    onRowClick(row, event, column) {
      this.$emit('row-click', row, event, column);
    },
    /**
     * 选择项发生变化时事件处理
     * @event
     * @param {Array} val 当前的选择项
     */
    handleSelectionChange(val) {
      this.$emit('selection-change', val);
    },
    /**
     * 渲染表格Column
     * @param {Object} props Column属性
     */
    renderColumn(h, props) {
      let ret = null;
      const { reserveelection, reserveSelection } = props;
      let columnReserveSelection = reserveelection;
      if (typeof columnReserveSelection !== 'boolean') {
        columnReserveSelection = reserveSelection;
      }
      if (props.type && props.type !== '') {
        ret = (
          <ElTableColumn
            type={props.type}
            label={props.label}
            index={props.index}
            fixed={props.fixed}
            width={props.width}
            min-width={props.minWidth}
            index={props.index}
            selectable={props.selectable}
            align={props.align}
            sortable={props.sortable}
            reserve-selection={columnReserveSelection}
          />
        );
      } else {
        let scopedSlots = null;
        if (this.$scopedSlots[props.key]) {
          scopedSlots = {
            default: (scope) => this.$scopedSlots[props.key](scope)
          };
        } else if (props.render === 'function') {
          scopedSlots = { default: (scope) => props.render(h, scope) };
        }
        const { renderHeader } = props;
        if (typeof renderHeader === 'function') {
          const header = (scope) => props.renderHeader(h, scope);
          if (scopedSlots === null) {
            scopedSlots = {
              header
            };
          } else {
            scopedSlots.header = header;
          }
        }
        ret = (
          <ElTableColumn
            label={props.title}
            fixed={props.fixed}
            prop={props.key}
            formatter={props.formatter}
            min-width={props.minWidth}
            width={props.width}
            align={props.align}
            sortable={props.sortable}
            scopedSlots={scopedSlots}
          />
        );
      }
      return ret;
    },
    getDefaultTableProperties() {
      const { $attrs } = this;
      return {
        'element-loading-text': '加载中',
        ...$attrs
      };
    },
    handleColumnSettingCheckboxChange(val) {
      if (!val) {
        this.columnSettingCheckedKeys = [];
      } else {
        this.columnSettingCheckedKeys = this.getAllColumnKeys();
      }
      this.getAllColumnKeys().forEach(key => this.$refs.columnSettingTree.setChecked(key, val));
    },
    handleColumnSettingDragStart(node) {
      const { checked } = node;
      this.dragNodeChecked = checked;
    },
    handleColumnSettingDragDrop(node, targetNode) {
      this.$nextTick(() => {
        // 解决拖拽后节点被选中状态丢失的问题
        this.$refs.columnSettingTree.setChecked(node.data, this.dragNodeChecked);
        this.columnSettingCheckedKeys = this.$refs.columnSettingTree.getCheckedKeys();
        this.dragNodeChecked = null;
      });
    },
    handleColumnSettingTreeNodeClick(data, node) {
      const { checked } = node;
      // 选中的场合，取消选中
      this.$refs.columnSettingTree.setChecked(data, !checked);
      this.columnSettingCheckedKeys = this.$refs.columnSettingTree.getCheckedKeys();
    },
    handleColumnSettingTreeNodeCheck(data, node) {
      const { checkedKeys } = node;
      this.columnSettingCheckedKeys = checkedKeys;
    },
    getColumnSettingRender() {
      const {
        columnSettingKeys,
        handleColumnSettingCheckboxChange,
        handleColumnSettingDragDrop,
        handleColumnSettingDragStart,
        handleColumnSettingTreeNodeCheck,
        handleColumnSettingTreeNodeClick,
        isAllColumnShow
      } = this;
      const indeterminate = !isAllColumnShow;
      const renderContent = (h, { node, data, store }) => {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      };
      if (columnSettingKeys.length > 0) {
        return (
          <ElPopover
            placement="bottom"
            class="column-setting"
            width="150"
            trigger="click"
            popper-class="pro-table__column-setting-tree">
            <div class="column-setting__toolbar">
              <ElCheckbox indeterminate={indeterminate} value={isAllColumnShow} on-change={handleColumnSettingCheckboxChange}>所有列</ElCheckbox>
              <ElButton type="text" class="column-setting__reset-button">重置</ElButton>
            </div>
            <ElTree data={columnSettingKeys}
              node-key="key"
              ref="columnSettingTree"
              icon-class="el-icon-rank"
              props={{ label: 'title' }}
              indent={0}
              default-expand-all={true}
              expand-on-click-node={false}
              show-checkbox
              draggable
              on-node-click={handleColumnSettingTreeNodeClick}
              on-check={handleColumnSettingTreeNodeCheck}
              on-node-drag-start={handleColumnSettingDragStart}
              on-node-drop={handleColumnSettingDragDrop}
              render-content={renderContent}>
            </ElTree>
            <ElTooltip content="列设置" placement="top" slot="reference">
              <i class="el-icon-setting"></i>
            </ElTooltip>
          </ElPopover>
        );
      }
    }
  },
  /**
   * Vue实例渲染函数，生成组件模版
   */
  render(h) {
    const {
      $listeners,
      $slots,
      columns,
      collapse,
      current,
      currentPageSize,
      currentPageData,
      pageSizes,
      handleCurrentChange,
      onRowClick,
      handleSelectionChange,
      handleSizeChange,
      renderColumn,
      isLoading,
      isNeedAutoPagination,
      innerData = [],
      innerTotal,
      isShowPager,
      height,
      maxHeight,
      rowKey,
      rowClassName,
      getDefaultTableProperties,
      getColumnSettingRender,
      headerTitle,
      showIndex,
      defaultSort
    } = this;
    const tableCurrentData = isNeedAutoPagination ? currentPageData : innerData;
    if (tableCurrentData && typeof tableCurrentData.length === 'number' && showIndex) {
      tableCurrentData.forEach((data, index) => {
        data[PRO_TABLE_INDEX] = (currentPageSize * (current - 1)) + index + 1;
      });
    }
    const tableAttrs = getDefaultTableProperties();
    const inheritProps = {
      attrs: tableAttrs,
      listeners: $listeners
    };
    const directives = [
      { name: 'loading', value: isLoading }
    ];
    const renderColumns = [];
    columns.forEach((column) => {
      renderColumns.push(renderColumn(h, column));
    });
    return (
      <ElCard class="el-pro-table" collapse={collapse}>
        <div slot="header" class="el-pro-table__header clearfix">
          <div class="header__title">{ headerTitle }</div>
          <div class="el-pro-table__toolbar clearfix">
            {$slots.toolbar}
            <div class="toolbar__extra__setting">
              {getColumnSettingRender()}
            </div>
          </div>
        </div>
        <div class="el-pro-table__batch-control">
          {$slots.batchControl}
        </div>
        <ElTable
          ref="proTable"
          class="el-pro-table__content"
          {...inheritProps}
          {...$listeners}
          {...{
            directives
          }}
          border
          data={tableCurrentData}
          loading={isLoading}
          height={height}
          max-height={maxHeight}
          on-row-click={onRowClick}
          on-selection-change={handleSelectionChange}
          row-key={rowKey}
          row-class-name={rowClassName}
          highlight-select-row={true}
          default-sort={defaultSort}
        >
          {$slots['batch-control'] ? (
            <template slot="control">{$slots['batch-control']}</template>
          ) : null}
          {renderColumns}
        </ElTable>
        {tableCurrentData.length > 0 && isShowPager ? (
          <div class="el-pro-table__pagination">
            <ElPagination
              total={innerTotal}
              current-page={current}
              page-size={currentPageSize}
              page-sizes={pageSizes}
              layout="total, sizes, prev, pager, next, jumper"
              on-current-change={handleCurrentChange}
              on-size-change={handleSizeChange}
            />
          </div>
        ) : null}
      </ElCard>
    );
  }
};
