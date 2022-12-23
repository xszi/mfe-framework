<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import defaultRoutes from './routesConfig'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      const routes = this.$router.options.routes
      const resultRoutes = process.env.NODE_ENV === 'development' ? defaultRoutes : this.getCombineRoutess()
      return routes.concat(resultRoutes)
      // return this.getCombineRoutess()
    },
    activeMenu() {
      const route = this.$route
      const { meta, fullPath } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return fullPath
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    getCombineRoutess() {
      console.log('getCombineRoutess')
    }
  }
}
</script>
