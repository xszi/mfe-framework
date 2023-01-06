const routes = [
  {
    meta: { title: 'App1', icon: 'record' },
    path: 'app1',
    children: [{
      meta: { title: 'App1 User' },
      title: 'App1 User',
      path: '/app1/user'
    }, {
      meta: { title: 'App1 About' },
      title: 'App1 About',
      path: '/app1/about/'
    }]
  },
  {
    meta: { title: 'App2', icon: 'record' },
    path: '/app2/user',
    children: [{
      meta: { title: 'App2 User' },
      path: '/app2/user'
    }, {
      meta: { title: 'App2 About' },
      path: '/app2/about/'
    }]
  },
  {
    title: '再次打开->App2-About',
    path: '/app2/about?id=123&age=999岁&name=kuaifengle'
  },
  {
    title: '强制打开->App2-userDeatil',
    path: '/app2/user/detail?mustJump=true&pageTabTitle=用户详情'
  },
  {
    title: '假装打开一个加载失败的应用',
    path: '/app3/abc'
  }]

export default routes
