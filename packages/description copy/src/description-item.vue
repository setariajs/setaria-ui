<script>
  import emitter from 'setaria-ui/src/mixins/emitter';

  export default {
    name: 'ElDescriptionItem',
    mixins: [emitter],
    props: {
      label: String,
      span: {
        type: Number,
        default: 1
      },
      width: null,
      class: null
    },
    data() {
      return {
        innerSpan: null
      };
    },
    render() {
      return null;
    },
    mounted() {
      if (this.label) {
        this.dispatch('ElDescription', 'el.description.addField', [this]);
      }
    }
  };
</script>