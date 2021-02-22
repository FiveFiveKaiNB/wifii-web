<template>
  <div>
    <el-upload
      :headers="headers"
      :action="uploadBaseUrl"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :show-file-list="false"
      :data="uploadData"
      list-type="picture-card"
    >
      <el-tooltip class="img-box" effect="dark" content="点击图片可以更换图片哦~" placement="right">
        <img v-if="url && !uploading" :src="url" class="avatar" :style="{ width: imgWidth, height: imgHeight }">
      </el-tooltip>
      <i v-if="uploading" class="el-icon-loading" />
      <i v-if="!url && !uploading && showPlusIcon" class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'LdWechatUpload',
  components: {
  },
  props: {
    url: {
      default: false,
      type: [String, Boolean]
    },
    max: {
      default: 1,
      type: [String, Number]
    },
    picAdvice: {
      default: '',
      type: String
    },
    showPlusIcon: {
      type: Boolean,
      default: true
    },
    imgWidth: {
      type: String,
      default: '148px'
    },
    imgHeight: {
      type: String,
      default: '148px'
    },
    uploadData: {
      type: Object,
      default: () => ({
        corpId: window.localStorage.getItem('corpId')
      })
    }
  },
  data() {
    return {
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      uploading: false,
      uploadBaseUrl: `${process.env.VUE_APP_BASE_API}/common/wechat/upload`
    }
  },
  methods: {
    // 上传错误处理
    handleError(res) {
      this.uploading = false
    },
    // 通用的上传方法
    async beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < parseInt(this.max)
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt1M) {
        this.$message.error(`上传头像图片大小不能超过 ${this.max}MB!`)
        return false
      }
      this.uploading = true
      return isJPG || isPNG
    },
    // 成功后回调方法
    handleSuccess({ code, msg, data }, file, fileList) {
      if (code !== 20000) {
        console.error(msg)
        this.$message({
          type: 'warning',
          message: msg
        })
        return
      }

      this.$emit('handleSuccess', data.url)
      this.uploading = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.img-box {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: block;
}
.hint {
  font-size: 12px;
  color: #606266;
  margin-top: 8px;
}
</style>
