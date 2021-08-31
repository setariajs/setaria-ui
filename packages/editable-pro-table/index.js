import EditableProTable from '../pro-table/src/editable-pro-table.js';

/* istanbul ignore next */
EditableProTable.install = function install(Vue) {
  Vue.component(EditableProTable.name, EditableProTable);
};

export default EditableProTable;
