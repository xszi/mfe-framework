const routes = [{
  meta: { title: 'main-首页', icon: 'record' },
  title: 'main-首页',
  path: '/home'
},
{
  title: 'main-关于',
  path: '/about?id=123123123'
},
{
  title: 'main-用户',
  path: '/user'
},
{
  meta: { title: 'App1 User', icon: 'record' },
  title: 'App1 User',
  path: '/app1/user'
},
{
  meta: { title: 'App1 About', icon: 'record' },
  title: 'App1 About',
  path: '/app1/about'
},
{
  meta: { title: 'App2-User', icon: 'record' },
  title: 'App2-User',
  path: '/app2/user'
},
{
  meta: { title: 'App2-About', icon: 'record' },
  title: 'App2-About',
  path: '/app2/about'
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
// const routes = [
//   {
//     path: '/layout/v2-sub-app',
//     meta: { title: 'SUB-JAY', icon: 'record', childApp: 'v3-sub-app' },
//     children: [
//       {
//         path: '/layout/v2-sub-app/nginx-prefix/nginx',
//         meta: { title: '可爱女人', icon: '', childApp: 'v2-sub-app' }
//       },
//       {
//         path: '/layout/v2-sub-app/nginx-prefix/other',
//         meta: { title: '黑色幽默', icon: '', childApp: 'v2-sub-app' }
//       }
//     ]
//   }
// ]

export default routes
