/**
 *  sockets
 */
import { getToken } from '@/utils/auth'
import { setAlreadyRead, getSocketnotices } from '@/api/notice'

import store from '../store'

const notificationInstance = Notification || window.Notification

// 创建通知
function creatNotification(title, body) {
  const notification = new Notification(title, {
    body,
    tag: '2ue',
    icon: 'https://2ue.github.io/images/common/avatar.png'
  })

  notification.onshow = function() {
  }
  notification.onclick = function(e) {
    // 可以直接通过实例的方式获取data内自定义的数据
    // 也可以通过访问回调参数e来获取data的数据
    window.focus()
    notification.close()
  }
  notification.onclose = function() {
  }
  notification.onerror = function(err) {
    console.error(err)
  }
}

// 请求通知权限
function setPermission(title, body) {
  notificationInstance.requestPermission(PERMISSION => {
    if (PERMISSION === 'granted') {
      creatNotification(title, body)
    } else {
      console.error('用户拒绝了')
    }
  })
}

function notification(title, body) {
  if (notificationInstance) {
    const permissionNow = notificationInstance.permission
    if (permissionNow === 'granted') {
      creatNotification(title, body)
    } else if (permissionNow === 'denied') {
      console.error('用户拒绝了')
    } else {
      setPermission(title, body)
    }
  }
}

// 消息通知
function speckText(str) {
  const url = 'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=' + encodeURI(str)
  const n = new Audio(url)
  n.src = url
  n.play()
}

// 点击右上角的通知栏 出现订单详情页
async function handleClick(item) {
  if (item.type === 'hotelOrder') {
    // 获取单条房间订单
    await store.dispatch('hotel/hotelManage/roomOrders/getOneHotelOrderDetail', item.ext.orderId)
    store.commit('noticeStore/CHANGE_STATUS', ['roomDetailsShow', true])
  } else if (item.type === 'serviceOrder') {
    // 获取单条服务订单
    await store.dispatch('hotel/service/serviceOrders/getOneServiceOrderDetail', item.ext.orderId)
    store.commit('noticeStore/CHANGE_STATUS', ['serviceDetailsShow', true])
  } else {
    // 获取单条商城订单
    await store.dispatch('corp/emalls/eMallOrders/getOneMallOrderDetail', item.ext.orderId)
    store.commit('noticeStore/CHANGE_STATUS', ['mallDetailsShow', true])
  }

  if (item.status !== 1) {
    await setAlreadyRead(item._id, { status: 1 })
    let params = {}
    if (this.activeName === 'first') {
      params = {}
    } else {
      params = { status: 0 }
    }
    // await noticeStore.actions.getSocketNotices(params)
    await store.dispatch('noticeStore/getSocketNotices', params)
  }
}

const sockets = {
  async connect() {
    const token = await getToken()
    this.$socket.emit('auth', token)
  },
  notification(data) {
    const documentFocus = document.hidden
    const ignoreMsg = ['socket 连接成功', '新人加入房间', '有一条新通知']
    if (ignoreMsg.indexOf(data) === -1) {
      const h = this.$createElement
      this.$notify({
        title: data.title,
        message: h('span', { style: 'color: #262626;cursor: pointer' }, data.content),
        duration: 0,
        async onClick() {
          const { data: { list }} = await getSocketnotices({ socketTempId: data.socketTempId })
          console.log(list, 111)
          await handleClick(list[0])
          this.close()
        }
      })
      if (documentFocus) {
        notification(data.title, data.content)
      }
      speckText(data.title)
      // speckText('支付宝到帐五千万元')
    }
  }
}
export { sockets }
