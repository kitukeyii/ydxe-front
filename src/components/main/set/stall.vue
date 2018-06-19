<template>
<div class="wrap-con">
    <div class="yun-dialog-body" v-if="noDialog">
        <div class="yun-dialog-content">
            <div class="dialog-header">此档口被下列菜品使用<i class="iconfont" style="position: absolute;right: 10px;cursor: pointer;" @click="usedFoodDialog">&#xe65a;</i></div>
            <div class="dialog-body">
                <table class="exists-pro">
                    <tr><th>商品名称</th><th>图片展示</th></tr>
                    <tr v-for="(v, i) in usedPro" v-bind:key="i"><td style=" vertical-align: middle;">{{v.product_name}}</td>
                        <td><img :src="v.product_image" style="height:50px;width:50px;"></td></tr>
                </table>
            </div>
        </div>
    </div>
    <div class="wct">
        <p>智能设置 / 档口设置</p>
        <div class="wct-r">
            <div class="wrapCom">
            </div>
            <div class="wrapBtns">
                <el-button class="add" size="small" @click="add">新增
                </el-button>
            </div>
        </div>
    </div>
    <div class="wcc"><select id="Select01" size="1" onchange="demoCreatePagSizeList()" style="display: none"></select>
        <ul><li></li></ul>
        <table class="printTable">
            <tr><th>档口ID</th><th>档口名称</th><th>所属打印机</th><th>打印机尺寸</th><th>更多</th></tr>
            <tr v-for="(item,key) in stallList" v-bind:key="key">
                <td>{{item.stall_id}}</td>
                <td>{{item.stall_name}}</td>
                <td>
                   <select  v-model="item.print_value">
                       <option  v-for="(val, index) in item.printers" v-bind:key="index" v-bind:value="index">
                         {{val.name}}
                       </option>
                   </select>
                </td>
                <td><select v-model="item.print_type">
                    <option v-for="(o, j) in item.printerVal" v-bind:key="j" v-bind:value="o.value">{{o.label}}</option>
                </select></td>
                <td><button @click="update(key)">修改</button>&nbsp;&nbsp;<button @click="delPirnter(key)">删除</button></td>
            </tr>
        </table>

        <el-dialog
                :title="title[data.data.info.type - 2]"
                :visible.sync="flag"
                width="30%"
                center
                :style="{background: bgColor}">
            <el-form label-width="80px">
                <div style="text-align: center;margin-bottom: 30px;" v-show="data.data.info.type === 4">确定删除当前档口吗?</div>
                <el-form-item label="档口名称"  v-show="data.data.info.type === 2 || data.data.info.type === 3">
                    <el-input size="small" v-model="data.data.info.stall_name"></el-input>
                </el-form-item>
                <div style="text-align: center;">
                    <el-button @click="flag = false" size="small">取 消</el-button>
                    <el-button type="danger" @click="submit" size="small">确 定</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import layer from 'vue-layer'
import Vue from 'vue'
import qs from 'qs'
export default {
  data () {
    return {
      usedPro: [],
      stallList: [],
      noDialog: false,
      flag: false,
      title: ['新增档口', '修改档口', '删除档口'],
      paperSize: [{value: '1', label: '58mm'}, {value: '2', label: '80mm'}],
      printerList: [],
      data: {
        account: '',
        token: '',
        printer: {
          value: ''
        },
        data: {
          shop_code: '',
          user_type_id: '',
          right_id: '38',
          info: {
            type: 1,
            stall_id: '',
            stall_name: ''
          }
        }
      }
    }
  },
  mounted () {
    console.log(window.CLODOP.Printers.list)
    return 0
    this.$nextTick(() => {
      this._getInitData_()
    })
  },
  created () {
    this._setInitData_()
  },
  methods: {
    ...mapMutations(['changeLoading']),
    /* 修改打印机设置 */
    update (index) {
      this.stallList[index].type = 3
      this.data.data.info = this.stallList[index]
      this.$http.post(this.publicapi + '/byadmin/setup/stalls', qs.stringify(this.data))
        .then(res => {
          this.$layer.msg(res.data.msg)
        })
    },
    /* 弹窗的显示与隐藏 */
    usedFoodDialog () {
      if (this.noDialog) {
        this.noDialog = false
      } else {
        this.noDialog = true
      }
    },
    /* 删除打印机 */
    delPirnter (index) {
      let id = this.$layer.confirm('是否删除打印机？', () => {
        this.stallList[index].type = 4
        this.data.data.info = this.stallList[index]
        this.$http.post(this.publicapi + '/byadmin/setup/stalls', qs.stringify(this.data))
          .then(res => {
            this.$layer.msg(res.data.msg)
            console.log(res)
            if (res.data.status) {
              this.stallList.splice(index, 1)
            } else {
              this.noDialog = true
              res.data.data.forEach((v, i) => {
                res.data.data[i].product_image = 'http://oss.yundianxiaoer.com/' + v.product_image
              })
              this.usedPro = res.data.data
              console.log(this.res)
              console.log(this.usedPro)
            }
          })
        this.$layer.close(id)
      })
    },
    _getInitData_ () {
      this.changeLoading({status: true, msg: '加载中'})
      this.data.data.info.type = 1
      this.$http.post(this.publicapi + '/byadmin/setup/stalls', qs.stringify(this.data))
        .then(res => {
          if (res.data.status) {
            this.stallList = res.data.data
            this.demoCreatePrinterList()
            this.changeLoading({status: false, msg: '加载中'})
          } else {
            this.$message(res.data.msg)
          }
        })
    },
    demoCreatePrinterList () {
      lodop.do().Create_Printer_List(document.getElementById('Select01'))
      let length = document.getElementById('Select01').length
      let obj = document.getElementById('Select01')
      for (let i = 0; i < length; i++) {
        let arr = []
        arr.name = obj.options[i].text
        arr.value = i
        this.printerList.push(arr)
      }
      this.stallList.forEach((v, i) => {
        this.stallList[i].printers = this.printerList
        this.stallList[i].printerVal = this.paperSize
      })
      console.log(this.stallList)
      this.demoCreatePagSizeList()
    },
    demoCreatePagSizeList () {
      let oSelect = document.getElementById('Select02')
      let iPrintIndex = document.getElementById('Select01').value
      lodop.do().Create_PageSize_List(oSelect, iPrintIndex)
    },
    _setInitData_ () {
      const account = JSON.parse(sessionStorage.getItem('account'))
      this.data.account = account.account
      this.data.token = account.token
      this.data.data.shop_code = account.shop_code
      this.data.data.user_type_id = account.user_type_id
    },
    add () {
      this.flag = true
      this.data.data.info.type = 2
      this.data.data.info.stall_name = ''
    },
    more (command) {
      this.data.data.info.type = command.type
      this.flag = true
      this.data.data.info.stall_name = command.data.stall_name
      this.data.data.info.stall_id = command.data.stall_id
    },
    submit () {
      this.$http.post(this.publicapi + '/byadmin/setup/stalls', qs.stringify(this.data))
        .then(res => {
          this.flag = false
          this._getInitData_()
          this.$message(res.data.msg)
        })
    }
  },
  computed: {
    ...mapState([
      'bgColor',
      'baseBg',
      'tableHeaderBg',
      'publicapi'
    ])
  }
}
</script>
<style>
    @import '../../../../static/css/cashier.css';
</style>
<style scoped>
.printTable{
    width: 100%;
}
.printTable img {
    height: 50px;
    width: 50px;
}
.printTable td{
    vertical-align: middle;
    text-align: center;
}
.printTable tr{
    text-align: center;
    height: 40px;
}
.exists-pro{
    width: 90%;
    margin: 0px auto;
}
</style>
