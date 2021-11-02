/**
 * 列表组件通用的props
 */
export const COMMON_TABLE_PROPS = {
  // 数据
  data: null,
  schema: {
    type: Object,
    required: true
  },
  uiSchema: Object,
  // 行主键
  rowKey: String,
  height: {
    type: String,
    default: null
  },
  maxHeight: {
    type: String
    // default: '425px',
  },
  /**
   * 首页列表选择类型
   */
  selectionType: {
    type: String,
    required: false,
    default: null,
    validator(value) {
      return ['radio', 'checkbox', ''].indexOf(value) >= 0;
    }
  },
  multipleSelection: {
    type: Boolean,
    default: false
  },
  /**
   * Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
   */
  selectable: Function,
  /**
   * 获取行数据操作按钮
   */
  rowButtons: Function,
  /**
   * 校验规则
   */
  rules: {
    type: Object,
    required: false,
    default: () => ({})
  },
  /**
   * 标识上级节点的字段名
   */
  parentField: {
    type: String,
    required: false,
    default: null
  },
  // 列宽度
  columnWidth: String,
  // 前端分页
  autoPagination: {
    type: Boolean,
    required: false,
    default: true
  },
  // 是否所有列默认允许排序
  defaultAllColumnSort: {
    type: Boolean,
    default: false
  },
  // 是否保留CheckBox选中状态
  isReserve: {
    type: Boolean,
    required: false,
    default: false
  },
  mergeCells: Function,
  // 加载状态
  loading: Boolean,
  // 获取行数据快捷菜单按钮  menu-button-click
  menuConfig: Object,
  checkStrictly: {
    type: Boolean,
    required: false,
    default: false
  },
  mergeFooterItems: Array,
  footerMethod: Function,
  showFooter: Boolean,
  // 序号配置项
  seqConfig: Object,
  // 复选框配置项
  checkboxConfig: Object,
  // 单选框配置项
  radioConfig: Object,
  // 展开行配置项（不能用于虚拟滚动）
  expandConfig: Object,
  // 树形结构配置项
  treeConfig: {
    type: Object,
    default() {
      return {
        children: 'children'
      };
    }
  },
  // 排序配置项
  sortConfig: Object,
  // 导出配置项
  exportConfig: Object,
  // 数据代理配置项
  proxyConfig: Object,
  // 指定为树节点
  treeNode: String,
  // 是否使用虚拟树
  virtualTree: Boolean,
  // 全表排序自定义函数
  sortMethod: Function,
  // 是否显示分页
  showPagination: {
    type: Boolean,
    default: true
  },
  // 当前页号
  pageNum: Number,
  // 每页显示数据数量
  pageSize: Number,
  // 数据总数量
  total: Number,
  // 控制列宽度
  controlColumnWidth: {
    type: String,
    default: '160'
  },
  // 表格ID，主要用于对表格的配置进行缓存
  tableId: String,
  // 是否显示"全部展开"按钮，：is-tree="true"时生效，默认为true
  showExpandAllBtn: {
    type: Boolean,
    required: false,
    default: true
  },
  // 是否显示"全部收缩"按钮，：is-tree="true"时生效，默认为true
  showCollapseAllBtn: {
    type: Boolean,
    required: false,
    default: true
  },
  showColumnSetting: {
    type: Boolean,
    default: true
  },
  rowClassName: null,
  showControlColumn: {
    type: Boolean,
    default: true
  }
};

export const EDIT_TABLE_PROPS = {
  /**
   * "新增同级"按钮点击事件
   */
  onAddCurrentClick: {
    type: Function,
    required: false,
    default: null
  },
  /**
   * "新增子级"按钮点击事件
   */
  onAddChildClick: {
    type: Function,
    required: false,
    default: null
  },
  /**
   * "新增一行"按钮点击事件
   */
  onAddRowClick: {
    type: Function,
    required: false,
    default: null
  },
  /**
   * "批量删除"按钮点击事件
   */
  onDeleteClick: {
    type: Function,
    required: false,
    default: null
  },
  /**
   * 新增一行按钮点击时的回调函数，用于对新增数据进行默认值设定
   */
  beforeAddRow: Function,
  /**
   * 修改按钮点击时的回调函数，用于对修改数据进行处理
   */
  beforeUpdateRow: Function,
  /**
   * "新增同级"按钮点击前回调函数
   */
  beforeAddCurrent: {
    type: Function,
    required: false,
    default: null
  },
  /**
   * "新增子级"按钮点击前回调函数
   */
  beforeAddChild: {
    type: Function,
    required: false,
    default: null
  },
  /**
   * 是否强制在行内编辑
   */
  forceEditOnRow: {
    type: Boolean,
    required: false,
    default: null
  },
  /**
   * ChangeMode 字段名
   */
  changeModeField: {
    type: String,
    required: false,
    default: '_MODE'
  },
  /**
   * 与子节点关联的字段名，默认使用 rowKey的值
   */
  refField: {
    type: String,
    required: false,
    default: null
  },
  // 导入的Sheet名称
  importSheetName: String,
  // 导入后自定义数据处理
  afterImport: Function,
  // 可编辑配置项
  editConfig: Object,
  // 点击对话框的表单保存按钮后执行，可返回Promise或Boolean
  save: Function,
  // 编辑模式时，Dioalog组件的相关属性
  dialogAttrs: {
    type: Object,
    required: false,
    default: () => {}
  },
  // 编辑模式时，表格组件的相关属性
  formAttrs: {
    type: Object,
    required: false,
    default: () => {}
  },
  maxHeight: {
    type: String,
    default: '700'
  },
  defaultEntity: {
    type: Object,
    required: false,
    default: null
  },
  isShowDefaultBatchControl: {
    type: Boolean,
    required: false,
    default: true
  },
  canAdd: {
    type: Boolean,
    default: true
  },
  canAddChild: {
    type: Boolean,
    default: true
  },
  canUpdate: {
    type: Boolean,
    default: true
  },
  canDelete: {
    type: Boolean,
    default: true
  },
  pageSize: Number,
  pageSizes: Array,
  dataAddPosition: {
    type: String,
    default: 'end',
    validator(val) {
      return ['end', 'begin', null].indexOf(val) > -1;
    }
  },
  dialogFormDiscardChangeMessageSetting: {
    default() {
      return {
        message: '是否放弃对数据的更改?',
        confirmButtonText: '是',
        cancelButtonText: '否'
      };
    }
  }
};

export default {
  COMMON_TABLE_PROPS,
  EDIT_TABLE_PROPS
};
