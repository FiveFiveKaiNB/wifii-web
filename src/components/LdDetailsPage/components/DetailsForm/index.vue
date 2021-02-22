<template>
  <div>
    <div v-if="detailsForm.formTitle" class="details-form-title">{{ detailsForm.Title }}</div>
    <div class="details-form-body">
      <div class="details-form-body-left" style="margin-left: 24px">
        <!--  -->
        <div v-for="(item, index) in leftFromData" :key="index">
          <div class="item">
            <div class="label">{{ item.label + ':' }}</div>
            <div class="value">{{ item.value }}</div>
          </div>
        </div>
      </div>
      <!-- todo -->
      <div class="details-form-body-right" style="margin-right: 54px">
        <div v-for="(item, index) in rightFromData" :key="index">
          <div class="item">
            <div class="label">{{ item.label + ':' }}</div>
            <div class="value">{{ item.value }}</div>
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
    detailsForm: {
      type: Object,
      default: function() {
        return { formTitle: false, Title: '' }
      }
    },
    leftFromData: {
      type: Array,
      default: function() {
        return []
      }
    },
    rightFromData: {
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
  margin-bottom: 16px;
  margin-left: 24px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
  font-family: PingFangSC-Medium, PingFang SC;
}
.details-form-body {
    display: flex;

  .details-form-body-left, .details-form-body-right {
    width: 400px;
    margin-bottom: 20px;
    .item {
      display: flex;
      width: 100%;

      .label {
        // margin-right: 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: rgba(0,0,0,0.85);;
        line-height: 26px;
        width: 90px;
      }

      .value {
        font-size: 14px;
        font-weight: 400;
        // margin-left: 70px;
        color: rgba(0,0,0,0.85);;
        // width: 250px;
        line-height: 26px;
      }
    }
  }
}
</style>
