/**
 * Created by Administrator on 2018/4/8.
 */
export default {
  sign_out (state) {
    'use strict'
    sessionStorage.removeItem('Token')
  },
  change_right (state, value) {
    state.right = value
  },
  changeLoading (state, value) {
    state.loading = value.status
    state.loadingVal = value.msg
  },
  changeactive (state, value) {
    state.tabList.forEach((val, index) => {
      let reg = new RegExp(val)
      if (reg.test(value)) {
        state.active = index
      }
    })
    state.lv = state.tabList.indexOf(value) === -1 ? 0 : 1
  },
  getListName (state, value) {
    let arr2 = []
    let arr = value.split('/')
    let arr1 = arr.slice(2, arr.length)
    arr1.forEach((val, index) => {
      switch (val) {
        case 'branch' : arr2.push('分公司')
          break
        case 'distributor' : arr2.push('代理商')
          break
        case 'staff' : arr2.push('员工')
          break
        case 'shop' : arr2.push('商户')
          break
      }
    })
    state.listName = arr2.join('/')
  },
  changeFlag (state, value) {
    state.flag = value
  },
  /* 重写的呼叫信息 */
  setCallInfo (state, value) {
    state.callInfos = value
  },
  /* 即使相应呼叫信息 */
  getCallInfo (state, value) {
    state.callInfo = value
    state.callInfoNum = state.callInfo.length
  },
  /* 初始化相应信息 */
  initialCallInfo (state, value) {
    state.callInfo = value
    if (value) {
      state.callInfoNum = value.length
    } else {
      state.callInfoNum = 0
    }
  },
  /* 设置右侧订单信息 */
  __setOrderInfo__ (state, orderInfo) {
    state.orderInfo = orderInfo
  },
  /* 初始化桌台列表 */
  initialTables (state, value) {
    console.log(value)
    state.tableData.items = value.data.data
    state.floorData.items = value.data.table_floor_name
    state.tableOfFree = value.data.table_status.kongxian
    state.tableOfUnpayed = value.data.table_status.weifuk
    state.tableOfPayed = value.data.table_status.yifuk
    state.tableOfActive = value.data.table_status.kaitai
  },
  /* 实时获取订单信息，并且渲染 */
  changeOrderInfoInTime (state, value) {
    console.log(value)
    console.log(state.orderInfo)
    state.orderInfo.orderList = value
    console.log(state.orderInfo.orderList)
  },
  /* 并台付款,已付款加对应参数，已付款减对应参数 */
  combineTableStatus (state, value) {
    state.tableOfPayed += value
    state.tableOfUnpayed -= value
  },
  /* 添加呼叫来的消息 */
  addCallInfo (state, value) {
    let k = 0
    if (state.callInfo.length > 0) {
      state.callInfo.forEach((v, i) => {
        console.log(v, '9999')
        if (v.call_id === value.call_id) {
          k = 1
        }
      })
    }
    if (k) {
      return 0
    }
    try {
      state.callInfo.push(value)
    } catch (e) {
      state.callInfo = []
      state.callInfo.push(value)
    }
    let voice = JSON.parse(value.table_voice)
    switch (value.call_msg) {
      case '服务员': {
        value.videoSource = voice[1]
        break
      }
      case '茶水': {
        value.videoSource = voice[2]
        break
      }
      case '纸巾': {
        value.videoSource = voice[3]
        break
      }
    }
    let calls = []
    if (localStorage.getItem('callInfoList')) {
      calls = JSON.parse(localStorage.getItem('callInfoList'))
    }
    calls.push(value)
    localStorage.setItem('callInfoList', JSON.stringify(calls))
    console.log(JSON.parse(localStorage.getItem('callInfoList')))
    state.callInfoNum = state.callInfo.length
  },
  /* 添加预点订单 */
  addPrePointPro (state, value) {
    state.prePointPro = value
  }
  /* 打印一个订单的所有消息 */
}
