<template>
    <div class="admin" onselectstart="return false">
        <!--<button @click="lineUpPrint">打印操作</button>-->
        <el-container class="" v-loading="false"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-container class="leftmenu">
                <el-aside width="102px" style="background-color: #584d4d">
                    <el-row class="tac" >
                        <ul class="left-function-list">
                            <li> <img src="../assets/logo.png" width="50" height="50"></li>
                            <li><i class="iconfont">&#xe613;</i><span>桌台</span></li>
                            <li><i class="iconfont">&#xe65b;</i><span>外卖</span></li>
                            <li><i class="iconfont">&#xe601;</i><span>排队</span></li>
                            <li><i class="iconfont">&#xe60b;</i><span>预定</span></li>
                            <li><i class="iconfont">&#xe61d;</i><span>会员</span></li>
                            <li><i class="iconfont">&#xe60c;</i><span>收银</span></li>
                            <li><i class="iconfont">&#xe60d;</i><span>设置</span></li>
                        </ul>
                        <div class="user-info-btm">
                            <div><img :src="userHead"></div>
                            <div>{{userName}}</div>
                        </div>
                    </el-row>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
        <audio id="video1" src="http://oss.yundianxiaoer.com/audio/order_new_order.wav" controls="controls" style="width:0;height:0; display: none;" ref="callVideo"></audio>
        <audio id="video2" src="../../static/video/news.wav" controls="controls" style="width:0;height:0; display: none;" ref="news"></audio>
        <audio id="video" v-bind:src="videoSource" controls="controls" style="width:0;height:0; display: none;" ref="newCallvideo"></audio>
    </div>
</template>
<script>
// import lodop from 'LodopFuncs'
import qs from 'qs'
import {mapState, mapMutations} from 'vuex'
import Vue from 'vue'
export default {
  data () {
    return {
      isCollapse: false,
      userHead: '',
      userName: '',
      num: 3,
      right: '',
      data: {
        data: {
          client_id: '',
          shop_code: ''
        }
      },
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
      videoSource: '',
      param: {
        data: [],
        table_name: '',
        price: {
          no_price: '',
          all_price: ''
        }
      }
    }
  },
  computed: {
    ...mapState([
      'bgColor',
      'baseBg',
      'tableHeaderBg',
      'publicapi',
      'callInfo',
      'callInfos',
      'tableData',
      'setTableId'
    ])
  },
  mounted () {
    this.userHead = JSON.parse(sessionStorage.getItem('account')).person_msg_headimage
    this.userName = JSON.parse(sessionStorage.getItem('account')).person_msg_name
    this.accountInfo.data.right_id = sessionStorage.getItem('right_id')
    let param = JSON.parse(sessionStorage.getItem('account'))
    this.accountInfo.account = param.account
    this.accountInfo.token = param.token
    this.accountInfo.data.shop_code = param.shop_code
    this.accountInfo.data.info.type = 0
    this._connectWb_()
    this.$http.post(this.publicapi + '/home/call/searchcall', qs.stringify(this.accountInfo))
      .then(res => {
        console.log(res.data.data)
        this.getCallInfo(res.data.data)
      })
    this.polling()
    this.$nextTick(() => {
      this._getSessionRight_()
    })
  },
  methods: {
    ...mapMutations([
      'getCallInfo',
      'initialCallInfo',
      'changeOrderInfoInTime',
      'addCallInfo',
      'addPrePointPro',
      'initialTables'
    ]),
    /* 定时器 */
    polling () {
      let This = this
      setTimeout(function () {
        try {
          var arr = JSON.parse(localStorage.getItem('callInfoList'))
          This.videoSource = arr[0].videoSource
          var timer11 = setTimeout(function () {
            This.$refs.newCallvideo.play()
            arr.splice(0, 1)
            console.log('这里是语音数组')
            console.log(arr)
            localStorage.setItem('callInfoList', JSON.stringify(arr))
            clearTimeout(timer11)
            This.polling()
          }, 1000)
        } catch (e) {
          This.polling()
        }
      }, 6000)
    },
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
    },
    /* socket连接服务器 */
    _connectWb_ () {
      const This = this
      const ws = new WebSocket('ws://borun.yundianxiaoer.com:8282')
      // 服务端主动推送消息时会触发这里的onmessage
      ws.onmessage = function (e) {
      // json数据转换成js对象
        const data = JSON.parse(e.data)
        console.log(data)
        // 判断传输类型，onConnect,表示绑定，onMessage数据更新
        if (data.type === 'onConnect') {
          This.data.data.client_id = data.message
          This.data.data.shop_code = This.accountInfo.data.shop_code
          This.$http.post(This.publicapi + '/byadmin/websocket/groupbyshopcode', qs.stringify(This.data))
            .then(res => {
            })
        } else if (data.type === 'onMessage') {
          if (data.message.type === 'call') {
            This.addCallInfo(data.message.data)
          } else if (data.message.type === 'all_call') {
            This.getCallInfo(data.message.data)
          } else if (data.message.type === 'new_line') {
            console.log(data.message.data.data)
            return 0
            This.lineUpPrint(data.message.data.data)
          } else if (data.message.type === 'all_table_status') {
            This.accountInfo.data.info.table_id = localStorage.getItem('tableId')
            This.$http.post(This.publicapi + '/home/order/tableorder', qs.stringify(This.accountInfo))
              .then(res => {
                if (res.data.status) {
                  console.log(res.data)
                  This.changeOrderInfoInTime(res.data)
                }
              })
            This.initialTables(data.message)
          } else if (data.message.type === 'all_prepoint') {
            /*  console.log(data.message.data) */
            This.addPrePointPro(data.message.data)
          } else if (data.message.type === 'order') {
            This.$refs.callVideo.play()
            /* 找到下单的桌台，做渲染 */
            This.tableData.items.forEach(function (v, i) {
              if (v.table_id === data.message.data.order_collect_table) {
                This.tableData.items[i].no_print = data.message.data.no_deal_num
                switch (data.message.data.order_collect_table_status) {
                  case '1':
                    This.tableData.items[i].now_status = '空闲'
                    break
                  case '2':
                    This.tableData.items[i].now_status = '开台'
                    break
                  case '3':
                    This.tableData.items[i].now_status = '未付款'
                    break
                  case '4':
                    This.tableData.items[i].now_status = '已付款'
                    break
                  case '5':
                    This.tableData.items[i].now_status = '预定'
                    break
                  case '6':
                    This.tableData.items[i].now_status = '清台'
                    break
                }
                Vue.set(This.tableData, i, This.tableData.items[i])
              }
            })
            This.param.person = data.message.data.order_collect_person
            This.param.price.no_price = data.message.data.all_nopay_price
            This.param.price.all_price = data.message.data.all_true_price
            This.param.price.pay_price = data.message.data.all_pay_price
            This.param.data = data.message.data.order_and_good
            This.param.good_num = data.message.data.all_product_num
            This.param.table_name = data.message.data.order_collect_table_name
            localStorage.setItem('tableId', data.message.data.order_collect_table)
            This.param.status = true
            This.param.no_print = data.message.data.no_deal_num
            console.log(This.param)
            This.changeOrderInfoInTime(This.param)
          } else if (data.message.type === 'pc_printer') {
            if (data.message.data.length > 1) {
              let r = data.message.data
              let l = r[0].order_good.length
              r.forEach((v, i) => {
                This.$layer.msg('手机端打印总单中')
                v.order_good.forEach((vv, ii) => {
                  r[0].order_good.push(vv)
                })
              })
              r[0].order_good.splice(0, l)
              This.printAOrderDetail(r[0], 0)
            } else {
              This.printAOrder(data.message.data, 0)
            }
          }
        }
      }
    },
    /* 排队打印 */
    lineUpPrint (val) {
      console.log(this.accountInfo)
      let no = val.line_code
      let itop = 0
      let itopParam = 24
      if (no < 10) {
        no = '00' + '' + no + ''
      } else if (no < 100) {
        no = '0' + '' + no + ''
      }
      no = val.line_type + '' + no + ''
      console.log(no)
      let printerSize = 58
      let rightCtnMarginLeft = printerSize === 58 ? 140 : 150
      window.CLODOP.ADD_PRINT_TEXT(itop += itopParam - 10, 0, 210, 20, '欢迎您的光临！')
      window.CLODOP.ADD_PRINT_TEXT(itop += itopParam + 10, 0, 555, 0, '*排队号：')
      window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft, 555, 0, no)
      window.CLODOP.ADD_PRINT_TEXT(itop += itopParam, 0, 555, 0, '*选择的人数')
      window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft, 555, 0, val.line_personnum)
      window.CLODOP.ADD_PRINT_TEXT(itop += itopParam, 0, 555, 0, '*前面排队人数')
      window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft, 555, 0, val.line_before_num)
      window.CLODOP.ADD_PRINT_TEXT(itop += 40, 0, 200, 40, '温馨提示：请牢记您的排队号，注意叫号，过号作废！')
      for (let i = 0; i < 8; i++) { // 给上面的字体的大小赋值
        window.CLODOP.SET_PRINT_STYLEA(i, 'FontSize', 13)
        window.CLODOP.SET_PRINT_STYLEA(i, 'bold', 1)
      }
      window.CLODOP.SET_PRINT_STYLEA(1, 'FontSize', 10)
      window.CLODOP.SET_PRINT_STYLEA(1, 'bold', 0)
      window.CLODOP.SET_PRINT_STYLEA(8, 'FontSize', 10)
      window.CLODOP.SET_PRINT_STYLEA(8, 'bold', 0)
      console.log(val.print_value, '打印机驱动')
      window.CLODOP.SET_PRINTER_INDEXA(val.print_value)
      window.CLODOP.SET_PRINT_PAGESIZE(3, 555, 45, '')
      window.CLODOP.PREVIEW()
    },
    /* 手机端打印,不同档口不同打印 */
    printAOrder (val, k) {
      this.$layer.msg('手机端打印请求开始...')
      let info = val[0].order_good
      let This = this
      let tableName = val[0].table_name
      console.log(info)
      info.forEach(function (v, i) {
        This.accountInfo.data.info.stall_id = v.stall_id // 根据商品的档口id获取id的value
        This.$http.post(This.publicapi + '/home/order/return_pro_print', qs.stringify(This.accountInfo))
          .then(res => {
            console.log(res.data.data)
            let param = res.data.data
            let FontSize = 0// 字体大小
            let printerSize = param.print_type === '1' ? 58 : 80
            let rightCtnMarginLeft = printerSize === 58 ? 130 : 150
            let no = 1
            let itop = 20
            console.log(tableName)
            window.CLODOP.ADD_PRINT_TEXT(itop, 52, 555, 0, '桌号：' + tableName)
            if (k === 1) {
              window.CLODOP.ADD_PRINT_TEXT(itop += 25, 70, 100, 0, '（退单）')
            }
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 13)
            window.CLODOP.SET_PRINT_STYLEA(no - 1, 'bold', 1)
            window.CLODOP.ADD_PRINT_TEXT(itop += 25, 0, 100, 20, '菜名')
            window.CLODOP.ADD_PRINT_TEXT(itop, rightCtnMarginLeft - 7, 100, 20, '价格/数量')
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
            window.CLODOP.SET_PRINT_STYLEA(no++, 'FontSize', 10)
            window.CLODOP.ADD_PRINT_LINE(itop += 20, 0, itop, printerSize === 58 ? 180 : 214, 2, 1)
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
            window.CLODOP.SET_LICENSES('', '7AFD1019232F414D2A4DDCE20263AC91","C94CEE276DB2187AE6B65D56B3FC2848', '')
            window.CLODOP.SET_PRINTER_INDEXA(param.print_value)
            console.log(param.print_value, '99999')
            window.CLODOP.SET_PRINT_PAGESIZE(3, 655, 45, '')
            window.CLODOP.PRINT()
          })
      })
      this.printAOrderDetail(val[0], 0) // 前台打印
    },
    /* 单个的总订单 */
    printAOrderDetail (info, k) {
      console.log(info)
      this.$http.post(this.publicapi + '/home/order/return_print', qs.stringify(this.accountInfo))
        .then(res => {
          if (res.data.status) {
            console.log(res.data)
            let val = res.data.data
            let printerSize = val.print_type === '1' ? 58 : 80
            let rightCtnMarginLeft = printerSize === 58 ? 130 : 190
            let no = 1
            let itop = 20
            let tname = info.table_name
            window.CLODOP.ADD_PRINT_TEXT(itop, 52, 555, 0, '桌号：' + tname)
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
            window.CLODOP.ADD_PRINT_TEXT(itop += 10, 0, 250, 20, '共    计: ￥' + info.order_total_price)
            window.CLODOP.SET_LICENSES('', '7AFD1019232F414D2A4DDCE20263AC91","C94CEE276DB2187AE6B65D56B3FC2848', '')
            window.CLODOP.SET_PRINTER_INDEXA(val.print_value)
            console.log(val.print_value)
            window.CLODOP.SET_PRINT_PAGESIZE(3, 655, 45, '')
            window.CLODOP.PREVIEW()
          }
        })
    }
  }
}
</script>
<style lang="scss">
    /*左侧头像*/
    .user-info-btm{
        width:102px;
        height:100px;
        bottom:0;
        left:0;
        position: fixed;
    }
    .user-info-btm div:first-child{
        widht:102px;
        height:60px;
        text-align: center;
    }
    .user-info-btm div:first-child img{
        width:50px;
        height:50px;
        border-radius: 50%;
        margin-top:5px;
    }
    .user-info-btm div:last-child{
        font-family: '楷体';
        line-height: 30px;
    }
    /*左侧li*/
    .left-function-list li{
        height:60px;
        text-align: center;
        line-height: 60px;
        font-family: '楷体';
        font-size:18px;
    }
    .left-function-list li:hover{
        background-color: #927070;
    }
    .left-function-list li:first-child{
        background-color: white;
    }
    .left-function-list li:first-child img{
        margin-top:5px;
    }
    .left-function-list li i{
        font-size:24px;
        vertical-align: middle;
    }
    .left-function-list li span{
        vertical-align: middle;
        font-size:18px;
        font-family: '楷体';
        margin-left:10px;
    }
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
        background-color: #584d4d;
        color: #fff;
        text-align: center;
    }
    .el-main {
        padding:0;
        background-color: #e4e4e4;
        color: #333;
    }
</style>
