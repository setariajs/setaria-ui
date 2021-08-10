<template>
  <el-card
    shadow="never"
    class="el-page-header"
    :body-style="{
      padding: 0,
    }"
  >
    <!-- 面包屑 -->
    <el-breadcrumb separator="/"
                   v-if="showBreadCrumb && innerBreadCrumb && innerBreadCrumb.length > 0">
      <el-breadcrumb-item
        v-for="crumb in innerBreadCrumb"
        :to="crumb.path ? { path: crumb.path } : undefined"
        :key="`${crumb.label}-${crumb.path}`"
      >
        {{ crumb.label }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail">
      <div class="logo" v-if="$slots.logo">
        <slot name="logo"></slot>
      </div>
      <div class="main">
        <div class="row">
          <h1 class="title" v-if="currentTitle || $slots.title">
            <template v-if="currentTitle">
              {{ currentTitle }}
            </template>
            <slot name="title" v-else></slot>
          </h1>
          <div class="action" v-if="$slots.action">
            <slot name="action"></slot>
          </div>
        </div>
        <div class="row" v-if="content || $slots.content || $slots.extraContent">
          <div class="el-page-header__content" v-if="content || $slots.content">
            <template v-if="content">
              {{ content }}
            </template>
            <slot name="content" v-else></slot>
          </div>
          <div class="extra-content" v-if="$slots.extraContent">
            <slot name="extraContent"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs" v-if="tabList">
      <el-tabs v-model="nestTabActiveKey" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="tab in tabList"
          :key="tab.key"
          :name="tab.key"
          :label="tab.label"
        ></el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>
<script>
import { getValueByPath, isEmpty } from 'setaria-ui/src/utils/util';

export default {
  name: 'ElPageHeader',
  props: {
    routes: {
      type: Array,
      // 默认使用Vue实例上的$route对象
      default() {
        return this.$route.matched;
      }
    },
    breadCrumb: Array,
    showBreadCrumb: {
      type: Boolean,
      default: true
    },
    title: String,
    content: String,
    tabList: Array,
    tabActiveKey: null
  },
  data() {
    return {
      nestTabActiveKey: null,
      innerBreadCrumb: []
    };
  },
  computed: {
    currentTitle() {
      const { title } = this;
      let ret = title;
      if (isEmpty(title)) {
        ret = getValueByPath(this.$route, 'meta.title') || '';
      }
      return ret;
    }
  },
  watch: {
    tabActiveKey: {
      immediate: true,
      handler(val) {
        this.nestTabActiveKey = val;
      }
    },
    nestTabActiveKey: {
      immediate: true,
      handler(val) {
        this.$emit('update:tabActiveKey', val);
      }
    },
    breadCrumb: {
      immediate: true,
      handler(val) {
        this.innerBreadCrumb = val;
      }
    }
  },
  methods: {
    /**
     * Tab点击事件处理
     * @event
     * @param tabCompoent 被点击的Tab标签页的实例
     * @param evt Event事件对象
     */
    handleTabClick(tabComponent, evt) {
      // 保证先刷新tabActiveKey的值，再触发tab-click事件
      this.$nextTick(() => {
        const tab = this.tabList.find((item) => item.key === this.nestTabActiveKey);
        this.$emit('tab-click', tab, evt);
      });
    }
  }
};
</script>
