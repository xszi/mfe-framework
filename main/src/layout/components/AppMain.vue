<template>
  <section class="app-main">
    <transition>
      <router-view :key="key" />
    </transition>
    <div id="appContainer" />
  </section>
</template>

<script>
import { menuDataList } from '@/menuData/index.js'
import { mapGetters } from 'vuex'
export default {
  name: 'AppMain',
  components: {
  },
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

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}

.diplayNone {
  display: none;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
