<template>
    <div class="admin animated fadeInUp" onselectstart="return false">
      <el-container class="" :v-loading="false"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-header height="50px">
          <div class="logoandtitle">
            <img src="../assets/logo.png" alt="logo" width="50" height="50">
            <span>云店小二智慧餐饮</span>
          </div>
          <ul class="iconlist">
            <li>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>修改密码</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </el-header>
        <el-container class="leftmenu">
          <el-aside width="205px">
            <el-row class="tac">
              <el-menu
                :default-active="$route.path"
                class="el-menu-vertical-demo"
                active-text-color="#ff4141"
                router
                @open="handleOpen"
                @close="handleClose"
                @select="select"
                unique-opened>
                <el-menu-item index="/index">
                  <i class="el-icon-menu"></i>
                  <span slot="title">首页</span>
                </el-menu-item>
                <el-submenu index="dishes" v-if="right.a.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>商品管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/disheslist"  v-if="right.a.sub.a1">菜品</el-menu-item>
                    <el-menu-item index="/spec" v-if="right.a.sub.a2">规格</el-menu-item>
                    <el-menu-item index="/unit" v-if="right.a.sub.a3">单位</el-menu-item>
                    <el-menu-item index="/classify" v-if="right.a.sub.a4">分类</el-menu-item>
                    <el-menu-item index="/wine" v-if="right.a.sub.a5">酒水</el-menu-item>
                    <el-menu-item index="1-6" v-if="right.a.sub.a6">其他</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="table" v-if="right.b.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>桌台管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/tablelist" v-if="right.b.sub.b1">桌台列表</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3" v-if="right.c.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>订单管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/orderlist"  v-if="right.c.sub.c1">全部订单</el-menu-item>
                    <el-menu-item index="/billlist"  v-if="right.c.sub.c2">挂账</el-menu-item>
                    <el-menu-item index="3-3"  v-if="right.c.sub.c3">预定</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4" v-if="right.d.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>会员管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/viplist"  v-if="right.d.sub.d1">会员列表</el-menu-item>
                    <el-menu-item index="/viplevel"  v-if="right.d.sub.d2">会员等级</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5" v-if="right.e.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>营销管理</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="5-1"  v-if="right.e.sub.e1">打折促销</el-menu-item>
                    <el-menu-item index="5-2"  v-if="right.e.sub.e2">满减促销</el-menu-item>
                    <el-menu-item index="5-3"  v-if="right.e.sub.e3">固定套餐</el-menu-item>
                    <el-menu-item index="5-4"  v-if="right.e.sub.e4">特价菜</el-menu-item>
                    <el-menu-item index="5-5"  v-if="right.e.sub.e5">优惠券</el-menu-item>
                    <el-menu-item index="5-5"  v-if="right.e.sub.e6">会员管理</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="6" v-if="right.f.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>数据分析</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/business"  v-if="right.f.sub.f1">销售统计</el-menu-item>
                    <el-menu-item index="6-2"  v-if="right.f.sub.f2">菜品销量</el-menu-item>
                    <el-menu-item index="6-3"  v-if="right.f.sub.f3">采购统计</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="7" v-if="right.g.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>智能仓管</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="7-1"  v-if="right.g.sub.g1">原料</el-menu-item>
                    <el-menu-item index="7-2"  v-if="right.g.sub.g2">原料分类</el-menu-item>
                    <el-menu-item index="7-3"  v-if="right.g.sub.g3">原料进货</el-menu-item>
                    <el-menu-item index="7-4"  v-if="right.g.sub.g4">规格列表</el-menu-item>
                    <el-menu-item index="7-4"  v-if="right.g.sub.g5">采购录入</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-submenu index="8" v-if="right.h.right">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>智能设置</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item index="/staff"  v-if="right.h.sub.h1">员工管理</el-menu-item>
                    <el-menu-item index="8-2"  v-if="right.h.sub.h2">打印机设置</el-menu-item>
                    <el-menu-item index="/stall"  v-if="right.h.sub.h3">档口设置</el-menu-item>
                    <el-menu-item index="/shopinfo"  v-if="right.h.sub.h4">商家设置</el-menu-item>
                    <el-menu-item index="/remark"  v-if="right.h.sub.h5">备注设置</el-menu-item>
                    <el-menu-item index="/right"  v-if="right.h.sub.h6">权限设置</el-menu-item>
                    <el-menu-item index="8-7"  v-if="right.h.sub.h7">个人中心</el-menu-item>
                    <el-menu-item index="8-8"  v-if="right.h.sub.h8">预定设置</el-menu-item>
                    <el-menu-item index="8-9"  v-if="right.h.sub.h9">帮助中心</el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </el-menu>
            </el-row>
          </el-aside>
          <el-main>
            <router-view/>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>
<script>
export default {
  data () {
    return {
      isCollapse: false,
      num: 3,
      right: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._getSessionRight_()
    })
  },
  methods: {
    _getSessionRight_ () {
      this.right = JSON.parse(sessionStorage.getItem('right')).manage.sub
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    zhankai () {
      if (this.isCollapse) {
        this.isCollapse = false
      } else {
        this.isCollapse = true
      }
    },
    select (index, indexPath) {
      console.log(index, indexPath)
    }
  }
}
</script>
<style lang="scss">
@import '../../static/css/animal.css';
  .admin{
    width:100%;
    height:100%;
  }
  .el-container{
    height:100%;
    .leftmenu{
      .el-menu-item.is-active{
        color:#fff !important;
        background: #ff4141;
      }
    }
  }
  .el-header{
    color: #fff;
    background-color: #333;
    .logoandtitle{
      display: flex;
      line-height:50px;
      vertical-align: middle;
      img{
        margin-right:20px;
      }
    }
    .iconlist{
      display: flex;
      position: absolute;
      right:30px;
      top:0;
      li{
        margin:0 10px;
        line-height:50px;
      }
      i{
        font-size:30px;
        color:#fff;
      }
      [class^=el-icon-] {
        line-height:50px;
      }
    }
  }
  .el-aside {
    height:100%;
    background-color: #fff;
    color: #333;
    text-align: center;
  }
  .el-main {
    padding:10px 10px 0 10px;
    background-color: #E9EEF3;
    color: #333;
  }
</style>
