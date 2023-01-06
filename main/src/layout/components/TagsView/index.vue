<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <!-- :to="getToPathObj(tag)" -->
      <span
        v-for="tag in tabsList"
        ref="tag"
        :key="tag.fullPath"
        :class="isActive(tag)?'active':''"
        tag="span"
        class="tags-view-item"
        @click="changeActiveTab(tag)"
        @click.middle.native="!isAffix(tag)?removeTab(tag):''"
      >
        {{ tag ? tag.title : '' }}
        <span v-if="!isAffix(tag) && tabsList.length>1" class="el-icon-close" @click.prevent.stop="removeTab(tag)" />
      </span>
    </scroll-pane>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tabs from '@/qiankun/tabs.js'
import EventBus from '@/utils/eventBus'
import { routeCache } from '@/utils/routeCache'
import ScrollPane from './ScrollPane'
// import path from 'path'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      visitedViews: []
    }
  },
  computed: {
    ...mapGetters({
      tabsList: 'tabs/tabsList',
      activeTab: 'tabs/activeTab'
    })
  },
  mounted() {
    // this.addTags()
    this.visitedViews = JSON.parse(sessionStorage.getItem('visitedViews')) ? JSON.parse(sessionStorage.getItem('visitedViews')) : [this.$route]
    EventBus.$on('setRouteCache', this.getRouteCache)
  },
  methods: {
    changeActiveTab(item) {
      this.$router.push(item.fullPath)
    },
    getRouteCache() {
      this.visitedViews = JSON.parse(sessionStorage.getItem('visitedViews'))
    },
    getToPathObj(tag) {
      let path = ''; let fullPath = ''
      if (tag?.meta?.childApp) {
        const hashStr = tag.meta.mode === 'hash' ? '/#' : ''
        path = `/layout/${tag.meta.childApp}${hashStr}${tag.path}`
        fullPath = `/layout/${tag.meta.childApp}${hashStr}${tag.path}`
      } else {
        path = tag.fullPath
      }
      return {
        path,
        query: tag.query,
        fullPath
      }
    },
    isActive(route) {
      if (route?.meta?.childApp) {
        const hashStr = route.meta.mode === 'hash' ? '/#' : ''
        const matchPath = `/layout/${route.meta.childApp}${hashStr}${route.path}`
        return matchPath.split('?')[0] === this.$route.fullPath
      } else {
        return route.path === this.$route.path
      }
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    // filterAffixTags(routes, basePath = '/') {
    //   let tags = []
    //   routes.forEach(route => {
    //     if (route?.meta?.affix) {
    //       const tagPath = path.resolve(basePath, route.path)
    //       tags.push({
    //         fullPath: tagPath,
    //         path: tagPath,
    //         name: route.name,
    //         meta: { ...route.meta }
    //       })
    //     }
    //     if (route.children) {
    //       const tempTags = this.filterAffixTags(route.children, route.path)
    //       if (tempTags.length >= 1) {
    //         tags = [...tags, ...tempTags]
    //       }
    //     }
    //   })
    //   return tags
    // },
    // initTags() {
    //   const affixTags = this.affixTags = this.filterAffixTags(this.routes)
    //   for (const tag of affixTags) {
    //     // Must have tag name
    //     if (tag.name) {
    //       routeCache.addVisitedView(tag)
    //     }
    //   }
    // },
    addTags() {
      const { name } = this.$route
      if (name) {
        routeCache.addVisitedView(this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      if (!tags) return
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.path !== this.$route.path) {
              routeCache.updateVisitedView(this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      routeCache.delCachedView(view)
      const { fullPath } = view
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    },
    closeSelectedTag(view) {
      routeCache.delVisitedView(view)
      const visitedViews = JSON.parse(sessionStorage.getItem('visitedViews'))
      this.visitedViews = visitedViews
      if (this.isActive(view)) {
        this.toLastView(visitedViews, view)
      }
    },
    removeTab(item) {
      if (this.tabsList.length === 1) {
        return
      }
      tabs.closeTab(item)
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        let lastRoutePath
        if (latestView.meta?.childApp) {
          // 子应用使用hash模式路由
          const hashStr = latestView.meta.mode === 'hash' ? '/#' : ''
          lastRoutePath = `/layout/${latestView.meta.childApp}${hashStr}${latestView.path}`
        }
        this.$router.push(latestView.meta?.childApp ? lastRoutePath : latestView.fullPath)
      } else {
        if (view.name === 'home') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    handleScroll() {
      console.warn('scroll')
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
