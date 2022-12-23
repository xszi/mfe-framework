<template>
  <el-container class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <el-header class="clearfix" />
    <el-container class="layout-main">
      <el-aside id="asideLeft" width="210px">
        <el-menu
          :unique-opened="true"
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          text-color="#fff"
          :default-active="$route.path + ''"
          router
        >
          <div v-for="(item, index) in menuDataList" :key="index">
            <el-menu-item :index="item.path" :title="item.title">
              <i v-if="item.icon" :class="['iconfont', item.icon]" />
              <template #title>
                <span>{{ item.title }}</span>
              </template>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-main id="mainBox">
        <tabs />
        <!-- 子应用页面 -->
        <div v-show="!$route.name" v-loading="appLoading" element-loading-text="加载页面中, 请稍后...">
          <div
            v-for="item in tabsList"
            v-show="item.appName === activeTab.appName"
            :id="item.id"
            :key="item.path"
          />
        </div>

        <!-- 主应用页面 -->
        <div v-show="$route.name">
          <router-view v-slot="{ Component }">
            <keep-alive :include="keepAliveList['iframe'] || []">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
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
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";
.app-wrapper {
  height: 100%;
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
