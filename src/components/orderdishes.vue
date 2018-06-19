<template>
    <div class="od-body">
        <!--<button @click="handoverPrintImpl">打印操作</button>-->
        <div class="dishes">
            <div class="od-title animated fadeInLeft">
                <div class="od-back l" @click="goBack"><i class="iconfont" @click="del()" style="font-size: 26px;color: #865c5c;position: absolute">&#xe799;</i></div>
                <ul class="od-class animated fadeInLeft" v-show="searchText">
                    <li :class="{oblActive:classActiveNo === -1}" @click="getAllPro()">全部</li>
                    <li v-for="(item,key) in classList" v-bind:key="key" @click="changeClass(key,item.class_id)"
                        :class="{oblActive:classActiveNo === key}" v-if="key < 5">{{item.class_name}}</li>
                </ul>
                <el-dropdown trigger="click" style="float: left" v-show="searchText">
                    <ul class="od-more el-dropdown-link">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,key) in classList" v-bind:key="key" v-if="key > 4" @click.native="changeClass(key,item.class_id)">{{item.class_name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="od-search-btn" v-show="searchText"><li class="iconfont" style="font-size: 30px; margin-top: -4px; color: red;" @click="showSearchText()">&#xe604;</li></div>
                <div class="table-btn  l od-table-btn" v-show="searchText">
                    <div class="r-up l" @click="proMoveUp(1)">
                    <span style="top: -5px;left: 3px;"></span>
                    </div> <div class="r-down r" @click="proMoveUp(0)">
                    <span style="top: 12px; right: 4px;"></span></div>
                </div>
                <div class="searchText animated fadeInLeft"  v-show="!searchText">
                    <i class="iconfont input-search-btn" style="font-size: 30px;margin-left:8px" >&#xe604;</i>
                    <input type="text" placeholder="请输入商品名称" ref="keyWord">
                </div>
                <div class="search-continue-btn l"  v-show="!searchText" @click="simulationSearch()">确定</div>
                <div class="search-cancel-btn l"  v-show="!searchText" @click="hideSearchText()">取消</div>
            </div>
        </div>
        <div class="dish-list animated fadeInLeft" style="margin-top: 0px;overflow: hidden">
        <div class="dish-list animated fadeInLeft" style="width: 100%;" :style="{marginTop:(proListMarginTopValue+'px')}">
           <!-- <div class="dish-item">
                <div class="dish-type dish-spc">特</div>
                <div class="dish-item-pic">
                    <div class="purchasing">限购一份</div>
                    <img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1524903157&di=534fa6d3972482cdc43e474ee79d095c&src=http://cyjctrip.qiniudn.com/1402723248/381hv2by6autex24poitf2yf2.jpg"></div>
                <div class="dish-item-name">鱼香肉丝</div>
                <div class="dish-item-price"><div class="l">会员：￥88</div><div class="r">￥99</div></div>
            </div>-->
            <!--<div class="dish-item">
                <div class="dish-type dish-time">时</div>
                <div class="dish-item-pic"><img src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1524903157&di=534fa6d3972482cdc43e474ee79d095c&src=http://cyjctrip.qiniudn.com/1402723248/381hv2by6autex24poitf2yf2.jpg"></div>
                <div class="dish-item-name">鱼香肉丝</div>
                <div class="dish-item-price"><div class="l">会员：￥88</div><div class="r">￥99</div></div>
            </div>-->
            <div class="dish-item" @click="addDish(item)"  v-for="(item, key) in proList" v-bind:key="key">
                <!--<div class="dish-type dish-spc">特</div>-->
                <div class="dish-item-pic"><img :src="item.product_image"></div>
                <div class="dish-item-name">{{item.product_name}}</div>
                <div class="dish-item-price"><div class="l">会员：{{item.product_vip_price}}</div><div class="r">{{item.product_trueprice}}</div></div>
            </div>
            <div v-if="proList.length === 0" class="nopros">
                <i class="iconfont">&#xe615;</i>
            </div>
            <div  v-if="proList.length === 0" class="noprofont">没有菜品</div>
        </div>
        </div>
        <i class="iconfont">&#xe62a;</i>
        <div class="rig-content animated fadeInRight">
            <div class="right-header">
                <div class="bill l" >
                      <!--  <el-select v-model="value" placeholder="请选择" >
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value" >
                            </el-option>
                        </el-select>-->
                    <span v-if="yudianInfo" style="color: #666;">【{{yudianInfo}}】</span>
                    <span class="current_table" v-else>当前桌台：{{classId}}</span>
                </div>
                <div class="subtotal r">
                    <div >小计：{{subtotal.toFixed(2)}}</div>
                    <div>已点<!--{{ordereddiseData.length}}--> {{proNum}}份</div>
                </div>
            </div>
            <div class="order-list" >
                <div class="order-item1" v-show="ordereddiseData.length ===0">
                    <i class="iconfont">&#xe619;</i>
                    <span class="nopro">没有菜品</span>
                </div>
                <!--点餐列表-->
                <ul class="order-dish-list" :style="{marginTop:(proListLeftMarginTopValue+'px')}">
                    <li  v-for="(item, key) in ordereddiseData" v-bind:key="key" class="animated bounceInLeft">
                        <span>{{item.product_name}}</span>
                        <span class="delDishBtn" @click="changeProNum(item.product_id, 0)">-</span>
                        <span class="dish-num">{{item.nums}}</span>
                        <span class="addDishBtn" @click="changeProNum(item.product_id, 1)">+</span>
                        <span class="dish-item-money">￥{{(item.product_trueprice*item.nums).toFixed(2)}}</span>
                    </li>
                </ul>
                <!--备注-->
                <div class="dish-list-remark animated bounceInLeft" v-show="remarkcontent">备注：{{remarkcontent}}</div>
                <!--右边初始化页面-->
                <div class="od-order-title" v-show="disheListVisible">请选择点餐类型</div>
                <ul class="order-btm-list" v-show="disheListVisible">
                    <li  @click="preOrder()" class="pre-order">预点餐</li>
                    <li>打包</li>
                    <li>团餐</li>
                    <li>堂食</li>
                </ul>
                <div style="position:absolute;bottom: 70px;height: 80px;width: 100%;">
                    <div style="position: absolute;bottom: 25px;right: 33px;">
                        <div class="up-btn l spc-time-upbn" @click="proListMoveUp(1)" style="background-color: white"><span style=" top: -2px; right: 8px;"></span></div>
                        <div class="down-btn l spc-time-downbtn" @click="proListMoveUp(0)" style="background-color: white"><span style="top: 18px;right: 8px;"></span></div>
                    </div>
                </div>
                <div class="order-btn-list">
                    <div @click="clearOrderInfo()">清空</div>
                    <div @click="hideRemarkInfoDilog(1)">备注</div>
                    <div @click="placeOrder()">下单</div>
                </div>
            </div>
        </div>
        <!--选择人数弹窗-->
        <div class="yun-dialog-body " v-show="choosePeopleDialog">
            <div class="yun-dialog-content animated bounceInLeft">
                <div class="dialog-header">选择人数<span v-if="yudianInfo !== ''">【{{yudianInfo}}】</span><i class="iconfont cha" @click="delPeople()" style="font-size: 26px;color: #8c8c8c;" >&#xe65a;</i></div>
                <div class="dialog-body "  >
                    <input class="peo-num" v-model="peoNum" />
                    <table class="cal-value" border="1" cellspacing="0">
                        <tr><td @click="Calculator(1)">1</td><td @click="Calculator(2)">2</td><td @click="Calculator(3)">3</td></tr>
                        <tr><td @click="Calculator(4)">4</td><td @click="Calculator(5)">5</td><td @click="Calculator(6)">6</td></tr>
                        <tr><td @click="Calculator(7)">7</td><td @click="Calculator(8)">8</td><td @click="Calculator(9)">9</td></tr>
                        <tr><td @click="Calculator(0)">0</td><td colspan="2" @click="Calculator(-1)"><i class="iconfont" style="font-size: 30px;color: #8c8c8c;">&#xe625;</i></td ></tr>
                    </table>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel" @click="delPeople()">取消</div>
                    <div class="dialog-confirm" @click="choosePeople()">确认</div>
                </div>
            </div>
        </div>
        <!--团餐选桌弹窗-->
        <div class="yun-dialog-body" v-show="tableDialog">
            <div class="yun-dialog-content" style="width: 845px;" >
                <div class="dialog-header">团餐选桌<i class="iconfont cha" @click="delableDialog()" style="font-size: 26px;color: #8c8c8c;">&#xe65a;</i></div>
                <div class="dialog-body"  >
                   <ul class="floorList l">
                       <li>全部桌台</li>
                       <li>全部桌台</li>
                       <li>全部桌台</li>
                       <li>全部桌台</li>
                   </ul>
                    <div class="table-btn  l" style="width: 90px;">
                        <div class="r-up l r-up1"><span ></span></div>
                        <div class="r-down r r-down1"><span></span></div>
                    </div>
                    <div class="tuan-table-list">
                        <div class="table-dialogo-item" v-for="i in tableData" v-bind:key="i[0]">
                            <div class="table-i">
                                <div class="table-dialog-flag"></div>
                                <div class="table-dialog-num"></div>
                            </div>
                            <div class="table-dialogo-num">A-109</div>
                        </div>
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel">取消</div>
                    <div class="dialog-confirm">确认</div>
                </div>
            </div>
        </div>
        <!--选择规格弹窗-->
        <div class="yun-dialog-body" v-show="specDialog">
            <div class="yun-dialog-content" style="width:540px;">
                <div class="dialog-header">万州烤鱼<i class="iconfont cha" @click="delSpc()" style="font-size: 26px;color: #8c8c8c;">&#xe65a;</i></div>
                <div class="dialog-body"  >
                    <div class="flavorlist">
                        <div class="spc-name">口味</div>
                        <ul class="flavor-i l">
                            <li class="active">火爆川味</li>
                            <li>豌豆麻辣味</li>
                            <li>名族麻辣味</li>
                            <li>名族</li>
                            <li>名族麻辣味</li>
                            <li>名族麻辣味</li>
                        </ul>
                    </div>
                    <div class="flavorlist">
                        <div class="spc-name">辣度</div>
                        <ul class="flavor-i l">
                            <li>不辣</li>
                            <li>豌豆麻辣味</li>
                            <li>名族麻辣味</li>
                            <li>名族</li>
                            <li>名族麻辣味</li>
                            <li>名族麻辣味</li>
                        </ul>
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel">取消</div>
                    <div class="dialog-confirm">确认</div>
                </div>
            </div>
        </div>
        <!--时令 规格弹窗-->
        <div class="yun-dialog-body" v-show="specTimeDialog">
            <div class="yun-dialog-content" style="width:540px;">
                <div class="dialog-header">万州烤鱼<i class="iconfont cha" @click="delSpcTime()" style="font-size: 26px;color: #8c8c8c;">&#xe65a;</i></div>
                <div class="dialog-body" style="padding-top:0px;padding-bottom:20px;" >
                    <div class="flavorlist">
                        <div class="spc-name">价格</div>
                        <div class="spc-time-price" contenteditable=true></div>
                        <div class="l"> </div>
                        <div class="up-btn l spc-time-upbn"><span style=" top: -2px; right: 8px;"></span></div>
                        <div class="down-btn l spc-time-downbtn"><span style="top: 18px;right: 8px;"></span></div>
                    </div>
                    <div class="flavorlist">
                        <div class="spc-name">数量</div>
                        <div class="spc-time-price" contenteditable=true></div>
                        <div class="l"> </div>
                        <div class="up-btn l spc-time-upbn"><span style=" top: -2px; right: 8px;"></span></div>
                        <div class="down-btn l spc-time-downbtn"><span style="top: 18px;right: 8px;"></span></div>
                    </div>
                    <div class="flavorlist">
                        <div class="spc-name">口味</div>
                        <ul class="flavor-i l">
                            <li>不辣</li>
                            <li>豌豆麻辣味</li>
                            <li>名族麻辣味</li>
                            <li>名族</li>
                        </ul>
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel">取消</div>
                    <div class="dialog-confirm">确认</div>
                </div>
            </div>
        </div>
        <!--备注弹窗-->
        <div class="yun-dialog-body" v-show="remarkDialog">
            <div class="yun-dialog-content" style="width:540px;">
                <div class="dialog-header">备注<i class="iconfont cha" @click="hideRemarkDilog()" style="font-size: 26px;color: #8c8c8c;">&#xe65a;</i></div>
                <div class="dialog-body" style="padding-top:0px;padding-bottom:20px;height:200px;min-height: 200px;margin-left:10px;" >
                    <div class="flavorlist">
                        <div class="remarkDialog-remark">商品备注</div>
                        <ul class="flavor-i l">
                            <li>不辣</li>
                            <li>豌豆麻辣味</li>
                            <li>名族麻辣味</li>
                            <li>名族</li>
                        </ul>
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel">取消</div>
                    <div class="dialog-confirm">确认</div>
                </div>
            </div>
        </div>
        <!--备注弹窗-->
        <div class="yun-dialog-body" v-show="remarkInfoDialog">
            <div class="yun-dialog-content" style="width:540px;">
                <div class="dialog-header">备注<i class="iconfont cha" @click="hideRemarkInfoDilog(0)" style="font-size: 26px;color: #8c8c8c;">&#xe65a;</i></div>
                <div class="dialog-body" style="padding-top:0px;padding-bottom:20px;height:160px;min-height: 160px;margin-left:10px;" >
                    <div class="flavorlist">
                        <div class="remarkDialog-remark"></div>
                        <textarea v-model="remarkcontent" class="remarkDetail" />
                       <!--   <ul class="flavor-i l">
                            <li>不辣</li>
                            <li>豌豆麻辣味</li>
                            <li>名族麻辣味</li>
                            <li>名族</li>
                        </ul> -->
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel" @click="hideRemarkInfoDilog(0)">取消</div>
                    <div class="dialog-confirm" @click="getRemarkInfo()">确认</div>
                </div>
            </div>
        </div>
        <!--退菜弹窗-->
        <div class="yun-dialog-body" v-show="retireDialog">
            <div class="yun-dialog-content" style="width:400px;">
                <div class="dialog-header" style="border-bottom:none"><i class="iconfont cha" @click="hideRemarkDilog()" style="font-size: 26px;color: #8c8c8c;">&#xe65a;</i></div>
                <div class="dialog-body" style="padding-top:0px;padding-bottom:20px;height:92px;min-height: 92px;margin-left:10px;" >
                    <div class="flavorlist">
                        <div class="remarkDialog-remark" style="font-size: 30px; text-align: center;margin-left: -10px;font-family: '楷体';">确认退菜？</div>
                    </div>
                </div>
                <div class="dialog-footer">
                    <div class="dialog-cancel">取消</div>
                    <div class="dialog-confirm">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import qs from 'qs'
//import lodop from 'LodopFuncs'
import Vue from 'vue'
export default {
  data () {
    return {
      peoNum: '',
      proListLeftMarginTopValue: 0,
      choosePeopleDialog: true,
      proNum: 0,
      yudianInfo: '',
      classActiveNo: -1,
      classId: '',
      subtotal: 0.00,
      remarkcontent: '',
      canshu: '',
      proList: '',
      classList: '',
      remarkInfoDialog: false,
      tableData: [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5],
      options: [{
        value: '11111',
        label: '吃饭'
      },
      {
        value: '55555',
        label: '逛街'
      }],
      value: '',
      operateType: ['预点餐', '打包', '团餐'],
      currentOperateType: '预点餐',
      ordereddiseData: [],
      desc: '',
      bg: '#ff4141',
      dialogVisible: false,
      num: 0,
      flag: true,
      disheListVisible: false,
      regimentMealVisible: true,
      proListMarginTopValue: 0,
      title: 'go',
      tableDialog: false,
      specDialog: false,
      specTimeDialog: false,
      remarkDialog: false,
      retireDialog: false,
      searchText: true,
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
      }
    }
  },
  computed: {
    ...mapState([
      'bgColor',
      'baseBg',
      'publicapi',
      'firstUrl',
      'orderInfo'
    ])
  },
  methods: {
    ...mapMutations([
    ]),
    /* 获取所有商品 */
    getAllPro () {
      this.$refs.keyWord.value = ''
      this.simulationSearch()
      this.classActiveNo = -1
    },
    /* 菜品上下移动 */
    proMoveUp (param) {
      if (param === 0) {
        this.proListMarginTopValue -= 100
      } else {
        if (this.proListMarginTopValue === 0 || this.proListMarginTopValue === '0') return
        this.proListMarginTopValue = parseInt(this.proListMarginTopValue) + parseInt(100)
      }
    },
    /* 商品列表上下移动 */
    proListMoveUp (param) {
      if (param === 0) {
        this.proListLeftMarginTopValue -= 100
      } else {
        if (this.proListLeftMarginTopValue === 0 || this.proListLeftMarginTopValue === '0') return
        this.proListLeftMarginTopValue = parseInt(this.proListLeftMarginTopValue) + parseInt(100)
      }
    },
    delPeople () {
      this.choosePeopleDialog = false
      this.peoNum = 0
    },
    /* 选择人数 */
    choosePeople () {
      this.choosePeopleDialog = false
    },
    /* 人数计算器 */
    Calculator (val) {
      if (val === -1) {
        let l = (this.peoNum + '').split('')
        l.splice(l.length - 1, 1)
        this.peoNum = l.join('')
        console.log(l)
      } else {
        if (this.peoNum === 0 || this.peoNum === '0') {
          this.peoNum = val
        } else {
          this.peoNum = (this.peoNum * 10) + val
        }
      }
      console.log(val)
    },
    preOrder () {
      this.dialogVisible = true
    },
    goBack () {
      localStorage.setItem('yudian', 0)
      console.log(localStorage.getItem('yudian'))
      this.$router.push('/tables')
    },
    /* 模糊搜索 */
    simulationSearch () {
      this.proListMarginTopValue = 0
      this.accountInfo.data.keyWord = this.$refs.keyWord.value
      this.$http.post(this.publicapi + '/home/order/order_product_search', qs.stringify(this.accountInfo))
        .then(res => {
          this.proList = []
          this.proList = res.data.data
          let This = this
          this.proList.forEach(function (e, i) {
            This.proList[i]['product_image'] = This.firstUrl + '/' + e.product_image
            // This.proList[i]['product_image'] = 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1393171458,564650640&fm=27&gp=0.jpg'
          })
        })
    },
    /* 下订单 */
    placeOrder () {
      if (this.ordereddiseData.length === 0) {
        this.$layer.msg('请选择菜品')
        return 0
      }
      /* 判断人数是否为空，空则显示人数选择弹窗 */
      if (localStorage.getItem('yudian') === 1 || localStorage.getItem('yudian') === '1') {
        if (this.peoNum === '' || this.peoNum === 0) {
          this.choosePeopleDialog = true
          this.$layer.msg('请选择人数')
          return 0
        }
      } else if (localStorage.getItem('initialStatus') === '开台') { // 是普通的点单，判断他的状态是否不是开台
        if (this.peoNum === '' || this.peoNum === 0) {
          this.choosePeopleDialog = true
          this.$layer.msg('请选择人数')
          return 0
        }
      }
      this.accountInfo.data.info.orderInfo = this.ordereddiseData
      this.accountInfo.data.info.type = 1
      this.accountInfo.data.info.table_id = localStorage.getItem('tableId')
      this.accountInfo.data.info.remark = this.remarkcontent
      this.accountInfo.data.info.orderInfo.forEach((v, i) => {
        this.accountInfo.data.info.orderInfo[i].product_spec = ''
        this.accountInfo.data.info.orderInfo[i].product_remark = ''
      })
      this.accountInfo.data.info.people_num = this.peoNum
      this.accountInfo.data.info.person = this.peoNum
      if (localStorage.getItem('yudian') === 1 || localStorage.getItem('yudian') === '1') {
        this.$http.post(this.publicapi + '/home/LineAndPrepoint/prepoint_order', qs.stringify(this.accountInfo))
          .then(res => {
            if (res.data.status) {
              localStorage.setItem('yudian', 0)
              this.$layer.msg('预点餐成功')
              this.$router.push('/tables')
            }
          })
        return 0
      }
      this.$http.post(this.publicapi + '/home/order/choosedish', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          this.$layer.msg(res.data.msg)
          if (res.data.msg === '点菜成功') {
            this.ordereddiseData = []
            this.$router.push('/tables')
          }
        })
    },
    /* 获取备注信息 */
    getRemarkInfo () {
      // if (this.$refs.remarkcontent.innerHTML !== '请输入备注...' && this.ordereddiseData.length !== 0) {
      //   this.remarkcontent = this.$refs.remarkcontent.innerHTML
      // }
      this.remarkInfoDialog = false
    },
    /* 备注详情的对话框 */
    hideRemarkInfoDilog (k) {
      if (this.ordereddiseData.length === 0) {
        this.$layer.msg('请选择菜品')
        return 0
      }
      if (k === 1) {
        this.remarkInfoDialog = true
      } else {
        this.remarkInfoDialog = false
      }
    },
    /* 清空订单的数据 */
    clearOrderInfo () {
      this.remarkcontent
      if (this.ordereddiseData.length === 0) {
        this.$layer.msg('请选择菜品')
        return 0
      }
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '是否清空已选菜品 ')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.remarkcontent = ''
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            this.subtotal = 0
            setTimeout(() => {
              done()
              this.ordereddiseData = []
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 1000)
          } else {
            done()
          }
        }
      })
    },
    /* 加减号,type:1=>添加数据 type:0=>减数据 */
    changeProNum (productId, type) {
      let This = this
      this.ordereddiseData.forEach(function (v, i) {
        if (productId === v.product_id) {
          if (type === 1) {
            This.proNum ++
            This.ordereddiseData[i].nums += 1
          } else {
            This.proNum --
            if (This.ordereddiseData[i].nums === 1) {
              This.ordereddiseData.splice(i, 1)
              return 0
            }
            This.ordereddiseData[i].nums -= 1
          }
          Vue.set(This.ordereddiseData, i, This.ordereddiseData[i])
        }
      })
      This.subtotal = 0
      this.ordereddiseData.forEach(function (v, i) {
        This.subtotal += v.product_trueprice * v.nums
      })
      if (this.ordereddiseData.length === 0) {
        This.remarkcontent = ''
      }
    },
    del () {
      this.dialogVisible = false
    },
    /* 点击图片修改小计 */
    addDish (pro) {
      this.proNum ++
      let k = -1
      /* 第一次添加，数组为空 */
      if (this.ordereddiseData.length === 0) {
        pro.nums = 1
        this.ordereddiseData.push(pro)
        this.subtotal = parseInt(pro.product_trueprice)
        return 0
      }
      /* 判断是否有添加过 */
      this.ordereddiseData.forEach(function (v, i) {
        if (pro.product_id === v.product_id) {
          k = i
        }
      })
      /* 这个商品没有添加过 */
      if (k === -1) {
        pro.nums = 1
        this.ordereddiseData.push(pro)
      } else {
        this.ordereddiseData[k].nums = this.ordereddiseData[k].nums + 1
        Vue.set(this.ordereddiseData, k, this.ordereddiseData[k])
      }
      this.subtotal = 0
      let This = this
      this.ordereddiseData.forEach(function (v, i) {
        This.subtotal += v.product_trueprice * v.nums
      })
      this.disheListVisible = false
    },
    delableDialog () {
      this.tableDialog = false
    },
    delSpc () {
      this.specDialog = false
    },
    delSpcTime  () {
      this.specTimeDialog = false
    },
    hideRemarkDilog () {
      this.retireDialog = false
    },
    hideSearchText () {
      this.searchText = true
      this.$refs.keyWord.value = ''
      this.simulationSearch()
    },
    showSearchText () {
      this.searchText = false
    },
    /* 根据分类获取商品 */
    changeClass (i, classId) {
      console.log(classId)
      this.canshu = i
      this.classActiveNo = i
      this.accountInfo.data.info.class_id = classId
      this.$http.post(this.publicapi + '/home/order/choosedish', qs.stringify(this.accountInfo))
        .then(res => {
          this.proList = res.data.data
          let This = this
          this.proList.forEach(function (e, i) {
            This.proList[i]['product_image'] = This.firstUrl + '/' + e.product_image
          })
        })
    }
  },
  mounted: function () {
    if (localStorage.getItem('yudian') === 1 || localStorage.getItem('yudian') === '1') {
      this.yudianInfo = '预点'
    } else if (localStorage.getItem('initialStatus') !== '开台') { // 是普通的点单，判断他的状态是否不是开台
      this.choosePeopleDialog = false
    }
    console.log(localStorage.getItem('initialStatus'))
    this.classId = localStorage.getItem('tableName')
    let param = JSON.parse(sessionStorage.getItem('account'))
    this.accountInfo.account = param.account
    this.accountInfo.token = param.token
    this.accountInfo.data.shop_code = param.shop_code
    this.accountInfo.data.right_id = sessionStorage.getItem('right_id')
    this.accountInfo.data.info.type = 0
    this.accountInfo.data.info.class_id = 0
    console.log(this.accountInfo)
    this.$http.post(this.publicapi + '/home/order/choosedish', qs.stringify(this.accountInfo))
      .then(res => {
        this.classList = res.data.class_data
        this.simulationSearch()
        /* this.proList = res.data.data
        let This = this
        this.proList.forEach(function (e, i) {
          This.proList[i]['product_image'] = This.firstUrl + '/' + e.product_image
        }) */
      })
  }
}
</script>
<style>
    @import '../../static/css/cashier.css';
    @import '../../static/css/animal.css';
</style>
