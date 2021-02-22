<template>
  <div>
    <div class="details-form-title">{{ formTitle }}</div>
    <div class="details-form-body">
      <div class="details-form-body-left" style="margin-left: 24px">
        <!--  -->
        <div v-for="(item, index) in formData" :key="index">
          <div class="item">
            <div class="label">{{ item.label + ':' }}</div>
            <el-input v-model="item.value" clearable placeholder="请输入内容" class="value" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormList',
  props: {
    formData: {
      type: Array,
      default: function() {
        return []
      }
    },
    formTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.details-form-title {
  margin-bottom: 20px;
  margin-left: 24px;
  font-size: 16px;
  font-weight: 500;
  color: #4A4A4A;
}
.details-form-body {
    display: flex;
    align-items: center;
    justify-content: center;

  .details-form-body-left {
    width: 400px;
    margin-bottom: 9px;
    .item {
      display: flex;
      width: 100%;
      margin-bottom: 16px;
      .label {
        // margin-top: 6px;
        padding-top: 6px;
        font-size: 14px;
        font-weight: 500;
        color: #000000;
        line-height: 20px;
        width: 70px;
      }

      .value {
        font-size: 14px;
        // font-weight: 300;
        width: 278px;
        height: 40px;
        color: #000000;
        line-height: 20px;
      }
    }
  }
}
</style>
