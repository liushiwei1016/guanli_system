import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: 'login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login_home" */ 'content/login/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "login_home" */ 'views/home'),
    redirect: "/users",
    children: [
      {
        path: '/users',
        name: 'users',
        component: () => import(/* webpackChunkName: "Foo_0" */ 'content/users/users')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import(/* webpackChunkName: "Foo_0" */'content/roles/roles')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import(/* webpackChunkName: "Foo_0" */'content/rights/rights')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import(/* webpackChunkName: "Foo_1" */'content/reports/reports')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import(/* webpackChunkName: "Foo_1" */'content/params/params')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "Foo_1" */'content/orders/orders')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import(/* webpackChunkName: "FooFoo_2" */'content/goods/goods'),
      },
      {
        path: '/addGoods',
        name: 'addGoods',
        component: () => import(/* webpackChunkName: "FooFoo_2" */'content/goods/addGoods/addGoods')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import(/* webpackChunkName: "FooFoo_2" */'content/categories/categories')
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

/**
 * 路由导航守卫控制访问权限
 * 挂载路由导航守卫，判断用户是否成功登录( 判断 sessionStorage 里面是否有 token )
 * 如果没有 token 不允许调到其他页面，强制返回‘/login’登录页面
 **/
router.beforeEach((to, from, next) => {
  //如果用户访问登录页面，直接放行进入
  if (to.path === '/login') return next();
  //从 sessionStorage 中获取 token 值
  const tokenStr = window.sessionStorage.getItem('token');
  //没有 token ，强制跳转到 ‘/login’ 登录页
  if (!tokenStr) return next('/login');
  next()
});

export default router
