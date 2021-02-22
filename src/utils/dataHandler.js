const str2price = function(str) {
  return parseInt(parseFloat(str || 0) * 100)
}
const price2str = function(price) {
  return (price / 100 || 0).toFixed(2)
}
const str2int = function(str) {
  return parseInt(str || 0)
}
const int2str = function(int) {
  return (int || 0).toString()
}

// 上传数据处理，目前仅支持线上商城和餐厅商品
export function handleSubmitProduct(product) {
  // 单品价格
  if (product.price) {
    product.price.linePrice = str2price(product.price.linePrice)
    product.price.price = str2price(product.price.price)
    product.price.stock = str2int(product.price.stock)
    product.price.sales = str2int(product.price.sales)
    product.price.baseSales = str2int(product.price.baseSales)
  }

  // 规格价格
  if (product.specs && Array.isArray(product.specs)) {
    product.specs.map(item => {
      item.linePrice = str2price(item.linePrice)
      item.price = str2price(item.price)
      item.stock = str2int(item.stock)
      item.sales = str2int(item.sales)
      item.baseSales = str2int(item.baseSales)
      return item
    })
  }
  // 属性加价
  if (product.attributes && Array.isArray(product.attributes)) {
    product.attributes.map(item => {
      item.options = item.options.map(e => {
        e.price = str2price(e.price)
        return e
      })
      return item
    })
  }
  return product
}

export function handleDownloadProduct(product) {
  // 单品价格
  if (product.price) {
    product.price.linePrice = price2str(product.price.linePrice)
    product.price.price = price2str(product.price.price)
    product.price.stock = int2str(product.price.stock)
    product.price.sales = int2str(product.price.sales)
  }

  // 规格价格
  if (product.specs && Array.isArray(product.specs)) {
    product.specs.map(item => {
      item.linePrice = price2str(item.linePrice)
      item.price = price2str(item.price)
      item.stock = int2str(item.stock)
      item.sales = int2str(item.sales)
      return item
    })
  }
  // 属性加价
  if (product.attributes && Array.isArray(product.attributes)) {
    product.attributes.map(item => {
      item.options = item.options.map(e => {
        e.price = price2str(e.price)
        return e
      })
      return item
    })
  }
  return product
}
