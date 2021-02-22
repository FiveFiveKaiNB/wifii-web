<template>
  <div
    :corpId="corpId"
  >
    <LdDetailsPage
      :title="detailsTitle"
      :detail-dialog-visible="detailDialogVisible"
      :width="width"
      :prohibit-change="prohibitChange"
      :can-change="canChange"
      :show-close="showClose"
      :click-modal="false"
      @close="close"
      @submit="submit"
      @details-close="detailsClose"
    >
      <div class="form-data">
        <el-form ref="formData" label-width="90px" :model="formData" :rules="registerRules">
          <el-form-item label="门店名称:" prop="name">
            <el-input v-model="formData.name" maxlength="16" :show-word-limit="true" clearable style="width: 300px" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" name="phoneNumber" :maxlength="11" clearable style="width: 300px" />
          </el-form-item>
          <el-form-item v-if="showAddress" label="门店地址:" prop="address">
            <el-input v-model="formData.address" :disabled="isDisabled" placeholder="点击右侧图标选择定位" class="address" style="width: 300px">
              <i v-if="location" slot="suffix" class="location-active" @click="showMap">
                <img src="./assets/location-active.png" class="location">
              </i>
              <i v-else slot="suffix" class="location-btn" @click="showMap">
                <img src="./assets/location.png" class="location">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="门店介绍:" prop="intro">
            <el-input v-model="formData.intro" type="textarea" style="width: 300px" />
          </el-form-item>
        </el-form>
      </div>
    </LdDetailsPage>
    <el-dialog
      class="map-dialog"
      custom-class="dialog"
      title="地图"
      :visible.sync="status.centerDialogVisible"
      width="65%"
      top="10vh"
      center
    ><Tencent-map :address-object="addressObject" @setFormData="setFormData" /></el-dialog>
  </div>
</template>

<script>
import { validPhoneNumber } from '@/utils/validate'
import TencentMap from '@/components/TencentMap'
import LdDetailsPage from '@/components/LdDetailsPage'
import { mapState } from 'vuex'
export default {
  name: 'DetailsPage',
  components: {
    TencentMap,
    LdDetailsPage
  },
  props: {
    corpId: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: false
    },
    showAddress: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const validatePhoneNumber = (rule, value, callback) => {
      if (!validPhoneNumber(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      isDisabled: true,
      location: false,
      centerDialogVisible: false,
      addressObject: {},
      prohibitChange: false,
      canChange: true,
      width: '640px',
      detailDialogVisible: true,
      detailsTitle: '创建门店',
      initForm: {
        name: ''
      },
      formData: {
        name: '',
        corpId: this.corpId,
        address: '',
        phoneNumber: '',
        intro: ''
      },
      registerRules: {
        phoneNumber: [{ required: true, trigger: 'blur', validator: validatePhoneNumber }],
        name: [{ required: true, trigger: 'blur', message: '请输入门店名称' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        address: [{ required: true, trigger: 'blur', message: '门店地址为必填项' }],
        intro: [{ required: true, trigger: 'blur', message: '门店介绍为必填项' }]
      }
    }
  },
  computed: {
    ...mapState('user', ['status']),
    ...mapState('hotel/hotelManage/roomType', ['status'])
  },
  created() {
    this.addressObject.address = '福建省厦门市思明区市行政服务中心'
    this.addressObject.loc = [118.08917178948832, 24.47949910759976]
    this.addressObject.city = '厦门市'
    this.addressObject.province = '福建省'
  },
  methods: {
    showMap() {
      this.$store.commit('hotel/hotelManage/roomType/CHANGE_STATUS', ['centerDialogVisible', true])
    },
    setFormData(loc, province, city, address) {
      if (loc.length !== 0) {
        this.location = true
        this.formData.loc = loc
        this.formData.province = province
        this.formData.city = city
        this.formData.address = address
        this.isDisabled = false
        return
      }
      this.$message.error('未选择位置')
    },
    close() {
      this.$emit('details-close')
    },
    detailsClose() {
      this.$emit('details-close')
    },
    submit() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
          this.$store.commit('user/CHANGE_STATUS', ['dialogClose', true])
        } else {
          this.$store.commit('user/CHANGE_STATUS', ['dialogClose', false])
          this.$message({
            type: 'fail',
            message: '不能输入空的内容哦'
          })
          return
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.form-data {
  margin: 0 auto;
  width: 375px;
  .address {
    position: relative;
    .location-active {
      position: absolute;
      cursor: pointer;
      width:57px;
      height: 36px;
      right: -5px;
      border-radius:0px 6px 6px 0px;
      border: 1px solid #DCDFE6;
      // background:rgba(245,247,250,1);
      display: inline-block;
      line-height: 36px;
      .location {
        width: 18px;
        margin-top: 5px;
        height: 21px;
      }
    }
    .location-btn {
      position: absolute;
      cursor: pointer;
      width:57px;
      height: 36px;
      right: -5px;
      border-radius:0px 6px 6px 0px;
      border: 1px solid #DCDFE6;
      background:rgba(245,247,250,1);
      display: inline-block;
      line-height: 36px;
      .location {
        width: 18px;
        margin-top: 5px;
        height: 21px;
      }
  }
  }
  .el-form-item__label {
  color: #000;
  font-weight: 500;
  }
}
</style>
