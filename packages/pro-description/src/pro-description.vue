<template>
  <el-description :column="columns"
    :label-suffix="labelSuffix"
    :border="bordered"
    :direction="direction">
    <el-description-item v-for="key in Object.keys(innerItems)"
      :key="key"
      :span="getDescriptionSpan(key)"
      :label="innerItems[key].title"
      :label-class-name="`pro-description__label pro-description__label-${key.toLowerCase()}`"
      :content-class-name="`pro-description__content-${key.toLowerCase()}`">
      <slot :name="key"
        :data="innerData[key]">
        {{ innerData[key] }}
      </slot>
      <template v-if="$scopedSlots[`label.${key}`]"
        slot="label">
        <slot :name="`label.${key}`"
          :data="innerData">
        </slot>
      </template>

    </el-description-item>
  </el-description>
</template>
<script>
import { JSON_UI_SCHEMA } from 'setaria-ui/src/constants/index';
import { createFormatter } from 'setaria-ui/src/utils/schema';
import { isEmpty } from 'setaria-ui/src/utils/util';

// 默认列宽度
const DEFAULT_COL_SPAN = 1;

export default {
  name: 'ElProDescription',
  props: {
    columns: {
      type: Number,
      default: 3
    },
    labelSuffix: {
      type: String,
      default: ':'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    bordered: {
      type: Boolean,
      default: true
    },
    data: Object,
    schema: {
      type: Object,
      required: true
    },
    uiSchema: {
      type: Object
    }
  },
  computed: {
    innerItems() {
      const ret = {};
      const { schema, uiSchema } = this;
      if (isEmpty(schema.properties)) {
        return {};
      }
      Object.keys(schema.properties).forEach((key) => {
        // 隐藏的项目不显示
        if (
          !(uiSchema[key] && uiSchema[key][JSON_UI_SCHEMA.UI_HIDDEN] === true)
        ) {
          ret[key] = schema.properties[key];
        }
      });
      return ret;
    },
    innerData() {
      const ret = {};
      const { data, schema } = this;
      if (isEmpty(data)) {
        return {};
      }
      Object.keys(data).forEach((key) => {
        let value = data[key];
        const formatter = createFormatter(schema.properties[key] || {});
        if (formatter) {
          value = formatter(value);
        }
        ret[key] = value;
      });
      return ret;
    }
  },
  methods: {
    getDescriptionSpan(key) {
      console.log(
        this.$slots,
        this.$scopedSlots,
        this.$slots['label.CustomSlot']
      );
      const { uiSchema } = this;
      if (
        uiSchema[key] &&
        typeof uiSchema[key][JSON_UI_SCHEMA.UI_COLSPAN] === 'number'
      ) {
        return uiSchema[key][JSON_UI_SCHEMA.UI_COLSPAN];
      }
      return DEFAULT_COL_SPAN;
    }
  }
};
</script>