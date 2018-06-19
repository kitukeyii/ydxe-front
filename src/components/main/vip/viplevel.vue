<template>
  <div class="wrap-con">
    <div class="wct">
      <p>会员管理 / 会员等级</p>
      <div class="wct-r">
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
          style="width: 100%"
          :header-cell-style="{background: tableHeaderBg}">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="date" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="name" label="会员等级"></el-table-column>
          <el-table-column prop="address" label="会员折扣" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="所需消费金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="充值" show-overflow-tooltip></el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>修改</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-dialog
        title="新增会员等级"
        :visible.sync="flag"
        width="30%"
        center
        :style="{background: bgColor}">
        <el-form label-width="80px">
          <el-form-item label="会员等级">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="所需金额">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="充值金额">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="折扣">
            <el-input size="small"></el-input>
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
      tableData: [1, 2, 3, 4, 6, 7, 8, 9],
      flag: false
    }
  },
  computed: {
    ...mapState([
      'tableHeaderBg',
      'baseBg'
    ])
  }
}
</script>
<style lang="scss">
  .wcc{
    overflow: hidden;
    overflow-y: auto;
  }
</style>
