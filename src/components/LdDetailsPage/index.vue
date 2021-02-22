<template>
  <el-dialog
    class="detail-title"
    :width="width"
    top="128px"
    :title="title"
    :show-close="showClose"
    :visible="detailDialogVisible"
    :close-on-click-modal="clickModal"
    :append-to-body="true"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <dividing-line class="dividing-line" />
    <slot />
    <!-- 底部 -->
    <dividing-line class="dividing-line" style="margin-bottom: 0;" />
    <span slot="footer" class="dialog-footer">
      <el-button v-if="canChange" class="submit" type="primary" @click="submit">保存</el-button>
      <el-button v-if="customBtn" slot="reference" :style="btnStyle" class="el-button__custom-btn" type="primary" @click="submit">{{ customBtnText || '默认文字' }}</el-button>
      <slot name="custom" />
    </span>
  </el-dialog>
</template>

<script>
import DividingLine from './components/DividingLine'
import { mapState } from 'vuex'

export default {
  name: 'DetailsPage',
  components: {
    DividingLine
  },
  props: {
    title: {
      type: String,
      default: '详情'
    },
    detailDialogVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '640px'
    },
    // prohibitChange: {
    //   type: Boolean,
    //   default: true
    // },
    canChange: {
      type: Boolean,
      default: false
    },
    customBtn: {
      type: Boolean,
      default: false
    },
    customBtnText: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    clickModal: {
      type: Boolean,
      default: true
    },
    btnStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState('user', ['status'])
  },
  methods: {
    close() {
      this.$emit('close')
    },
    closed() {
      this.$emit('closed')
    },
    submit() {
      this.$emit('submit')
      // if (this.status.dialogClose) {
      //   this.$emit('details-close')
      // }
    },
    open() {
      this.$emit('open')
    },
    opened() {
      this.$emit('opened')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-button__custom-btn {
    width: auto!important;
  }
  .dividing-line {
    width: 100%;
    margin-bottom: 16px;
    background-color: rgba(0,0,0,0.12);
  }
</style>

<style rel="stylesheet/scss" lang="scss">
.detail-title {
  .dialog-footer {
  .el-button {
      width: 70px;
      text-align: center;
  }
}
.el-button--primary{
  background-color: #F76262;
  border-color: #F76262;
  width: 100px;
}
.el-button--primary:hover{
  background-color: #F76262;
  color: #ffffff;
  border-color: #F76262;
}
.el-dialog {
  border-radius: 10px;
}
.el-dialog__header {
  padding: 20px 0 20px 24px;
}
.el-dialog__title {
  font-size: 20px;
  font-weight: 500;
  color:rgba(0,0,0,0.85);
}
.el-dialog__body {
  padding: 0;
}
.el-dialog__headerbtn {
  font-size: 20px;
}
.el-dialog__footer {
  padding-top: 20px;
}
}
</style>
