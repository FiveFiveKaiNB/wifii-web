<template>
  <div class="wrap-box">
    <el-upload
      ref="upload"
      :class="{ noBorder: isSingle && url }"
      :style="{ width, height }"
      :action="uploadUrl"
      :data="qiniuData"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :show-file-list="!isSingle"
      :file-list="list"
      list-type="picture-card"
      multiple
      :limit="limit + 1"
      :on-exceed="handleExceed"
      :disabled="disabled"
    >
      <el-tooltip v-if="isSingle" :disabled="disabled" class="img-box" effect="dark" content="点击图片可以更换图片哦~" placement="right">
        <img v-if="url && !uploading" :src="url" class="img-box">
      </el-tooltip>
      <i v-if="uploading" class="el-icon-loading" />
      <i v-if="!uploading && !(isSingle && url)" class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
import * as gfun from '@/gfun'
import { getToken } from '@/api/qiniu'
import { qiniuConfig } from '@/api/qiniu'
export default {
  name: 'LdQiniuUpload',
  components: {
  },
  props: {
    isSingle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: 'auto'
    },
    url: {
      default: false,
      type: [String, Boolean]
    },
    path: {
      default: 'common',
      type: String
    },
    limit: {
      default: 5,
      type: Number
    },
    list: {
      default: () => ([]),
      type: Array
    },
    uploadBaseUrl: {
      default: process.env.VUE_APP_QINIU_UPLOAD_URL + '/',
      type: String
    },
    uploadStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      qiniuData: {
        token: '',
        key: ''
      },
      uploading: false,
      uploadUrl: '',
      host: '',
      count: 0,
      urlList: []
    }
  },
  computed: {
    // isSingle() {
    //   return this.url !== false
    // }
  },
  async created() {
    const { data: { clientUrl, host }} = await qiniuConfig()
    this.uploadUrl = clientUrl + '/'
    this.host = host
  },
  methods: {
    // 上传错误处理
    handleError(res) {
      this.uploading = false
      console.error(res)
    },
    handleExceed() {
      this.$message.error(`最多上传${this.limit + 1}张哦`)
    },
    // 列表移除处理
    handleRemove(file, fileList) {
      this.$emit('handleRemove', fileList)
    },
    submit() {
      const list = JSON.parse(JSON.stringify(this.$refs.upload.uploadFiles)) || []
      return list
    },
    // 通用的上传方法x
    async beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt20M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
        return false
      }
      const { data: { uptoken }} = await getToken()
      this.qiniuData.token = uptoken
      this.qiniuData.key = `${process.env.VUE_APP_QINIU_BASE_PATH}/${this.path}/${gfun.generateUid()}.${gfun.pickImgSuffix(file)}`
      this.uploading = true
      return isJPG || isPNG
    },
    /**
     * 获取图片宽高
     */
    async getImageInfo(file) {
      return new Promise((resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const img = new Image()
        img.onload = function() {
          resolve({ width: img.width, height: img.height })
        }
        img.src = _URL.createObjectURL(file)
      })
    },
    // 成功后回调方法
    async handleSuccess({ key }, file, fileList) {
      // const url = process.env.VUE_APP_QINIU_HOST + '/' + key
      const url = this.host + '/' + key
      this.urlList.push(url)
      ++this.count

      if (!this.isSingle) {
        this.$emit('handleSuccess', this.urlList, file, fileList)
        this.count = 0
        this.urlList = []
      } else {
        this.$emit('handleSuccess', url, file, fileList)
      }

      // if (this.count === fileList.length - this.list.length) {
      //   this.$emit('handleSuccess', url, file, fileList)
      // }
      this.uploading = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wrap-box {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.img-box {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: block;
}
// /deep/ .el-upload--picture-card {
//   width: 100%;
//   height: 100%
.el-upload--picture-card {
  width: 100%;
  height: 100%
}
.noBorder {
  //  /deep/ .el-upload--picture-card {
  //   border: 0;
  // }
  .el-upload--picture-card {
    border: 0;
  }
}
</style>
