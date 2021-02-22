<template>
  <div :id="idName" :style="{ height:height }" style="overflow:hidden; border-radius: 8px;margin: 20px 0" />
</template>

<script>
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    legendTop: {
      type: String,
      default: '59'
    },
    subTitleText: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'brokenLine'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '447px'
    },
    idName: {
      type: String,
      default: 'blockenLine'
    },
    titleText: {
      type: String,
      default: 'default value'
    },
    legendOrient: {
      type: String,
      default: 'horizontal'
    },
    customText: {
      type: String,
      default: ''
    },
    xAxisData: {
      type: Array,
      default: () => []
    },
    seriesData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null,
      condition: {},
      param: 'totalIncome'
    }
  },
  watch: {
    seriesData: function() {
      this.chart.clear()
      this.setOptions()
    },
    xAxisData: function() {
      this.setOptions()
    }
  },
  mounted() {
    this.initCharts()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initCharts() {
      this.chart = echarts.init(document.getElementById(this.idName))
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        title: {
          text: this.titleText,
          subtext: this.subTitleText,
          top: '22',
          left: '20',
          textStyle: {
            fontSize: 18,
            fontWeight: '400',
            fontFamily: 'PingFangSC-Regular,PingFang SC',
            color: '#000'
          }
        },
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '14%']
          }
        },
        legend: {
          orient: 'horizontal',
          x: 'left',
          top: this.legendTop,
          left: '20',
          // data: [
          //   { name: '销售额', icon: 'image://' + saleValue },
          //   { name: '间夜数', icon: 'image://' + nightValue }
          // ],
          icon: 'rect',
          // 图例的样式
          itemWidth: 15,
          itemHeight: 2,
          itemGap: 15,
          textStyle: {
            color: 'rgba(140, 140, 140, 1)',
            fontSize: 12,
            fontFamily: 'PingFangSC',
            fontWeight: 400
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            // 显示坐标轴轴线
            show: true
          },
          axisTick: {
          // 显示刻度
            show: false
          },
          // 两边留白
          boundaryGap: true,
          data: this.xAxisData
        },
        yAxis: [
          {
            type: 'value',
            position: 'left',
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            splitLine: {
              lineStyle: {
                type: 'solid'
              }
            },
            // 坐标轴刻度最小值
            min: 0,
            // 坐标轴的分割段数
            splitNumber: 5
          },
          {
            type: 'value',
            position: 'right',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            min: 0,
            splitNumber: 5
          }
        ],
        grid: {
          left: '10rem',
          right: '4%',
          bottom: '5%',
          top: '24%',
          // grid 区域是否包含坐标轴的刻度标签
          containLabel: true
        },
        series: this.seriesData
        // series: [
        //   {
        //     name: '销售额',
        //     type: 'line',
        //     // 折线数据
        //     data: [1, 2, 1, 4, 5],
        //     // 折线拐点标志的样式
        //     itemStyle: {
        //       normal: {
        //         color: '#5B8FF9',
        //         lineStyle: {
        //           width: 3
        //         }
        //       }
        //     }
        //   },
        //   {
        //     name: '间夜数',
        //     type: 'line',
        //     // 折线数据
        //     data: [1, 5, 6, 2, 9],
        //     itemStyle: {
        //       normal: {
        //         color: '#5AD8A6',
        //         lineStyle: {
        //           width: 3
        //         }
        //       }
        //     }
        //   }
        // ]
      })
    }
  }
}
</script>
