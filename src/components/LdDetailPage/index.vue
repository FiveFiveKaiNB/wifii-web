<template>
  <el-dialog
    v-if="show || visible"
    class="detail-title"
    :width="width"
    top="128px"
    :title="title"
    :show-close="showClose"
    :visible="show || visible"
    :close-on-click-modal="clickModal"
    :append-to-body="true"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <dividing-line :is-content-line="false" class="dividing-line" />
    <div class="ld-form-container">
      <ld-form
        v-if="formItems.length"
        ref="ldForm"
        :form="formData"
        :rules="rules"
        :form-items="formItems"
        :label-width="labelWidth"
        :item-width="formItemWidth"
      />
    </div>
    <details-form
      v-if="detailsForm.length"
      :details-form="detailsForm"
    />
    <dividing-line v-if="detailsTable.fields" style="width: 95%" />
    <details-table
      v-if="detailsTable.fields"
      :details-table="detailsTable"
    />
    <slot name="detailsPageSlot" />
    <!-- 底部 -->
    <dividing-line :is-content-line="false" class="dividing-line" style="margin: 16px 0 0 0" />
    <span slot="footer" class="dialog-footer">
      <!-- <el-button v-if="canChange" class="submit" type="primary" @click="submit">保存</el-button> -->
      <slot name="custom" />
      <el-button v-if="hasSubmitBtn" slot="reference" re-click :style="btnStyle" class="submit el-button__custom-btn" type="primary" :loading="loading" @click="submit">{{ btnText }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DividingLine from './DividingLine'
import { mapState } from 'vuex'
import request from '@/utils/request'
import ldForm from '@/components/LdForm'
import DetailsForm from './DetailsForm'
import DetailsTable from './DetailsTable'
import validate from '@/mixins/validate'

export default {
  name: 'DetailsPage',
  components: {
    DividingLine,
    ldForm,
    DetailsForm,
    DetailsTable
  },
  mixins: [validate],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    formItems: {
      type: Array,
      default: () => []
    },
    formItemWidth: {
      type: String,
      default: '360px'
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    title: {
      type: String,
      default: '详情'
    },
    // visible: {
    //   type: Boolean,
    //   default: false
    // },
    width: {
      type: String,
      default: '640px'
    },
    hasSubmitBtn: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '保存'
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
    },
    requestData: {
      type: Object,
      default: () => ({})
    },
    detailsForm: {
      type: Array,
      default: () => []
    },
    detailsTable: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState('detailsPage', ['visible'])
  },
  methods: {
    close() {
      this.$emit('close')
      this.$store.commit('detailsPage/SET_VISIBLE', false)
      this.$store.commit('detailsPage/SET_TYPE', '')
    },
    closed() {
      this.$emit('closed')
    },
    findObj(attr) {
      if (attr) {
        if ('myTable' in attr.$refs) {
          attr.$refs.myTable.load()
        } else {
          this.findObj(attr.$parent)
        }
      }
    },
    async submit() {
      this.$emit('submit')
      this.requestData.url && this.validate().then(async() => {
        this.loading = true
        await this.apiRequest().then(() => {
          this.$message.success(this.requestData.method === 'post' ? this.requestData.message || '添加成功！' : this.requestData.message || '更新成功！')
          this.loading = false
          this.findObj(this.$parent)
          this.close()
          this.$emit('close')
        }).catch(() => {
          this.loading = false
        })
      }).catch(error => {
        console.error('你的错误：', error)
      })
    },
    apiRequest() {
      return request({
        url: this.requestData.url,
        method: this.requestData.method || 'put',
        data: Object.assign({}, this.formData, ...this.priceProps())
      })
    },
    priceProps() {
      return this.requestData.priceProps ? this.requestData.priceProps.map(item => ({ [item]: this.formData[item] * 100 })) : []
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
    margin-bottom: 16px;
    background-color: rgba(0,0,0,0.12);
  }
  .ld-form-container {
    padding-left: 24px;
    display: flex;
    justify-content: center;
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
