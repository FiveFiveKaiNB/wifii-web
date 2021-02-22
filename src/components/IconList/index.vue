<template>
  <div class="facility-container">
    <div class="list-wrap">
      <div v-for="(item, index) in list" :key="index" class="item" :class="{ selected: item.selected }" @click="toggleSelect(item, index)">
        <img :src="item.url" alt="">
        <div class="text">{{ item.name }}</div>
        <div class="status">
          <i v-if="item.selected" class="el-icon-success" />
        </div>
      </div>
      <div class="upload" @click="upload">
        <div class="upload-css">
          <i class="el-icon-plus" />
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button v-re-click :disabled="isSaving" :loading="isSaving" type="primary" size="small" @click="save">保存</el-button>
      <!--      <el-button size="small" @click="reset">重置</el-button>-->
    </div>
    <el-dialog
      title="上传图片"
      center
      :visible.sync="uploadDialogVisible"
      width="30%"
      @closed="myClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="上传图片">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl"
            :show-file-list="false"
            :data="qiniuData"
            :on-error="handleError"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
            :auto-upload="true"
          >
            <img v-if="form.image_url" :src="form.image_url" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="图片名称">
          <el-input v-model="form.name" width="20" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible=false">取 消</el-button>
        <el-button v-re-click type="primary" @click="saveImg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { getToken } from '@/api/qiniu'
import * as gfun from '@/gfun'
export default {
  data() {
    return {
      baseUrl: process.env.VUE_APP_QINIU_UPLOAD_URL + '/',
      // image_url: '',
      isSaving: false,
      list: [],
      // qiniuPath,
      uploadDialogVisible: false,
      form: {
        name: '',
        image_url: ''
      },
      qiniuData: {
        token: '',
        key: ''
      },
      qiniuPath: 'hotel'
    }
  },
  computed: {
    ...mapGetters([
      'currentHotel'
    ]),
    ...mapState('hotel/hotelManage/hotelInfo', ['iconType'])
  },
  async created() {
    await this.getInitList()
    this.reset()
  },
  methods: {
    // dialog关闭后初始化表单
    myClose() {
      this.form = Object.assign({}, this.form, {
        name: '',
        image_url: ''
      })
    },
    // 成功后拼接图片的地址
    handleSuccess({ key }, file, fileList) {
      this.form.image_url = `${this.baseUrl}/${this.qiniuData.key}`
    },
    // 提交表单
    async saveImg() {
      this.uploadDialogVisible = false
      const submitForm = Object.assign({}, this.form, this.iconType)
      this.$store.dispatch('hotel/hotelManage/hotelInfo/updateIconList', submitForm)
      this.list = await this.getInitList()
    },
    upload() {
      this.uploadDialogVisible = true
    },
    handleError(res) {
      console.error(res)
    },
    async beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      const { uptoken } = await getToken()
      this.qiniuData.token = uptoken
      this.qiniuData.key = `${this.qiniuPath}/${gfun.generateUid()}.${gfun.pickImgSuffix(file)}`
      return isJPG || isPNG
    },
    async getInitList() {
      const selectedList = this.currentHotel.facility || []
      const selectedUrlList = selectedList.map(item => item.url)
      const allFacility = await this.$store.dispatch('hotel/hotelManage/hotelInfo/getAllHotelFacilityList')
      const initList = []
      allFacility.data.map(item => {
        initList.push({
          url: item.image_url,
          name: item.name,
          selected: selectedUrlList.indexOf(item.image_url) !== -1
        })
      })
      initList.sort((pre, cur) => cur.selected - pre.selected)
      this.initList = initList
      return initList
    },
    async save() {
      this.isSaving = true
      const facility = this.list.filter(item => item.selected).map(item => ({ name: item.name, url: item.url }))
      await this.$store.dispatch('hotel/hotelManage/hotelInfo/updateCurrentHotel', { facility })
      this.list = await this.getInitList()
      this.$message({
        message: '保存成功',
        type: 'success'
      })
      this.isSaving = false
    },
    reset() {
      this.list = JSON.parse(JSON.stringify(this.initList))
    },
    toggleSelect(item, index) {
      this.list[index].selected = !this.list[index].selected
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.facility-container {
  .list-wrap {
    width: 100%;
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;

    .item {
      border: 1px solid #efefef;
      margin-right: 10px;
      margin-bottom: 10px;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-radius: 3px;
      cursor: pointer;
      position: relative;
      color: #555;

      &.selected {
        border-color: #1890ff;

        i {
          color: #1890ff;
        }
      }

      img {
        width: 50px;
      }

      .text {
        font-size: 12px;
        line-height: 20px;
      }

      .status {
        position: absolute;
        top: 7px;
        right: 7px;

      }
    }
    .upload {
      width: 100px;
      height: 100px;
      border: 1px dashed #c0ccda;
      display: flex;
      align-items:center;
      justify-content:center;
      border-radius: 3px;
      position: relative;
      cursor: pointer;

      .text {
        text-align: center;
        font-size: 12px;
        color: #555;
        line-height: 20px;
      }

      .el-icon-plus {
        // position: absolute;
        font-size: 29px;
        color: #8c939d;
      }
    }
  }
  .avatar-uploader {
    height: 120px;
    width: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
}
</style>
