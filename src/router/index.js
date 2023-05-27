import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';
// import { History } from '@shopify/app-bridge/actions';
import utilsAuth from '@/utils/auth';
// import Middleware from "@/assets/js/Middleware";


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

export const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  // 主页
  {
    path: '/home',
    name: 'home',
    hidden: false,
    component: view('home/home'),
    meta: {
      svg: 'home',
      title: 'Home',
      urlStatus: '/home',
    }
  },
  //  name是作为导航的key,具有唯一性 
  // 登录页
  {
    path: '/login',
    hidden: true,
    component: view('login/login'),
    meta: {
      svg: 'login',
      title: 'Login',
      urlStatus: '/login'
    },
    children: [
      {
        path: '/',
        name: 'loginCard',
        hidden: true,
        component: view('login/loginCard'),
        meta: {
          svg: 'loginCard',
          title: 'Login',
          urlStatus: '/',
        }
      },
      {
        path: 'register',
        name: 'register',
        hidden: true,
        component: view('login/registerCard'),
        meta: {
          svg: 'register',
          title: 'Register',
          urlStatus: '/register',
        }
      },
    ]
  },
  // 404
  {
    path: '/404',
    name: '404',
    hidden: true,
    component: view('NotFoundPage'),
    meta: {
      title: 'Page Not Found'
    }
  },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  mode: 'history',
  routes,//请注意这里使用了语法糖，完整写法应该是 routes: routes
})


// let loginRoute = ['/', '/login', '/signup', '/forgot', '/verifyEmail', '/contactUs', '/middlePage', '/loading', '/reLogin', '/adminHome', '/adminLogin', '/adminRegister', '/goUserShop']
// 路由全局前置守卫
// https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#全局前置守卫
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  /* 添加对手机屏幕的自适应代码 */
  if (to.meta.title) {
    document.title = to.meta.title
    document.querySelector("meta[name='viewport']")["content"] = "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0"
  }

  // if (store.state.shopifyAppObj !== null) {
  //     //参考文档：https://shopify.dev/tools/app-bridge/actions/navigation/history
  //     //实现，当用户点击本应用相关导航栏时，同时改变 地址栏 URL
  //     //这样就可以解决用户刷新页面，打开页面丢失的问题
  //     const history = History.create(store.state.shopifyAppObj);
  //     history.dispatch(History.Action.PUSH, to.path);
  // }

  // 判断是否信息丢失 
  let token = utilsAuth.getToken()
  let noTokenPath = ['/login', '/login/register']
  if (noTokenPath.includes(to.path)) {
    utilsAuth.removeToken()
    next()
  } else if (!noTokenPath.includes(to.path) && (token === null || token === "")) {
    next('/login')
  } else {
    next()
  }

})

router.afterEach(() => {
  // if (!loginRoute.includes(to.path)) {
  //   Middleware.$emit('hidden', false)
  // }
  //跳转后，返回顶部页面
  // window.scrollTo(0, 0);
  // console.log(store.state.userInfo);

  // 是否Vuex数据丢失
  if (!store.state.userInfo) {
    store.commit('setUserInfo', JSON.parse(utilsAuth.getUserInfo()))
  }
})

function view(name) {
  return resolve => require(['@/views/' + name + '.vue'], resolve);
}

export default router
