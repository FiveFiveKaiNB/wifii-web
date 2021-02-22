<template>
  <div>
    <ld-detail-page
      :show="show"
      width="850px"
      title="留言详情"
      :request-data="requestData"
      :details-form="detailsForm"
      @close="handleHide"
    >
      <template v-if="form.images" v-slot:detailsPageSlot>
        <div class="images">
          <div v-for="(item,index) in form.images" :key="index">
            <img class="item" :src="item"></img>
          </div>
        </div>
      </template>
    </ld-detail-page>
  </div>
</template>

<script>
import LdDetailPage from '@/components/LdDetailPage'
import { postOneResourcesData, putOneResourcesData } from '@/api/curdHandler'
import { mapState } from 'vuex'
export default {
  components: {
    LdDetailPage
  },
  props: {
    detailDialogVisible: {
      type: Boolean,
      default: false
    },
    detailsTitle: {
      type: String,
      default: '答题详情'
    },
    form: {
      type: Object,
      default: function() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      requestData: { url: '' },
      visible: false,
      value: '',
      cancelOrderVisible: false,
      cancelOrderValue: ''
    }
  },
  computed: {
    detailsForm() {
      return [
        [
          '基本信息',
          [
            { label: 'wifiid', value: this.form._id },
            { label: 'wifi名字', value: this.form.name },
            { label: '连接次数', value: this.form.connectCount }
          ],
          [
            { label: 'wifi密码', value: this.form.password },
            { label: 'wifi说明', value: this.form.integral },
            { label: 'userId', value: this.form.userId }
          ]
        ]
      ]
    }
  },
  watch: {
    cancelOrderVisible: function(val, oldValue) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.inputReason.focus()
        })
      }
    }
  },
  async created() {
  },
  methods: {
    handleHide() {
      this.$emit('update:show', false)
      this.$emit('close')
      this.cancelOrderValue = ''
      this.value = ''
      this.visible = false
    },
    closeDetail() {
      this.$store.commit('detailsPage/SET_VISIBLE', false)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.form-data {
  .el-radio {
    margin-bottom: 10px;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #F76262;
    border-color: #F76262;
  }
  .el-radio__input.is-checked+.el-radio__label {
    color: #828282;
  }
  .el-tabs__nav-scroll {
    padding-left: 160px !important;
  }
  .el-tabs__item {
    height: 60px;
  }
  .el-tabs__item:hover {
    color: #F76262
  }
  .el-tabs__item.is-active {
    color: #F76262
  }
  .el-tabs__active-bar {
    background-color: #F76262;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

.form-data {
  margin: 0 auto;
  width: 600px;

  .correct {
    display: flex;
    align-items: center
  }

  .el-form-item__label {
    color: #000;
    font-weight: 500;
  }
  .manage__img {
    width: 160px;
    min-height: 160px;
  }
  .add {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-tabs__item {
    height: 50px;
  }

  .options {
    .option-item {
      .option-title {
        width: 100%;
        height: 40px;
        background: #EBEBEB;
        opacity: 1;
        display: flex;
        justify-content: space-between;
        padding-left: 24px;
        padding-right: 24px;
        margin-bottom: 24px;
        .index {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 40px;
          color: #000000;
        }
        .del {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 40px;
          color: #F76262;
          cursor: pointer;
        }
      }
    }
  }
  .block {
    width: 58px;
    height: 40px;
    background: #F5F5F5;
    border: 1px solid #E8E8E8;
    opacity: 1;
    border-radius: 0px 4px 4px 0px;
    border-left: 0px solid #fff;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #BFBFBF;
  }
}
</style>
