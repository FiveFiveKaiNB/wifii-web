<template>
  <div ref="slider" class="slider">
    <div class="slider-runway">
      <div v-for="item in barList" :key="item.background" class="slider-bar" :style="item" />
    </div>
    <div
      v-for="(item,index) in list"
      :key="index"
      :class="'slider-button-wrapper'+`${item.dragging?' drag':''}`"
      draggable="true"
      :style="{'left': item.value * 100 / (max-min) + '%'}"
      @dragstart="dragstart($event, index)"
      @dragend="dragend($event, index)"
      @drag="drag($event, index)"
    >
      <div class="slider-button" :style="{'border-color': item.borderColor}" />
      <div class="slider-label">{{ item.value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [10, 20, 30]
    },
    min: {
      type: Number,
      default: () => 0
    },
    max: {
      type: Number,
      default: () => 1000
    },
    step: {
      type: Number,
      default: () => 1
    }
  },
  data() {
    return {
      list: null,
      barList: null,
      bgs: ['#9AADFF', '#7EC2FF', '#FFCB73', '#FF9284']
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 组件初始化
    init() {
      // 初始化点的数据
      const arr = []
      for (let i = 0; i < this.value.length; i++) {
        const obj = { startX: 0, value: this.value[i], newPosition: null, dragging: false, borderColor: this.bgs[i] }
        arr.push(obj)
      }
      this.list = arr
      // 定义bar的样式
      this.setBarList()
    },
    // 计算当前点的位置
    currentPosition(index) {
      return `${(this.list[index].value - this.min) / (this.max - this.min) * 100}%`
    },
    // 监听拖拽开始的方法
    dragstart(event, index) {
      const obj = this.list[index]
      obj.dragging = true
      console.log('dragstart', event)
      obj.startX = event.clientX
      obj.startPosition = parseFloat(this.currentPosition(index))
      console.log(obj.startPosition)
    },
    // 监听拖拽结束的方法
    dragend(event, index) {
      const obj = this.list[index]
      obj.dragging = false
      console.log('dragend', event)
      let diff = 0
      const currentX = event.clientX
      diff = (currentX - obj.startX) / this.$refs.slider.clientWidth * 100
      obj.newPosition = obj.startPosition + diff
      this.setPosition(obj.newPosition, index)
    },
    // 监听拖拽过程的方法
    drag(event, index) {
      const obj = this.list[index]
      let diff = 0
      const currentX = event.clientX
      diff = (currentX - obj.startX) / this.$refs.slider.clientWidth * 100
      obj.newPosition = obj.startPosition + diff
      this.setPosition(obj.newPosition, index)
    },
    // 点位置的变更
    setPosition(newPosition, index) {
      if (newPosition < 0) {
        newPosition = 0
      } else if (newPosition > 100) {
        newPosition = 100
      }
      const lengthPerStep = 100 / ((this.max - this.min) / this.step)
      const steps = Math.round(newPosition / lengthPerStep)
      const obj = this.list[index]
      let value = steps * lengthPerStep * (this.max - this.min) * 0.01 + this.min
      if (index - 1 >= 0) {
        if (value <= this.list[index - 1].value) {
          value = this.list[index - 1].value + 1
        }
      }
      if (index + 1 <= this.list.length - 1) {
        if (value >= this.list[index + 1].value) {
          value = this.list[index + 1].value - 1
        }
      }
      obj.value = parseInt(value)
      this.$emit('test', this.list.map(item => item.value))
      this.setBarList()
    },
    // 设置bar的样式
    setBarList() {
      const temp = [...this.list]
      // temp.sort((a, b) => {
      //   if (a.value < b.value) {
      //     return -1
      //   } else if (a.far === b.far) {
      //     return 0
      //   } else {
      //     return 1
      //   }
      // })
      const bgs = this.bgs
      let barStyle = { left: 0, width: `${(temp[0].value - this.min) / (this.max - this.min) * 100}%`, background: bgs[0] }
      const arr = [barStyle]
      for (let i = 0; i < temp.length; i++) {
        if (i === temp.length - 1) {
          barStyle = { left: `${(temp[i].value - this.min) / (this.max - this.min) * 100}%`, width: `${(this.max - temp[i].value) / (this.max - this.min) * 100}%`, background: bgs[i + 1] }
        } else {
          barStyle = { left: `${(temp[i].value - this.min) / (this.max - this.min) * 100}%`, width: `${(temp[i + 1].value - temp[i].value) / (this.max - this.min) * 100}%`, background: bgs[i + 1] }
        }
        arr.push(barStyle)
      }
      this.barList = arr
    }
  }
}
</script>

<style  lang="scss" scoped>
.slider{
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  position: relative;
  &-runway{
    width: 100%;
    height: 6px;
    background-color: #e4e7ed;
    border-radius: 3px;
    position: relative;
    vertical-align: middle;
  }
  &-bar{
    width: 20%;
    left: 0%;
    height: 6px;
    background-color: #409eff;
    border-radius: 3px;
    position: absolute;
  }
  &-button-wrapper{
    height: 36px;
    width: 36px;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    z-index: 1001;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover{
      .slider-button{
        transform: scale(1.5);
      }
    }
    &.drag{
      .slider-button{
        transform: scale(1.5);
      }
    }
  }
  &-button{
    width: 16px;
    height: 16px;
    border: 2px solid #409eff;
    background-color: #fff;
    border-radius: 50%;
    transition: .2s;
  }
  &-label{
    position: absolute;
    bottom: -20px;
  }
}
</style>
