<template>
    <div class="body">
     <!-- 微信支付 -->
        <div v-bind:class="[weChatPayDialog?'db':'dn']">
    <div class="yundialogbody "  style="z-index: 99;">
        <div class="yun-dialog-content" style="margin-top: 10%">
            <div class="dialog-header">{{wechat_status}}
                <i class="iconfont" style="position: absolute;right: 10px;" @click="changeWechatDialog">&#xe65a;</i></div>
            <div class="dialog-body">
                <div style="padding-bottom:50px ;padding-top:10px  "><img src="../../../../static/img/loding.gif"></div>
            </div>
        </div>
        <div> <input type="text" autofocus="autofocus"  ref="wechatCode" style="position: absolute; left: 40%;top:4%"
                     @keyup.enter="getWechatCode" maxlength="18" @blur="getFoucus"></div>
    </div>
        </div>
     <div class="cen-header animated fadeInLeft">
         <ul class="table-status " style="position: relative">
             <li>
                 <i class="iconfont">&#xe607;</i>&nbsp;<span class="status-item">已开台</span><span class="table-status-num">{{tableOfActive}}</span>
             </li>
             <li>
                 <i class="iconfont ">&#xe60f;</i>&nbsp;<span class="status-item">已付款</span><span class="table-status-num">{{tableOfPayed}}</span>
             </li>
             <li>
                 <i class=" iconfont">&#xe610;</i>&nbsp;<span class="status-item">未付款</span><span class="table-status-num">{{tableOfUnpayed}}</span>
             </li>
             <li>
                 <i class=" iconfont">&#xe602;</i><span class="status-item">空闲</span><span class="table-status-num">{{tableOfFree}}</span>
             </li>
             <li class="order-icon r" style="margin-right: 70px;" @click="orderFood(1)">
                 <i class="iconfont">&#xe60b;</i><span class="call-icon-name" style="margin-right: 40px;" >预点</span>
             </li>
                 <el-dropdown trigger="click" style="position: absolute;right:0px;">
                 <li class="call-icon r" ><i class="iconfont">&#xe64f;</i><span class="call-icon-name">呼叫</span>
                     <span class="call-info-num" v-show="callInfoNum > 0">{{callInfoNum}}</span>
                 </li>
                 <el-dropdown-menu slot="dropdown"  v-if="callInfoNum !== 0">
                     <el-dropdown-item v-for="(item,key) in callInfo" v-bind:key="key" style="border-bottom:1px solid #eee">{{item.table_name}} 呼叫 {{item.call_msg}}
                         <el-button style="margin-left:10px;padding:5px 10px;" type="info" plain @click="copyInfo(item.call_id)">我知道了</el-button>
                     </el-dropdown-item>
                     <h4 class="clearCallInfoAll" @click="copyCallInfo()" v-if="callInfoNum !== '0'">清除所有</h4>
                 </el-dropdown-menu>
                 </el-dropdown>
         </ul>
     </div>
     <div class="cen-content animated fadeInLeft">
         <div class="cen-content-header">
             <div :class="{active:ins === -1}" @click="allTaleInfo()">全部桌台</div>
             <div :class="{active:key === ins}" v-for="(item,key) in floorData.items" v-bind:key="key"
                  @click="getTableList(item.table_floor_id,key)" v-if="key < 5">{{item.table_floor_name}}</div>
             <el-dropdown trigger="click">
             <ul class="table-more el-dropdown-link">
                 <li></li>
                 <li></li>
                 <li></li>
             </ul>
                 <el-dropdown-menu slot="dropdown">
                     <el-dropdown-item v-for="(item,key) in floorData.items" v-bind:key="key" @click.native="getTableList(item.table_floor_id,key)">
                         {{item.table_floor_name}}
                     </el-dropdown-item>
                 </el-dropdown-menu>
             </el-dropdown>
         </div>
         <div class="table-btn  l">
             <div class="r-up l" style="width: 50px;height:50px;" @click="tableMoveUp(1)"><span></span></div>
             <div class="r-down r" style="width: 50px;height:50px;" @click="tableMoveUp(0)"><span></span></div>
         </div>
         <div class="cen-content-tablelist">
             <div style="" class="table-contents" :style="{marginTop:(tableMarginTopValue+'px')}">
             <div class="table-item" v-for="(item,key) in tableData.items"
                  v-bind:key="key"
                  :style="{marginTop : selectTableNo === key?'5px':'12px' }"
                  @click="getOrederInfoByTable(item.table_id,item.shop_code,key,item.now_status)" >
             <i class="unhandleOrder iconfont" v-if="item.no_print">&#xe614;</i>
             <span class="unhandleOrderFont" v-if="item.no_print">{{item.no_print}}</span>
           <!--  <div class="table-orderNum">1</div>-->
                 <div class="table-info" >
                 <span class="table-body">
                     <i class="iconfont table-sign" v-if="item.now_status === '空闲'" style="color: #a7b0b5;font-size:40px">&#xe602;</i>
                     <i class="iconfont table-sign" v-if="item.now_status === '开台'" style="color: #fe9a00;font-size:40px">&#xe607;</i>
                     <i class="iconfont table-sign" v-if="item.now_status === '已付款'" style="color:#44c755;font-size:40px">&#xe60f;</i>
                     <i class="iconfont table-sign" v-if="item.now_status === '未付款'" style="color:#fe4040;font-size:40px">&#xe610;</i>
                     <span>{{item.now_status}}</span>
                 </span>
                 <span class="table-footer"><i class="iconfont">&#xe684;</i>{{item.table_mini_person}}-{{item.table_max_person}}</span>
                 </div>
                 <div class="table-id">{{item.table_name}}</div>
             </div>
            <!-- <div class="table-shift " style="display: none">
                 <div class="shift-up"><span></span></div>
                 <div class="shift-down"><span></span></div>
             </div>-->
         </div>
         </div>
     </div>
     <div class="rig-content animated fadeInRight">
         <div class="rig-header">
             <div class="table-num">
                 <div class="l">
                     <span v-if="orderInfo.orderList.table_name">{{orderInfo.orderList.table_name}}</span><span v-else>当前桌台没有订单{{orderInfo.orderList.table_name}}</span>
                     <span v-show="orderInfo.orderList.person">({{orderInfo.orderList.person}}人)</span></div>
                 <div class="r">
                     <span>未支付：</span><span v-if="orderInfo.orderList.data">{{orderInfo.orderList.price.no_price}}</span>
                     <span v-else>--</span></div>
             </div>
             <div class="table-num">
                 <div class="l oreder-num" >
                     <span v-if="orderInfo.orderList.good_num">已点菜{{orderInfo.orderList.good_num}}份</span>
                     <span v-else>已点0份</span>
                 </div>
                 <div class="r total-money"  >共计：<b v-if="orderInfo.orderList.data">{{orderInfo.orderList.price.all_price}}</b><b v-else>--</b></div>
             </div>
         </div>
         <div class="order-list ">
             <div class="order-item" v-for="(item,key) in orderInfo.orderList.data"
                  :style="{marginTop:key===0?(orderMarginTopValue+'px'):0}" v-bind:key="key">
                 <div class="order-title">
                     <div class="order-num">{{item.order_code.substr(12,20)}}</div>
                     <div class="order-time">{{item.order_time.substr(11,5)}}</div>
                     <div class="order-status">{{item.pay_status}}</div>
                 </div>
                 <div class="order-btns">
                     <div class="printer" @click="doPrint(1,key)" v-if="item.order_is_print === '0'" style="margin-left: 34px;">打印</div>
                     <div class="printer" @click="doPrint(1,key)" style="margin-left: 30px;" v-else>已打印</div>
                     <!--<div class="hangup">挂起</div>-->
                     <div class="refund" v-if="item.order_is_refound === '0'" style="margin-left: 42px" @click="refoundAOrder(item.order_id, key, orderInfo.orderList.table_name)">退单</div>
                 </div>
                 <ul class="pro-list">
                     <li v-for="(pro,key) in item.order_good" v-bind:key="key">
                         <div class="pro-base-info"><div class="pro-name l">{{pro.product_name}}</div>
                             <div class="pro-num l">×{{pro.product_num}}</div>
                             <div class="pro-price" >￥{{pro.product_trueprice}}</div>
                             <div class="pro-refund l">退菜</div></div>
                         <div class="pro-remark" v-show="pro.product_remark != 0">{{pro.product_remark}}</div>
                     </li>
                 </ul>
                 <div class="order-remark">备注：{{item.order_remark}}</div>
                 <div class="wave"></div>
             </div>
             <div v-if="orderInfo.orderList.data == ''" class="no-orderInfo">
                 <span class="iconfont">&#xe600;</span>
                 <span >该桌台暂无清单，可进行点餐或翻台！</span>
             </div>
             <div class="r-up-down">
                 <span class="getDown" @click="tablelGetDown">翻台</span>
                 <span class="getDown" @click="turnTable">转台</span>
                 <div class="r-down r" @click="orderMoveUp(0)"><span ></span></div>
                 <div class="r-up r" @click="orderMoveUp(1)"><span></span></div>
             </div>
             <div class="order-btn-list">
                 <div @click="orderFood(0)">点餐/加菜</div>
                 <div @click="payDialogStatus()">付款</div>
                 <div @click="doPrint(0)">打印总单</div>
             </div>
         </div>
     </div>
    <div class="yun-dialog-body " v-show="payDialog" >
        <div class="yun-dialog-content animated bounceInLeft" style="width: 864px;">
            <div class="dialog-header">付款<span style="font-family: '楷体'" v-if="combine">（并台付款中）</span>
                <i class="iconfont closeBtn"  @click="payDialogStatus()">&#xe65a;</i></div>
            <div class="dialog-body" >
                <div class="pay-title-info">
                    <div class="pay-ti-left l">
                        <div class="pay-ti-table "><span>桌&nbsp;&nbsp;&nbsp;&nbsp;台</span>
                            <span class="pay-ti-value" v-if="!combine">{{orderInfo.orderList.table_name}}</span>
                            <span class="pay-ti-value" v-if="combine" v-for="(item, key) in accountInfo.data.tableList" v-bind:key="key">{{item.table_name}}</span>
                        </div>
                        <div class="pay-ti-table "><span>就餐人数</span><span class="pay-ti-value">{{orderInfo.orderList.person}}</span>
                            <span  class="pay-ti-value" style="margin-left:126px;">商品总数</span><span style="margin-left: 20px;">{{orderInfo.orderList.good_num}}</span></div>
                    </div>
                    <div class="pay-ti-right l"><div class="ps-btn" @click="mergeTable" >并台</div></div>
                </div>
                <div class="pay-content ">
                    <div class="pay-content-left">
                        <div class="pay-content-title ">&nbsp;会员信息 <i v-if="isVip" class="vipInfoIcon iconfont">&#xe648;{{isVip}}</i></div>
                        <div class="pay-content-tel" ><span>手&nbsp;机&nbsp;号</span>
                            <input type="text" class="telList" placeholder="请输入手机号码" ref="tel">
                            <i class="iconfont telSearIcon" @click="searVipInfoByTel">&#xe604;</i>
                        </div>
                        <div class="pay-content-title">&nbsp;消费信息</div>
                        <ul class="pay-content-infoList">
                            <li style="margin-bottom: 10px;"><span>选择活动</span>
                                <select class="allActive" @change="getActiveValue" v-model="activityNo">
                                    <option v-bind:value="-1">￥{{tempMoney}}&nbsp;&nbsp;--&nbsp;&nbsp;默认无活动</option>
                                    <option v-for="(item,key) in activeList" v-bind:key="key" v-bind:value="key">
                                        <i>￥{{item.discount_price}}</i>&nbsp;&nbsp;--&nbsp;&nbsp;<span style="min-width: 130px">{{item.activity_name}}</span>
                                        </option>
                                    <option v-bind:value="-2" v-if="vipPrice">会员折扣价：{{vipPrice}}</option>
                                    <option v-bind:value="-3" v-if="proVipPrice">会员商品价：{{proVipPrice}}</option>
                                </select>
                            </li>
                            <li v-if="!combine"><span>共&nbsp;&nbsp;&nbsp;&nbsp;计</span><span>￥{{moneyList.all_price}}</span></li>
                            <li v-if="!combine"><span>已付金额</span><span>￥{{moneyList.pay_price}}</span></li>
                            <li><span>未付金额</span><span>￥{{tempMoney}}</span></li>
                            <li style="line-height:50px;"><span>实际应付</span><span class="clearZero" @click="noChange">抹零</span><span class="fontColor">￥{{moneyList.true_price}}</span></li>
                        </ul>
                    </div>
                    <!-- 普通支付 -->
                    <div class="pay-content-right" v-if="!hungUp">
                        <div class="pay-content-title l" style="margin-left:20px">&nbsp;支付方式</div>
                        <div class="pay-method-list">
                            <div :class="{pmlActive:payKind === 0}" @click="changPayKind(0)">微信</div>
                            <div :class="{pmlActive:payKind === 1}" @click="changPayKind(1)">支付宝</div>
                            <div :class="{pmlActive:payKind === 2}" @click="changPayKind(2)">现金</div>
                            <div :class="{pmlActive:payKind === 3}" @click="changPayKind(3)">会员余额</div>
                        </div>
                        <ul class="pay-content-infoList l">
                            <li><span>抹零金额</span><span class="fontColor">￥{{moneyList.true_price}}</span></li>
                            <li><span>应付金额</span><span class="fontColor">￥{{moneyList.true_price}}</span></li>
                        </ul>
                    </div>
                    <!-- 挂账 -->
                    <div class="pay-content-right " v-if="hungUp">
                        <div class="pay-content-title l" style="margin-left:20px">&nbsp;挂账</div>
                        <div class="pay-content-tel" style="margin-top: 17px;"><span>手&nbsp;机&nbsp;号</span>
                            <input type="text" placeholder="请输入手机号码" class="telList" ref="hungUpTel">
                            <i class="iconfont telSearIcon" @click="hangUpSearch"></i></div>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <div class="dialog-cancel" @click="payDialogStatus()" style="margin-left: 200px;">取&nbsp;&nbsp;消</div>
                <div class="dialog-confirm" @click="hangUp">挂&nbsp;&nbsp;账</div>
                <div class="dialog-confirm" style="background-color: #3fca57;" @click="payment">付&nbsp;&nbsp;款</div>
            </div>
        </div>
    </div>
    <div class="yun-dialog-body " v-show="mergeTableDialog" >
            <div class="yun-dialog-content animated bounceInLeft" style="width: 864px;">
                <div class="dialog-header">并台<i class="iconfont closeBtn"  @click="mergeTableDialogStatus()">&#xe65a;</i></div>
                <div class="dialog-body" >
                    <ul class="merge-floor-list">
                        <li :class="{mergeActive: -1 === mergeFloorActive}" >全部桌台</li>
                       <!-- <li v-for="(item,key) in floorData.items" :class="{mergeActive: key === mergeFloorActive}" v-bind:key="key" @click="changeMergeTable(item.table_floor_id,key)">
                            {{item.table_floor_name}}
                        </li>-->
                    </ul>
                    <ul class="od-more merge-more"><li></li><li></li><li></li></ul>
                </div>
                <div class="merge-table-list" style="float: left;">
                        <div class="merge-table-item" v-for="(item,key) in mergeTableData" v-bind:key="key" @click="chooseMergeTable(key, item.table_id)">
                            <div class="merge-span"  :class="{mergeTableItemActive:item.isSelected === 1 }"><i class="iconfont icon">&#xe602;</i>
                            <span class="mergin-span-btm" :class="{mergeTableItemSpanActive:item.isSelected === 1}"><i class="iconfont">&#xe684;</i>231</span></div>
                            <div class="merget-span-title">{{item.table_name}}</div>
                        </div>
                </div>
                <div class="dialog-footer" style="float: left;">
                    <div class="dialog-cancel" @click="mergeTableDialogStatus()" style="margin-left: 284px;">取&nbsp;&nbsp;消</div>
                    <div class="dialog-confirm" style="background-color: #3fca57;" @click="mergeTableAndPay">确认并付款</div>
                </div>
            </div>
        </div>
        <!-- 转台 -->
        <div class="yun-dialog-body" v-if="turnTableStatus">
            <div class="yun-dialog-content" style="width: 875px;">
                <div class="dialog-header">转台<i class="iconfont" style="float:right;margin-right: 20px;" @click="turnTableDialog">&#xe65a;</i></div>
                <div class="dialog-body">
                    <ul class="merge-floor-list">
                        <li @click="changeMergeTable(0, -1)">全部桌台</li>
                        <li  @click="changeMergeTable(item.table_floor_id,key)">
                        </li>
                    </ul>
                    <div class="merge-table-list" style="float: left;">
                        <div class="merge-table-item" v-for="(item,key) in freeTables" v-bind:key="key" @click="chooseFreeTable(key, item.table_id)">
                            <div class="merge-span"  :class="{mergeTableItemActive:item.isSelected === 1 }"><i class="iconfont icon">&#xe602;</i>
                                <span class="mergin-span-btm" :class="{mergeTableItemSpanActive:item.isSelected === 1}"><i class="iconfont">&#xe684;</i>231</span></div>
                            <div class="merget-span-title">{{item.table_name}}</div>
                        </div>
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel" @click="turnTableDialog">取&nbsp;&nbsp;消</div>
                    <div class="dialog-confirm" @click="turnTableConfirm">确&nbsp;&nbsp;认</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import od from './orderdishes.vue'
import qs from 'qs'
import {mapState, mapMutations} from 'vuex'
import Vue from 'vue'
import layer from 'vue-layer'
Vue.prototype.$layer = layer(Vue)
Vue.prototype.$layer = layer(Vue, {
  msgtime: 3
})
export default {
  data () {
    return {
      freeTables: [],
      orderMarginTopValue: '0',
      turnTableStatus: false,
      autoPrint: 0,
      aliPaySuccess: 0,
      wechat_status: '微信支付',
      mergeTableNo: [0, 1, 3, 6],
      mergeTableData: [],
      ins: -1,
      selectTableNo: '-1',
      activeList: [],
      accountInfo: {
        account: '',
        token: '',
        data: {
          shop_code: '',
          info: {
            type: '',
            table_floor_id: ''
          }
        }
      },
      desc: '',
      bg: '#ff4141',
      flag: true,
      payDialog: false,
      payKind: 0,
      isVip: 0,
      moneyList: [],
      tempMoney: '',
      vipActive: [],
      noChangePrice: '',
      vipPrice: '',
      activityId: '-1',
      vipId: '',
      originalPrice: '',
      proVipPrice: '',
      tableGetDown: 0,
      hungUp: false,
      mergeTableDialog: false,
      mergeFloorActive: -1,
      mergeTableSelected: [],
      combine: 0,
      weChatPayDialog: 0,
      weChatPaySuccess: 0,
      sum: '',
      tableMarginTopValue: 0,
      param: {
        data: []
      },
      activityNo: -1
    }
  },
  computed: {
    ...mapState([
      'bgColor',
      'baseBg',
      'tableHeaderBg',
      'publicapi',
      'callInfoNum',
      'callInfo',
      'orderInfo',
      'tableOfFree',
      'tableOfActive',
      'tableOfPayed',
      'tableOfUnpayed',
      'tableData',
      'floorData'
    ])
  },
  mounted: function () {
    /* 其他 */
    let param = JSON.parse(sessionStorage.getItem('account'))
    this.accountInfo.account = param.account
    this.accountInfo.token = param.token
    this.accountInfo.data.right_id = sessionStorage.getItem('right_id')
    this.accountInfo.data.shop_code = param.shop_code
    this.accountInfo.data.info.type = 0
    this.$http.post(this.publicapi + '/byadmin/setup/return_print_setup_auto', qs.stringify(this.accountInfo))
      .then(res => {
        console.log(res)
        this.autoPrint = res.data.data
      })
    /* 开启定时器 */
    this.orderTimer()
    this.$http.post(this.publicapi + '/home/table/tablelist', qs.stringify(this.accountInfo))
      .then(res => {
        if (res.data.status) {
          console.log('桌面加载是下面的内容：')
          console.log(res)
          this.initialTables(res)
        }
      })
    if (localStorage.getItem('initialKey')) {
      this.initialTable()
    }
  },
  methods: {
    ...mapMutations([
      'getCallInfo',
      'initialCallInfo',
      'getOrderByTableId',
      'initialTables',
      'changeOrderInfoInTime',
      'setTableId',
      'changeFlag1',
      'changeTableStatus',
      'combineTableStatus'
    ]),
    /* 桌台的确认 */
    turnTableConfirm () {
      console.log(this.orderInfo.orderList.data.length)
      if (this.orderInfo.orderList.data.length === 0) {
        this.$layer.msg('次桌台没有订单')
        return 0
      }
      this.accountInfo.data.info.order_all_code = this.orderInfo.orderList.data[0].order_all_code
      this.accountInfo.data.info.type = 1
      this.accountInfo.data.info.swivel_table_id = this.accountInfo.data.table_id
      this.accountInfo.data.info.old_table_id = localStorage.getItem('tableId')
      this.$http.post(this.publicapi + '/home/table/table_swivel', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$layer.msg(res.data.msg)
            this.turnTableStatus = false
          }
        })
    },
    /* 选择桌台 */
    chooseFreeTable (key, tableId) {
      this.accountInfo.data.table_id = tableId
      this.freeTables.forEach((v, i) => {
        this.freeTables[i].isSelected = 0
        Vue.set(this.freeTables, i, this.freeTables[i])
      })
      if (this.freeTables[key].isSelected === 0) {
        this.freeTables[key].isSelected = 1
      } else {
        this.freeTables[key].isSelected = 0
      }
      Vue.set(this.freeTables, key, this.freeTables[key])
    },
    /* 转台的确认 */
    /* 转台的对话框 */
    turnTableDialog () {
      if (this.turnTableStatus) {
        this.turnTableStatus = false
      } else {
        this.turnTableStatus = true
      }
    },
    /* 转台 */
    turnTable () {
      this.turnTableStatus = true
      console.log(this.accountInfo)
      this.accountInfo.data.info.type = 2
      this.$http.post(this.publicapi + '/home/table/table_swivel', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res.data.data)
          this.freeTables = res.data.data
          this.freeTables.forEach((v, i) => {
            this.freeTables[i].isSelected = 0
          })
        })
    },
    /* 定时器，捕获推送过来的消息 */
    orderTimer () {
      setTimeout(() => {
        let lastOrder = this.orderInfo.orderList.data[0]
        console.log(this.autoPrint)
        let autoprint = this.autoPrint
        try {
          if ((autoprint === 2 || autoprint === 3) && lastOrder.pay_status === '已付款' && lastOrder.order_is_print === '0') {
            this.printAOrder(0, 0)
          } else if ((autoprint === 1 || autoprint === 3) && lastOrder.pay_status === '未付款' && lastOrder.order_is_print === '0') {
            this.printAOrder(0, 0)
          }
        } catch (e) {}
        this.orderTimer()
      }, 5000)
    },
    /* 上下移动按钮 */
    tableMoveUp (param) {
      console.log(param)
      if (param === 0) {
        this.tableMarginTopValue -= 100
      } else {
        if (this.tableMarginTopValue === 0 || this.tableMarginTopValue === '0') return
        this.tableMarginTopValue = parseInt(this.tableMarginTopValue) + parseInt(100)
      }
    },
    /* 自动获取焦点 */
    getFoucus () {
      if (this.$refs.wechatCode === undefined || this.$refs.wechatCode.value.length !== 18) {
        this.$refs.wechatCode.focus()
        setTimeout(() => {
          this.$refs.wechatCode.focus()
        }, 1000)
        return 0
      }
    },
    /* 微信密码支付验证 轮询 */
    wechatPayPolling () {
      console.log('轮训执行中:' + this.weChatPaySuccess)
      let self = this
      if (!self.weChatPaySuccess) {
        setTimeout(() => {
          self.$http.post(this.publicapi + '/WxAndAli/pay/get_wxpay_status', qs.stringify(self.param))
            .then(res => {
              console.log(res)
              if (res.data.status && !self.weChatPaySuccess) {
                self.accountInfo.data.info.pay_msg_id = res.data.data
                self.weChatPaySuccess = 1
                console.log('最后执行')
                self.weChatPayDialog = false
                self.payment()
                return 0
              }
            })
          if (!self.weChatPaySuccess) {
            self.wechatPayPolling()
          }
        }, 3000)
      }
    },
    /* 自动获取微信支付和支付宝支付的支付码 */
    getWechatCode () {
      this.$refs.wechatCode.blur()
      this.param.data.pay_auth_code = this.$refs.wechatCode.value
      this.param.data.pay_body = JSON.parse(sessionStorage.getItem('account')).shop_name + '就餐支付'
      this.param.data.pay_price = this.accountInfo.data.payInfo.moneyList.final_price
      // this.param.data.pay_price = 5000
      if (this.accountInfo.data.payInfo.payKind === 0) {
        this.param.data.pay_sub_mchid = sessionStorage.getItem('wxpay')
      } else {
        this.param.data.pay_sub_mchid = sessionStorage.getItem('alipay')
      }
      let ranNumer = Math.floor(Math.random() * 1000)
      if (ranNumer < 10) {
        ranNumer = '00' + ranNumer
      } else if (ranNumer < 100) {
        ranNumer = '0' + ranNumer
      }
      this.param.data.pay_order_code = this.orderInfo.orderList.data[0].order_all_code + '' + ranNumer + ''
      if (this.combine) {
        this.param.data.pay_attach = 3
      } else {
        this.param.data.pay_attach = 2
      }
      console.log(this.param)
      /* 如果是支付宝支付，执行并退出 */
      if (this.accountInfo.data.payInfo.payKind === 1) {
        this.$http.post(this.publicapi + '/WxAndAli/pay/alipay_scanner', qs.stringify(this.param))
          .then(res => {
            console.log(res)
            if (res.data.msg === 'success') {
              this.wechat_status = '验证中'
              this.alipyaVerrification()
            } else if (!res.data.status) {
              this.weChatPayDialog = false
              this.$layer.msg('支付已过期，请重新支付')
            }
          })
        return 0
      }
      /* 微信接口 */
      this.$http.post(this.publicapi + '/WxAndAli/pay/wxpay_scanner', qs.stringify(this.param))
        .then(res => {
          console.log(res)
          if (res.data.data === 'success') {
            this.wechat_status = '验证中'
            this.wechatPayVerrification()
          } else if (res.data.data === 'USERPAYING') {
            this.wechat_status = '用户支付中...'
            this.wechatPayPolling()
          }
        })
    },
    /* 支付宝支付验证 */
    alipyaVerrification () {
      console.log('支付宝支付验证中。。。')
      this.$http.post(this.publicapi + '/WxAndAli/pay/get_alipay_status', qs.stringify(this.param))
        .then(res => {
          console.log(res)
          if (res.data.msg === 'success') {
            this.accountInfo.data.info.pay_msg_id = res.data.data// 保存订单id，返回个后台处理
            this.aliPaySuccess = 1
            this.weChatPayDialog = false
            this.$refs.wechatCode.value = ''
            this.payment()
          } else {
            this.$layer.msg('支付失败')
            this.weChatPayDialog = false
          }
        })
    },
    /* 微信支付验证 */
    wechatPayVerrification () {
      this.$http.post(this.publicapi + '/WxAndAli/pay/get_wxpay_status', qs.stringify(this.param))
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.accountInfo.data.info.pay_msg_id = res.data.data// 保存订单id，返回个后台处理
            this.weChatPaySuccess = 1
            this.weChatPayDialog = false
            this.$refs.wechatCode.value = ''
            this.payment()
          }
        })
    },
    /* 微信支付等待中 */
    changeWechatDialog () {
      if (this.weChatPayDialog) {
        this.weChatPayDialog = false
      } else {
        this.weChatPayDialog = true
      }
    },
    /* 并台并付款 */
    mergeTableAndPay () {
      /* this.$layer.msg(this.mergeTableSelected) */
      this.accountInfo.data.tableList = this.mergeTableData.filter(function (i) {
        return i.isSelected === 1
      })
      this.accountInfo.data.tableList.push(this.tableData.items.filter(function (i) {
        return i.table_id === localStorage.getItem('tableId')
      })[0])
      console.log(this.accountInfo)
      this.$http.post(this.publicapi + '/home/table/table_combine_pay', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          this.accountInfo.data.combine_code = res.data.combine_code
          this.tempMoney = res.data.data.true_price
          this.originalPrice = res.data.data.true_price
          this.activeList = res.data.acitvity_data
          this.moneyList = res.data.data
          this.payDialog = true
          this.mergeTableDialog = false
          this.combine = 1
        })
    },
    /* 隐藏与显示并台 */
    mergeTableDialogStatus () {
      if (this.mergeTableDialog === true) {
        this.mergeTableDialog = false
      } else {
        this.mergeTableDialog = true
      }
    },
    /* 选择并台桌子 */
    chooseMergeTable (key, tableId) {
      if (this.mergeTableData[key].isSelected === 0) {
        this.mergeTableData[key].isSelected = 1
      } else {
        this.mergeTableData[key].isSelected = 0
      }
      Vue.set(this.mergeTableData, key, this.mergeTableData[key])
      /* 查询次桌台是否需要并台 */
      console.log(this.mergeTableSelected.includes(tableId))
      if (!this.mergeTableSelected.includes(tableId)) {
        this.mergeTableSelected.push(tableId)
      } else {
        this.mergeTableSelected.pop(tableId)
      }
    },
    /* 选择并台楼层 */
    changeMergeTable (floorId, index) {
      this.accountInfo.data.info.type = 1
      this.accountInfo.data.info.table_floor_id = floorId
      this.$http.post(this.publicapi + '/home/table/tablelist', qs.stringify(this.accountInfo))
        .then(res => {
          if (res.data.status) {
            this.mergeTableData = res.data.data
            if (!(this.mergeTableData)) {
              this.$layer.msg('此楼层没有桌台')
              return 0
            }
            this.mergeTableData.forEach((v, i) => {
              /* 当前楼层是否有选择选择并台的 */
              let k = 0
              this.mergeTableSelected.forEach((val, j) => {
                if (val === v.table_id) {
                  k++
                }
              })
              if (k === 0) {
                this.mergeTableData[i].isSelected = 0
              } else {
                this.mergeTableData[i].isSelected = 1
              }
            })
          }
        })
      this.mergeFloorActive = index
    },
    /* 合并桌台 */
    mergeTable () {
      this.payDialog = false
      this.mergeTableDialog = true
      this.accountInfo.data.info.type = 1
      this.accountInfo.data.info.table_floor_id = 0
      let arr = []
      this.$http.post(this.publicapi + '/home/table/tablelist', qs.stringify(this.accountInfo))
        .then(res => {
          if (res.data.status) {
            arr = res.data.data
            this.mergeTableData = arr.filter(function (i) {
              return (i.now_status === '未付款' && i.table_id !== localStorage.getItem('tableId'))
            })
            let This = this
            this.mergeTableData.forEach(function (v, i) {
              This.mergeTableData[i].isSelected = 0
            })
            if (this.mergeTableData.length === 0) {
              this.$layer.msg('没有可合并的桌台')
              this.mergeTableDialog = false
            }
            console.log(this.mergeTableData)
          }
        })
    },
    /* 初始化桌台 */
    initialTable () {
      // console.log(localStorage.getItem('tableId'), this.accountInfo.data.shop_code,
      //   localStorage.getItem('initialKey'), localStorage.getItem('initialStatus'))
      this.getOrederInfoByTable(localStorage.getItem('tableId'), this.accountInfo.data.shop_code,
        localStorage.getItem('initialKey'), localStorage.getItem('initialStatus'))
    },
    /* 翻台 */
    tablelGetDown () {
      /* 开台状态下翻台 */
      if (!(this.orderInfo.orderList.good_num > 0)) {
        let id = this.$layer.confirm('是否翻台？', () => {
          // this.changeTableStatus(2)
          this.accountInfo.data.tableList = this.tableData.items[localStorage.getItem('initialKey')]
          this.$http.post(this.publicapi + '/home/table/table_free_rockover', qs.stringify(this.accountInfo))
            .then(res => {
              if (res.data.msg === '翻台成功') {
                this.$layer.msg(res.data.msg)
                /* this.tableData.items[localStorage.getItem('initialKey')].now_status = '空闲'
                this.tableData.items[localStorage.getItem('initialKey')].no_print = 0
                this.orderInfo.orderList.data = '' */
              }
            })
          this.$layer.close(id)
        })
        return 0
      } else if (this.tableData.items[localStorage.getItem('initialKey')].now_status === '未付款') {
        this.$layer.msg('此桌台未付款，无法翻台')
        return 0
      }
      /* 已付款的翻台 */
      let id = this.$layer.confirm('确认翻台？', () => {
        /* this.changeTableStatus(3) */
        let orderIdList = []
        let This = this
        This.orderInfo.orderList.data.forEach(function (e, i) {
          orderIdList.push(e.order_code)
        })
        this.accountInfo.data.orderList = orderIdList
        this.accountInfo.data.table_id = localStorage.getItem('tableId')
        console.log(this.accountInfo)
        this.$http.post(this.publicapi + '/home/table/table_rockover', qs.stringify(this.accountInfo))
          .then(res => {
            if (res.data.msg === '翻台操作成功') {
              this.$layer.msg('翻台成功')
              this.tableData.items[localStorage.getItem('initialKey')].now_status = '空闲'
              this.tableData.items[localStorage.getItem('initialKey')].no_print = 0
              this.tableGetDown = false
              this.orderInfo.orderList.data = ''
            }
          })
        this.$layer.close(id)
      })
    },
    /* 挂账 */
    hangUp () {
      if (this.hungUp) {
        this.hungUp = false
      } else {
        this.hungUp = true
      }
    },
    /* 查询挂账信息是否是正确 */
    hangUpSearch () {
      this.accountInfo.data.tel = this.$refs.hungUpTel.value
      if (this.combine) {
        console.log(' 并台挂账开始执行 ')
        this.$http.post(this.publicapi + '/home/table/table_on_account_search', qs.stringify(this.accountInfo))
          .then(res => {
            console.log(res)
            if (res.data.msg === '查询成功') {
              let id = this.$layer.confirm('验证成功，是否确认挂账？', () => {
                this.initialPrice()
                this.accountInfo.data.debt_id = res.data.data.debtsperson_id
                this.accountInfo.data.tableList = this.mergeTableData
                console.log(this.accountInfo.data)
                this.$http.post(this.publicapi + '/home/table/table_on_account_combine', qs.stringify(this.accountInfo))
                  .then(res => {
                    console.log(res)
                    if (res.data.msg === '挂账成功') {
                      this.$layer.msg('并台付款成功')
                    }
                  })
                this.$layer.close(id)
              })
            } else {
              this.$layer.msg('验证失败')
            }
          })
        return 0
      }
      this.$http.post(this.publicapi + '/home/table/table_on_account_search', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.msg === '查询成功') {
            let id = this.$layer.confirm('验证成功，是否确认挂账？', () => {
              this.initialPrice()
              this.accountInfo.data.debt_id = res.data.data.debtsperson_id
              console.log(this.accountInfo.data)
              this.$http.post(this.publicapi + '/home/table/table_on_account', qs.stringify(this.accountInfo))
                .then(res => {
                  if (res.data.msg === '挂账成功') {
                    this.payDialog = false
                    this.tableData.items[localStorage.getItem('initialKey')].now_status = '已付款'
                    this.initialTable()
                  }
                })
              this.$layer.close(id)
            })
          } else {
            this.$layer.msg('验证失败')
          }
        })
    },
    /* 初始化付款参数金额 */
    initialPrice () {
      this.accountInfo.data.payInfo = []
      this.accountInfo.data.payInfo.moneyList = this.moneyList
      this.accountInfo.data.payInfo.moneyList.final_price = this.moneyList.true_price
      this.accountInfo.data.payInfo.moneyList.truth_price = this.tempMoney
      this.accountInfo.data.payInfo.moneyList.originalPrice = this.originalPrice
      this.accountInfo.data.payInfo.payKind = this.payKind
      this.accountInfo.data.payInfo.activityId = this.activityId
      this.accountInfo.data.payInfo.vipId = this.vipId
      this.accountInfo.data.info.type = 3
      this.accountInfo.data.payInfo.table_id = localStorage.getItem('tableId')
    },
    /* 付款给钱 */
    payment () {
      this.$refs.wechatCode.value = ''// 初始化二维码
      this.initialPrice()
      /* 微信支付状态，而且没有成功 */
      console.log('weChatPaySuccess:')
      console.log(this.aliPaySuccess)
      if (this.accountInfo.data.payInfo.payKind === 0 && this.weChatPaySuccess === 0) {
        this.wechat_status = '微信支付'
        this.weChatPayDialog = true
        this.getFoucus()
        return 0
      } else if (this.accountInfo.data.payInfo.payKind === 1 && this.aliPaySuccess === 0) {
        this.wechat_status = '支付宝支付'
        this.weChatPayDialog = true
        this.getFoucus()
        return 0
      }
      console.log('并台付款传入的信息：')
      console.log(this.accountInfo)
      console.log(this.combine, '是否并台')
      if (this.combine) {
        console.log('并台付款执行中')
        this.$http.post(this.publicapi + '/home/table/table_comnine_paymoney', qs.stringify(this.accountInfo))
          .then(res => {
            console.log(res)
            this.$layer.msg(res.data.msg)
            if (res.data.msg === '付款成功') {
              this.payDialog = false
            }
            this.payDialog = false
            this.weChatPaySuccess = 0// 付款成功后，默任0，为下一次支付做验证
            this.aliPaySuccess = 0// 付款成功后，默任0，为下一次支付做验证
          })
        return 0
      }
      console.log('普通付款传入的参数')
      console.log(this.accountInfo)
      this.$http.post(this.publicapi + '/home/table/table_pay', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.msg === '付款成功') {
            this.$layer.msg('付款成功')
            /* this.changeTableStatus(4) */
            this.payDialog = false
            this.tableGetDown = true
            let i = localStorage.getItem('initialKey')
            this.tableData.items[i].now_status = '已付款'
            this.orderInfo.orderList.price.no_price = 0
            this.initialTable()
            Vue.set(this.tableData.items, i, this.tableData.items[i])
            if (this.accountInfo.data.payInfo.payKind === 0) {
              this.weChatPaySuccess = 0// 付款成功后，默任0，为下一次支付做验证
            } else {
              this.aliPaySuccess = 0// 付款成功后，默任0，为下一次支付做验证
            }
          }
        })
    },
    /* 更换普通活动价格 */
    getActiveValue (v) {
      if (v.target.value === '-1') {
        this.moneyList.true_price = this.tempMoney
        this.activityId = -1
      } else if (v.target.value === '-2') {
        this.activityId = -2
        this.moneyList.true_price = this.vipPrice
      } else if (v.target.value === '-3') {
        this.activityId = -3
        this.moneyList.true_price = this.proVipPrice
      } else {
        this.moneyList.true_price = this.activeList[v.target.value].discount_price
        this.activityId = this.activeList[v.target.value].activity_id
      }
      this.originalPrice = this.moneyList.true_price
      console.log(this.activityId)
    },
    /* 抹零 */
    noChange () {
      this.moneyList.true_price = parseInt(this.moneyList.true_price) + '.00'
      this.moneyList.is_moling = 1
    },
    /* 根据手机号查询会员 */
    searVipInfoByTel () {
      if (this.$refs.tel.value.length === 0) {
        this.$layer.msg('手机号码错误')
        return 0
      }
      this.accountInfo.data.info.type = 1
      this.accountInfo.data.info.tel = this.$refs.tel.value
      if (this.combine) {
        this.accountInfo.data.combine = 1
      }
      console.log(this.accountInfo)
      this.$http.post(this.publicapi + '/home/table/table_pay', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.msg === '查询成功') {
            this.$layer.msg('会员验证成功')
            this.proVipPrice = res.data.data.vip_price
            this.vipId = res.data.vip_level.vip_id
            this.vipPrice = res.data.data.discount_price
            this.vipActive = res.data.acitvity_data
            this.isVip = res.data.vip_level.vip_level
          } else {
            this.$layer.msg('会员验证失败')
            return 0
          }
          let This = this
          res.data.acitvity_data.forEach(function (item, i) {
            This.activeList.push(item)
          })
          this.moneyList = res.data.data
        })
    },
    /* 打印菜单 v：打印的类型，i:0:打印所有订单 */
    doPrint (v, i) {
      let This = this
      switch (v) {
        case 0 :
          this.accountInfo.data.info.backPrintType = 1
          this.$http.post(this.publicapi + '/home/order/return_print', qs.stringify(this.accountInfo))
            .then(res => {
              console.log(res.data)
              if (res.data.status) {
                This.printAll(res.data.data)
              } else {
                this.$layer.msg(res.data.msg)
              }
            })
          break
        case 1 :This.printAOrder(i, 0)// i第几个订单，0：打印订单 1：退的订单
          break
        case 2 :This.printAOrder(i, 1)
      }
    },
    /* 打印总单 index:前台打印总单 */
    printAll (val, index) {
      let orderIdList = []
      this.orderInfo.orderList.data.forEach(function (e, i) {
        orderIdList.push(e.order_code)
      })
      this.accountInfo.data.orderList = orderIdList
      let info = this.orderInfo.orderList
      /*  let FontSize = 0// 字体大小 */
      let printerSize = val.print_type === '1' ? 58 : 80
      let rightCtnMarginLeft = printerSize === 58 ? 130 : 190
      /* let printerWidth = printerSize === 58 ? 455 : 555
      let proFontSize = FontSize === 0 ? 12 : 16
      let fontBold = FontSize === 0 ? 0 : 1 */
      let no = 1
      let itop = 20
      let tname = info.table_name
      window.CLODOP.ADD_PRINT_TEXT(itop, 52, 555, 0, '桌号：' + tname)
      window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 13)
      window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
      window.CLODOP.ADD_PRINT_TEXT(itop += 25, 0, 100, 20, '菜名')
      window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft - 7, 100, 20, '价格/数量')
      window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
      window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
      window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
      /* 商品开始 */
      if (info.data.length === 0) {
        this.$layer.msg('此桌台没有可打印的订单')
        return 0
      }
      info.data.forEach(function (v, i) {
        v.order_good.forEach(function (v, j) {
          if (i === 0 && j === 0) {
            window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 130, 20, v.product_name)
          } else {
            window.CLODOP.ADD_PRINT_TEXT(itop += 20, 0, 130, 20, v.product_name)
          }
          window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft, 100, 20, v.product_trueprice + '*' + v.product_num)
          /* 如果商品的字数过长，就进行分行处理 */
          if (v.product_name.length > 20) {
            itop += 30
          } else if (v.product_name.length > 10) {
            itop += 15
          }
        })
      })
      window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
      window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 250, 20, '共    计: ￥' + this.orderInfo.orderList.price.all_price)
      window.CLODOP.ADD_PRINT_TEXT(itop += 20, 0, 250, 20, '未付金额: ￥' + this.orderInfo.orderList.price.no_price)
      window.CLODOP.SET_LICENSES('', '38595AACE5D4ECECF40F142F2C4FDEE0', 'C94CEE276DB2187AE6B65D56B3FC2848', '')
      window.CLODOP.SET_PRINTER_INDEXA(val.print_value)
      window.CLODOP.SET_PRINT_PAGESIZE(3, 655, 45, '')
      window.CLODOP.PRINT()
    },
    /* 打印小的订单 k:0 打印小订单 1：打印退款订单 */
    printAOrder (index, k) {
      this.$layer.msg('开始打印...')
      let info = this.orderInfo.orderList.data[index].order_good
      this.printAOrderDetail(this.orderInfo.orderList.data[index], k, 1) // 前台打印
      /* 0:后厨不出票 1：多档口,多张票出 2:单一档口，一张票出 3：一个档口，多张票出 4：多档口一张票出 */
      this.$http.post(this.publicapi + '/byadmin/Setup/return_print_setup', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res.data.data, '打印的类型')
          if (res.data.data === 0) {
            return 0
          } else if (res.data.data === 2) {
            this.printAOrderDetail(this.orderInfo.orderList.data[index], k, 2) // 后台统一出票
          } else if (res.data.data === 1 || res.data.data === 3) {
            /* 分档口打印 */
            let This = this
            let tableName = This.orderInfo.orderList.table_name
            info.forEach(function (v, i) {
              console.log(v, 999)
              This.accountInfo.data.info.stall_id = v.stall_id // 根据商品的档口id获取id的value
              let url = '/home/order/return_pro_print'
              if (res.data.data === 3) {
                url = '/home/order/return_print'
                This.accountInfo.data.info.backPrintType = 2 // backPrintType:1前台正常出票，2：查询后台打印机
              }
              This.$http.post(This.publicapi + url, qs.stringify(This.accountInfo))
                .then(res => {
                  console.log(res.data.data)
                  let param = res.data.data
                  let FontSize = 0// 字体大小
                  let printerSize = param.print_type === '1' ? 58 : 80
                  let rightCtnMarginLeft = printerSize === 58 ? 130 : 190
                  console.log(rightCtnMarginLeft, '58就是130')
                  let printerWidth = printerSize === 58 ? 455 : 555
                  let proFontSize = FontSize === 0 ? 12 : 16
                  let fontBold = FontSize === 0 ? 0 : 1
                  let no = 1
                  let itop = 20
                  console.log(tableName)
                  window.CLODOP.ADD_PRINT_TEXT(itop, 52, 555, 0, '桌号：' + tableName)
                  window.CLODOP.ADD_PRINT_TEXT(itop += 20, 58, 555, 0, '取餐号：' + This.orderInfo.orderList.data[index].order_serial_num)
                  if (k === 1) {
                    window.CLODOP.ADD_PRINT_TEXT(itop += 25, 70, 100, 0, '（退单）')
                  }
                  window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 13)
                  window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
                  window.CLODOP.ADD_PRINT_TEXT(itop += 25, 0, 100, 20, '菜名')
                  window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft - 7, 100, 20, '价格/数量')
                  window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
                  window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
                  window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
                  let height = 20
                  if (v.product_name.length > 14) {
                    height += 40
                  } else if (v.product_name.length > 7) {
                    height += 20
                  }
                  window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 130, height, v.product_name)
                  window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft - 7, 80, 20, v.product_trueprice + '*' + v.product_num)
                  window.CLODOP.SET_PRINT_STYLEA(++no, 'FontSize', 12)
                  window.CLODOP.SET_PRINT_STYLEA(++no, 'FontSize', 12)
                  window.CLODOP.SET_LICENSES('', '38595AACE5D4ECECF40F142F2C4FDEE0', 'C94CEE276DB2187AE6B65D56B3FC2848', '')
                  window.CLODOP.SET_PRINTER_INDEXA(param.print_value)
                  console.log(param.print_value, '99999')
                  window.CLODOP.SET_PRINT_PAGESIZE(3, 655, 45, '')
                  window.CLODOP.PRINT()
                })
            })
          } else if (res.data.data === 4) {
            this.accountInfo.data.info.type = 1
            this.$http.post(this.publicapi + '/byadmin/setup/stalls', qs.stringify(this.accountInfo))
              .then(res => {
                res.data.data.forEach((v, i) => {
                  console.log(v)
                  let k = 0
                  info.forEach((vv, ii) => {
                    if (v.stall_id === vv.stall_id) {
                      k = 1
                    }
                  })
                  if (k) {
                    let printerSize = v.print_type === 1 ? 58 : 80
                    let rightCtnMarginLeft = printerSize === 58 ? 130 : 190
                    let no = 1
                    let itop = 20
                    window.CLODOP.ADD_PRINT_TEXT(itop, 52, 555, 0, '桌号：' + this.orderInfo.orderList.table_name)
                    window.CLODOP.ADD_PRINT_TEXT(itop += 20, 60, 555, 0, '取餐号：' + this.orderInfo.orderList.data[index].order_serial_num)
                    window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 13)
                    window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
                    window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
                    window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
                    window.CLODOP.ADD_PRINT_TEXT(itop += 25, 0, 100, 20, '菜名')
                    window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft - 7, 100, 20, '价格/数量')
                    window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
                    window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
                    window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
                    info.forEach((vv, ii) => {
                      if (v.stall_id === vv.stall_id) {
                        console.log(vv)
                        if (ii === 0) {
                          window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 130, 20, vv.product_name)
                        } else {
                          window.CLODOP.ADD_PRINT_TEXT(itop += 20, 0, 130, 20, vv.product_name)
                        }
                        window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft, 100, 20, vv.product_trueprice + '*' + vv.product_num)
                        /* 如果商品的字数过长，就进行分行处理 */
                        if (vv.product_name.length > 20) {
                          itop += 30
                        } else if (vv.product_name.length > 10) {
                          itop += 15
                        }
                      }
                    })
                    window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
                    window.CLODOP.SET_LICENSES('', '38595AACE5D4ECECF40F142F2C4FDEE0', 'C94CEE276DB2187AE6B65D56B3FC2848', '')
                    window.CLODOP.SET_PRINTER_INDEXA(v.print_value)
                    window.CLODOP.SET_PRINT_PAGESIZE(3, 655, 45, '')
                    window.CLODOP.PRINT()
                  }
                })
              })
          }
        })
      this.accountInfo.data.info.order_code = this.orderInfo.orderList.data[index].order_code
      this.$http.post(this.publicapi + '/home/order/printinter', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
        })
    },
    /* 打印一个订单的详细信息,k:0 打印小订单 1：打印退款订单 backPrintType 1:前台打印，2：后台打印 */
    printAOrderDetail (info, k, backPrintType) {
      console.log(info)
      this.accountInfo.data.info.backPrintType = backPrintType
      this.$http.post(this.publicapi + '/home/order/return_print', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.status) {
            console.log(res.data)
            let val = res.data.data
            let printerSize = val.print_type === '1' ? 58 : 80
            let rightCtnMarginLeft = printerSize === 58 ? 130 : 190
            let no = 1
            let itop = 20
            let tname = this.orderInfo.orderList.table_name
            window.CLODOP.ADD_PRINT_TEXT(itop, 2, 555, 0, '桌号：' + tname + '【' + info.pay_status + '】')
            window.CLODOP.ADD_PRINT_TEXT(itop += 20, 58, 555, 0, '取餐号：' + info.order_serial_num)
            if (k === 1) {
              window.CLODOP.ADD_PRINT_TEXT(itop += 25, 70, 100, 0, '（退单）')
            }
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 13)
            window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
            window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
            window.CLODOP.ADD_PRINT_TEXT(itop += 25, 0, 100, 20, '菜名')
            window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft - 7, 100, 20, '价格/数量')
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
            window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
            /* 商品开始 */
            console.log(info)
            info.order_good.forEach(function (v, j) {
              if (j === 0) {
                window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 130, 20, v.product_name)
              } else {
                window.CLODOP.ADD_PRINT_TEXT(itop += 20, 0, 130, 20, v.product_name)
              }
              window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft, 100, 20, v.product_trueprice + '*' + v.product_num)
              /* 如果商品的字数过长，就进行分行处理 */
              if (v.product_name.length > 20) {
                itop += 30
              } else if (v.product_name.length > 10) {
                itop += 15
              }
            })
            window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 244, 2, 1)
            if (backPrintType === 1) {
              window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 250, 20, '共    计: ￥' + info.order_total_price)
            }
            window.CLODOP.SET_LICENSES('', '38595AACE5D4ECECF40F142F2C4FDEE0', 'C94CEE276DB2187AE6B65D56B3FC2848', '')
            window.CLODOP.SET_PRINTER_INDEXA(val.print_value)
            console.log(val.print_value)
            window.CLODOP.SET_PRINT_PAGESIZE(3, 655, 45, '')
            window.CLODOP.PRINT()
          }
        })
    },
    /* 修改支付方式 */
    changPayKind (v) {
      this.payKind = v
    },
    /* 点菜加菜 */
    orderFood (val) {
      if (this.tableData.items[localStorage.getItem('initialKey')].now_status === '空闲') {
        this.$layer.msg('请翻台')
        return 0
      }
      if (val) {
        localStorage.setItem('yudian', 1)
      }
      this.tableData.items.forEach((v, i) => {
        if (v.table_id === localStorage.getItem('tableId')) {
          localStorage.setItem('initialStatus', v.now_status)
        }
      })
      this.$router.push('/orderdishes')
    },
    /* 付款界面的显示与隐藏 */
    payDialogStatus () {
      this.hungUp = false
      this.activityNo = -1 // 默认活动是第一个
      this.payKind = 0 // 默认支付方式是微信
      this.combine = 0
      if (this.orderInfo.orderList.data === '') {
        this.$layer.msg('暂无订单')
        return 0
      } else {
        if (this.tableData.items[localStorage.getItem('initialKey')].now_status === '已付款') {
          this.$layer.msg('此桌台已经付款')
          return 0
        }
      }
      if (this.payDialog) {
        this.payDialog = false
      } else {
        let orderIdList = []
        this.orderInfo.orderList.data.forEach(function (e, i) {
          orderIdList.push(e.order_code)
        })
        this.accountInfo.data.orderIdList = orderIdList
        this.accountInfo.data.info.type = 2
        this.$http.post(this.publicapi + '/home/table/table_pay', qs.stringify(this.accountInfo))
          .then(res => {
            console.log(res)
            this.tempMoney = res.data.data.true_price
            this.originalPrice = res.data.data.true_price
            this.activeList = res.data.acitvity_data
            this.moneyList = res.data.data
          })
        this.payDialog = true
      }
    },
    /* 获取桌台列表 */
    getTableList (floorId, key) {
      console.log(key)
      this.selectTableNo = -1
      this.ins = key
      this.accountInfo.data.info.type = 1
      this.accountInfo.data.info.table_floor_id = floorId
      this.$http.post(this.publicapi + '/home/table/tablelist', qs.stringify(this.accountInfo))
        .then(res => {
          if (res.data.status) {
            this.initialTables(res)
          }
        })
    },
    /* 点击全部查询所有信息 */
    allTaleInfo () {
      this.selectTableNo = -1
      this.ins = -1
      let param = JSON.parse(sessionStorage.getItem('account'))
      this.accountInfo.account = param.account
      this.accountInfo.token = param.token
      this.accountInfo.data.shop_code = param.shop_code
      this.accountInfo.data.info.type = 0
      this.accountInfo.data.info.table_floor_id = 0
      console.log(this.accountInfo)
      this.$http.post(this.publicapi + '/home/table/tablelist', qs.stringify(this.accountInfo))
        .then(res => {
          if (res.data.status) {
            this.initialTables(res)
          }
        })
    },
    /* 点击桌台按钮显示订单列表 */
    getOrederInfoByTable (tableId, shopCode, key, status) {
      console.log(' key: ' + key)
      localStorage.setItem('tableId', tableId)
      localStorage.setItem('initialKey', key)
      localStorage.setItem('initialStatus', status)
      console.log(localStorage.getItem('initialStatus'))
      console.log(this.tableData.items[key])
      if (this.tableData.items.length) {
        localStorage.setItem('tableName', this.tableData.items[key].table_name)
      }
      if (status === '空闲') {
        let id = this.$layer.confirm('是否将' + this.tableData.items[key].table_name + '开台？', () => {
          this.accountInfo.data.info.table_id = tableId
          localStorage.setItem('initialStatus', '开台')
          this.$http.post(this.publicapi + '/home/table/table_original', qs.stringify(this.accountInfo))
            .then(res => {
              if (res.data.msg === '开台成功') {
                let This = this
                /* this.changeTableStatus (1) */
                console.log(this.tableOfActive)
                this.tableData.items.forEach(function (e, i) {
                  if (e.table_id === tableId) {
                    console.log(This.tableData.items[i])
                    This.tableData.items[i].now_status = '开台'
                    Vue.set(This.tableData.items, i, This.tableData.items[i])
                  }
                })
              }
            })
          this.$layer.close(id)
        })
        return 0
      }
      if (status === '已付款') {
        this.tableGetDown = 1
      } else this.tableGetDown = 0
      this.selectTableNo = key
      this.accountInfo.data.info.table_id = tableId
      this.accountInfo.data.shop_code = shopCode
      this.$http.post(this.publicapi + '/home/order/tableorder', qs.stringify(this.accountInfo))
        .then(res => {
          if (res.data.status) {
            console.log(res.data)
            this.changeOrderInfoInTime(res.data)
          }
        })
    },
    /* 订单上下移动 - 按钮 */
    orderMoveUp (param) {
      console.log(this.orderMarginTopValue)
      if (param === 0) {
        this.orderMarginTopValue -= 100
      } else {
        if (this.orderMarginTopValue === 0 || this.orderMarginTopValue === '0') return
        this.orderMarginTopValue = parseInt(this.orderMarginTopValue) + parseInt(100)
      }
    },
    /* 处理个别信息 */
    copyInfo (key) {
      this.accountInfo.data.call_id = key
      console.log(this.accountInfo)
      this.$http.post(this.publicapi + '/home/call/dealcall', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
        })
    },
    /* 处理呼叫信息 */
    copyCallInfo () {
      this.$http.post(this.publicapi + '/home/call/dealallcall', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
        })
    },
    /* 退单接口 */
    refundImp (tableName, k) {
      this.$layer.msg('已退款')
      this.doPrint(2, k)
      let This = this
      let m = 0
      console.log(this.orderInfo.orderList.data)
      let noPrice = 0
      let allPrice = 0
      this.orderInfo.orderList.data.forEach((v, i) => {
        if (v.pay_status === '未付款') {
          noPrice += parseFloat(v.order_total_price)
        }
        allPrice += parseFloat(v.order_total_price)
      })
      this.orderInfo.orderList.price.no_price = noPrice.toFixed(2)
      this.orderInfo.orderList.price.all_price = allPrice.toFixed(2)
      console.log(this.orderInfo.orderList.price.no_price === 0.00)
      if (this.orderInfo.orderList.price.no_price === 0.00) {
        this.tableData.items[m].now_status = '已付款'
        Vue.set(this.tableData.items, m, This.tableData.items[m])
      }
    },
    /* 退订单开始 */
    refoundAOrder (orderId, key, tableName) {
      this.accountInfo.data.info.order_id = orderId
      this.accountInfo.data.info.type = 1
      if (!this.accountInfo.data.info.table_id) {
        this.accountInfo.data.info.table_id = localStorage.getItem('tableId')
      }
      /* 已经付款退单 */
      this.$http.post(this.publicapi + '/home/order/order_refound', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.msg === '退单成功') {
            this.refundImp(tableName, key)
            return 0
          }
          if (res.data.msg === '查询成功') {
            let obj = this.$layer.confirm('价格:￥' + res.data.data + ',是否退单？', {title: '退单', icon: 6, skin: 2}, () => {
              this.accountInfo.data.info.refound_info = res.data
              console.log(res.data.pay_type)
              console.log(res.data)
              /* 微信退款 */
              if (res.data.pay_type === 1 || res.data.pay_type === '1') { // 微信退款
                let data = []
                data.data = []
                data.data.pay_order_code = res.data.pay_message_data.pay_code
                data.data.pay_sub_mchid = sessionStorage.getItem('wxpay')
                data.data.pay_price = res.data.pay_message_data.pay_price
                data.data.pay_refund_price = res.data.data
                console.log(data)
                this.$http.post(this.publicapi + '/WxAndAli/pay/wxpay_refund', qs.stringify(data))
                  .then(res => {
                    if (res.data.status) {
                      this.$layer.msg('微信退款成功')
                      /* 退款给用户后保存数据 */
                      this.$http.post(this.publicapi + '/home/order/order_refound_save', qs.stringify(this.accountInfo))
                        .then(res => {
                        })
                      this.refundImp(tableName, key)
                    } else {
                      this.$layer.msg('微信退款失败')
                    }
                  })
              } else if (res.data.pay_type === 2 || res.data.pay_type === '2') { // 支付宝退款
                let data = []
                data.data = []
                console.log(res.data)
                data.data.pay_order_code = res.data.pay_message_data.pay_code
                data.data.pay_sub_mchid = sessionStorage.getItem('alipay')
                data.data.pay_price = res.data.pay_message_data.pay_price
                data.data.pay_refund_price = res.data.data
                console.log(data)
                this.$http.post(this.publicapi + '/WxAndAli/pay/alipay_refund', qs.stringify(data))
                  .then(res => {
                    if (res.data.status) {
                      this.$layer.msg('支付宝退款成功')
                      /* 退款给用户后保存数据 */
                      this.$http.post(this.publicapi + '/home/order/order_refound_save', qs.stringify(this.accountInfo))
                        .then(res => {
                        })
                      this.refundImp(tableName, key)
                    } else {
                      this.$layer.msg('支付宝退款失败')
                    }
                  })
              } else {
                this.$http.post(this.publicapi + '/home/order/order_refound_save', qs.stringify(this.accountInfo))
                  .then(res => {
                    console.log(res)
                  })
                this.refundImp(tableName, key)
              }
              this.$layer.close(obj)
            })
          }
        })
    }
  },
  components: {
    od
  }
}
</script>
<style>
    @import '../../../../static/css/cashier.css';
    @import '//at.alicdn.com/t/font_647332_anne8atx3yfx0f6r.css';
    @import '../../../../static/css/animal.css';
</style>
