<template>
    <div class="login" onselectstart="return false">
      <div class="login-box">
        <div class="login-top">
          <img class="login-logo" src="http://oss.yundianxiaoer.com/card/up1523584314314.png!style"  alt="logo" width="152" height="152"/>
          <p class="login-title">云店小二智慧餐饮</p>
        </div>
        <div class="login-inp">
          <div class="login-type">
            <div :class="{on:loginType===1}" @click="changeType(1)">账号密码登录<span></span></div>
            <div :class="{on:loginType===2}" @click="changeType(2)">手机短信<span></span></div>
          </div>
          <div class="login-input" v-if="loginType===1">
            <div class="login-user">
              <input type="text" placeholder="请输入账号" v-model="data.account"  @keyup.enter="login()">
            </div>
            <div class="login-pwd">
              <input type="password" placeholder="请输入密码" v-model="data.psw" @keyup.enter="login()">
            </div>
          </div>
          <div class="login-input" v-else>
            <div class="login-user-msg login-msg">
              <div>手机号&nbsp;:&nbsp;</div><input type="text" v-model="msg.phoneNum">
            </div>
            <div class="login-pwd-msg login-msg">
              <div>验证码&nbsp;:&nbsp;</div><input type="text" v-model="msg.verCode" @keyup.enter="login()"><div class="sendMsg" @click="sendMsg()">{{sendmsg}}</div>
            </div>
          </div>
          <div id="login" @click="login()">登录</div>
        </div>
      </div>
    </div>
</template>
<script>
import qs from 'qs'
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      loginType: 1,
      sendmsg: '发送验证码',
      num: 60,
      ok: true,
      data: {
        account: 'dinglin',
        psw: 'dinglin'
      },
      msg: {
        phoneNum: '',
        verCode: ''
      }
    }
  },
  computed: {
    ...mapState([
      'online',
      'publicapi'
    ])
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  methods: {
    ...mapMutations([
      'keeplogin'
    ]),
    changeType (i) {
      this.loginType = i
    },
    sendMsg () {
      let This = this
      if (This.msg.phoneNum && This.ok) {
        This.$http.post(this.publicapi + '/byadmin/login/getMessageForLogin', qs.stringify(This.msg)).then(res => {
          this.$message(res.data.msg)
        })
        if (This.ok) {
          This.ok = false
          let timer = setInterval(function () {
            This.num--
            This.sendmsg = This.num + '秒后重发'
            if (This.num === 0) {
              clearInterval(timer)
              This.sendmsg = '发送验证码'
              This.num = 60
              This.ok = true
            }
          }, 1000)
        }
      } else {
        this.$message('请输入正确的手机号码')
      }
    },
    login () {
      if (this.loginType === 1) {
        if (this.data.account && this.data.psw) {
          this._sendPost_(this.data)
        } else {
          this.$message('账号或密码不能为空')
        }
      } else {
        if (this.msg.phoneNum && this.msg.verCode) {
          this._sendPost_(this.msg)
        }
      }
    },
    _setInfo_ (res) {
      let url = ''
      sessionStorage.setItem('Token', JSON.stringify(res.data.data.token))
      sessionStorage.setItem('account', JSON.stringify(res.data.data))
      sessionStorage.setItem('right', JSON.stringify(res.data.data.allRight))
      sessionStorage.setItem('type_name', res.data.data.type_name)
      sessionStorage.setItem('right_id', 46)
      sessionStorage.setItem('wxpay', JSON.parse(res.data.data.shop_msg_pay).wxpay)
      sessionStorage.setItem('alipay', JSON.parse(res.data.data.shop_msg_pay).alipay)
      console.log(sessionStorage.getItem('alipay'))
      console.log(res.data.data)
      if (res.data.data.allRight.manage.right) {
        url = '/index'
      } else if (!res.data.data.allRight.manage.right && res.data.data.allRight.cash.right) {
        url = '/cashier'
      }
      return url
    },
    _sendPost_ (data) {
      console.log(this.data)
      this.axios.post(this.publicapi + '/byadmin/login/login', qs.stringify(data)).then(res => {
        if (res.data.status) {
          this.$router.push(this._setInfo_(res))
        }
        console.log(res.data)
        this.$message(res.data.msg)
      })
    }
  }
}
</script>
<style>
  @import '../../static/css/login.css';
</style>
