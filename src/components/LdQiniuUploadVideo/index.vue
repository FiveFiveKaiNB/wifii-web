<template>
  <div class="wrap-box">
    <el-upload
      :action="uploadBaseUrl"
      :data="qiniuData"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :show-file-list="true"
      :file-list="list"
      list-type="picture-card"
    >
      <!--      <el-tooltip v-if="isSingle" class="img-box" effect="dark" placement="right">-->
      <!--        <video v-if="url && !uploading" controls class="avatar">-->
      <!--          <source :src="url" type="video/mp4">-->
      <!--        </video>-->
      <!--      </el-tooltip>-->
      <img v-if="url && !uploading" :src="url" class="avatar">
      <i v-if="uploading" class="el-icon-loading" />
      <i v-if="!uploading && !(isSingle && url)" class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <video width="100%" controls>
        <source :src="videoUrl" type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import * as gfun from '@/gfun'
import { getToken } from '@/api/qiniu'
export default {
  name: 'LdQiniuVideoUpload',
  components: {
  },
  props: {
    url: {
      default: false,
      type: [String, Boolean]
    },
    path: {
      default: 'common',
      type: String
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
      videoUrl: '',
      dialogVisible: false,
      qiniuData: {
        token: '',
        key: ''
      },
      uploading: false
    }
  },
  computed: {
    isSingle() {
      return this.url !== false
    }
  },
  created() {
  },
  methods: {
    trimSuffix(value) {
      const index = value.lastIndexOf('?')
      return value.substring(0, index)
    },
    handlePreview(file) {
      // this.videoUrl = file.url
      this.videoUrl = this.trimSuffix(file.url)
      this.dialogVisible = true
    },
    ltrim(key) {
      return key.replace('/', '', 1)
    },
    // 上传错误处理
    handleError(res) {
      this.uploading = false
      console.error(res)
    },
    // 列表移除处理
    handleRemove(file) {
      const list = this.list.filter(item => {
        return item.url !== file.url
      })
      this.$emit('handleRemoveVideo', list)
    },
    // 通用的上传方法
    async beforeUpload(file) {
      const isVideo = ['video/mp4'].indexOf(file.type) === -1
      // const isPNG = file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (isVideo) {
        this.$message.error('上传文件只能是mp4格式!')
        return false
      }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      //   return false
      // }
      const { data: { uptoken }} = await getToken()
      this.qiniuData.token = uptoken
      this.qiniuData.key = `${process.env.VUE_APP_QINIU_BASE_PATH}/${this.path}/${gfun.generateUid()}.${gfun.pickImgSuffix(file)}`
      this.qiniuData.key = this.ltrim(this.qiniuData.key)
      this.uploading = true
      return isVideo
    },
    // 成功后回调方法
    handleSuccess({ key }, file, fileList) {
      const url = process.env.VUE_APP_QINIU_HOST + '/' + key + '?vframe/jpg/offset/1'
      this.$emit('handleSuccess', url)
      this.uploading = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wrap-box {
  width: 100%;
  height: 100%;
}
.img-box {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: block;
}

</style>
