<template>
  <div class="wrap-con">
    <div class="wct">
      <p>智能设置 / 档口设置</p>
      <div class="wct-r">
        <div class="wrapCom">
        </div>
        <div class="wrapBtns">
          <el-button class="add" size="small" @click="add">新增</el-button>
        </div>
      </div>
    </div>
    <div class="wcc">
      <template>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column prop="stall_id" label="档口ID"></el-table-column>
          <el-table-column prop="stall_name" label="档口名称"></el-table-column>
          <el-table-column prop="address" label="所属打印机" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.print_type" @change="select(scope.row)">
                <el-option
                  v-for="item in paperSize"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="打印机尺寸" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.print_type" @change="select(scope.row)">
                <el-option
                  v-for="item in paperSize"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 3, data: scope.row}">修改</el-dropdown-item>
                  <el-dropdown-item :command="{type: 4, data: scope.row}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
import qs from 'qs'
export default {
  data () {
    return {
      tableData: [],
      flag: false,
      title: ['新增档口', '修改档口', '删除档口'],
      paperSize: [{value: '58', label: '58mm'}, {value: '80', label: '80mm'}],
      data: {
        account: '',
        token: '',
        data: {
          shop_code: '',
          user_type_id: '',
          right_id: '',
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
    this.$nextTick(() => {
      this._getInitData_()
    })
  },
  created () {
    this._setInitData_()
  },
  methods: {
    ...mapMutations(['changeLoading']),
    _getInitData_ () {
      this.changeLoading({status: true, msg: '加载中'})
      this.data.data.info.type = 1
      this.$http.post(this.publicapi + '/byadmin/setup/stalls', qs.stringify(this.data))
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.tableData = res.data.data
            this.changeLoading({status: false, msg: '加载中'})
          } else {
            this.$message(res.data.msg)
          }
        })
    },
    _setInitData_ () {
      const account = JSON.parse(sessionStorage.getItem('account'))
      this.data.account = account.account
      this.data.token = account.token
      this.data.data.shop_code = account.shop_code
      this.data.data.user_type_id = account.user_type_id
      this.data.data.right_id = this.$route.meta.right_id
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
    },
    select (val) {
      console.log(val)
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
</style>
