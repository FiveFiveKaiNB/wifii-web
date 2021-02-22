<template>
  <div>
    <div :id="idName" :style="{ width, height }" style="border-radius: 8px; overflow: hidden;margin: 20px 0" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
require('echarts/lib/chart/bar')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {
  mixins: [resize],
  props: {
    position: {
      type: Array,
      default: () => [],
      required: true
    },
    idName: {
      type: String,
      default: 'pieChart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '447px'
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
    subTitleText: {
      type: String,
      default: ''
    },
    legendTop: {
      type: String,
      default: '59'
    },
    seriesInnerFormatter: {
      type: String,
      default: ''
    },
    seriesOuterFormatter: {
      type: String,
      default: ''
    },
    tooltipFormatter: {
      type: String,
      default: ''
    },
    seriesRadius: {
      type: [String, Array],
      default: () => ['0', '50%']
    },
    seriesData: {
      type: Array,
      default: () => []
    },
    watchChange: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    seriesData: {
      handler(val) {
        this.pieChartSetOptions()
      },
      deep: true
    }
  },
  mounted() {
    this.initPieChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    pieChartSetOptions() {
      this.chart.setOption({
        title: {
          text: this.titleText,
          subtext: this.subTitleText,
          subtextStyle: {
            color: 'gray',
            fontSize: '12',
            align: 'right'
          },
          top: '22',
          left: '20',
          textStyle: {
            fontSize: 18,
            fontWeight: '500',
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: this.tooltipFormatter
        },
        // 在图形中某个位置显示自定义文字
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: this.customText,
            textAlign: 'center',
            fill: '#000',
            fontSize: 18,
            fontWeight: 500
          }
        },
        backgroundColor: '#fff',
        legend: {
          orient: this.legendOrient,
          x: 'left',
          top: this.legendTop,
          left: '20',
          icon: 'circle',
          textStyle: {
            color: 'rgba(140, 140, 140, 1)',
            fontSize: 12,
            fontFamily: 'PingFangSC',
            fontWeight: 400
          }
        },
        series: [this.position.includes('inner') && {
          type: 'pie',
          radius: this.seriesRadius,
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            normal: {
              position: 'inner',
              show: true,
              formatter: `{color|${this.seriesInnerFormatter}}`,
              rich: {
                color: {
                  fontSize: 16,
                  color: 'white',
                  fontWeight: 400,
                  fontFamily: 'PingFangSC'
                }
              }
            }
          },
          // 标签的视觉引导线样式
          labelLine: {
            length: 20
          },
          // 高亮的扇区和标签样式
          // emphasis: {
          //   label: {
          //     show: true
          //   }
          // },
          data: this.seriesData
        },
        this.position.includes('outer') && {
          type: 'pie',
          radius: this.seriesRadius,
          // 单选
          // selectedMode: 'single',
          // center: ['55%', '55%'], // 饼图的位置
          // 选中扇区的偏移距离
          // selectedOffset: 30,
          // 顺时针排布
          // clockwise: true,
          // 图形样式
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            normal: {
              show: true,
              position: 'outer',
              formatter: `{fontStyle|${this.seriesOuterFormatter}}`,
              rich: {
                fontStyle: {
                  fontSize: 16,
                  fontWeight: 400,
                  fontFamily: 'PingFangSC'
                }
              }
            }
          },
          // 标签的视觉引导线样式
          labelLine: {
            length: 20
          },
          // 高亮的扇区和标签样式
          emphasis: {
            label: {
              show: true
            }
          },
          data: this.seriesData
        }].filter(item => item)
      })
    },
    initPieChart() {
      this.chart = echarts.init(document.getElementById(this.idName))
      this.pieChartSetOptions()
    }
  }
}
</script>
