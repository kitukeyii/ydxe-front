<template>
  <div class="wrap-con">
    <div class="wct">
      <p>智能设置 / 权限设置</p>
      <div class="wct-r">
        <div class="wrapBtns">
          <el-button class="add" size="small">保存</el-button>
        </div>
      </div>
    </div>
    <div class="wcc">
      <div style="margin-left:80px;">
        <el-form label-position="left" label-width="80px">
          <h3>岗位选择</h3>
          <div style="margin-left: 30px;">
            <el-form-item label="岗位名称 :">
              <el-select size="small">
                <el-option>1</el-option>
                <el-option>2</el-option>
                <el-option>3</el-option>
              </el-select>
            </el-form-item>
          </div>
          <h3>权限分配</h3>
          <div style="margin-left: 30px;">
            <el-form-item label="收银台">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="预定" name="type"></el-checkbox>
                <el-checkbox label="结账" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="后台">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="报表" name="type"></el-checkbox>
                <el-checkbox label="库存" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      form: {
        type: []
      },
      val: '本餐厅今日消费全部5折'
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
<style lang="scss">
  .wcc{
    overflow: hidden;
    overflow-y: auto;
    .el-input{
      width:200px;
      .el-input__inner[type='text']:focus{
        border-color:#ff4141 !important;
      }
    }
    .el-textarea{
      width:200px;
      .el-textarea__inner:focus{
        border-color:#ff4141 !important;
      }
    }
    h3{
      line-height:80px;
    }
  }
</style>
