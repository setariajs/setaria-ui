<script>
  export default {
    name: 'ElDescriptionCell',
    props: {
      child: {},
      bordered: Boolean,
      colon: Boolean,
      cellType: {
        type: String,
        validator(val) {
          return ['label', 'content'].indexOf(val) !== -1;
        }
      },
      layout: {
        type: String,
        validator(val) {
          return ['horizontal', 'vertical'].indexOf(val) !== -1;
        }
      },
      span: {
        type: Number,
        default: 1
      },
      className: String
    },
    render(h) {
      const { bordered, cellType, className, span, $slots } = this;
      if (cellType === 'label') {
        return (
          <th
            class={[className, 'el-description-item-label', bordered ? 'is-bordered' : null]}>{ $slots.default }</th>
        );
      } else {
        return (
          <td
            class={[className, 'el-description-item-content']}
            colSpan={span * 2 - 1}>{ $slots.default }</td>
        );
      }
    }
  };
</script>