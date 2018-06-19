/**
 * Created by DingLin on 2018/4/16.
 */
import Vue from 'vue'

function capitalizeFirtLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const requireComponent = require.context('.', false, /\.vue$/)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = capitalizeFirtLetter(fileName.replace(/^\.\//, ').replace(/\.\w+$/, ')
  // 因为得到的fileName格式是:'./baseButton.vue',所以这里我们去掉头和尾，只保留真正的文件名
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})
