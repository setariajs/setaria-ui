import ProDescription from './src/pro-description.js';

/* istanbul ignore next */
ProDescription.install = function install(Vue) {
  Vue.component(ProDescription.name, ProDescription);
};

export default ProDescription;
