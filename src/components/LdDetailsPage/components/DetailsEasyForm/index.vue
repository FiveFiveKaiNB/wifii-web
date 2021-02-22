<template>
  <div>
    <div class="details-form-body">
      <!--  -->
      <div v-for="(item, index) in fromData" :key="index">
        <div class="item">
          <div class="label">{{ item.label + ':' }} <slot :name="item.labelSlot" /></div>
          <div class="value">{{ item.value }} <slot :name="item.valueSlot" /></div>
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
    fromData: {
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
  .details-form-body {
    // width: 400px;
    margin-bottom: 20px;
    .item {
      display: flex;
      // width: 100%;

      .label {
        // margin-right: 10px;
        font-size: 14px;
        font-weight: 400;
        margin-left: 137px;
        color: rgba(0,0,0,0.65);
        line-height: 24px;
        width: 100px;
      }

      .value {
        font-size: 14px;
        font-weight: 400;
        // width: 250px;
        margin-left: 10px;
        color: rgba(0,0,0,0.65);
        line-height: 20px;
      }
    }
  }

</style>
