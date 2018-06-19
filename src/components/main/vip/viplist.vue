<template>
  <div class="wrap-con">
    <div class="wct">
      <p>会员管理 / 会员列表<span v-show="count===2"> / 会员充值</span><span v-show="count===3"> / 会员详情</span></p>
      <div class="wct-r">
        <div class="wrapCom">
          <el-input placeholder="请输入内容" class="input-with-select" size="small">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="wrapBtns">
          <el-button v-show="count===1" class="add" size="small" @click="add()">新增</el-button>
          <el-button v-show="count===2 || count===3" size="small" @click="add1()">返回</el-button>
        </div>
      </div>
    </div>
    <div class="wcc">
      <div v-show="count===1">
        <div class="businessall" style="display: flex;margin-bottom:10px;" :style="{background: tableHeaderBg}">
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
          <div>
            <div>普通会员</div>
            <div>123</div>
            <div>123</div>
          </div>
        </div>
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background: tableHeaderBg}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="date" label="会员姓名" width="100">
            </el-table-column>
            <el-table-column prop="name" label="手机号"></el-table-column>
            <el-table-column prop="address" label="余额" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="等级" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="折扣" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="积分" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="消费次数" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="会员生日" show-overflow-tooltip></el-table-column>
            <el-table-column label="更多" width="80">
              <template  slot-scope="scope">
                <el-dropdown trigger="click" @command="more">
                <span class="el-dropdown-link">
                  <el-button size="mini">更多</el-button>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{type: 1}">充值</el-dropdown-item>
                    <el-dropdown-item>修改</el-dropdown-item>
                    <el-dropdown-item>删除</el-dropdown-item>
                    <el-dropdown-item :command="{type: 4}">详情</el-dropdown-item>
                    <el-dropdown-item>积分调整</el-dropdown-item>
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
      </div>
      <div class="vipInfo" v-show="count===2">
        <div class="vip1">
          <h3>会员信息</h3>
          <div class="baseInfo" style="margin-left:30px;">
            <div style="flex: 1;line-height: 40px;">
              <div>会员姓名&nbsp;&nbsp;: 张三</div>
              <div>手机号码&nbsp;&nbsp;: 18251164546</div>
            </div>
            <div style="flex: 1;line-height: 40px;">
              <div>当前余额&nbsp;&nbsp;: 200</div>
              <div>当前积分&nbsp;&nbsp;: 0</div>
            </div>
          </div>
        </div>
        <div class="vip2">
          <h3>会员充值</h3>
          <el-form labelWidth="80px">
            <el-form-item label="充值金额 :">
              <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item label="支付方式 :">
              <el-select size="small"></el-select>
            </el-form-item>
            <el-form-item label="充值优惠 :">
              <el-input size="small"></el-input>
            </el-form-item>
            <el-form-item label="充值金额 :">
              <el-input type="textarea" size="small" style="width:200px;"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="vipdetail" v-show="count===3">
        <h3>会员信息</h3>
        <div class="businessall vipall" :style="{background: tableHeaderBg}">
          <div>
            <div>会员姓名</div>
            <div>刘航</div>
          </div>
          <div>
            <div>等级</div>
            <div>普通会员</div>
          </div>
          <div>
            <div>手机号码</div>
            <div>18251164546</div>
          </div>
          <div>
            <div>折扣</div>
            <div>8折</div>
          </div>
          <div>
            <div>积分</div>
            <div>100</div>
          </div>
          <div>
            <div>生日</div>
            <div>10.01</div>
          </div>
          <div>
            <div>余额</div>
            <div>200</div>
          </div>
          <div>
            <div>消费次数</div>
            <div>3</div>
          </div>
          <div>
            <div>充值信息</div>
            <div>
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  详情
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>2018-01-01 12:00:00  200元</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="消费信息" name="0"></el-tab-pane>
            <el-tab-pane label="充值信息" name="1"></el-tab-pane>
          </el-tabs>
        </template>
        <template v-if="activeName==='1'">
          <el-table
            ref="multipleTable"
            :data="tableData1"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background: tableHeaderBg}">
            <el-table-column prop="date" label="充值时间">
            </el-table-column>
            <el-table-column prop="address" label="金额（元）" show-overflow-tooltip></el-table-column>
          </el-table>
        </template>
        <template v-if="activeName==='0'">
          <el-table
            ref="multipleTable1"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background: tableHeaderBg}">
            <el-table-column prop="date" label="消费时间">
            </el-table-column>
            <el-table-column prop="name" label="订单号"></el-table-column>
            <el-table-column prop="address" label="金额（元）" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="折扣优惠" show-overflow-tooltip></el-table-column>
            <el-table-column prop="num" label="实收金额（元）" show-overflow-tooltip></el-table-column>
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
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000">
          </el-pagination>
        </template>

      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      tableData: [1, 2, 3, 4, 6, 7, 8, 9],
      count: 1,
      activeName: 0,
      tableData1: []
    }
  },
  computed: {
    ...mapState([
      'tableHeaderBg',
      'baseBg'
    ])
  },
  methods: {
    add () {
    },
    add1 () {
      this.count = 1
    },
    back () {
      this.count = 1
    },
    more (command) {
      console.log(command)
      if (command.type === 4) {
        this.count = 3
      } else if (command.type === 1) {
        this.count = 2
      }
    }
  }
}
</script>
<style lang="scss">
  .wcc{
    overflow: hidden;
    overflow-y: auto;
  }
  .businessall{
    display: flex;
    margin-bottom:10px;
    width:100%;
  }
  .businessall > div{
    flex:1;
    position: relative;
    text-align: center;
    div{
      line-height:40px;
    }
  }
  .businessall > div::after{
    display: block;
    content: '';
    position: absolute;
    right:0;
    top:15px;
    width:0;
    height:90px;
    border-left:1px solid #ddd;
  }
  .businessall.vipall > ::after{
    display: none;
  }
  .businessall > div:last-child::after{
    display: none;
  }
  .vipInfo{
    width:100%;
    .vip1{
      margin:0 auto;
      width:90%;
      border-bottom:1px solid #ddd;
    }
    .vip2{
      margin:0 auto;
      width:90%;
    }
    .baseInfo{
      display: flex;
    }
    .el-input{
      width:200px;
    }
  }
  h3{
    line-height:60px;
  }
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
