<template>
  <el-container class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <!-- <tags-view v-if="needTagsView" /> -->
      <!-- <app-main /> -->
      <el-container class="layout-main">
        <el-main id="mainBox">
          <tabs />
          <div v-show="!$route.name" v-loading="appLoading" element-loading-text="加载页面中, 请稍后...">
            <div
              v-for="item in tabsList"
              v-show="item.appName === activeTab.appName"
              :id="item.id"
              :key="item.path"
            />
          </div>
          <div v-show="$route.name">
            <router-view v-slot="{ Component }">
              <keep-alive :include="keepAliveList['iframe'] || []">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </div></el-container>
  </div>

</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import tabs from './components/tabs.vue'
import { menuDataList } from '@/menuData/index.js'
import { mapGetters } from 'vuex'

export default {
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    tabs
  },
  mixins: [ResizeMixin],
  data() {
    return {
      menuDataList
    }
  },
  computed: {
    ...mapGetters({
      keepAliveList: 'tabs/keepAliveList',
      activeTab: 'tabs/activeTab',
      tabsList: 'tabs/tabsList',
      appLoading: 'tabs/appLoading'
    }),
    needTagsView() {
      return false
    },
    sidebar() {
      return this.$store.state.app?.sidebar
    },
    device() {
      return this.$store.state.app?.device
    },
    fixedHeader() {
      return this.$store.state.settings?.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.app-wrapper {
  height: 100%;
  width: 100%;
  .main-container {
    width: 100%;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
.layout-main {
  height: calc(100% - 64px);
  width: 100%;
}
.el-header {
  padding-left: 0 !important;
  height: 64px !important;
  background: #393d49;
  .logo {
    color: #fff;
    padding-left: 54px;
    background-size: 54px 54px;
    line-height: 64px;
    height: 64px;
    font-size: 20px;
    font-weight: 400;
  }
  .el-dropdown {
    cursor: pointer;
    margin-right: 6px;
    color: #fff;
    line-height: 64px;
    font-size: 16px;
    height: 64px;
    .el-icon {
      vertical-align: middle;
      font-size: 16px;
      margin-right: 5px;
    }
  }
}

.el-main {
  padding-top: 0 !important;
  position: relative;
}
</style>
