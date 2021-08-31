class VxeColumn {
  constructor() {
    /**
     * 列ID
     */
    this.colId = null;
    /**
     * 渲染类型
     */
    this.type = null;
    /**
     * 列字段名
     */
    this.field = null;
    /**
     * 列标题
     */
    this.title = null;
    /**
     * 列宽度
     */
    this.width = null;
    /**
     * 列最小宽度，把剩余宽度按比例分配
     */
    this.minWidth = null;
    /**
     * 是否允许拖动列宽调整大小
     */
    this.resizable = null;
    /**
     * 将列固定在左侧或者右侧
     */
    this.fixed = null;
    /**
     * 列对其方式
     */
    this.align = null;
    /**
     * 表头对齐方式
     */
    this.headerAlign = null;
    /**
     * 表尾列的对齐方式
     */
    this.footerAlign = null;
    /**
     * 当内容过长时显示为省略号
     */
    this.showOverflow = null;
    /**
     * 当表头内容过长时显示为省略号
     */
    this.showHeaderOverflow = null;
    /**
     * 当表尾内容过长时显示为省略号
     */
    this.showFooterOverflow = null;
    /**
     * 给单元格附加 className
     */
    this.className = null;
    /**
     * 给表头单元格附加 className
     */
    this.headerClassName = null;
    /**
     * 给表尾单元格附加 className
     */
    this.footerClassName = null;
    /**
     * 格式化显示内容
     */
    this.formatter = null;
    /**
     * 是否允许排序
     */
    this.sortable = null;
    /**
     * 自定义排序的属性
     */
    this.sortBy = null;
    /**
     * 排序的字段类型，比如字符串转数值等
     */
    this.sortType = null;
    /**
     * 配置筛选条件数组
     */
    this.filters = null;
    /**
     * 筛选是否允许多选
     */
    this.filterMultiple = null;
    /**
     * 自定义筛选方法
     */
    this.filterMethod = null;
    /**
     * 筛选模板配置项
     */
    this.filterRender = null;
    /**
     * 指定为树节点
     */
    this.treeNode = null;
    /**
     * 是否可视
     */
    this.visible = true;
    /**
     * 自定义单元格数据导出方法
     */
    this.exportMethod = null;
    /**
     * 自定义表尾单元格数据导出方法
     */
    this.footerExportMethod = null;
    /**
     * 标题帮助图标配置项
     */
    this.titleHelp = null;
    /**
     * 单元格值类型
     */
    this.cellType = null;
    /**
     * 单元格渲染配置项
     */
    this.cellRender = null;
    /**
     * 单元格编辑渲染配置项
     */
    this.editRender = null;
    /**
     * 内容渲染配置项
     */
    this.contentRender = null;
    /**
     * 额外的参数
     */
    this.params = null;
    /**
     * 是否含有自定义插槽
     */
    this.hasCustomSlot = false;
    /**
     * 内部使用
     * 父节点Field
     */
    this.srParentField = null;
  }
}

export default VxeColumn;
