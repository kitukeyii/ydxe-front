<template>
  <div class="wrap-con">
    <div class="wct">
      <p>智能设置 / 商家信息</p>
      <div class="wct-r">
        <div class="wrapCom">
        </div>
        <div class="wrapBtns">
          <el-button class="add" size="small">保存</el-button>
        </div>
      </div>
    </div>
    <div class="wcc">
      <div style="margin-left:80px;">
        <el-form label-position="left" label-width="80px">
          <h3>基本信息</h3>
          <div style="margin-left: 30px;">
            <el-form-item label="餐厅名称 :">
              <span v-if="edit0">123</span>
              <el-input size="small" v-else :disabled="edit0" value="123"></el-input>
              <i class="el-icon-edit" @click="edit0 = !edit0"></i>
            </el-form-item>
            <el-form-item label="法人姓名 :">
              <span v-if="edit1">1233</span>
              <el-input size="small" v-else :disabled="edit1" value="1233"></el-input>
              <i class="el-icon-edit" @click="edit1 = !edit1"></i>
            </el-form-item>
            <el-form-item label="手机号码 :">
              <span v-if="edit2">1233</span>
              <el-input size="small" v-else :disabled="edit2" value="1233"></el-input>
              <i class="el-icon-edit" @click="edit2 = !edit2"></i>
            </el-form-item>
            <el-form-item label="餐厅电话 :">
              <span v-if="edit3">1233</span>
              <el-input size="small" v-else :disabled="edit3" value="1233"></el-input>
              <i class="el-icon-edit" @click="edit3 = !edit3"></i>
            </el-form-item>
            <el-form-item label="餐厅名称 :">
              <span v-if="edit4">1233</span>
              <el-input size="small" v-else :disabled="edit4" value="1233"></el-input>
              <i class="el-icon-edit" @click="edit4 = !edit4"></i>
            </el-form-item>
          </div>
          <h3>餐厅信息</h3>
          <div style="margin-left: 30px;">
            <el-form-item label="餐厅公告 :">
              <span v-if="edit5">{{val}}</span>
              <el-input type="textarea" size="small" v-else :disabled="edit5" v-model="val"></el-input>
              <i class="el-icon-edit" @click="edit5 = !edit5"></i>
            </el-form-item>
            <el-form-item label="餐厅logo :">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false">
                <img :src="imageUrl" class="avatar"  width="60" height="60">
              </el-upload>
            </el-form-item>
            <el-form-item label="门面照 :">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false">
                <img  :src="imageUrl" class="avatar" width="250" height="150">
              </el-upload>
            </el-form-item>
            <el-form-item label="餐厅图片 :">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false">
                <img :src="imageUrl" class="avatar" width="200" height="250">
              </el-upload>
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
      flag: false,
      edit0: true,
      edit1: true,
      edit2: true,
      edit3: true,
      edit4: true,
      edit5: true,
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
