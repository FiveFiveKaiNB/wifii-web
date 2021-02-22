<template>
  <div class="map">
    <div style="overflow: hidden;">
      <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true">
            <el-form-item>
              <el-select v-model="provinceFullname" placeholder="选择省份" style="width: 200px;" @change="provinceChange">
                <el-option
                  v-for="item in provinceList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.fullname"
                />
              </el-select>
              <el-select v-model="cityFullname" placeholder="选择城市" style="width: 200px;" @change="cityChange">
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.fullname"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="inputVal" style="width: 300px;" placeholder="搜索地点/街道" clearable />
              <el-button type="primary" style="width: 80px" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="tip">请在地图上点选准确位置</div>
        </el-col>
      </section>
    </div>
    <div class="mapWrap">
      <div id="qqmapCont" class="qqmap" />
      <div class="lngTips" />
    </div>
    <div class="handle-save">
      <el-button type="primary" class="save" @click="save">确定</el-button>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    addressObject: {
      type: Object,
      default: function() {
        return {
        }
      }
    }
  },
  data: function() {
    return {
      currentProcince: '',
      provinceFullname: '',
      cityFullname: '',
      provinceList: [],
      cityList: [],
      qqmap: [],
      premarker: '',
      marker: '',
      inputVal: '',
      region: '',
      address: '',
      loc: [],
      oldmarker: '',
      mapcenter: '',
      geolocation: null,
      markers: [],
      infoWin: ''
    }
  },
  computed: {
    // ...mapState('pages/hotel/hotel', ['addressObject'])
  },
  watch: {
    oldmarker(newVal, oldVal) {
      if (newVal) {
        this.qqmap && this.createMarker()
      }
    },
    premarker(newVal, oldVal) {
      console.log(newVal, 9999)
    }
  },
  async created() {
    this.inputVal = this.addressObject.address.replace(this.addressObject.province + this.addressObject.city, '')
    this.cityFullname = this.addressObject.city
    this.provinceFullname = this.addressObject.province
    await this.$jsonp('https://apis.map.qq.com/ws/district/v1/list', {
      key: process.env.VUE_APP_MAP_KEY,
      output: 'jsonp'
    }).then(json => {
      this.provinceList = json.result[0]
    })
    const provinceId = this.getProvinceId(this.provinceList, this.provinceFullname)
    this.getCityList(provinceId)
  },
  mounted() {
    const that = this
    if (typeof (qq) === 'object') {
      that.createMap()
      // this.getCurLocation()
    } else {
      this.loadQQmap()
    }
    window.onMapFileLoad = function() {
      that.createMap()
    }
  },
  methods: {
    getCurLocation() {
      const options = { timeout: 6000 }
      this.geolocation.getLocation(this.showPosition, this.showErr, options)
    },
    showPosition(e) {
    },
    showErr(e) {
    },
    async pointChange(ev, position) {
      await this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1', {
        get_poi: '1',
        location: `${ev.lat},${ev.lng}`,
        key: process.env.VUE_APP_MAP_KEY,
        output: 'jsonp'
      }).then(json => {
        const { result: { address_component, address }} = json
        this.inputVal = address_component.district + address_component.street_number
        this.cityFullname = address_component.city
        this.provinceFullname = address_component.province
        this.address = address
        const list = []
        list.push(Number(ev.lng))
        list.push(Number(ev.lat))
        this.loc = list
        const provinceId = this.getProvinceId(this.provinceList, this.provinceFullname)
        this.getCityList(provinceId)
      }).catch(err => {
        console.log(err)
      })
    },
    provinceChange(e) {
      // 如果更换省份 就初始化城市和搜索条件
      this.cityFullname = ''
      this.inputVal = ''
      // 获取当前选择的省份
      const provinceId = this.getProvinceId(this.provinceList, e)
      if (e) {
        this.getCityList(provinceId)
      }
    },

    async getCityList(provinceId) {
      await this.$jsonp(`https://apis.map.qq.com/ws/district/v1/getchildren?id=${provinceId}`, {
        key: process.env.VUE_APP_MAP_KEY,
        output: 'jsonp'
      }).then(json => {
        this.cityList = json.result[0]
      })
    },
    getProvinceId(list, name) {
      let provinceId = ''
      list.map(item => {
        if (item.fullname === name) {
          provinceId = item.id
        }
        return item
      })
      return provinceId
    },
    cityChange(e) {
      this.inputVal = ''
    },
    save() {
      this.$emit('formSubmit', this.loc, this.provinceFullname, this.cityFullname, this.address)
      this.$store.commit('hotel/hotelManage/roomType/CHANGE_STATUS', ['centerDialogVisible', false])
    },
    loadQQmap() {
      const mapScript = document.createElement('script')
      const script = document.createElement('script')
      // 设置标签的type属性
      script.type = 'text/javascript'
      mapScript.type = 'text/javascript'
      // 设置标签的链接地址
      script.src = `https://map.qq.com/api/js?v=2.exp&callback=onMapFileLoad&key=${process.env.VUE_APP_MAP_KEY}`
      mapScript.src = `https://apis.map.qq.com/tools/geolocation/min?key=${process.env.VUE_APP_MAP_KEY}&referer=myapp`
      // 添加标签到dom
      document.body.appendChild(script)
      document.body.appendChild(mapScript)
    },
    async search() {
      const that = this
      const map = that.qqmap
      const markers = []
      if (this.markers.length) {
        that.clearOverlays(this.markers)
      }
      const latlngBounds = new qq.maps.LatLngBounds()
      const searchService = new qq.maps.SearchService({
        complete: function(results) {
          // that.infoWin = new qq.maps.InfoWindow({ map })
          const pois = results.detail.pois
          for (let i = 0, l = pois.length; i < l; i++) {
            const poi = pois[i]
            latlngBounds.extend(poi.latLng)
            const marker = new qq.maps.Marker({
              map: map,
              position: poi.latLng
            })
            marker.setTitle(i + 1)
            markers.push(marker)
          }
          markers.map((item, index) => {
            qq.maps.event.addListener(item, 'click', function(event) {
              that.pointChange(event.latLng, pois[index])
              that.infoWin.open()
              that.infoWin.setContent('<div style="text-align:center;white-space:' +
                'nowrap;margin:10px;">当前所选的位置</div>')
              that.infoWin.setPosition(new qq.maps.LatLng(Number(event.latLng.lat), Number(event.latLng.lng)))
            })
          })
          map.fitBounds(latlngBounds)
          map.setZoom(12)
          that.markers = markers
        }
      })
      const keyWord = that.inputVal
      const region = that.cityFullname

      searchService.setLocation(region)
      searchService.search(keyWord)
      if (this.inputVal === '' || this.cityFullname === '') {
        this.$message.error('请完善搜索信息哦~')
        return
      }
      this.$message.success('滑动滚轮或者点击左上角的+号可以放大地图哦~')
    },
    clearOverlays(overlays) {
      let overlay
      while (overlay = overlays.pop()) {
        overlay.setMap(null)
      }
    },
    inputChange() {
      this.$emit('addr', this.inputVal) // 地图点击坐标 传递给父组件
    },
    createMap() {
      const that = this
      this.qqmap = new qq.maps.Map(document.getElementById('qqmapCont'), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(String(that.addressObject.loc[1]), String(that.addressObject.loc[0])),
        zoom: 20
      })

      // this.createMarker()
      // this.bindMapEvent()
      // that.geolocation = new qq.maps.Geolocation('34KBZ-NVWLF-Q4UJD-NGC4T-U532T-THBGD', 'myapp')

      setTimeout(() => {
        that.geolocation = new qq.maps.Geolocation('34KBZ-NVWLF-Q4UJD-NGC4T-U532T-THBGD', 'myapp')
        this.createMarker()
        this.bindMapEvent()
      }, 500)
    },
    // 创建标记点
    createMarker() {
      this.pointChange({ lat: String(this.addressObject.loc[1]), lng: String(this.addressObject.loc[0]) })
      const that = this
      if (that.premarker) {
        that.premarker.setMap(null)
      }
      if (!this.oldmarker) {
        const mapLatLng = new qq.maps.LatLng(String(that.addressObject.loc[1]), String(that.addressObject.loc[0]))
        that.qqmap.setCenter(mapLatLng)
        that.premarker = new qq.maps.Marker({
          position: mapLatLng,
          map: that.qqmap
        })
      } else {
        // 获取城市列表接口设置中心点
        const citylocation = new qq.maps.CityService({
          complete: function(result) {
            that.qqmap.setCenter(result.detail.latLng)
          }
        })
        // 调用searchLocalCity()方法
        citylocation.searchLocalCity()
      }
    },
    bindMapEvent() {
      const that = this
      that.infoWin = new qq.maps.InfoWindow({ map: that.qqmap })
      console.log(that.infoWin, 666)
      // 地图点击事件
      qq.maps.event.addListener(that.qqmap, 'click', function(event) {
        that.marker && that.marker.setMap(null)
        that.premarker && that.premarker.setMap(null)
        that.pointChange(event.latLng)
        that.marker = new qq.maps.Marker({
          position: event.latLng,
          map: that.qqmap
        })
        that.infoWin.open()
        that.infoWin.setContent('<div style="text-align:center;white-space:' +
          'nowrap;margin:10px;">当前所选的位置</div>')
        that.infoWin.setPosition(new qq.maps.LatLng(Number(event.latLng.lat), Number(event.latLng.lng)))
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .toolbar {
    .tip {
      margin-bottom: 18px;
      font-size:12px;
      font-weight:400;
      color:rgba(0,0,0,0.3);
    }
  }
  .map{
    .qqmap{
      width:100%;
      // height:500px;
      height: calc(75vh - 35px - 70px);
      .mapWrap{
        position:relative;
        width:100%;
        // height:500px;
        height: calc(80vh - 35px - 70px);
        overflow:hidden;
        margin-top:15px;
        }
        .lngTips{
          display:none;
          width:255px;
          height:40px;
          padding:5px 7px;
          overflow:hidden;
          position:absolute;
          left:0; top:0;
          z-index:123456;
          background:#ffffff;
          border-radius:5px;
          line-height:20px;
          box-shadow:#eeeeee 1px 1px 3px;
          border:#eeeeee 1px solid;
          font-size:12px;
        }
    }
    .handle-save {
      height: 40px;
    .save {
      width: 100px;
      margin-top: 20px;
      position: relative;
      float: right;
    // margin-left: 820px;
  }
    }
  }
</style>
