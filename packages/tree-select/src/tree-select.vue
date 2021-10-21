<template>
  <el-select :value="valueTitle"
    ref="select"
    :collapse-tags="collapseTags"
    :clearable="clearable"
    popper-class="el-tree-select-popper"
    @clear="clearHandle"
    @remove-tag="removeTagHandler"
    :multiple="multiple">
    <!-- <el-input
      class="selectInput"
      :placeholder="placeholder"
      v-model="filterText">
    </el-input> -->

    <el-option :value="valueTitle"
      :label="''"
      class="options">
      <el-tree id="tree-option"
        :class="{'singleSelect':!multiple}"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="treeProps"
        :node-key="treeProps.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        :show-checkbox="multiple"
        @check-change="handleCheckChange"
        @node-click="handleNodeClick">
      </el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ElTreeSelect',
  props: {
    /* 配置项 */
    treeProps: {
      type: Object,
      default: () => ({
        value: 'value', // ID字段名
        label: 'label', // 显示名称
        children: 'children' // 子级字段名
      })
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: false
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => []
    },
    /* 初始值 */
    value: {
      default: () => null
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => true
    },
    placeholder: {
      type: String,
      default: () => '检索关键字'
    }
  },
  data() {
    return {
      /* 自动收起 */
      accordion: false,
      filterText: '',
      //   valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    };
  },
  mounted() {
    this.initHandle();
  },
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler() {
        this.initHandle();
      }
    },
    filterText(val) {
      this.$refs.selectTree.filter(val);
    }
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.innerValue) {
        if (this.multiple) {
          //   this.defaultExpandedKey = this.innerValue;
          this.$nextTick(() => {
            this.$refs.selectTree.setCheckedKeys(this.innerValue); // 设置默认选中
          });
        } else {
          this.defaultExpandedKey = [this.innerValue]; // 设置默认展开
          this.$nextTick(() => {
            this.valueTitle = this.$refs.selectTree.getNode(
              this.innerValue
            ).data[this.treeProps.label]; // 初始化显示
            this.$refs.selectTree.setCurrentKey(this.innerValue); // 设置默认选中
          });
        }
      }
      this.initScroll();
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        const scrollWrap = document.querySelectorAll(
          '.el-tree-select-popper .el-scrollbar .el-select-dropdown__wrap'
        )[0];
        const scrollBar = document.querySelectorAll(
          '.el-tree-select-popper .el-scrollbar .el-scrollbar__bar'
        );
        scrollWrap.forEach((ele) => (ele.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'));
        // scrollWrap.style.cssText =
        //  ;
        // eslint-disable-next-line no-return-assign
        scrollBar.forEach((ele) => (ele.style.width = 0));
      });
    },
    // 清除选中
    clearHandle() {
      if (this.multiple) {
        this.valueTitle = [];
        this.defaultExpandedKey = [];
        this.clearSelected();
        this.$refs.selectTree.setCheckedKeys([]);
        this.innerValue = [];
      } else {
        this.valueTitle = '';
        this.defaultExpandedKey = [];
        this.clearSelected();
        this.innerValue = '';
      }
    },
    /* 清空选中样式 */
    clearSelected() {
      const allNode =
        this.$refs.selectTree.$el.querySelectorAll('.el-tree-node');
      allNode.forEach((element) => element.classList.remove('is-current'));
    },
    removeTagHandler(removeVal) {
      const vtIndex = this.valueTitle.findIndex((item) => item === removeVal);
      if (vtIndex !== -1) {
        this.valueTitle.splice(vtIndex, 1);
        this.innerValue.splice(vtIndex, 1);
      }
    },
    filterNode(value, item) {
      if (!value) return true;
      const formatVal = value.toLowerCase();
      return (
        item[this.treeProps.label].toLowerCase().indexOf(formatVal) !== -1 ||
        `${item[this.treeProps.value]}`.toLowerCase().indexOf(formatVal) !== -1
      );
    },
    // 单选触发
    handleNodeClick(node) {
      if (!this.multiple) {
        this.valueTitle = node[this.treeProps.label];
        this.innerValue = node[this.treeProps.value];
        this.defaultExpandedKey = [];
        this.accordion = false;
        this.$refs.select.blur();
      }
    },
    // 多选触发
    handleCheckChange(data, checked, indeterminate) {
      if (!Array.isArray(this.valueTitle)) {
        this.valueTitle = [data[this.treeProps.label]];
        this.innerValue = [data[this.treeProps.value]];
      }
      if (checked) {
        if (!this.innerValue.includes(data[this.treeProps.value])) {
          this.defaultExpandedKey = [];
          this.valueTitle.push(data[this.treeProps.label]);
          this.innerValue.push(data[this.treeProps.value]);
        }
      } else {
        const vtIndex = this.innerValue.findIndex(
          (item) => item === data[this.treeProps.value]
        );
        if (vtIndex !== -1) {
          this.valueTitle.splice(vtIndex, 1);
          this.innerValue.splice(vtIndex, 1);
        }
      }
    }
  }
};
</script>