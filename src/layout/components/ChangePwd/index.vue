<template>
  <div>
    <LdDetailsPage
      :title="detailsTitle"
      :detail-dialog-visible="detailDialogVisible"
      :width="width"
      :prohibit-change="prohibitChange"
      :custom-btn="customBtn"
      :custom-btn-text="customText"
      @submit="submit"
      @close="close"
      @details-close="detailsClose"
    >
      <div v-if="customText === '确认修改'" class="form-data">
        <el-form ref="formData" label-width="90px" :model="formData" :rules="rules">
          <el-form-item label="原密码:" prop="oldPassword">
            <el-input v-model="formData.oldPassword" clearable placeholder="请输入原密码" :type="oldPassWordType">
              <i slot="suffix" class="slot" @click="showOldPassord">
                <img v-if="oldPassWordType === 'password'" src="@/assets/tip/eyes.png" class="eyes">
                <img v-else src="@/assets/tip/eyes-active.png" class="eyes">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="password">
            <el-input v-model="formData.password" clearable placeholder="请输入新密码" :type="passWordType">
              <i slot="suffix" class="slot" @click="showPassord">
                <img v-if="passWordType === 'password'" src="@/assets/tip/eyes.png" class="eyes">
                <img v-else src="@/assets/tip/eyes-active.png" class="eyes">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirmPassword">
            <el-input v-model="formData.confirmPassword" clearable placeholder="请再次输入密码" :type="confirmPasswordType">
              <i slot="suffix" class="slot" @click="showConfirmPassword">
                <img v-if="confirmPasswordType === 'password'" src="@/assets/tip/eyes.png" class="eyes">
                <img v-else src="@/assets/tip/eyes-active.png" class="eyes">
              </i>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else class="success">已成功修改密码，请重新登陆青果酒店后台系统</div>
    </LdDetailsPage>
  </div>
</template>

<script>
import LdDetailsPage from '@/components/LdDetailsPage'
import { validPassword } from '@/utils/validate'
import { changePwd } from '@/api/user'
export default {
  name: 'DetailsPage',
  components: {
    LdDetailsPage
  },
  props: {
    detailDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 校验密码
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码不能小于6位数'))
      } else {
        callback()
      }
    }
    return {
      customText: '确认修改',
      prohibitChange: false,
      formData: {},
      customBtn: true,
      width: '640px',
      detailsTitle: '修改密码',
      initForm: {
        name: ''
      },
      // confirmPassword: '',
      rules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passWordType: 'password',
      oldPassWordType: 'password',
      confirmPasswordType: 'password'
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    showOldPassord() {
      if (this.oldPassWordType === 'password') {
        this.oldPassWordType = ''
      } else {
        this.oldPassWordType = 'password'
      }
    },
    showPassord() {
      if (this.passWordType === 'password') {
        this.passWordType = ''
      } else {
        this.passWordType = 'password'
      }
    },
    showConfirmPassword() {
      if (this.confirmPasswordType === 'password') {
        this.confirmPasswordType = ''
      } else {
        this.confirmPasswordType = 'password'
      }
    },
    close() {
      this.$emit('details-close')
    },
    detailsClose() {
      this.$emit('details-close')
    },
    async submit(e) {
      this.$store.commit('user/CHANGE_STATUS', ['dialogClose', false])

      if (this.customText === '重新登录') {
        this.$emit('logout')
      } else {
        this.$refs.formData.validate(async valid => {
          if (valid) {
            if (this.formData.confirmPassword !== this.formData.password) {
              this.$message({
                type: 'fail',
                message: '两次输入的密码不一致'
              })
              return
            } else {
              await changePwd(this.formData)
              await this.$store.dispatch('user/resetToken')
              this.customText = '重新登录'
              this.detailsTitle = '重新登录'
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.formData = {}
            }
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.form-data {
  margin: 0 auto;
  width: 375px;

  .el-form-item__label {
    color: #000;
    font-weight: 500;
  }
  .slot {
    cursor: pointer;
    margin-right: 5px;
    .eyes {
    width: 15px;
    height: 11px;
  }
  }
}
.success {
  text-align: center;
  line-height: 138px;
  font-size:14px;
  font-weight:400;
  color:rgba(89,89,89,1);
}

</style>
