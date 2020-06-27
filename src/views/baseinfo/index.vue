<template>
  <div class="baseinfo">
    <div class="baseinfo-container">
      <div class="baseinfo-header">基本信息</div>
      <div class="baseinfo-main">
        <el-form ref="bookinfo" :model="bookinfo" label-width="128px">
          <el-form-item label="书名 :">
            <el-input v-model="bookinfo.name" maxlength="12" show-word-limit />
          </el-form-item>
          <el-form-item label="出自 :">
            <el-input v-model="bookinfo.publish" maxlength="16" show-word-limit />
          </el-form-item>
          <el-form-item label="参与者 :">
            <el-tag
              v-for="tag in bookinfo.author"
              :key="tag"
              closable
              @close="handleClose(tag)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新建</el-button>
          </el-form-item>
          <el-form-item label="书籍简介 :">
            <el-input v-model="bookinfo.intro" type="textarea" placeholder="简单概况书籍基本信息" :autosize="{minRows:6}" resize="none" />
          </el-form-item>
        </el-form>
      </div>
      <div class="baseinfo-footer">
        <el-button @click="reset">重置</el-button>
        <el-button type="success" class="saveBtn" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addBookinfo, editBookinfo, getBookinfo } from '@/api/bookinfo'

export default {
  data() {
    return {
      bookinfo: {
        name: '',
        publish: '',
        author: [],
        intro: ''
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    getBookinfo().then(res => {
      if (res.data.list.length < 1) {
        addBookinfo(this.bookinfo).then(_ => {
          console.log(_)
        })
      } else {
        this.bookinfo = res.data.list[0]
      }
    })
  },
  methods: {
    handleClose(tag) {
      this.bookinfo.author.splice(this.bookinfo.author.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.bookinfo.author.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    save() {
      console.log(this.bookinfo)
      editBookinfo(this.bookinfo).then(res => {
        this.$message('保存成功')
      })
    },
    reset() {
      this.bookinfo = {
        name: '',
        publish: '',
        author: [],
        intro: ''
      }
      this.$message('图书信息已重置')
    }
  }
}
</script>

<style lang="scss" scoped>
.baseinfo {
  background:#F5F5F5;
  padding: 24px;
  min-height: calc(100vh - 76px);
  &-container {
    padding: 24px;
    background: #FFFFFF;
  }
  &-header {
    font-size: 18px;
    line-height: 25px;
    padding: 0 16px;
    color: #00C376;
    font-weight: 500;
  }
  &-main{
    padding: 30px 0;
    min-height: calc(100vh - 76px - 48px - 48px - 25px - 40px);
    .el-form-item{
      width: 778px;
      .el-tag {
        margin-right: 10px;
      }
      .button-new-tag {
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
        vertical-align: middle;
      }
      .input-new-tag {
        width: 70px;
        line-height: 32px;
        vertical-align: middle;
      }
    }
  }
  &-footer{
    height: 40px;
    line-height: 40px;
    .el-button{
      padding: 10px 20px;
      &.saveBtn{
        background: #00C376;
      }
    }
  }
}
</style>
