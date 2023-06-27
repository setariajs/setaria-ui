import Description from './src/description';

/* istanbul ignore next */
Description.install = function(Vue) {
  Vue.component(Description.name, Description);
};

export default Description;
