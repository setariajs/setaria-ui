<template>
  <div class="el-json-viewer">
    <el-tree :data="jsonData" ref="jsonTree"
      @node-expand="handleExpand" @node-collapse="handleCollapse">
      <div
        class="el-json-viewer__item"
        slot-scope="{ node, data }"
        @mouseover="handleMouseOver(node)"
        @mouseout="handleMouseOut(node)">
        <span class="el-json-viewer__label">
          <template v-if="isRoot(data.label)">
            {{ getRootDisplayLabel(node, data) }}
          </template>
          <template v-else-if="data.label !== 'undefined'">
            {{ data.label }}:
          </template>
        </span>
        <span 
          :class="[
            'el-json-viewer__value',
            data.valueType === 'number' ? 'is-number' : '',
            data.valueType === 'string' ? 'is-string' : '',
            data.valueType === 'boolean' ? 'is-boolean' : ''
          ]"
          v-if="data.type === 'value'">
          <el-popover
            v-if="data.valueType === 'string' && data.isStringCollapse === true"
            placement="right-end"
            width="200"
            trigger="hover"
            :content="data.value"
            offset="200">
            <span slot="reference">
              {{ data.displayValue }}
            </span>
          </el-popover>
          <template v-else>
            {{ data.displayValue }}
          </template>
        </span>
        <span class="el-json-viewer__collapse" v-if="!node.expanded && data.children && !isRoot(data.label)">
          {{ data.type === 'object' ?
            data.children.length > 0 ? '{ ... }' : '{}'
            :
            data.children.length > 0 ? '[ ... ]' : '[]' }}
        </span>
        <span class="el-json-viewer__size" v-if="data.children">
          {{ data.children.length }} {{ t('el.jsonviewer.childrenSizeUnit') }}
        </span>
        <span class="el-json-viewer__copy" v-show="node.checked" v-if="copy">
           <el-button type="info" icon="el-icon-share" circle
            class="copy-button" @click.prevent.stop="handleCopy(data)"></el-button>
        </span>
      </div>
    </el-tree>
  </div>
</template>
<script>
  import Locale from 'setaria-ui/src/mixins/locale';

  export default {
    mixins: [Locale],

    name: 'ElJsonViewer',
    props: {
      data: {
        required: true
      },
      collapseStringSize: {
        type: Number,
        default: 12
      },
      copy: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isRootNodeExpand: false
      };
    },
    computed: {
      jsonData() {
        let jsonObj = typeof this.data === 'string' ? JSON.parse(this.data) : this.data;
        if (this.isValue(jsonObj)) {
          return [this.transformValue(jsonObj)];
        }

        // If it's an object or an array, transform as an object
        const structure = [
          {
            label: this.isArray(jsonObj) ? '[' : '{',
            value: this.data
          },
          {
            label: this.isArray(jsonObj) ? ']' : '}'
          }
        ];
        structure[0].children = this.transformObject(jsonObj).children;
        return structure;
      }
    },
    methods: {
      handleMouseOver(data) {
        data.checked = true;
      },
      handleMouseOut(data) {
        data.checked = false;
      },
      handleCopy(data) {
        const container = document.createElement('textarea');
        container.innerHTML = JSON.stringify(data.value);
        document.body.appendChild(container);
        container.select();
        document.execCommand('copy');
        document.body.removeChild(container);
        this.$message({
          showClose: true,
          message: '拷贝成功',
          type: 'success',
          duration: 1000
        });
      },
      handleExpand(obj) {
        if (this.isRoot(obj.label)) {
          this.isRootNodeExpand = true;
        }
      },
      handleCollapse(obj) {
        if (this.isRoot(obj.label)) {
          this.isRootNodeExpand = false;
        }
      },
      isObject(value) {
        return Object.prototype.toString.call(value).toLowerCase() === '[object object]';
      },
      isArray(value) {
        return Array.isArray(value);
      },
      isValue(value) {
        return !this.isObject(value) && !this.isArray(value);
      },
      isRoot(value) {
        return ['{', '}', '[', ']'].indexOf(value) !== -1;
      },
      getRootDisplayLabel({ expand }, { label }) {
        if (this.isRootNodeExpand) {
          return label;
        }
        if (['{', '['].indexOf(label) !== -1) {
          const suffix = label === '{' ? '}' : ']';
          return `${label} ... ${suffix}`;
        } else {
          return '';
        }
      },
      collapseString(value) {
        if (typeof value !== 'string' ||
          this.collapseStringSize === -1) {
          return value;
        }
        // 字符串长度小于折叠长度的场合
        if (value.length <= this.collapseStringSize) {
          return value;
        }
        return `${value.substring(0, this.collapseStringSize)}...`;
      },
      transformValue(value, key) {
        let displayValue = '';
        let isStringCollapse = false;
        if (value === null) {
          displayValue = 'null';
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          displayValue = value;
        } else if (typeof value === 'string') {
          const collapseStr = this.collapseString(value);
          isStringCollapse = collapseStr !== value;
          displayValue = `"${collapseStr}"`;
        }
        return {
          label: `${key}`,
          value: value,
          displayValue,
          type: 'value',
          valueType: typeof value,
          isStringCollapse
        };
      },
      recursionData(value, keyOrIndex) {
        if (this.isObject(value)) {
          return this.transformObject(value, keyOrIndex);
        }
        if (this.isArray(value)) {
          return this.transformArray(value, keyOrIndex);
        }
        if (this.isValue(value)) {
          return this.transformValue(value, keyOrIndex);
        }
      },

      generateChildrenFromData(val) {
        if (this.isObject(val)) {
          return Object.keys(val).map((key) => this.recursionData(val[key], key));
        } else if (this.isArray(val)) {
          return val.map((item, index) => this.recursionData(item, index));
        } else {
          return this.transformValue(val);
        }
      },

      // Transformer for the Array type
      transformArray(arrayToTransform, indexOrKey) {
        return {
          label: indexOrKey,
          type: 'array',
          children: this.generateChildrenFromData(arrayToTransform),
          value: arrayToTransform
        };
      },

      // Transformer for the Object type
      transformObject(objectToTransform, key) {
        return {
          label: key,
          type: 'object',
          children: this.generateChildrenFromData(objectToTransform),
          value: objectToTransform
        };
      }
    }
  };
</script>
