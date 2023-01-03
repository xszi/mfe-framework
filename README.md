> 项目在父文件下会导致 eslint 报错红色提示显示不出来

### 使用 qiankun 改造的 vue2 微前端主应用

#### 主要功能改造

1. iframe 路由映射 ———— 创建独立路由的 Iframe 页面
2. 登陆状态共享（验证码登录）———— 父应用通过 props 传递登录信息到子应用
3. 跨应用跳转 ———— 父应用向子应用传递 Vue-router 实例， this.$parRouter
4. 标签导航共享 ———— visitedViews 统一缓存在父应用 vuex
5. nginx 配置入口，缓存

- 跨域 ———— Access-Control-Allow-Origin
- HTTP 缓存 ———— Cache-Control no-cache，不使用强制缓存(tag / last-modified)
  **注：**
  > 如果什么缓存策略都没设置，浏览器会采用一个启发式的算法，通常会取响应头中的 Date 减去 Last-Modified 值的 10% 作为缓存时间。
  > 重新部署后，router.onError 监听页面跳转失败刷新页面，拉取最新 js 静态文件

6. 跨应用页面缓存 keep-alive
7. 子应用为 vite 启动（待实现）
8. 公共依赖复用（待实现）
9. 项目间组件复用（待实现）
10. 嵌套子子应用（待实现）
11. 嵌入 blink-mind react 子应用（待实现）

#### UMD 格式打包

[可能是最详细的 UMD 模块入门指南](https://juejin.cn/post/6844903927104667662)

#### 缓存问题

- Q1. 每次重新部署代码后需要强制刷新清缓存后才能加载到最新的代码。

**解决办法：**

```
  server {
      listen       8080;
      location / {
          root   /usr/share/nginx/html; # 前端静态资源入口地址
          index  index.html; # 前端静态资源入口文件
          add_header Cache-Control no-cache; # 响应头去掉强制缓存，子应用也要去掉
          try_files $uri $uri/ /index.html; # 使用路由history模式时需要配置
      }
  }
```

- Q2. 打开的页面没有关闭，此阶段有重新部署新代码，会导致点击跳转没反应，打印报错。

**解决办法：**

```js
router.onError((error) => {
  console.error("error----------", error);
  const pattern = /Loading chunk (\d)+ failed/g;
  console.error("router.onError---------------------------");
  const isChunkLoadFailed = error.message.match(pattern);
  console.error("isChunkLoadFailed", isChunkLoadFailed);
  const targetPath = router.history.pending.fullPath;
  console.error("targetPath", targetPath);
  if (isChunkLoadFailed) {
    router.replace(targetPath);
  }
  window.location.reload();
});
```

## Vue2.0/Vue3.0 + qiankun 实现多 tab 标签页路由切换

演示地址 [https://xszi.github.io/mfe-main-app](https://xszi.github.io/mfe-main-app)

```
原理是通过监听主应用的vue-router的 router.beforeEach 方法来动态加载(loadMicroApp)微应用页面
用vuex来管理已加载的微应用和tab标签数据
监听用initialState的变化来执行对微页面内部的路由跳转
用keep-alive来缓存主应用和微应用的页面
关闭微应用页面的tab时修改keep-alive的值并判断是否需要销毁微应用
```

```
各依赖版本
"element-plus": "^1.3.0-beta.5",
"qiankun": "^2.6.3",
"vue": "^3.0.0",
"vue-router": "^4.0.0-0",
"vuex": "^4.0.0-0"
```

#### 路由配置修改

```
主应用使用的是: createWebHistory();
微应用使用的是: createMemoryHistory(window.__POWERED_BY_QIANKUN__ ? '' : `/subPages/app1/`);

每个vue文件都要定义 [name] 属性, 并且要与 router/index.js 内部定义页面参数的 [name] 相同 如:
lib: src/views/user.vue
export default {
    name: 'App1Detail',         >>>=====|
    setup() {},                         |
    methods: {},                        |
    ...                                 |
}                                       |
                                        |=====>>>  2个name的值要相同
...                                     |
lib: src/router/index.js                |
routes = [                              |
    {                                   |
        path: appPath + '/detail',      |
        name: 'App1Detail',     <<<=====|
        component: () => import( '@/views/app1/detail.vue')
    }
]
```

### 路由使用方法

#### 主应用中路由跳转

```
主应用使用的是原生的vue-router的方法
无论是在主应用中跳转主应用页面          主=>主应用页面
还是在主应用中跳转微应用页面            主=>微应用页面

router.push()
router.replace()
router.go(-1)
...
```

#### 微应用中路由跳转

```
微应用跳转自身页面也和原生的vue-router的使用方法一致
参考lib: app2/src/views/user/**

router.push()
router.replace()
router.go(-1)
...

============================ 分割线  =================================

从A微应用跳转B微应用的子页面, 如:
参考lib: app1/src/views/about.vue
...
    import { getCurrentInstance } from 'vue'

    setup() {
        const instance = getCurrentInstance()

        let jump = () => {
            instance.appContext.config.globalProperties.$parentRouter.push('/app2/user')
        }

        return {
            jump
        }
    }
...

============================ 分割线  =================================

在微应用中关闭当前活跃的tab标签,如:
参考lib: app1/src/views/user.vue

    let closeActiveTab = () => {
    action.setGlobalState({
        changeMicoTabsPath: {
            type: 'closeActiveTab',
        },
    })
}

============================ 分割线  =================================

在微应用中关闭当前已加载的其他tab标签,如:
参考lib: app1/src/views/user.vue

let closeOtherTab = () => {
    action.setGlobalState({
        changeMicoTabsPath: {
            type: 'closeOtherTab',
            path: '/app1/about',
        },
    })
}

```

如果觉得有用的话,还请给个 Star😁😁😁
