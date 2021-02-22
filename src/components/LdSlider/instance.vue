<template>
  <div class="sliderWrapper">
    <LdSlider ref="LdSlider" :value="testData" />
    <div v-if="baojiData" class="baoji">
      <div class="level1" :style="{'width': baojiData.baseWidth, 'background': baojiData.baseBgColor}" />
      <el-slider v-for="item in baojiData.list" :key="item" v-model="item.value" :style="{'width': item.width}" :min="item.min" :max="item.max" />
    </div>
  </div>
</template>

<script>
import LdSlider from '@/components/LdSlider'
export default {
  components: {
    LdSlider
  },
  data() {
    return {
      testData: null,
      baojiData: null,
      bgs: ['#9AADFF', '#7EC2FF', '#FFCB73', '#FF9284']
    }
  },
  created() {
    this.testData = [10, 30, 60]
    this.$nextTick(() => {
      const { max, min } = this.$refs.LdSlider
      const diff = max - min
      const baseWidth = (this.testData[0] - min) * 100 / diff + '%'
      const baseBgColor = this.bgs[0]
      const list = []
      let obj = {}
      for (let i = 0; i < this.testData.length; i++) {
        if (i === this.testData.length - 1) {
          obj = { width: (max - this.testData[i]) * 100 / diff + '%', bgColor: this.bgs[i + 1], value: '', min: this.testData[i], max }
        } else {
          obj = { width: (this.testData[i + 1] - this.testData[i]) * 100 / diff + '%', bgColor: this.bgs[i + 1], value: '', min: this.testData[i], max: this.testData[i + 1] }
        }
        list.push(obj)
      }
      this.baojiData = { baseWidth, baseBgColor, list }
    })
  }
}
</script>

<style lang="scss" scoped>
.baoji{
    margin-top: 30px;
    display: flex;
    align-items: center;
    .level1{
      height: 6px;
    }
    >>> .el-slider{
      &:nth-child(2){
        .el-slider__runway{
          background: #C4E3FF;
        }
        .el-slider__bar{
          background: #7EC2FF;
        }
        .el-slider__button{
          border-color: #7EC2FF;
        }
      }
      &:nth-child(3){
        .el-slider__runway{
          background: #FFE7BE;
        }
        .el-slider__bar{
          background: #FFCB73;
        }
        .el-slider__button{
          border-color: #FFCB73;
        }
      }
      &:nth-child(4){
        .el-slider__runway{
          background: #FFD3CE;
        }
        .el-slider__bar{
          background: #FF9284;
        }
        .el-slider__button{
          border-color: #FF9284;
        }
      }
    }
  }
</style>
