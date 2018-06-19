<template>
  <div class="wrap-con">
    <div class="wct">
      <p>商品管理  / {{flag ? '酒水列表':'添加酒水'}}</p>
      <div class="wct-r">
        <div class="wrapCom">
          <el-input v-show="flag" placeholder="请输入内容" class="input-with-select" size="small">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="wrapBtns">
          <el-button class="add" size="small" @click="flag = !flag">新增</el-button>
        </div>
      </div>
    </div>
    <div class="wcc">
      <el-container v-if="flag" class="dishlist">
        <el-main style="padding:0 0 0 10px">
          <template>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              :style="{background: tableHeaderBg}">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="date" label="商品图片" width="80">
                <template  slot-scope="scope">
                  <img src="../../../assets/erweima.png" alt="" width="60" height="60">
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
              <el-table-column prop="address" label="商品编号" show-overflow-tooltip></el-table-column>
              <el-table-column prop="num" label="所属分类" show-overflow-tooltip></el-table-column>
              <el-table-column prop="price" label="价格" show-overflow-tooltip></el-table-column>
              <el-table-column prop="viprice" label="会员价" show-overflow-tooltip></el-table-column>
              <el-table-column prop="unit" label="单位" show-overflow-tooltip></el-table-column>
              <el-table-column prop="rest" label="库存" show-overflow-tooltip></el-table-column>
              <el-table-column label="更多" width="80">
                <template  slot-scope="scope">
                  <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>修改密码</el-dropdown-item>
                      <el-dropdown-item>调整排序</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
          </el-pagination>
        </el-main>
      </el-container>
      <el-container v-else class="adddish">
        <div class="goBack" @click="flag = !flag">
          <i class="el-icon-back" style="font-size: 30px;"></i>
        </div>
        <el-form style="margin:0 auto;" label-position="left" label-width="80px">
          <el-form-item label="商品名称">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <div style="display: flex;">
            <el-form-item label="商品价格">
              <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item label="会员价格">
              <el-input size="small"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;">
            <el-form-item label="商品单位">
              <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item label="商品排序">
              <el-input size="small"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="商品起售">
            <el-input size="small"></el-input>
          </el-form-item>
          <el-form-item label="是否特价">
            <el-checkbox-group v-model="desc">
              <el-checkbox label="是"  name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div style="display: flex;" v-show="desc">
            <el-form-item label="特价价格">
              <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item label="限购个数">
              <el-input size="small"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="商品详情">
            <el-input type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" class="submit">提交</el-button>
            <el-button size="small">取消</el-button>
          </el-form-item>
        </el-form>
      </el-container>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      tableData: [1, 2, 3, 4, 5, 6],
      desc: '',
      bg: '#ff4141',
      flag: true
    }
  },
  computed: {
    ...mapState([
      'tableHeaderBg'
    ])
  }
}
</script>
<style lang="scss">
  .wcc{
    overflow: hidden;
    overflow-y: auto;
    .dishlist{
      height:100%;
      .el-menu{
        height:100%;
        border: none;
        background: #fafafa;
        .el-menu-item-group__title{
          padding:0 !important;
        }
        li{
          height: 40px;
          line-height:40px;
        }
        .is-active{
          color:#fff !important;
          background: #ff4141;
        }
      }
    }
    .adddish{
      background: #fff;
      .el-input{
        .el-input__inner[type='text']:focus{
          border-color:#ff4141 !important;
        }
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #ff4141;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
      }
      .avatar {
        width: 150px;
        height: 150px;
        display: block;
      }
      .el-checkbox__input.is-checked{
        .el-checkbox__inner{
          background: #ff4141;
        }
      }
      .submit{
        border:1px solid #ff4141;
        color:#fff;
        background: #ff4141;
      }
    }
  }
</style>
