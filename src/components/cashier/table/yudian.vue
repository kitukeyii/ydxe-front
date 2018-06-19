<template>
    <div class="yudian-body">
        <div class="yudian-header" >
            <div contenteditable="true" class="yd-search" style="display: none">
                <div class="ydh-search">搜索</div>
            </div>
        </div>
        <div class="yudian-info">
            <table :style="{marginTop:(orderMarginTopValue+'px')}" >
                <thead>
                    <th>订单号</th>
                    <th>点餐时间</th>
                    <th>商品数量</th>
                    <th>状态</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    <tr v-for="(item, key) in prePointPro" v-bind:key="key">
                        <td>{{item.prepoint_code | eidtLine}}</td>
                        <td>{{item.prepoint_time}}</td>
                        <td>{{item.prepoint_personnum }}</td>
                        <td v-if="item.prepoint_isdeal === '1'">未处理</td><!--1:未处理  2:已经处理 3：取消-->
                        <td v-else-if="item.prepoint_isdeal === '2'">已处理</td>
                        <td v-else>取消</td>
                        <td style="width: 22%;">
                            <button class="xiadan" @click="placeOrder(item.prepoint_id)">下单并分配桌台</button>
                            <button class="quxiao" @click="delyudian(item.prepoint_id, key)">取消</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="yudian-footer">
                <div class="down-btn r spc-time-downbtn" style="margin-right: 70px;" @click="orderMoveUp(0)"><span style="top: 18px;right: 8px;"></span></div>
                <div class="up-btn r spc-time-upbn" style="margin-right: 20px;" @click="orderMoveUp(1)"><span style=" top: -2px; right: 8px;"></span></div>
            </div>
            <!-- 选择桌台 -->
          <div class="yun-dialog-body " v-if="shareTable" >
                <div class="yun-dialog-content animated bounceInLeft" style="width: 864px;">
                    <div class="dialog-header">预点<i class="iconfont closeBtn"  @click="hiddenTableDialog()">&#xe65a;</i></div>
                    <div class="dialog-body" >
                        <ul class="merge-floor-list">
                            <li @click="changeMergeTable(0, -1)">全部桌台</li>
                            <li  @click="changeMergeTable(item.table_floor_id,key)">
                            </li>
                        </ul>
                      <!--  <ul class="od-more merge-more"><li></li><li></li><li></li></ul>-->
                    </div>
                    <div class="merge-table-list" style="float: left;">
                        <div class="merge-table-item" v-for="(item,key) in freeTables" v-bind:key="key" @click="chooseFreeTable(key, item.table_id)">
                            <div class="merge-span"  :class="{mergeTableItemActive:item.isSelected === 1 }"><i class="iconfont icon">&#xe602;</i>
                                <span class="mergin-span-btm" :class="{mergeTableItemSpanActive:item.isSelected === 1}"><i class="iconfont">&#xe684;</i>231</span></div>
                            <div class="merget-span-title">{{item.table_name}}</div>
                        </div>
                    </div>
                    <div class="dialog-footer" style="float: left;">
                        <div class="dialog-cancel" @click="hiddenTableDialog" style="margin-left: 284px;">取&nbsp;&nbsp;消</div>
                        <div class="dialog-confirm" style="background-color: #3fca57;" @click="shareTableDialog">确认</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import qs from 'qs'
import layer from 'vue-layer'
import Vue from 'vue'
Vue.prototype.$layer = layer(Vue)
export default{
  data () {
    return {
      pro: '',
      orderMarginTopValue: 0,
      tableId: '',
      marginTop: 0,
      shareTable: false,
      freeTables: [],
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
      'publicapi',
      'prePointPro'
    ])
  },
  methods: {
    ...mapMutations([
      'addPrePointPro'
    ]),
    /* 上下移动按钮 */
    orderMoveUp (param) {
      if (param === 0) {
        this.orderMarginTopValue -= 100
      } else {
        if (this.orderMarginTopValue === 0 || this.orderMarginTopValue === '0') return
        this.orderMarginTopValue = parseInt(this.orderMarginTopValue) + parseInt(100)
      }
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
    delyudian (val, index) {
      this.accountInfo.data.table_id = ''
      this.accountInfo.data.prepoint_id = val
      this.$http.post(this.publicapi + '/home/LineAndPrepoint/prepoint_cancel', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$layer.msg('取消成功！')
          }
        })
    },
    placeOrder (prepointId) {
      this.accountInfo.data.line_or_prepoint_id = prepointId
      this.shareTable = true
      this.$http.post(this.publicapi + '/home/LineAndPrepoint/get_free_table', qs.stringify(this.accountInfo))
        .then(res => {
          console.log(res)
          this.freeTables = res.data.data
          this.freeTables.forEach((v, i) => {
            this.freeTables[i].isSelected = 0
          })
        })
    },
    hiddenTableDialog () {
      this.shareTable = false
      this.accountInfo.data.table_id = ''
    },
    shareTableDialog () {
      this.shareTable = false
      this.accountInfo.data.type = 2
      if (this.accountInfo.data.table_id > 0) {
        this.$http.post(this.publicapi + '/home/LineAndPrepoint/repast', qs.stringify(this.accountInfo))
          .then(res => {
            if (res.data.status) {
              this.$layer.msg('分配桌台成功！')
            }
            this.accountInfo.data.table_id = ''
          })
      }
    }
  },
  filters: {
    eidtLine (value) {
      let str = ''
      if (value.length === 1) {
        str = '00' + value
      } else if (value.length === 2) {
        str = '0' + value
      } else {
        str = value
      }
      return str
    },
    editTime (value) {
      return value.substring(10)
    }
  },
  mounted: function () {
    let param = JSON.parse(sessionStorage.getItem('account'))
    this.accountInfo.account = param.account
    this.accountInfo.token = param.token
    this.accountInfo.data.right_id = sessionStorage.getItem('right_id')
    this.accountInfo.data.shop_code = param.shop_code
    console.log(this.accountInfo)
    this.$http.post(this.publicapi + '/home/LineAndPrepoint/get_prepoint', qs.stringify(this.accountInfo))
      .then(res => {
        console.log(res)
        // this.pro = res.data.data
        this.addPrePointPro(res.data.data)
      })
  }
}
</script>
<style lang="scss">
    .yudian-footer{
        height: 70px;
        width: 100%;
        position: absolute;
        float: left;
        bottom: 0px;
        border-top: 1px solid #bbb;
        background-color: white;
    }
    .quxiao{
        border:1px solid #ff4141;
        height: 40px;
        border-radius: 4px;
        color: #000;
        background-color: white;
        padding:0px 16px;
        margin-left: 4px;
    }
    .xiadan {
        background: #ff4141;
        border: none;
        height: 40px;
        border-radius: 4px;
        color: white;
        padding:0px 10px;
    }
    .yudian-info table tbody tr{
        height: 50px;
        line-height: 50px;
        text-indent: 15px;
        border-bottom: 1px solid #eee;
    }
    .yudian-info table tbody tr:hover{
        background-color: #e4e4e4;
    }
    .yudian-info table {
        width: 100%;
    }
    .yudian-info table thead th{
        height: 44px;
        line-height: 44px;
        text-align: left;
        text-indent: 14px;
    }
    .yudian-info table thead{
        width: 100%;
        border-bottom: 1px solid #eee;
    }
    .yudian-info{
        width: 96%;
        height: calc(100% - 75px);
        margin-top: 15px;
        margin-left: 2%;
        border-radius: 4px;
        background-color: white;
        overflow: hidden;
        position: relative;
    }
    .yudian-body {
        width: 100%;
        height: 100%;
    }
    .yudian-header{
        width: 100%;
        height: 60px;
        background-color: white;
        border-left: 1px solid #ddd;
    }
    .yd-search {
        width: 340px;
        height: 44px;
        float: left;
        margin-left: 15px;
        margin-top: 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
        position: relative;
    }
    .ydh-search {
        position: absolute;
        height: 40px;
        right: 0;
        width: 70px;
        color: white;
        text-align: center;
        line-height: 40px;
        font-family: '楷体';
        background-color: #ff4141;
        color: white;
        margin-top: 1px;
        border-radius:4px;
    }
    @import '//at.alicdn.com/t/font_647332_anne8atx3yfx0f6r.css';
    @import '../../../../static/css/animal.css';
    @import '../../../../static/css/cashier.css';
</style>
