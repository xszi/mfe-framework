<template>
  <div id="app" v-loading="globalLoading">
    <router-view />
  </div>
</template>
<script>
import EventBus from '@/utils/eventBus'
import actions from '@/shared/actions'
import { logout } from '@/utils/util'

export default {
  name: 'App',
  computed: {
    globalLoading() {
      return this.$store.state.app?.globalLoading
    }
  },
  mounted() {
    // this.handleTabChange()
    this.handleGlobalState()
    this.handlePostMessage()
    this.setDocumentTitle()
  },
  methods: {
    handleTabChange() {
      document.addEventListener('visibilitychange', () => { // 浏览器tab切换监听事件
        if (document.visibilityState === 'visible') { // 状态判断：显示（切换到当前页面）
          // 切换到页面执行事件
          const storeToken = this.$store.state.user.signFrameToken
          const localToken = sessionStorage.getItem('sign_frame_token')
          if (storeToken !== localToken) {
            this.$alert('检测到登录用户有变更，请确认使用新登录用户操作。', '系统提示', {
              confirmButtonText: '确定',
              callback: () => {
                location.reload()
              }
            })
          }
        }
      })
    },
    handlePostMessage() {
      window.addEventListener('message', (e) => {
        try {
          const data = e.data
          const processConfigReLogin = data.from === 'processConfig' && data.event === 'reLogin'
          const templateRelogin = data.from === 'template' && data.event === 'reLogin'
          const openRelogin = data.from === 'open' && data.event === 'reLogin'
          if (processConfigReLogin || templateRelogin || openRelogin) {
            logout()
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    handleGlobalState() {
      actions.setGlobalState({ visitedViews: [], value: 0 })
      // 注册一个观察者函数
      actions.onGlobalStateChange((state, prevState) => {
        if (state.visitedViews.length > 0) {
          sessionStorage.setItem('visitedViews', JSON.stringify(state.visitedViews))
          EventBus.$emit('setRouteCache')
        }
      })
    },
    setDocumentTitle() {
      document.title = 'MFE'
    }
  }
}
</script>
<style lang="scss">
#app,
#app1,
#app2 {
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
html {
  width: 100%;
  height: 100%;
}
body {
  width: 100%;
  height: 100%;
}
</style>
