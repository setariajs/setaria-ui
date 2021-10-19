import TreeSelect from './src/tree-select.vue';

/* istanbul ignore next */
TreeSelect.install = function(Vue) {
  Vue.component(TreeSelect.name, TreeSelect);
};

export default TreeSelect;
