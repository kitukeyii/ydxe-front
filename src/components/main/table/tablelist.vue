<template>
  <div class="wrap-con">
    <div class="wct">
      <p>商品管理 / 桌台列表</p>
      <div class="wct-r">
        <div class="wrapCom">
          <el-input placeholder="请输入内容" class="input-with-select" size="small">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="wrapBtns">
          <el-button class="add" size="small" @click="add()">新增</el-button>
        </div>
      </div>
    </div>
    <div class="wcc">
      <template>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :table-cell-style="{background: tableHeaderBg}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" label="桌台二维码">
            <template  slot-scope="scope">
              <img :src="scope.row.table_qrcode_url" alt="" width="60px" height="60px">
            </template>
          </el-table-column>
          <el-table-column prop="table_name" label="桌台号"></el-table-column>
          <el-table-column prop="table_person" label="可坐人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="table_floor" label="楼层" show-overflow-tooltip></el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 2, data: scope.row}">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{type: 3, data: scope.row}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog
        :title="title"
        :visible.sync="DialogVisible"
        width="30%"
        center
        :style="{background: bgColor}">
        <el-form label-width="80px">
          <div style="text-align: center;line-height: 50px;"  v-show="num===3">确定删除当前桌台吗？</div>
          <el-form-item label="楼层" v-show="num===1||num===2">
            <el-select v-model="data.data.info.table_floor_id" placeholder="请选择">
              <el-option
                v-for="item in floorlist"
                :key="item.table_floor_id"
                :label="item.table_floor_name"
                :value="item.table_floor_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新增桌号" v-show="num===1">
            <el-input size="small" v-model="data.data.info.table_name"></el-input>
          </el-form-item>
          <el-form-item label="桌号" v-show="num===2">
            <el-input size="small" v-model="data.data.info.table_name"></el-input>
          </el-form-item>
          <el-form-item label="可坐人数" v-show="num===1||num===2">
            <div style="display: flex;">
              <el-input size="small" class="minNum" v-model="data.data.info.minperson"></el-input>
              <span>至</span>
              <el-input size="small" class="maxNum" v-model="data.data.info.maxperson"></el-input>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="DialogVisible = false" size="small">取 消</el-button>
            <el-button :style="{background: baseBg}" type="danger" @click="submit()" size="small">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import qs from 'qs'
export default {
  data () {
    return {
      tableData: [],
      DialogVisible: false,
      title: '',
      num: 0,
      floorlist: [],
      data: {
        account: '',
        token: '',
        data: {
          user_type_id: '',
          shop_code: '',
          right3: 'b1',
          info: {
            adminMsgType: 1,
            limit: 1,
            table_id: '',
            table_floor_name: '',
            table_name: '',
            table_floor_id: '',
            minperson: '',
            maxperson: ''
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
  methods: {
    _setInitData_ () {
      const account = JSON.parse(sessionStorage.getItem('account'))
      this.data.account = account.account
      this.data.token = account.token
      this.data.data.shop_code = account.shop_code
      this.data.data.user_type_id = account.user_type_id
    },
    _getInitData_ () {
      this._setInitData_()
      this.$http.post(this.publicapi + '/byadmin/table/tablelist', qs.stringify(this.data))
        .then(res => {
          if (res.data.status) {
            this.tableData = this._eidttableData_(res.data.data)
          }
          this.$message(res.data.msg)
        })
    },
    _eidttableData_ (data) {
      data.forEach(val => {
        val.table_qrcode_url = this.firstUrl + val.table_qrcode_url + this.lastUrl
      })
      return data
    },
    add () {
      this.num = 1
      this.DialogVisible = true
      this._changeTitle_()
      if (this.floorlist.length) {
        this._getFloor_()
      }
    },
    _getFloor_ () {
      this.$http.post(this.publicapi + '/byadmin/table/getfloor', qs.stringify(this.data))
        .then(res => {
          if (res.data.status) {
            this.floorlist = res.data.data
          }
        })
    },
    addtable () {
      this.$http.post(this.publicapi + '/byadmin/table/addtable', qs.stringify(this.data))
        .then(res => {
          console.log(res)
        })
    },
    _gettable_ (data) {
      if (this.floorlist.length) {
        this._getFloor_()
      }
      this.data.data.info.table_id = data.table_id
      this.data.data.info.table_floor_name = data.table_floor_name
      this.data.data.info.table_name = data.table_name
      this.data.data.info.table_floor_id = data.table_floor_id
      this.data.data.info.minperson = data.table_mini_person
      this.data.data.info.maxperson = data.table_max_person
    },
    edittable () {
      this.$http.post(this.publicapi + '/byadmin/table/edittable', qs.stringify(this.data))
        .then(res => {
          if (res.data.status) {
            this._getInitData_()
            this.DialogVisible = false
          }
          this.$message(res.data.msg)
        })
    },
    more (command) {
      this.num = command.type
      this.DialogVisible = true
      this._changeTitle_()
      if (command.type === 2) {
        this._gettable_(command.data)
      }
    },
    submit () {
      if (this.num === 1) {
        this.addtable()
      } else {
        this.edittable()
      }
    },
    _changeTitle_ () {
      let title = ''
      switch (this.num) {
        case 1 : title = '新增桌台'
          break
        case 2 : title = '修改桌台'
          break
        case 3 : title = '删除桌台'
          break
      }
      this.title = title
    }
  },
  computed: {
    ...mapState([
      'bgColor',
      'baseBg',
      'tableHeaderBg',
      'publicapi',
      'firstUrl',
      'lastUrl'
    ])
  }
}
</script>
<style lang="scss">
  .el-dialog__wrapper{
    background: rgba(255,255,255,.8);
  }
  .wcc{
    overflow: hidden;
    overflow-y: auto;
  }
</style>
