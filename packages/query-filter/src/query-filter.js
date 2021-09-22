import ElButton from 'setaria-ui/packages/button';
import ElCollapseTransition from 'setaria-ui/src/transitions/collapse-transition';
import ElDivider from 'setaria-ui/packages/divider';
import ElForm from 'setaria-ui/packages/form';
import ElIcon from 'setaria-ui/packages/icon';
import ElRadioGroup from 'setaria-ui/packages/radio-group';
import ElRadioButton from 'setaria-ui/packages/radio-button';
import ElTagSelect from 'setaria-ui/packages/tag-select';
import ElTagSelectItem from 'setaria-ui/packages/tag-select-item';
import ElTooltip from 'setaria-ui/packages/tooltip';
import ElProForm from 'setaria-ui/packages/pro-form';
import { arrayFind, arrayFindIndex, coerceTruthyValueToArray } from 'setaria-ui/src/utils/util';
import { camelCase } from 'setaria-ui/src/utils/dom';
const NON_INITIAL = 'nonInitial';
const INITIALED = 'initialed';

const proFormInitialOptions = {
  attrs: {
    labelSuffix: '：',
    labelPosition: 'left',
    labelWidth: 'auto',
    columns: 3
  },
  props: {
    type: 'queryFilter',
    expand: true,
    positionErrorField: false
  }
};

export default {
  name: 'ElQueryFilter',

  componentName: 'ElQueryFilter',

  components: {
    ElButton,
    ElCollapseTransition,
    ElDivider,
    ElForm,
    ElIcon,
    ElRadioGroup,
    ElRadioButton,
    ElTagSelect,
    ElTagSelectItem,
    ElTooltip,
    ElProForm
  },

  props: {
    value: {
      required: true,
      type: Object,
      default() {
        return {};
      }
    },
    expand: Boolean,
    rules: {
      type: Object,
      default() {
        return null;
      }
    },
    showResult: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Number,
      default: 3
    },
    normalSchema: Object,
    normalUiSchema: Object,
    advanceSchema: Object,
    advanceUiSchema: {
      type: Object,
      default() {
        return {};
      }
    },
    afterSubmit: Function
  },

  data() {
    return {
      conditionValue: {},
      conditionValidateMessage: {},
      innerExpand: true,
      conditionResultItemKey: NON_INITIAL,
      conditionFormKey: NON_INITIAL
    };
  },

  watch: {
    expand: {
      handler(val) {
        this.innerExpand = val;
      }
    },
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        const v = val === undefined || val === null ? {} : val;
        this.conditionValue = v === undefined || v === null ? [] : v;
      }
    },
    conditionValue: {
      deep: true,
      handler(val) {
        this.emitValue();
      }
    }
  },

  mounted() {
    // 初始化时，需要等自组件渲染完才能从子组件取得当前选择值
    this.$nextTick(() => {
      // 刷新当前搜索条件值的显示
      this.conditionResultItemKey = INITIALED;
      if (typeof this.expand === 'boolean') {
        this.innerExpand = this.expand;
      } else {
        this.innerExpand = false;
      }
    });
  },

  methods: {
    handleExpand() {
      this.innerExpand = !this.innerExpand;
      this.$emit('update:expand', this.innerExpand);
    },
    handleClear(refKey) {
      if (refKey === 'normalConditionForm') {
        if (this.$refs.advanceConditionForm) {
          this.$refs.advanceConditionForm.resetFields();
        }
      } else {
        if (this.$refs.normalConditionForm) {
          this.$refs.normalConditionForm.resetFields();
        }
      }
      // 触发clear事件
      this.$nextTick(() => {
        this.$emit('clear');
      });
    },
    /**
     * @public
     */
    search() {
      this.handleSearch();
    },
    handleSearch() {
      return typeof this.afterSubmit === 'function' ? this.afterSubmit() : true;
    },
    validate() {
      const validateAdvanceForm = (callback) => {
        const { advanceConditionForm } = this.$refs;
        if (advanceConditionForm) {
          advanceConditionForm.validate(callback);
        } else {
          callback(true);
        }
      };
      return new window.Promise((resolve, reject) => {
        if (this.$refs.normalConditionForm) {
          this.$refs.normalConditionForm.validate((valid) => {
            if (valid) {
              validateAdvanceForm((valid) => {
                if (valid) {
                  resolve(valid);
                }
              });
            }
          });
        } else {
          validateAdvanceForm((valid) => {
            if (valid) {
              resolve(valid);
            }
          });
        }
      });
    },
    /**
     * 清空指定条件筛选结果项目
     *
     * @param {*} key
     * @param {*} value
     * @returns
     */
    handleItemClose(key, value) {
      return (event) => {
        let isCleared = false;
        const conditionObj = this.conditionValue[key];
        if (conditionObj === undefined || conditionObj === null) {
          return;
        }
        // 筛选项目的值为数组的场合
        if (Array.isArray(conditionObj)) {
          const index = arrayFindIndex(coerceTruthyValueToArray(conditionObj), v => v === value);
          if (index !== -1) {
            conditionObj.splice(index, 1);
            isCleared = true;
          }
        }
        // 为其他类型的场合
        // 某些组件的值虽然为数组类型，但是显示值为单一值(Cascader)
        const componentName = this.getSeniorConditionFormItemComponentName(key);
        if (isCleared === false) {
          // 数字输入框的场合
          if (componentName === 'ElInputNumber') {
            // 保证清空后输入框不为0
            this.conditionValue[key] = undefined;
          } else {
            this.conditionValue[key] = null;
          }
        }
        this.$nextTick(() => {
          this.$emit('clear', key);
          if (this.innerExpand) {
            if (this.$refs.advanceConditionForm) {
              this.$refs.advanceConditionForm.handleSubmit();
            }
          } else {
            this.$refs.normalConditionForm.handleSubmit();
          }
        });
      };
    },
    getSeniorConditionFormItemComponentName(key) {
      if (this.$refs.advanceConditionForm) {
        const fields = this.$refs.advanceConditionForm.fields;
        if (fields) {
          // FormItem组件
          const item = arrayFind(coerceTruthyValueToArray(fields), component => component.prop === key);
          if (item && item.$children && item.$children[0].$options) {
            // 子组件名称
            return item.$children[0].$options.componentName;
          }
        }
      }
      return null;
    },
    emitValue() {
      const { conditionValue } = this;
      this.$emit('input', conditionValue);
    },
    /**
     * 渲染允许多选值的条件筛选Label
     */
    renderMultipleLabelItem(h, key, label, value, isLastChild, isShowCloseIcon) {
      return (
        <div class="item-value">
          <span>{label}</span>
          { isShowCloseIcon ? <i class="value-clear-icon el-icon-close" name="close" onClick={this.handleItemClose(key, value)}></i> : null }
          { isLastChild ? <ElDivider direction="vertical"></ElDivider> : null }
        </div>
      );
    },
    /**
     * 渲染当前输入的条件筛选项目值
     */
    renderConditionResultItem(h, key, value) {
      let ret = null;
      let item = null;
      let fields = [];
      if (this.$refs.normalConditionForm) {
        fields = fields.concat(this.$refs.normalConditionForm.getFields());
      }
      if (this.$refs.advanceConditionForm) {
        fields = fields.concat(this.$refs.advanceConditionForm.getFields());
      }
      // FormItem组件
      item = arrayFind(coerceTruthyValueToArray(fields), component => component && component.prop === key);
      if (item) {
        if (Array.isArray(value) && value.length === 0) {
          return null;
        }
        if (item.$children) {
          const formItemComponent = item.$children.length > 1 ? item.$children[1] : item.$children[0];
          const childComponentName = formItemComponent.$options.componentName;
          const isShowCloseIcon = () => {
            if (formItemComponent && formItemComponent.disabled) {
              return false;
            }
            if (item.isRequired) {
              return false;
            }
            return true;
          };
          // 可以多选的组件，排除级联选择器
          if (Array.isArray(value) && value.length > 0 &&
            childComponentName !== 'ElCascader' &&
            childComponentName !== 'ElDatePicker') {
            const itemValue = value || [];
            let valueList = null;
            // 可以多选的选择器(ElSelect)
            if (childComponentName === 'ElSelect') {
              valueList = itemValue.map((v, index) => {
                const label = formItemComponent.getOption(v).label;
                if (label && label !== '') {
                  return this.renderMultipleLabelItem(h, key, label, v, index !== itemValue.length - 1, isShowCloseIcon());
                }
              });
            }
            ret = (
              <div class="query-result__item is-array">
                <span class="item-label">{item.label}：</span>
                { valueList }
              </div>
            );
          } else {
            let displayValue = value;
            // 选择器
            if (childComponentName === 'ElSelect') {
              displayValue = formItemComponent.getOption(value).label;
            // 级联选择器
            } else if (childComponentName === 'ElCascader') {
              displayValue = formItemComponent.presentText;
            } else if (childComponentName === 'ElDatePicker') {
              const currentValue = formItemComponent.value;
              if (typeof currentValue === 'string') {
                displayValue = currentValue;
              } else if (Array.isArray(currentValue)) {
                displayValue = currentValue.length > 0 ? currentValue.join(' - ') : '';
              }
            // 单选框
            } else if (childComponentName === 'ElRadioGroup') {
              if (formItemComponent.$children) {
                formItemComponent.$children.forEach(radio => {
                  if (radio.model === radio.label) {
                    displayValue = radio.getDisplayLabel();
                  }
                });
              }
            } else if (formItemComponent && typeof formItemComponent.getDisplayLabel === 'function') {
              displayValue = formItemComponent.getDisplayLabel();
            }
            if (item !== undefined && item !== null && value && value !== '') {
              ret = (
                <div class="query-result__item">
                  <span class="item-label">{item.label}：</span>
                  <div class="item-value">
                    <span>{displayValue}</span>
                    { isShowCloseIcon() ? <i class="value-clear-icon el-icon-close" name="close" onClick={this.handleItemClose(key)}></i> : null }
                  </div>
                </div>
              );
            }
          }
        }
      }
      return ret;
    },

    /**
     * 渲染普通搜索项目
     * @param {*} schema schema
     * @param {*} uiSchema uiSchema
     * @param {*} value 值
     */
    renderNormalCondition(schema, uiSchema, $scopedSlots, handleSearch, handleClear, handleFormChange, value, attrs) {
      if (schema) {
        return (
          <ElProForm
            {...proFormInitialOptions}
            {...{ attrs }}
            model={value}
            ref="normalConditionForm"
            class="normal-condition-form"
            schema={schema}
            uiSchema={uiSchema}
            after-submit={handleSearch}
            scopedSlots={$scopedSlots}
            on-change={handleFormChange}
            on-clear={() => { handleClear('normalConditionForm'); }}>
          </ElProForm>
        );
      }
      return null;
    },

    /**
     * 渲染搜索项目当前输入值
     * @param {*} h h
     * @param {*} conditionValue 当前查询项目的值
     */
    renderConditionResultList(h, conditionValue) {
      return Object.keys(conditionValue).map(key => {
        return this.renderConditionResultItem(h, key, conditionValue[key]);
      });
    },

    handleFormChange(key, value, model) {
      this.$emit('change', key, value, model);
    }
  },

  render(h) {
    const {
      columns,
      $slots,
      $scopedSlots,
      $attrs,
      innerExpand,
      conditionValue = {},
      normalSchema,
      normalUiSchema,
      advanceSchema,
      advanceUiSchema = {},
      conditionResultItemKey,
      conditionFormKey,
      handleSearch,
      handleClear,
      handleFormChange,
      renderConditionResultList,
      renderNormalCondition,
      showResult
    } = this;
    // 格式化attrs为驼峰Key
    const attrs = Object.keys($attrs).reduce((res, key) => {
      res[camelCase(key)] = $attrs[key];
      return res;
    }, {});

    // 普通搜索
    let normalConditionNode = $slots.normalCondition
      ? $slots.normalCondition
      : renderNormalCondition(
        normalSchema,
        normalUiSchema,
        $scopedSlots,
        handleSearch,
        handleClear,
        handleFormChange,
        conditionValue, attrs);
    // 不存在普通搜索的场合，高级搜索默认展开
    if (normalConditionNode === undefined || normalConditionNode === null) {
      this.innerExpand = true;
    }
    const isExistAdvanceSchema = advanceSchema && advanceSchema.properties && Object.keys(advanceSchema.properties).length > 0;
    // 高级搜索表单
    let advanceConditionForm = null;
    if (isExistAdvanceSchema) {
      advanceConditionForm = (<ElProForm
        {...proFormInitialOptions}
        {...{ attrs }}
        model={conditionValue}
        key={conditionFormKey}
        ref="advanceConditionForm"
        class="advance-condition-form"
        afterSubmit={handleSearch}
        schema={advanceSchema}
        uiSchema={advanceUiSchema}
        columns={columns}
        scopedSlots={$scopedSlots}
        on-change={handleFormChange}
        on-clear={() => { handleClear('advanceConditionForm'); }}>
      </ElProForm>);
    }
    return (
      <div
        class={[
          'el-query-filter',
          innerExpand ? 'is-expand' : ''
        ]}>
        { normalConditionNode ? (
          <div class="el-query-filter__normal">
            { normalConditionNode }
            {
              isExistAdvanceSchema ? (
                <div class="normal__toolbar">
                  <ElButton
                    type="text"
                    onClick={this.handleExpand}
                    class="toolbar__expand-button">{ innerExpand ? '普通搜索' : '高级搜索' }</ElButton>
                  <i class="el-icon-setting toolbar-icon" style="font-size: 18px;"></i>
                </div>
              ) : null
            }
          </div>
        ) : null }
        <div class="el-query-filter__advance">
          { showResult ? (
            <div class="query-result">
              <div class="query-result__icon">
                <i class="el-icon-search"></i>
              </div>
              <div class="query-result__detail" key={conditionResultItemKey}>
                {renderConditionResultList(h, conditionValue)}
              </div>
            </div>

          ) : null }
          <ElCollapseTransition>
            <div v-show={innerExpand} class="el-query-filter__advance-expand-container">
              { advanceConditionForm }
            </div>
          </ElCollapseTransition>
        </div>
      </div>
    );
  }
};
