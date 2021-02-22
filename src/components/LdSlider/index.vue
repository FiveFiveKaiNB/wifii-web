<template>
  <div ref="slider" class="slider">
    <div class="slider-runway">
      <div v-for="item in barList" :key="item.background" class="slider-bar" :style="item">
        <div class="bar-label">{{ item.barlabel }}</div>
      </div>
    </div>
    <!-- <div
      v-for="(item,index) in list"
      :key="index"
      :class="['slider-button-wrapper'+`${item.dragging?' drag':''}`, { hover: true }]"
      :draggable="true"
      :style="{'left': item.value * 100 / (max-min) + '%'}"
      @dragstart="dragstart($event, index)"
      @dragend="dragend($event, index)"
      @drag="drag($event, index)"
    > -->
    <div
      v-for="(item,index) in list"
      :key="index"
      :class="['slider-button-wrapper'+`${item.dragging?' drag':''}`, { 'hover-btn': isClick }]"
      :style="{ userSelect: 'none','left': item.value * 100 / (max-min) + '%', transform: membership.upgradeMethod === 'times' ? 'translateX(-100%)' : 'translateX(-50%)'}"
      @mousedown="onMousedown($event, index)"
    >
      <el-tooltip
        ref="tooltip"
        :content="'升级至' + barList[index + 1].barlabel +
          '需要' + formatValue(item.value) +
          (membership.upgradeMethod === 'times'
            ? '间夜'
            : '成长值')"
        placement="top"
      >
        <div class="slider-button" :style="{'border-color': item.borderColor}" />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    membership: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Array,
      default: () => [100, 300, 500]
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
    },
    barLabel: {
      type: Array,
      default: () => ['label1', 'label2', 'label3']
    }
  },
  data() {
    return {
      isClick: false,
      list: null,
      barList: null,
      index: 0,
      bgs: ['#9AADFF', '#7EC2FF', '#FFCB73', '#FF9284']
    }
  },
  created() {
    setTimeout(() => {
      this.init()
    }, 500)
  },
  methods: {
    formatValue(value) {
      if (this.membership.upgradeMethod === 'times') {
        if (value > 30 && value <= 37) {
          return (value - 30) * 10 + 30
        } else if (value > 37) {
          return (value - 37) * 100 + 100
        } else {
          return value
        }
      } else {
        if (value > 100 && value <= 190) {
          return (value - 100) * 10 + 100
        } else if (value > 190 && value <= 280) {
          return (value - 190) * 100 + 1000
        } else if (value > 280) {
          return (value - 280) * 1000 + 10000
        } else {
          return value
        }
      }
    },
    displayTooltip(index) {
      this.$refs.tooltip[index] && (this.$refs.tooltip[index].showPopper = true)
    },
    hideTooltip(index) {
      this.$refs.tooltip && (this.$refs.tooltip[index].showPopper = false)
    },
    onMousedown(e, index) {
      this.index = index
      this.dragstart(e, index)
      document.addEventListener('mousemove', this.drag)
      document.addEventListener('mouseup', this.dragend)
    },
    // 组件初始化
    init() {
      console.log('init...')
      // 初始化点的数据
      const arr = []
      for (let i = 0; i < this.value.length; i++) {
        const obj = { startX: 0, value: this.value[i], newPosition: null, dragging: false, borderColor: this.bgs[i + 1] }
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
    dragstart(event) {
      this.isClick = true
      const obj = this.list[this.index]
      obj.dragging = true
      obj.startX = event.clientX
      obj.startPosition = parseFloat(this.currentPosition(this.index))
    },
    // 监听拖拽结束的方法
    dragend(event) {
      this.isClick = false
      const obj = this.list[this.index]
      this.hideTooltip(this.index)
      obj.dragging = false
      let diff = 0
      const currentX = event.clientX
      diff = (currentX - obj.startX) / this.$refs.slider.clientWidth * 100
      obj.newPosition = obj.startPosition + diff
      this.setPosition(obj.newPosition, this.index)
      document.removeEventListener('mouseup', this.dragend)
      document.removeEventListener('mousemove', this.drag)
      document.removeEventListener('mousedown', this.onMousedown)
    },
    // 监听拖拽过程的方法
    drag(event) {
      // if (event.clientX === 0) return
      const obj = this.list[this.index]
      let diff = 0
      const currentX = event.clientX
      diff = (currentX - obj.startX) / this.$refs.slider.clientWidth * 100
      if (this.isClick) {
        obj.newPosition = obj.startPosition + diff
        this.setPosition(obj.newPosition, this.index)
      }
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
          value = this.list[index - 1].value + this.step
        }
      }
      if (index + 1 <= this.list.length - 1) {
        if (value >= this.list[index + 1].value) {
          value = this.list[index + 1].value - this.step
        }
      }
      obj.value = parseInt(value)

      this.$emit('test', this.list.map(item => item.value), index, this.isClick)
      this.$nextTick(() => {
        this.displayTooltip(this.index)
        this.$refs.tooltip && this.$refs.tooltip[this.index].updatePopper()
      })
      this.setBarList()
    },
    // 设置bar的样式
    setBarList() {
      const temp = [...this.list]
      const bgs = this.bgs
      let barStyle = { left: 0, width: `${(temp[0].value - this.min) / (this.max - this.min) * 100}%`, background: bgs[0], barlabel: this.barLabel[0] }
      const arr = [barStyle]
      for (let i = 0; i < temp.length; i++) {
        if (i === temp.length - 1) {
          barStyle = { left: `${(temp[i].value - this.min) / (this.max - this.min) * 100}%`, width: `${(this.max - temp[i].value) / (this.max - this.min) * 100}%`, background: bgs[i + 1], barlabel: this.barLabel[i + 1] }
        } else {
          barStyle = { left: `${(temp[i].value - this.min) / (this.max - this.min) * 100}%`, width: `${(temp[i + 1].value - temp[i].value) / (this.max - this.min) * 100}%`, background: bgs[i + 1], barlabel: this.barLabel[i + 1] }
        }
        arr.push(barStyle)
      }
      this.barList = arr
    }
  }
}
</script>

<style  lang="scss" scoped>
.bar-label {
  position: absolute;
  right: 50%;
  top: 5px;
  transform: translateX(50%);
  min-width: 32px;
}
.slider {
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
        transform: scale(1.3);
        cursor: grab;
      }
    }
    &.drag{
      .slider-button{
        transform: scale(1.3);
      }
    }
    .hover-btn {
      // cursor: grab;
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
