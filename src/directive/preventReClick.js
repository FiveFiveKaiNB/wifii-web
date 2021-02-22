import Vue from 'vue'
import Element from 'element-ui'
// 按钮防重指令
Vue.directive('re-click', {
  bind: (el, binding) => {
    let throttleTime = binding.value // 防抖时间
    if (!throttleTime) { // 用户若不设置防抖时间，则默认1000ms
      throttleTime = 1000
    }
    let isFirst = false
    el.addEventListener('click', (event) => {
      if (!isFirst) { // 第一次执行
        isFirst = true
        setTimeout(() => {
          isFirst = false
        }, throttleTime)
      } else {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
          isFirst = false
        }, throttleTime)

        Element.Message.warning('请勿频繁操作！')
      }
    }, true)
  }
})
