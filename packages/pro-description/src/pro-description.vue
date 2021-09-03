<template>
  <el-description :columns="columns">
    <el-description-item
      v-for="key in Object.keys(innerLabelModeSchemaProps)"
      :key="key"
      :span="getDescriptionSpan(key)"
      :label="innerLabelModeSchemaProps[key].title"
    >
      <slot :name="`desc.${key}`" :data="innerValue[key]">
        <span
          v-if="innerLabelModeSchemaProps[key]['ui:showHtmlContent'] === true"
          v-html="formatter(key, innerValue[key])"
        >
        </span>
        <template v-else>
          {{ formatter(key, innerValue[key]) }}
        </template>
      </slot>
    </el-description-item>
  </el-description>
</template>
<script>
export default {
  name: 'ElProDescription',
  props: {
    columns: {
      type: Number,
      default: 3
    },
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
      const UI_HIDDEN = 'ui:hidden';
      Object.keys(innerSchema.properties).forEach((k) => {
        if (!(innerUiSchema[k] && innerUiSchema[k][UI_HIDDEN])) {
          tempSchemaProps[k] = innerSchema.properties[k];
        }
      });
      Object.keys(innerUiSchema).forEach((k) => {
        const property = tempSchemaProps[k];
        const uiProperty = innerUiSchema[k];
        if (property) {
          tempSchemaProps[k] = _.assign({}, property, uiProperty);
        }
      });
    }
  }
};
</script>