<template>
  <div>
    <div v-for="(item, index) in detailsForm" :key="index">
      <div v-if="item[0]" class="details-form-title">{{ item[0] }}</div>
      <div class="details-form-body">
        <div class="details-form-body-left" style="margin-left: 24px">
          <div v-for="(_item, _index) in item[1]" :key="_index">
            <div class="item">
              <div class="label">{{ _item.label + ':' }}</div>
              <div class="value">{{ _item.value }}</div>
            </div>
          </div>
        </div>
        <!-- todo -->
        <div class="details-form-body-right" style="margin-right: 54px">
          <div v-for="(_item, _index) in item[2]" :key="_index">
            <div class="item">
              <div class="label">{{ _item.label + ':' }}</div>
              <div class="value">{{ _item.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <dividing-line v-if="index < detailsForm.length - 1" />
    </div>
  </div>
</template>

<script>
import DividingLine from '../DividingLine'
export default {
  name: 'FormList',
  components: {
    DividingLine
  },
  props: {
    detailsForm: {
      type: Array,
      default: () => []
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
        width: 400px;
        line-height: 26px;
      }
    }
  }
}
</style>
