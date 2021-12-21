<template>
  <li :style="{'width': width}">
    <span>
      <slot></slot>
    </span>
  </li>
</template>
<script>
import emitter from 'setaria-ui/src/mixins/emitter';

export default {
  name: 'ElCardActionItem',

  mixins: [emitter],

  inject: ['elCard'],

  computed: {
    width() {
      return `${100 / this.elCard.actionItemList.length}%`;
    }
  },

  beforeMount() {
    this.dispatch('ElCard', 'el.card.addActionItem', [this]);
  },

  mounted() {
    // console.log(this.elCard.actionItemList.length);
  }
};
</script>
