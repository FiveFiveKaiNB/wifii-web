/**
 * await函数包装
 * @param {*} promise
 */
export function awaitWrap(promise) {
  return promise.then(data => [null, data])
    .catch(err => [err, null])
}

/**
 * 生成唯一数
 * @param {*} len
 */
export function generateUid(len = 16) {
  if (len < 16) len = 16

  const inputLen = len
  let randNum = Math.random()
  while (len > 13) {
    randNum *= 10
    len -= 1
  }
  randNum = (Array(inputLen - 13).join(0) + randNum).slice(13 - inputLen)
  return new Date().valueOf() + randNum
}

/**
 * 获取文件后缀
 * @param {*} file
 */
export function pickImgSuffix(file) {
  // if (!file.hasOwnProperty('raw')) return ''

  let type = ''
  switch (file.type) {
    case 'image/png': type = 'png'; break
    case 'image/jpeg': type = 'jpg'; break
    default: break
  }
  return type
}

/**
 * 价格处理
 * @param {*} number
 */
export function multiplyOneHundred(price) {
  const newNum = Number(price)
  const TureNum = +(newNum * 100).toFixed(2)
  return TureNum
}

/**
 * 价格处理
 * @param {*} price
 */
export function divideOneHundred(price) {
  const newNum = Number(price)
  const TureNum = +(newNum / 100).toFixed(2)
  return TureNum
}
// 深拷贝
export function deepClone(obj) {
  var _obj = JSON.stringify(obj)
  var objClone = JSON.parse(_obj)
  return objClone
}

/**
 * 下载图片
 * @param {*} url
 */
export function downloadImg(url) {
  if (!url || typeof url !== 'string') {
    alert('传入的地址错误！')
    return
  }
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest()
    x.open('GET', url, true)
    x.responseType = 'blob'
    x.onload = (e) => {
      var _url = window.URL.createObjectURL(x.response)
      var a = document.createElement('a')
      a.href = _url
      a.download = ''
      a.click()
      resolve()
    }
    x.send()
  })
}
