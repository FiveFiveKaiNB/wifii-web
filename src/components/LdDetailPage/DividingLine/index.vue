<template>
  <div :class="['dividing-line', this.isContentLine && 'content-dividing-line']" />
</template>

<script>
export default {
  name: 'DividingLine',
  props: {
    isContentLine: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dividing-line {
  background-color: #EBEEF5;
  height: 1px;
  margin: 0 auto;
}
.content-dividing-line {
  margin-bottom: 16px;
  width: 95%!important;
}
</style>
