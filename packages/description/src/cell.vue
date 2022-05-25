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
      className: String,
      labelClass: String,
      contentClass: String
    },
    render(h) {
      const { bordered, cellType, className, labelClass, contentClass, span, $slots } = this;
      if (cellType === 'label') {
        return (
          <th
            class={[labelClass, 'el-description-item-label', bordered ? 'is-bordered' : null]}
            colSpan={span * 2 - 1}>{ $slots.default }</th>
        );
      } else {
        return (
          <td
            class={[className, contentClass, 'el-description-item-content']}
            colSpan={span * 2 - 1}>{ $slots.default }</td>
        );
      }
    }
  };
</script>