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
    component: () => import('content/login/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('views/home'),
    redirect: "/users",
    children: [
      {
        path: '/users',
        name: 'users',
        component: () => import('content/users/users')
      },
      {
        path: '/roles',
        name: 'roles',
        component: () => import('content/roles/roles')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('content/rights/rights')
      },
      {
        path: '/reports',
        name: 'reports',
        component: () => import('content/reports/reports')
      },
      {
        path: '/params',
        name: 'params',
        component: () => import('content/params/params')
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('content/orders/orders')
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('content/goods/goods'),
      },
      {
        path:'/addGoods',
        name:'addGoods',
        component:()=>import('content/goods/addGoods/addGoods')
      },
      {
        path: '/categories',
        name: 'categories',
        component: () => import('content/categories/categories')
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
