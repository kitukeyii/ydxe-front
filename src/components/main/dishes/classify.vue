<template>
  <div class="wrap-con">
    <div class="wct">
      <p>商品管理 / 分类管理 1233</p>
      <div class="wct-r">
        <div class="wrapBtns">
          <el-button class="add" size="small" @click="addClass()">新增</el-button>
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
          :header-cell-style="{ background: tableHeaderBg}">
          <el-table-column prop="class_sort" label="分类排行"></el-table-column>
          <el-table-column prop="class_name" label="分类名称"></el-table-column>
          <el-table-column label="更多" width="80">
            <template  slot-scope="scope">
              <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 2, data: scope.row}">修改</el-dropdown-item>
                  <el-dropdown-item :command="{type: 3}">删除</el-dropdown-item>
                  <el-dropdown-item :command="{type: 4}">重新排序</el-dropdown-item>
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
        <div v-show="data.data.info.type === 3" style="width:100%;text-align: center;margin-bottom:20px;">确定删除当前分类吗？</div>
        <el-form label-width="80px">
          <el-form-item label="新序号" v-show="data.data.info.type === 4">
            <el-input size="small" v-model="data.data.info.class_name"></el-input>
          </el-form-item>
          <el-form-item label="分类名称" v-show="data.data.info.type === 1">
            <el-input size="small" v-model="data.data.info.class_name"></el-input>
          </el-form-item>
          <el-form-item label="分类名称" v-show="data.data.info.type === 2">
            <el-input size="small" v-model="data.data.info.class_name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="dialogVisible = false">取消</el-button>
            <el-button size="small"  class="submit" type="danger" :style="{background: baseBg}" @click="submit()">提交</el-button>
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
      dialogVisible: false,
      title: '',
      data: {
        data: {
          shop_code: '1523438014007',
          info: {
            class_name: '',
            class_sort: '',
            type: 0,
            sort: '',
            class_id: ''
          }
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._getInit_()
    })
  },
  methods: {
    more (command) {
      if (command.data) {
        this.data.data.info.class_name = command.data.class_name
        this.data.data.info.class_id = command.data.class_id
      }
      this.data.data.info.type = command.type
      this.dialogVisible = true
      this.changeTitle()
    },
    changeTitle () {
      switch (this.data.data.info.type) {
        case 2 : this.title = '修改分类'
          break
        case 3 : this.title = '删除分类'
          break
        case 4 : this.title = '重新排序'
          break
      }
    },
    addClass () {
      this.dialogVisible = true
      this.data.data.info.type = 1
      this.title = '添加分类'
      this.data.data.info.class_name = ''
    },
    submit () {
      if (this.data.data.info.type === 1) {
        this.addclass()
      }
    },
    addclass () {
      if (this.data.data.info.class_name) {
        this.$http.post(this.publicapi + '/byadmin/class/addclass', qs.stringify(this.data))
          .then(res => {
            if (res.data.status) {
              this.dialogVisible = false
              this._getInit_()
              this.data.data.info.class_name = ''
            }
            this.$message(res.data.msg)
            console.log(res.data)
          })
      }
    },
    _getInit_ () {
      this.$http.post(this.publicapi + '/byadmin/class/classlist', qs.stringify(this.data))
        .then(res => {
          if (res.data.status) {
            this.tableData = res.data.data
          }
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

</style>
