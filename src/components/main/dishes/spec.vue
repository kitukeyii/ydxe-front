<template>
  <div class="wrap-con">
    <div class="wct">
      <p>商品管理 / 规格管理</p>
      <div class="wct-r">
        <div class="wrapCom">
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
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" label="规格名称" width="120"></el-table-column>
          <el-table-column prop="name" label="规格值"></el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 2}">修改</el-dropdown-item>
                  <el-dropdown-item :command="{type: 3}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        center
        :style="{background: bgColor}">
        <el-form label-width="80px">
          <div style="text-align: center;line-height: 50px;" v-show="num===3">确定删除当前规格吗？</div>
          <el-form-item label="规格名称" v-show="num===1||num===2">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="规格内容" v-show="num===1||num===2">
            <el-input type="textarea" size="small"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <el-button size="small"  class="submit" type="danger" :style="{background: baseBg}" @click="dialogVisible = false">提交</el-button>
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      tableData: [{
        date: '大小',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      dialogVisible: false,
      num: 0,
      data: {
        data: {
        }
      }
    }
  },
  methods: {
    more (command) {
      this.num = command.type
      this.dialogVisible = true
      this.changeTitle()
    },
    add () {
      this.num = 1
      this.dialogVisible = true
      this.changeTitle()
    },
    changeTitle () {
      let title = ''
      switch (this.num) {
        case 1 : title = '添加规格'
          break
        case 2 : title = '修改规格'
          break
        case 3 : title = '删除规格'
          break
      }
      this.title = title
    }
  },
  computed: {
    ...mapState([
      'bgColor',
      'baseBg'
    ])
  }
}
</script>
<style>
  .el-table th{
    background:#f4f4f4;
  }
</style>
