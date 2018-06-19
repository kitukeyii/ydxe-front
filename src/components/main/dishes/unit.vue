<template>
  <div class="wrap-con">
    <div class="wct">
      <p>商品管理 / 单位管理</p>
      <div class="wct-r">
        <div class="wrapCom">
        </div>
        <div class="wrapBtns">
          <el-button class="add" size="small" @click="flag1 = !flag1">新增</el-button>
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
          <el-table-column prop="name" label="单位值"></el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>修改</el-dropdown-item>
                  <el-dropdown-item :command="{type: 'delete'}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        center
        :style="{background: bgColor}">
        <span>确定删除当前规格吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
      <el-dialog
        title="添加规格"
        :visible.sync="flag1"
        width="30%"
        center
        :style="{background: bgColor}">
        <el-form label-width="80px">
          <el-form-item label="规格名称">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="规格内容">
            <el-input type="textarea" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small"  class="submit" type="danger" :style="{background: baseBg}" @click="flag1 = false">提交</el-button>
            <el-button size="small" @click="flag1 = false">取消</el-button>
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
      flag1: false
    }
  },
  methods: {
    more (command) {
      if (command.type === 'delete') {
        this.dialogVisible = true
      }
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
