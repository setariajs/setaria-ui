import _ from 'lodash';
import Vue from 'vue';
import { COMMON_TABLE_PROPS } from './table-props';
import tableMixin from './table-mixin';

export default Vue.extend({
  name: 'ElProTable',
  mixins: [tableMixin],
  props: {
    ...COMMON_TABLE_PROPS
  },
  data() {
    return {};
  },
  computed: {
    innerTableColumns() {
      const { vxeColumns } = this;
      const ret = [];
      return ret.concat(vxeColumns);
    },
    innerDataList() {
      const {
        autoPagination,
        showPagination,
        data,
        innerCurrentPage,
        innerPageSize,
        innerSortList,
        isSortAllData,
        sortData,
        total
      } = this;
      let ret = data;
      // if (typeof tableListTransform === 'function') {
      //   ret = tableListTransform(data);
      // }
      // 前端排序逻辑
      if (isSortAllData && !_.isEmpty(innerSortList)) {
        ret = sortData(ret, innerSortList);
      }
      if (showPagination && autoPagination && !_.isEmpty(ret)) {
        // 设置数据总数量
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.innerTotal = ret.length;
        if (ret && ret.length && ret.length > 0) {
          let fromIndex = (innerCurrentPage - 1) * innerPageSize;
          if (fromIndex < 0) {
            fromIndex = 0;
          }
          let toIndex = innerCurrentPage * innerPageSize;
          if (toIndex > total) {
            toIndex = total + 1;
          }
          return ret.slice(fromIndex, toIndex);
        }
      }
      return ret;
    }
  },
  methods: {
    /**
     * 用于 type=checkbox，设置行为选中状态，第二个参数为选中与否
     * @public
     * @param {object | array} rows 欲更改选中状态的行数据对象
     * @param {*} checked 是否选中
     */
    setCheckboxRow(rows, checked) {
      this.getTableRef().setCheckboxRow(rows, checked);
    },
    recalculate(refull) {
      this.getTableRef().recalculate(refull);
    }
  },
  render() {
    const {
      $slots,
      $attrs,
      innerCurrentPage,
      isTree,
      innerDataList,
      innerPageSize,
      vxeTableColumnArray,
      innerSeqConfig,
      innerTotal,
      layouts,
      rowKey,
      height,
      maxHeight,
      innerMergeCells,
      innerCheckboxConfig,
      innerTreeConfig,
      innerRadioConfig,
      innerExpandConfig,
      innerSortConfig,
      innerExportConfig,
      innerPageSizes,
      onPageChange,
      onTableCheckboxAll,
      onTableCheckboxChange,
      onTableRadioChange,
      onCellClick,
      mergeFooterItems,
      footerMethod,
      showFooter,
      onCellMenu,
      onMenuClick,
      onSortChange,
      showPagination,
      getColumnSettingRender,
      rowClassName
    } = this;
    this.$nextTick(() => {
      // 表格状态发生变化时，临时合并失效，需要重新合并
      this.refreshTempState();
    });
    return (
      <div class="el-table-container">
        <div class="el-pro-table__toolbar">
          <div>{$slots.batchControl}</div>
          <div class="toolbar__table-common">{getColumnSettingRender()}</div>
        </div>
        <div class="el-pro-table__main">
          <vxe-grid
            ref="xTable"
            class="el-pro-table"
            {...{ attrs: $attrs }}
            size="mini"
            scroll-x={{ gt: 15 }}
            scroll-y={{ gt: 20 }}
            border
            resizable
            auto-resize
            highlight-hover-row
            highlight-current-row
            data={innerDataList}
            columns={vxeTableColumnArray}
            seq-config={innerSeqConfig}
            height={height}
            max-height={maxHeight}
            row-id={rowKey}
            merge-cells={innerMergeCells}
            edit-config={{}}
            checkbox-config={innerCheckboxConfig}
            radio-config={innerRadioConfig}
            expand-config={innerExpandConfig}
            tree-config={innerTreeConfig}
            sort-config={innerSortConfig}
            export-config={innerExportConfig}
            on-checkbox-change={onTableCheckboxChange}
            on-checkbox-all={onTableCheckboxAll}
            on-radio-change={onTableRadioChange}
            on-cell-click={onCellClick}
            on-cell-menu={onCellMenu}
            on-menu-click={onMenuClick}
            on-sort-change={onSortChange}
            show-footer={showFooter}
            footer-method={footerMethod}
            merge-footer-items={mergeFooterItems}
            row-class-name={rowClassName}
          />
        </div>
        {showPagination && !isTree ? (
          <vxe-pager
            background
            size="small"
            current-page={innerCurrentPage}
            layouts={layouts}
            page-size={innerPageSize}
            total={innerTotal}
            page-sizes={innerPageSizes}
            on-page-change={onPageChange}
          />
        ) : null}
      </div>
    );
  }
});
