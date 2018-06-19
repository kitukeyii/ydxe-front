<template>
  <div class="wrap-con">
    <div class="wct">
      <p>订单管理 / 挂账</p>
      <div class="wct-r">
        <div class="wrapCom">
          <el-date-picker
            v-model="value5"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="small"
            style="width:350px">
          </el-date-picker>
          <el-button class="add" size="small">查询</el-button>
        </div>
        <div class="wrapBtns">

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
          :header-cell-style="{background: tableHeaderBg}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" label="订单ID" width="100">
          </el-table-column>
          <el-table-column prop="name" label="订单号"></el-table-column>
          <el-table-column prop="address" label="时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="桌号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="floor" label="总价" show-overflow-tooltip></el-table-column>
          <el-table-column prop="floor" label="支付方式" show-overflow-tooltip></el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>详情</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      tableData: [1, 2, 3, 4, 6],
      value5: '',
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
    }
  },
  computed: {
    ...mapState([
      'tableHeaderBg'
    ])
  }
}
</script>
<style>
</style>
