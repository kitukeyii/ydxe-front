import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import admin from '@/components/admin'
import index from '@/components/main/index'
import dishesList from '@/components/main/dishes/disheslist'
import spec from '@/components/main/dishes/spec'
import classify from '@/components/main/dishes/classify'
import tablelist from '@/components/main/table/tablelist'
import orderlist from '@/components/main/order/orderlist'
import billlist from '@/components/main/order/billlist'
import stall from '@/components/main/set/stall'
import remark from '@/components/main/set/remark'
import staff from '@/components/main/set/staff'
import shopinfo from '@/components/main/set/shopinfo'
import right from '@/components/main/set/right'
import business from '@/components/main/data/business'
import wine from '@/components/main/dishes/wine'
import unit from '@/components/main/dishes/unit'
import viplist from '@/components/main/vip/viplist'
import viplevel from '@/components/main/vip/viplevel'
import NotFoundComponent from '@/components/404'
import cashier from '@/components/cashier'
import tables from '@/components/cashier/table/tables'
import yudian from '@/components/cashier/table/yudian'
import orderdishes from '@/components/orderdishes'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/stall',
      name: 'stall',
      component: stall,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/index',
          name: 'index',
          component: index,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/disheslist',
          name: 'disheslist',
          component: dishesList,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/spec',
          name: 'spec',
          component: spec,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/classify',
          name: 'classify',
          component: classify,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/tablelist',
          name: 'tablelist',
          component: tablelist,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/orderlist',
          name: 'orderlist',
          component: orderlist,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/billlist',
          name: 'billlist',
          component: billlist,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/remark',
          name: 'remark',
          component: remark,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/staff',
          name: 'staff',
          component: staff,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/shopinfo',
          name: 'shopinfo',
          component: shopinfo,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/business',
          name: 'business',
          component: business,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/right',
          name: 'right',
          component: right,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/wine',
          name: 'wine',
          component: wine,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/unit',
          name: 'unit',
          component: unit,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/viplist',
          name: 'viplist',
          component: viplist,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/viplevel',
          name: 'viplevel',
          component: viplevel,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '*',
      component: NotFoundComponent
    },
    {
      path: '/cashier',
      name: 'cashier',
      component: cashier,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: '/tables',
          name: 'tables',
          component: tables,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/yudian',
          name: 'yudian',
          component: yudian,
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/orderdishes',
      name: 'orderdishes',
      component: orderdishes,
      meta: {
        requiresAuth: true
      }
    }
  ]
})
