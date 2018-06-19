<template>
  <div class="wrap-con">
    <div class="wct">
      <p>智能设置 / 员工设置</p>
      <div class="wct-r">
        <div class="wrapCom">
        </div>
        <div class="wrapBtns">
          <el-button class="add" size="small" @click="flag = !flag">新增</el-button>
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
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="date"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="员工账号">
          </el-table-column>
          <el-table-column
            prop="address"
            label="员工姓名"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="address"
            label="职位"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="address"
            label="手机号码"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="更多" width="160">
            <template  slot-scope="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>编辑</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog
        title="新增员工"
        :visible.sync="flag"
        width="30%"
        center
        :style="{background: bgColor}">
        <el-form label-width="80px">
          <el-form-item label="账号">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="岗位选择">
            <el-select size="small">
              <el-option>收银员</el-option>
              <el-option>厨师</el-option>
              <el-option>服务员</el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="flag = false" size="small">取 消</el-button>
        <el-button type="danger" @click="flag = false" size="small">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      tableData: [1, 2, 3, 4, 6, 7, 8, 9, 10],
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
      value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      flag: false
    }
  },
  methods: {
  },
  computed: {
    ...mapState([
      'bgColor'
    ])
  }
}
</script>
<style>
</style>
