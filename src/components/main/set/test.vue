<template>
    <div class="wrap-con">
        <div class="wct">
            <p>智能设置 / 档口设置</p>
            <div class="wct-r">
                <div class="wrapCom">
                </div>
                <div class="wrapBtns">
                    <el-button class="add" @click="add">新增</el-button>
                </div>
            </div>
        </div>
        <div class="wcc">
            <el-table
                    :data="stallList"
                    style="width: 100%">
                <el-table-column prop="stall_id" label="档口ID"></el-table-column>
                <el-table-column prop="stall_name" label="档口名称"></el-table-column>
                <el-table-column prop="address" label="所属打印机">
                    <template slot-scope="scope">
                        <el-select placeholder="请选择" @change="update(scope)" v-model="scope.row.print_value" v-if="Printers.length > 0">
                            <el-option
                                    v-for="item in Printers"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="打印机尺寸">
                    <template slot-scope="scope">
                        <el-select placeholder="请选择" @change="update(scope)" v-model="scope.row.print_type" v-if="Printers.length > 0">
                            <el-option
                                    v-for="item in paperSize"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="更多" width="100">
                    <template  slot-scope="scope">
                        <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="middle">更多</el-button>
                </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{type: 3, data: scope.row}">修改</el-dropdown-item>
                                <el-dropdown-item :command="{type: 4, data: scope.row}">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            <div class="yun-dialog-body" v-if="noDialog">
                <div class="yun-dialog-content">
                    <div class="dialog-header">此档口被下列菜品使用<i class="iconfont" style="position: absolute;right: 10px;cursor: pointer;" @click="usedFoodDialog">&#xe65a;</i></div>
                    <div class="dialog-body">
                        <table class="exists-pro">
                            <tr><th>商品名称</th><th>商品图片</th></tr>
                            <tr v-for="(v, i) in usedPro" v-bind:key="i"><td style=" vertical-align: middle;">{{v.product_name}}</td>
                                <td><img :src="v.product_image" style="height:50px;width:50px;"></td></tr>
                        </table>
                    </div>
                </div>
            </div>
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
  //import lodop from 'CLodopFuncs'
  export default {
    data () {
      return {
        usedPro: [],
        stallList: [],
        noDialog: false,
        flag: false,
        title: ['新增档口', '修改档口', '删除档口'],
        paperSize: [{value: 1, label: '58mm'}, {value: 2, label: '80mm'}],
        Printers: [],
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
              stall_name: '',
              setup_stall: ''
            }
          }
        }
      }
    },
    mounted () {
      this._getInitData_()
      this.getPrinters()
      this.$nextTick(() => {})
    },
    created () {
      this._setInitData_()
    },
    methods: {
      ...mapMutations(['changeLoading']),
      /* 修改打印机设置 */
      update (scope) {
        this.stallList[scope.$index].type = 3
        this.data.data.info.setup_stall = this.stallList[scope.$index]
        this.$http.post(this.publicapi + '/byadmin/setup/edit_print', this.$qs.stringify(this.data))
          .then(res => {
            this.$layer.msg(res.data.msg)
          })
      },
      /* 弹窗的显示与隐藏 */
      usedFoodDialog () {
        this.noDialog = !this.noDialog
      },
      /* 删除档口 */
      delPirnter (index) {
        const id = this.$layer.confirm('是否删除档口？', () => {
          this.$http.post(this.publicapi + '/byadmin/setup/stalls', this.$qs.stringify(this.data))
            .then(res => {
              this.$layer.msg(res.data.msg)
              if (res.data.status) {
                this._getInitData_()
              } else {
                this.noDialog = true
                res.data.data.forEach((v, i) => {
                  res.data.data[i].product_image = 'http://oss.yundianxiaoer.com/' + v.product_image
                })
                this.usedPro = res.data.data
              }
            })
          this.$layer.close(id)
        })
      },
      /* 获取打印机列表 */
      getPrinters () {
        const printers = window.CLODOP.Printers.list
        console.log(printers)
        printers.forEach((val, index) => {
          val.label = val.name
          val.value = index
        })
        this.Printers = printers
      },
      /* 进入页面初始化数据 */
      _getInitData_ () {
        this.changeLoading({status: true, msg: '加载中'})
        this.data.data.info.type = 1
        this.$http.post(this.publicapi + '/byadmin/setup/stalls', this.$qs.stringify(this.data))
          .then(res => {
            if (res.data.status) {
              this.stallList = res.data.data
              console.log(res.data.data)
              this.changeLoading({status: false, msg: '加载中'})
            } else {
              this.$message({message: res.data.msg, type: 'error'})
            }
          })
      },
      /* 进入页面设置初始数据 */
      _setInitData_ () {
        const account = JSON.parse(sessionStorage.getItem('account'))
        this.data.account = account.account
        this.data.token = account.token
        this.data.data.shop_code = account.shop_code
        this.data.data.user_type_id = account.user_type_id
        this.data.data.right_id = this.$route.meta.right_id
      },
      /* 点击添加按钮 */
      add () {
        this.flag = true
        this.data.data.info.type = 2
        this.data.data.info.stall_name = ''
      },
      /* 点击更多按钮的选项 */
      more (command) {
        this.data.data.info.type = command.type
        if (command.type === 3) {
          this.flag = true
        } else {
          this.delPirnter()
        }
        this.data.data.info.stall_name = command.data.stall_name
        this.data.data.info.stall_id = command.data.stall_id
      },
      submit () {
        if (this.data.data.info.stall_name) {
          this.$http.post(this.publicapi + '/byadmin/setup/stalls', this.$qs.stringify(this.data))
            .then(res => {
              if (res.data.status) {
                this.flag = false
                this.data.data.info.type = 2
                this.data.data.info.stall_name = ''
                this._getInitData_()
              }
              this.$message({message: res.data.msg, type: res.data.status ? 'success' : 'error'})
            })
        } else {
          this.$message({message: '请填写档口名称', type: 'error'})
        }
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
        margin: 0 auto;
    }
</style>
