import ElCard from 'setaria-ui/packages/card/src/main';
import ElDialog from 'setaria-ui/packages/dialog/src/component';
import ElJsonForm from 'setaria-ui/packages/json-form/src/json-form';
import { getStyle } from 'setaria-ui/src/utils/dom';
import { arrayFind, isEmpty } from 'setaria-ui/src/utils/util';

const NON_INITIAL = 'nonInitial';
// const INITIALED = 'initialed';

/** 配置表单列变化的容器宽度断点 */
const BREAKPOINTS = {
  vertical: [
    // [breakpoint, cols, layout]
    [513, 1, 'vertical'],
    [785, 2, 'vertical'],
    [1057, 3, 'vertical'],
    // ! FIXME 4列情况下有错误，需要修正
    [Infinity, 3, 'vertical']
  ],
  default: [
    [513, 1, 'vertical'],
    [701, 2, 'vertical'],
    [1062, 3, 'horizontal'],
    [1352, 3, 'horizontal'],
    // ! FIXME 4列情况下有错误，需要修正
    [Infinity, 3, 'horizontal']
  ]
};

export default {
  name: 'ElProForm',
  componentName: 'ElProForm',
  props: {
    model: {
      type: Object
    },
    type: {
      type: String,
      default: ''
    },
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
    beforeSubmit: {
      type: Function
    },
    afterSubmit: {
      type: Function
    },
    expand: {
      type: Boolean,
      default: false
    },
    title: String,
    // 提交按钮相关配置
    submitter: Boolean | Object,
    // type为card时的props
    cardAttrs: Object,
    // type为modalForm时的props
    dialogAttrs: Object
  },
  data() {
    return {
      isSubmiting: false,
      isMounted: false,
      innerExpand: false,
      width: null,
      currentDisplayTotalColSpan: 0,
      totalColSpan: 0,
      isShowModalForm: false,
      formRenderKey: NON_INITIAL
    };
  },
  watch: {
    expand: {
      immediate: true,
      handler(val) {
        this.innerExpand = val;
      }
    },
    innerExpand(val) {
      this.$emit('update:expand', val);
    },
    isShowModalForm(val) {
      this.$emit('visibleChange', val);
    }
  },
  computed: {
    direction() {
      let ret = '';
      const { type } = this;
      switch (type) {
        case 'queryFilter':
          ret = 'default';
          break;
        default:
          ret = 'vertical';
      }
      return ret;
    },
    currentColumns() {
      const { direction, widthNumber } = this;
      const breakPoints = BREAKPOINTS[direction];
      const breakPoint = arrayFind(breakPoints, item => widthNumber < item[0]);
      return breakPoint ? breakPoint[1] : 0;
    },
    widthNumber() {
      const { width } = this;
      if (isEmpty(width)) {
        return 0;
      }
      return parseInt(width.replace('px', ''), 10);
    },
    innerUiSchema() {
      let ret = {};
      if (!this.isMounted) {
        return ret;
      }
      this.totalColSpan = 0;
      this.currentDisplayTotalColSpan = 0;
      const { currentColumns, innerExpand, schema, type, uiSchema } = this;
      Object.keys(schema.properties).forEach((schemaKey, index) => {
        let uiProperty = uiSchema[schemaKey];
        if (isEmpty(uiSchema[schemaKey])) {
          uiProperty = {};
        }
        ret[schemaKey] = uiProperty;
        if (type === 'queryFilter') {
          let propertyColspan = uiProperty['ui:colspan'];
          propertyColspan = typeof propertyColspan === 'number' ? propertyColspan : 1;
          // 收起的场合
          if (!innerExpand) {
            if (currentColumns === 1 && index === 0) {
              uiProperty['ui:hidden'] = false;
            // 只显示一行表单项目，其余的隐藏
            } else if (this.currentDisplayTotalColSpan + propertyColspan + 1 > currentColumns) {
              uiProperty['ui:hidden'] = true;
            } else {
              uiProperty['ui:hidden'] = false;
            }
          // 展开的场合
          } else {
            uiProperty['ui:hidden'] = false;
          }
          const isCurrentRowEnough = currentColumns - (this.currentDisplayTotalColSpan % currentColumns) < propertyColspan;
          if (propertyColspan > currentColumns) {
            propertyColspan = currentColumns;
          }
          // 隐藏的项目不统计
          if (uiProperty['ui:hidden'] !== true) {
            if (isCurrentRowEnough) {
              // 如果当前行空余位置放不下，那么折行
              this.currentDisplayTotalColSpan += currentColumns - (this.currentDisplayTotalColSpan % currentColumns);
            }
            this.currentDisplayTotalColSpan += propertyColspan;
          }
          if (isCurrentRowEnough) {
            this.totalColSpan += currentColumns - (this.totalColSpan % currentColumns);
          }
          this.totalColSpan += propertyColspan;
        }
      });
      return ret;
    },
    queryFilterColumnConfig() {
      const { currentColumns, currentDisplayTotalColSpan } = this;
      const currentColspan = 24 / currentColumns;
      let ret = {
        span: currentColspan
      };
      if (!this.isMounted) {
        return ret;
      }
      const leaveSpan = currentColumns - currentDisplayTotalColSpan % currentColumns - 1;
      ret.offset = leaveSpan * currentColspan;
      return ret;
    },
    fields() {
      if (this.$refs.proForm) {
        return this.$refs.proForm.fields;
      }
      return [];
    }
  },
  created() {
  },
  mounted() {
    this.handleResize();
    this.isMounted = true;
    window.addEventListener('resize', this.handleResize);
    // 初始化时，需要等自组件渲染完才能从子组件取得当前选择值
    this.$nextTick(() => {
      // this.formRenderKey = INITIALED;
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    getFields() {
      return this.$refs.proForm && this.$refs.proForm.fields;
    },
    resetFields() {
      this.$refs.proForm.resetFields();
    },
    handleResize() {
      this.width = getStyle(this.$el, 'width');
    },
    handleExpand() {
      this.innerExpand = !this.innerExpand;
    },
    submit() {
      const { afterSubmit, model, type } = this;
      this.isSubmiting = true;
      if (typeof afterSubmit === 'function') {
        const result = afterSubmit(model);
        if (result.then) {
          result.then(() => {
            this.isSubmiting = false;
            if (type === 'modalForm' && this.isShowModalForm) {
              this.isShowModalForm = false;
            }
          });
        }
      }
      this.$emit('submit');
    },
    /**
     * 表单提交事件处理
     * @public
     */
    handleSubmit() {
      const { beforeSubmit, model, submit } = this;
      this.$refs.proForm.validate((isValid) => {
        if (isValid) {
          if (typeof beforeSubmit === 'function') {
            const res = beforeSubmit(model);
            if (res.then) {
              res.then(() => {
                submit();
              });
            } else {
              submit();
            }
          } else {
            this.submit();
          }
        }
      });
    },
    handleReset() {
      this.resetFields();
      this.$emit('clear');
    },
    handleCancel() {
      this.isShowModalForm = false;
    },
    handleChange(key, value, object) {
      this.$emit('change', key, value, object);
    },
    handleModalButtonClick(evt) {
      this.isShowModalForm = !this.isShowModalForm;
    },
    validate(callbackFunc) {
      this.$refs.proForm.validate(callbackFunc);
    }
  },
  render(h) {
    const {
      $attrs,
      $listeners,
      $slots,
      $scopedSlots,
      cardAttrs,
      currentColumns,
      dialogAttrs,
      innerExpand,
      model,
      isMounted,
      isSubmiting,
      isShowModalForm,
      innerUiSchema,
      queryFilterColumnConfig,
      schema,
      totalColSpan,
      type,
      title,
      submitter,
      handleExpand,
      handleSubmit,
      handleChange,
      handleModalButtonClick
    } = this;
    if (!isMounted) {
      return (<div></div>);
    }
    const attributes = {
      attrs: $attrs,
      listeners: $listeners
    };
    // console.log('------------------------------------------', innerExpand);
    // console.log('当前宽度', widthNumber);
    // console.log('当前每行列数', currentColumns);
    // console.log('元素所占列数总和', currentDisplayTotalColSpan, totalColSpan);
    const getExpandTextLabel = () => {
      return innerExpand
        ? (<div><i class="el-icon-arrow-up"></i><span>收起</span></div>)
        : (<div><i class="el-icon-arrow-down"></i><span>展开</span></div>);
    };
    /**
     * 正常表单的操作区域
     */
    const getNormalFormControlContainer = () => {
      const { handleSubmit, handleReset } = this;
      return (
        <div class="pro-form-control-button-container" slot="button">
          <el-button type="primary" onClick={handleSubmit} loading={isSubmiting}>提交</el-button>
          <el-button onClick={handleReset}>重置</el-button>
        </div>
      );
    };
    /**
     * 渲染查询筛选的操作区域
     */
    const getQueryFillterControlContainer = () => {
      const { handleSubmit, handleReset } = this;
      return (
        <el-col
          span={queryFilterColumnConfig.span}
          offset={queryFilterColumnConfig.offset}
          slot="formItems"
          class="el-pro-form__control">
          <el-form-item label="&nbsp;">
            <el-button
              type="primary"
              icon="el-icon-search"
              onClick={handleSubmit}
              loading={isSubmiting}>搜索</el-button>
            <el-button onClick={handleReset} icon="el-icon-refresh-left">重置</el-button>
            <el-button
              type="text"
              onClick={handleExpand}
              class="control__expand-button">
              {totalColSpan >= currentColumns ? getExpandTextLabel() : null}
            </el-button>
          </el-form-item>
        </el-col>
      );
    };
    /**
     * ModalForm的操作区域
     */
    const getModalFormControlContainer = () => {
      const { handleSubmit, handleCancel } = this;
      return (
        <div class="pro-form-control-button-container" slot="button">
          <el-button onClick={handleCancel}>取消</el-button>
          <el-button type="primary" onClick={handleSubmit} loading={isSubmiting}>提交</el-button>
        </div>
      );
    };
    const getControlButton = () => {
      if (submitter === false) {
        return null;
      }
      if (isEmpty(type)) {
        return getNormalFormControlContainer();
      } else if (type === 'queryFilter') {
        return getQueryFillterControlContainer();
      }
      return null;
    };
    const formRender = (
      <ElJsonForm
        ref="proForm"
        class="el-pro-form"
        model={model}
        schema={schema}
        uiSchema={innerUiSchema}
        columns={currentColumns}
        scopedSlots={$scopedSlots}
        on-submit={handleSubmit}
        on-change={handleChange}
        {...attributes}>
        { getControlButton() }
      </ElJsonForm>
    );
    const cardFormAttrs = {
      attrs: cardAttrs
    };
    const cardForm = (
      <ElCard header={title} {...cardFormAttrs}>
        {formRender}
      </ElCard>
    );
    const onListener = {
      'update:visible': (val) => {
        this.isShowModalForm = val;
      }
    };
    const modalFormAttrs = {
      attrs: dialogAttrs
    };
    const modalDialog = (
      <ElDialog
        visible={isShowModalForm}
        title={title}
        {...modalFormAttrs}
        {...{on: onListener }}>
        {formRender}
        <span slot="footer" class="dialog-footer">
          {getModalFormControlContainer()}
        </span>
      </ElDialog>
    );
    if (type === 'cardForm') {
      return cardForm;
    } else if (type === 'modalForm') {
      return (
        <div class="el-modal-form">
          <div onClick={handleModalButtonClick}>{$slots.default}</div>
          {modalDialog}
        </div>
      );
    }
    return formRender;
  },
  components: {
    ElCard,
    ElDialog,
    ElJsonForm
  }
};
