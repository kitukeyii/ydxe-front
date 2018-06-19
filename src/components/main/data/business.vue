<template>
  <div class="wrap-con">
    <div class="wct">
      <p>数据分析 / 收银统计</p>
      <div class="wct-r">
        <div class="wrapCom">
          <el-date-picker
            v-model="value5"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            size="small"
            style="width:350px">
          </el-date-picker>
        </div>
        <div class="wrapBtns">
          <!--<el-button class="add" size="small" @click="flag = !flag">新增</el-button>-->
        </div>
      </div>
    </div>
    <div class="wcc">
      <h3>营业状况汇总</h3>
      <div class="businessall" style="display: flex;" :style="{background: tableHeaderBg}">
        <div>
          <div>现金付款</div>
          <div>123</div>
        </div>
        <div>
          <div>银行卡付</div>
          <div>123</div>
        </div>
        <div>
          <div>支付宝付款</div>
          <div>123</div>
        </div>
        <div>
          <div>微信付款</div>
          <div>123</div>
        </div>
        <div>
          <div>会员卡付款</div>
          <div>123</div>
        </div>
        <div>
          <div>挂账</div>
          <div>123</div>
        </div>
        <div>
          <div>优惠总金额</div>
          <div>123</div>
        </div>
        <div>
          <div>总计</div>
          <div>123</div>
        </div>
      </div>
      <h3>营业状况明细</h3>
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
          <el-table-column prop="name" label="订单号"></el-table-column>
          <el-table-column prop="address" label="桌号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="就餐人数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="结账方式" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="消费金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="优惠金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="订金" show-overflow-tooltip></el-table-column>
          <el-table-column prop="num" label="实收金额" show-overflow-tooltip></el-table-column>
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
      </template>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      tableData: [1, 2, 3, 4, 6, 7, 8, 9],
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
      value4: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)]
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
  h3{
    line-height:60px;
    text-indent:2em;
  }
  .businessall{
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
    top:10px;
    width:0;
    height:60px;
    border-left:1px solid #ddd;
  }
  .businessall > div:last-child::after{
    display: none;
  }
  .businessall > div:last-child{
    color:#ff4141;
  }

</style>
