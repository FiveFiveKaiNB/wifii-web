<template>
  <div class="dialog-container">
    <el-dialog
      width="640px"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <dividing-line
        style="width: 100%; margin-bottom: 16px;background-color: rgba(0,0,0,0.12);"
      />
      <slot />
      <div class="importExcel">
        <el-upload
          drag
          :data="query"
          name="file"
          :headers="headers"
          :action="fullUploadUrl"
          multiple
          :on-success="onSuccess"
          :before-upload="beforeUpload"
          :on-error="onError"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip" style="margin-top: 20px">只能上传xls/xlsx文件，请按照模版填写后上传，
            <a :href="fullDownloadUrl" target="_blank" style="color: #4A90E2;">下载模板</a>
          </div>
        </el-upload>
      </div>
      <dividing-line style="width: 100%; margin-top: 64px;background-color: rgba(0,0,0,0.12);" />
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import DividingLine from '@/components/LdDetailsPage/components/DividingLine'

export default {
  name: 'ImportExcel',
  components: {
    DividingLine
  },
  props: {
    downloadUrl: {
      type: String,
      default: ''
    },
    uploadUrl: {
      type: String,
      default: ''
    },
    query: {
      type: Object,
      default: () => ({ corpId: window.localStorage.getItem('corpId') })
    }
  },
  data() {
    return {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        client: 'web'
      },
      fullDownloadUrl: process.env.VUE_APP_BASE_API + this.downloadUrl,
      fullUploadUrl: process.env.VUE_APP_BASE_API + this.uploadUrl
    }
  },
  methods: {
    async onSuccess(e) {
      if (e.code !== 20000) {
        this.$message.error(`上传出错：${e.msg}`)
        return
      }
      this.$emit('handleSuccess', e)
    },
    onError(err) {
      this.$message.error(`上传失败: ${err}`)
      return false
    },
    beforeUpload(file) {
      return (file.name.split('.')[1] === ('xlsx' || 'xls')) || this.onError('文件类型不符')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dialog-container {
  .importExcel {
    margin-top: 20px;
    text-align: center;
  }
  & >>> .el-dialog__body {
    padding: 15px 0 30px 0;
  }
}

</style>
