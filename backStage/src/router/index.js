import Vue from 'vue'
import Router from 'vue-router'
import {
  routerMode
} from '@/config/env'
import store from '@/config/store'
Vue.use(Router)
//路由配置
const routes = [{
  path: '/',
  name: 'login',
  component: resolve => require(['@/page/common/login.vue'], resolve)
}, {
  path: '/home',
  name: 'home',
  component: resolve => require(['@/page/common/home.vue'], resolve),
  children: [{
      //内容管理
      path: '/contentManage',
      component: function (resolve) {
        require(['@/page/contentManage/index.vue'], resolve)
      }
    },
    {
      //内容管理-添加内容
      path: '/contentAdd',
      component: function (resolve) {
        require(['@/page/contentManage/add.vue'], resolve)
      }
    },
    {
      //内容管理-编辑内容
      path: '/contentEdit/:id',
      component: function (resolve) {
        require(['@/page/contentManage/edit.vue'], resolve)
      }
    },
    {
      //商品管理
      path: '/goodsManage',
      component: function (resolve) {
        require(['@/page/goodsManage/index.vue'], resolve)
      }
    },
    {
      //商品管理-添加商品
      path: '/goodsAdd',
      component: function (resolve) {
        require(['@/page/goodsManage/add.vue'], resolve)
      }
    },
    {
      //商品管理-编辑商品
      path: '/goodsDetails/:id',
      component: function (resolve) {
        require(['@/page/goodsManage/details.vue'], resolve)
      }
    },
    {
      //红包管理
      path: '/redPacketManage',
      component: function (resolve) {
        require(['@/page/redPacketManage/index.vue'], resolve)
      }
    },
    {
      //红包管理-编辑红包
      path: '/redPacketEdit/:id',
      component: function (resolve) {
        require(['@/page/redPacketManage/edit.vue'], resolve)
      }
    },
    {
      //红包管理-红包详情
      path: '/redPacketDetails/:id',
      component: function (resolve) {
        require(['@/page/redPacketManage/details.vue'], resolve)
      }
    },
    {
      //红包管理-添加红包
      path: '/redPacketAdd',
      component: function (resolve) {
        require(['@/page/redPacketManage/add.vue'], resolve)
      }
    },
    {
      //提现审核
      path: '/poresentAudit',
      component: function (resolve) {
        require(['@/page/poresentAudit/index.vue'], resolve)
      }
    },
    {
      //商家管理
      path: '/sellersManage',
      component: function (resolve) {
        require(['@/page/sellersManage/index.vue'], resolve)
      }
    },
    {
      //商家管理-添加商家
      path: '/sellersManageAdd',
      component: function (resolve) {
        require(['@/page/sellersManage/add.vue'], resolve)
      }
    },
    {
      //商家管理-编辑商家
      path: '/sellersManageEdit/:id',
      component: function (resolve) {
        require(['@/page/sellersManage/edit.vue'], resolve)
      }
    },
    {
      //用户管理
      path: '/userManage',
      component: function (resolve) {
        require(['@/page/userManage/index.vue'], resolve)
      }
    },
    {
      //用户协议
      path: '/userAgreement',
      component: function (resolve) {
        require(['@/page/userAgreement/index.vue'], resolve)
      }
    },
    {
      //隐私权政策
      path: '/userPolicy',
      component: function (resolve) {
        require(['@/page/userPolicy/index.vue'], resolve)
      }
    },
    {
      //版本管理
      path: '/version',
      component: function (resolve) {
        require(['@/page/version/index.vue'], resolve)
      }
    },
    {
      //版本添加
      path: '/versionAdd',
      component: function (resolve) {
        require(['@/page/version/add.vue'], resolve)
      }
    },
    {
      //版本编辑
      path: '/versionEdit/:id',
      component: function (resolve) {
        require(['@/page/version/edit.vue'], resolve)
      }
    },
    {
      //版本详情
      path: '/versionDetail/:id',
      component: function (resolve) {
        require(['@/page/version/detail.vue'], resolve)
      }
    },
    {
      //订单管理
      path: '/ordersManage',
      component: function (resolve) {
        require(['@/page/ordersManage/index.vue'], resolve)
      }
    },
    {
      //订单详情
      path: '/ordersDetails/:id',
      component: function (resolve) {
        require(['@/page/ordersManage/details.vue'], resolve)
      }
    }
  ]
}];
let router = new Router({
  //模式
  mode: routerMode,
  //代码检查
  // strict: process.env.NODE_ENV !== 'production',
  //页面滚动
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes
});
//页面加载时
router.beforeEach(function (to, from, next) {
  store.commit('setPageLoading', true);
  store.commit('setPath', to.path)
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next();
  }
});
//页面销毁时
router.afterEach(function (to) {
  store.commit('setPageLoading', false);
});
export default router;
