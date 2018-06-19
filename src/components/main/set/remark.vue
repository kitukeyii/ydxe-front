<template>
  <div class="wrap-con">
    <div class="wct">
      <p>智能设置 / 备注设置</p>
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
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="点菜备注" name="0"></el-tab-pane>
          <el-tab-pane label="退菜备注" name="1"></el-tab-pane>
        </el-tabs>
      </template>
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
            label="点菜备注"
            v-if="activeName === '0'">
          </el-table-column>
          <el-table-column
            prop="address"
            label="退菜备注"
            show-overflow-tooltip
            v-if="activeName === '1'">
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
        title="新增备注"
        :visible.sync="flag"
        width="30%"
        center
        :style="{background: bgColor}">
        <el-form label-width="80px">
          <el-form-item label="备注内容">
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
      tableData: [1, 2, 3, 4, 6, 7, 8, 9, 10],
      activeName: 0,
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
  .el-tabs__item.is-top.is-active{
    color:#ff4141;
  }
  .el-tabs__item.is-top:hover{
    color:#ff4141;
  }
  .el-tabs__active-bar.is-top{
    background: #ff4141;
  }
</style>
