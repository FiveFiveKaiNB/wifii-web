<template>
  <div class="tab-container">
    <!-- 这里用v-model报错 -->
    <el-tabs :value="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in groups"
        :key="index"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    groups: {
      type: Array,
      default: () => ([])
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // activeName:
    }
  },
  methods: {
    handleClick(e) {
      this.$emit('tab-click', e)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tab-container {
    // margin-left: 20px;
  padding-left: 25px;
  background-color: #fff;
}
</style>

<style rel="stylesheet/scss" lang="scss">
.tab-container {
  .el-tabs__item.is-active {
  color: rgba(39,181,186,1) !important;
}
.el-tabs__item:hover {
  color: rgba(39,181,186,1) !important;
}
.el-tabs__item {
  font-weight: 500;
  font-family: 'PingFangSC-Medium,PingFang SC';
  color: rgba(0,0,0,0.85);
  padding: 0px 22px;
  font-size: 16px;
}
.el-tabs__active-bar {
  width: 54px;
  background-color: rgba(39,181,186,1) !important;
}
.el-tabs__header {
  margin: 0;
}
}

</style>
