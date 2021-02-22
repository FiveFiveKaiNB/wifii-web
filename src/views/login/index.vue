<template>
  <div class="login-container">
    <img class="ltImg" src="https://qn-qghotel.lindingtechnology.com/pcenter_1608790863793" alt="">
    <img class="rbImg" src="https://qn-qghotel.lindingtechnology.com/pcenter_1608790857068" alt="">
    <div class="form-container">
      <div class="form-aside">
        <div class="aside-title">欢迎进入</div>
        <div class="aside-title">WIFI-管理管理后台</div>
        <img src="https://qn-qghotel.lindingtechnology.com/pcenter_1608790867913" class="loginImg" alt="">
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

        <div class="form-title">登陆</div>

        <el-form-item prop="username">
          <div class="svg-container">
            <svg-icon icon-class="ebook-username" />
          </div>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="请输入管理账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <div class="svg-container">
            <svg-icon icon-class="ebook-password" />
          </div>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入账号密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span> -->
        </el-form-item>
        <div class="btn-wrapper">
          <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">点击登陆</el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // username: 'admin',
        // password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_green:#003E26;
$light_green:#F05454;

.login-container {
  min-height: 100%;
  width: 100%;
  position: relative;
  .ltImg{
    position: absolute;
    width: 853px;
    height: 338px;
    left: 0;
    top: 0;
  }
  .rbImg{
    position: absolute;
    width: 769px;
    height: 453px;
    right: 0;
    bottom: 0;
  }
  .form-container{
    position: absolute;
    width:1067px;
    height:609px;
    // box-shadow:0px 2px 5px 0px rgba(39,181,186,0.11),0px 3px 13px 4px rgba(22,119,122,0.11);
    box-shadow: 0px 6px 12px 2px rgba(0, 0, 0, 0.06);
    border-radius:23px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;

    .form-aside{
      width: 495px;
      height: 100%;
      padding: 30px;
      float: left;
      // box-shadow:2px 0px 5px 0px rgba(39,181,186,0.11),3px 0px 13px 4px rgba(22,119,122,0.11);
      box-shadow: 5px 0px 10px 0px rgba(0, 0, 0, 0.06);
      border-radius:23px;
      .aside-title{
        color: $dark_green;
        font-size:18px;
        font-weight:600;
        line-height:25px;
      }
      .loginImg{
        position: absolute;
        display: block;
        width: 496px;
        height: 400px;
        left: 0;
        bottom: 0;
      }
    }

    .login-form {
      padding: 30px;
      overflow: hidden;
      height: 100%;
      .form-title {
        font-size: 28px;
        color: $dark_green;
        line-height: 40px;
        text-align: center;
        font-weight: 400;
      }
      .el-form-item{
        width: 350px;
        border-bottom: 1px solid rgba(232,232,232,1);
        padding-left: 28px;
        position: relative;
        margin: 0 auto;
        .svg-container {
          position: absolute;
          left: -28px;
          top: 10px;
          .svg-icon{
            display: block;
            width: 19px;
            height: 22px;
          }
        }
        & >>> .el-input{
          .el-input__inner{
            border: none;
            outline: none;
          }
        }

        &:nth-of-type(2){
          margin-top: 138px;
        }
        & + .el-form-item{
          margin-top: 50px;
        }

        .show-pwd {
          position: absolute;
          right: 10px;
          top: 7px;
          font-size: 16px;
          cursor: pointer;
          user-select: none;
        }
      }
      .btn-wrapper{
        width: 350px;
        margin: 157px auto;
        box-shadow: 0px 5px 10px 2px rgba(204, 0, 0, 0.3);
        border-radius:4px;
        .el-button{
          background: $light_green;
        }
         .el-button--primary:hover {
            border: 2px solid $light_green;
         }
         .el-button--primary {
            border: 2px solid $light_green;
         }
      }
    }

  }
}
</style>
