import VXETable from 'setaria-vxe-table';
import VXETablePluginElement from 'vxe-table-plugin-element';
import 'vxe-table-plugin-element/dist/style.css';
import VXETablePluginVirtualTree from 'vxe-table-plugin-virtual-tree';
import 'vxe-table-plugin-virtual-tree/dist/style.css';
// import VXETablePluginMenus from 'vxe-table-plugin-menus';
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';

export function install(Vue, opts = {}) {
  if (opts.i18n) {
    VXETable.setup({
      // 对组件内置的提示语进行国际化翻译
      i18n: (key, args) => opts.i18n.t(key, args),
      zIndex: 5000
    });
  }
  // 初始化VxeTable
  Vue.use(VXETable);
  VXETable.use(VXETablePluginElement);
  VXETable.use(VXETablePluginVirtualTree);
  // VXETable.use(VXETablePluginMenus);
  // VXETable.use(VXETablePluginExportXLSX);
};

export default {
  install
};
