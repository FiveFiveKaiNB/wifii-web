<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="login-container avatar-container right-menu-item hover-effect" trigger="click" size="medium">
        <div class="login-wrapper">
          {{ username }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="login-dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="changePwd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <change-pwd
      v-if="detailsShow"
      :details-show="detailsShow"
      :detail-dialog-visible="detailsShow"
      @details-close="detailsClose"
      @logout="logout"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ChangePwd from '../components/ChangePwd'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ChangePwd
  },
  data() {
    return {
      detailsShow: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState('user', [
      'username'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changePwd() {
      this.detailsShow = true
    },
    detailsClose() {
      this.detailsShow = false
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 76px;
  overflow: hidden;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #E8E8E8;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 74px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    line-height: 74px;
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 76px;
    font-size: 20px;

    .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          // cursor: pointer;
          // transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

    &:focus {
      outline: none;
    }

    .login-container {
      margin-right: 30px;

      .login-wrapper {
        position: relative;
        font-size: 20px;
        color: #BFBFBF;
        .el-icon-caret-bottom {
          cursor: pointer;
        }
      }
    }
  }
}
.el-dropdown-menu{
  text-align: center;
  width: 144px;
  margin: 0;
  padding:12px 1px;
  .el-dropdown-menu__item{
    font-size: 16px;
    &:hover{
      color:#009C9C;
      background:rgba(245,247,250,1);
    }
  }
}
</style>
