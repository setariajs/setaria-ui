import DescriptionItem from '../description/src/description-item';

/* istanbul ignore next */
DescriptionItem.install = function(Vue) {
  Vue.component(DescriptionItem.name, DescriptionItem);
};

export default DescriptionItem;
