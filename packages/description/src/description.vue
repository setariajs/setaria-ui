<script>
  import emitter from 'setaria-ui/src/mixins/emitter';
  import { isEmpty } from 'setaria-ui/src/utils/util';
  import Cell from './cell';
  
  export default {
    name: 'ElDescription',
    componentName: 'ElDescription',
    mixins: [emitter],
    props: {
      title: String,
      bordered: {
        type: Boolean,
        default: true
      },
      colon: Boolean,
      columns: {
        type: Number,
        default: 4
      },
      layout: {
        type: String,
        validator(val) {
          return ['horizontal', 'vertical'].indexOf(val) !== -1;
        }
      },
      size: String,
      labelSuffix: {
        type: String,
        default: ''
      }
    },
    provide() {
      return {
        elDescription: this
      };
    },
    data() {
      return {
        fields: []
      };
    },
    computed: {
      sizeClass() {
        return this.size || (this.$ELEMENT || {}).size;
      }
    },
    created() {
      this.$on('el.description.addField', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      /* istanbul ignore next */
      this.$on('el.description.removeField', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    },
    methods: {
      getColumn() {
        const { columns } = this;
        // If the configuration is not an object, it is a number, return number
        if (typeof columns === 'number') {
          return columns;
        }
        // If it is an object, but no response is found, this happens only in the test.
        // Maybe there are some strange environments
        return 4;
      },
      renderTitle(content, columns) {
        return !isEmpty(content) ? (
          <thead>
            <tr>
              <th colspan={columns * 2} class="el-description-title">
                { content }
              </th>
            </tr>
          </thead>
        ) : null;
      },
      // getFilledItem(
      //   node,
      //   span,
      //   rowRestCol) {
      //   let clone = node;

      //   if (span === undefined || span > rowRestCol) {
      //     clone = cloneElement(node, {
      //       span: rowRestCol
      //     });
      //   }

      //   return clone;
      // },
      getRows(children, column) {
        const rows = [];
        let tmpRow = [];
        let rowRestCol = column;
        let colNodes = this.fields;
        if (colNodes.length === 0) {
          colNodes = children.filter(child => child.tag && child.tag.indexOf('el-description-item') !== -1);
        }
        colNodes.forEach((col, index) => {
          let itemNode = col;
          let itemProps = itemNode && itemNode.componentOptions &&
            itemNode.componentOptions.propsData;
          if (isEmpty(itemProps)) {
            itemProps = itemNode.data.attrs;
          }
          if (itemProps) {
            const { span } = itemProps;
            const mergedSpan = span || 1;
            // Additional handle last one
            if (index === colNodes.length - 1) {
              tmpRow.push(itemNode);
              // tmpRow.push(getFilledItem(itemNode, span, rowRestCol));
              itemNode.innerSpan = rowRestCol;
              rows.push(tmpRow);
              return;
            }
            itemNode.innerSpan = mergedSpan;
            if (mergedSpan < rowRestCol) {
              rowRestCol -= mergedSpan;
              tmpRow.push(itemNode);
            } else {
              if (rowRestCol - mergedSpan === 0) {
                tmpRow.push(itemNode);
                // tmpRow.push(getFilledItem(itemNode, mergedSpan, rowRestCol));
                rows.push(tmpRow);
                rowRestCol = column;
                tmpRow = [];
              } else {
                if (tmpRow[tmpRow.length - 1]) {
                  tmpRow[tmpRow.length - 1].innerSpan += rowRestCol;
                  // tmpRow.push(getFilledItem(itemNode, mergedSpan, rowRestCol));
                  rows.push(tmpRow);
                  rowRestCol = column;
                  tmpRow = [];
                }
                // new row
                tmpRow.push(itemNode);
                rowRestCol -= mergedSpan;
                if (rowRestCol <= 0) {
                  itemNode.innerSpan = mergedSpan;
                  rows.push(tmpRow);
                  rowRestCol = column;
                  tmpRow = [];
                }
              }
            }
          }
        });
        return rows;
      },
      renderRow(children, index, prefixCls, bordered, layout, colon, createElement) {
        const { labelSuffix, renderCol } = this;
        const retChildren = [];
        const trClass = [];
        children.forEach((child, index) => {
          // 获取label数据
          let propsData = child.data ? child.data.attrs : (child.componentOptions ? child.componentOptions.propsData : null);
          let label = `${propsData.label}${labelSuffix}`;
          // 取得插槽
          const childNodes = child.children;
          if (childNodes) {
            let labelNode = childNodes.filter(c => c.data && c.data.slot === 'label');
            if (labelNode && labelNode.length > 0) {
              label = labelNode[0];
              if (label.children) {
                label.children.push(createElement('span', [labelSuffix]));
              }
            }
          }
          // 获取内容数据
          let node = null;
          let children = child.children;
          if (!children) {
            children = (child.componentOptions && child.componentOptions.children.length > 0) ? child.componentOptions.children : null;
          }
          let contentNodes = children.filter(c => (c.data === undefined || c.data === null || (c.data && (c.data.slot === undefined || c.data.slot !== 'label'))));
          if (contentNodes && contentNodes.length > 0) {
            if (contentNodes.length === 1) {
              node = contentNodes[0];
            } else {
              contentNodes = contentNodes.filter(c => c.children);
            }
            node = contentNodes[0];
          }
          if (label && node) {
            // Label
            let colItem = {
              child: label
            };
            retChildren.push((
              renderCol(colItem, 'label', index)
            ));
            colItem = {
              child: node.text ? node.text : node,
              span: child.innerSpan,
              className: child.data ? child.data.staticClass : null
            };
            // Content
            retChildren.push((
              renderCol(colItem, 'content', index)
            ));
          }
        });
        return (
          <tr class={trClass}>
            { retChildren }
          </tr>
        );
      },
      renderCol(colItem, type, idx) {
        const { bordered, colon } = this;
        const prop = {
          bordered,
          colon,
          cellType: type,
          span: colItem.span,
          className: colItem.className
        };
        const child = colItem.child;
        return (
          <Cell
            bordered={prop.bordered}
            cell-type={prop.cellType}
            colon={prop.colon}
            span={prop.span}
            className={prop.className}>{ child }</Cell>
        );
      }
    },
    render(h) {
      const {
        bordered,
        colon,
        getColumn,
        getRows,
        layout,
        renderRow,
        renderTitle,
        sizeClass,
        title,
        $slots
      } = this;
      const columns = getColumn();
      const rowArray = getRows($slots.default, columns);
      const rootClassArray = [
        sizeClass ? 'el-description--' + sizeClass : '',
        'el-description',
        !isEmpty(title) ? 'has-title' : ''
      ];
      // ! FIXME 目前SETARIAUI不支持ES6语法Array.from
      const colArray = [];
      for (let i = 0; i < columns * 2; i++) {
        colArray.push(undefined);
      }
      return (
        <div class={rootClassArray}>
          <table cellspacing="0" class={bordered ? 'is-bordered' : null}>
            <colgroup>
              {
                colArray.map(item => (
                  <col width={`${100 / (columns * 2)}%`}></col>
                ))
              }
            </colgroup>
            { renderTitle(title, columns) }
            <tbody>
              {
                rowArray.map((row, index) =>
                  renderRow(row, index, {}, bordered, layout, colon, h))
              }
            </tbody>
          </table>
        </div>
      );
    },
    components: {
      Cell
    }
  };
</script>
