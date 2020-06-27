<template>
  <div class="content">
    <div class="content-header">
      <el-button type="success" class="addBtn" @click="add">新建章节</el-button>
    </div>
    <div class="content-body">
      <div class="content-container">
        <div class="content-container-header">目录</div>
        <div class="content-container-main">
          <div class="sidebar">
            <div v-for="(chapterItem,index) in chaptersData" :key="index" class="item" :class="active===index?'active':''" @click="changeChapter(index)">第{{ numbers[index] }}章</div>
          </div>
          <Chapter class="chapter" :chapter="chapter" />
        </div>
        <div class="content-container-footer">
          <el-button @click="reset">重置</el-button>
          <el-button type="success" class="saveBtn" @click="save">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chapter from './chapter'
import { addChapter, getChapters, editChapter } from '@/api/chapters'

export default {
  components: {
    Chapter
  },
  data() {
    return {
      chaptersData: null,
      numbers: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      active: 0,
      chapter: null
    }
  },
  created() {
    getChapters().then(res => {
      this.chaptersData = res.data.list
      // 默认展示第一章节的设置
      this.chapter = this.chaptersData ? this.chaptersData[0] : null
      console.log(res)
    })
  },
  methods: {
    // 新建章节
    add() {
      const index = this.chaptersData ? this.chaptersData.length + 1 : 0
      addChapter({ title: '', content: '', index }).then(res => {
        this.get()
      })
    },
    // 获取所有章节信息
    get() {
      getChapters().then(res => {
        this.chaptersData = res.data.list
      })
    },
    // 更换章节内容
    changeChapter(index) {
      this.active = index
      this.chapter = this.chaptersData[index]
    },
    // 重置
    reset() {
      this.chapter.title = ''
      this.chapter.content = ''
      this.$message(`第${this.numbers[this.active]}章 已重置`)
    },
    // 保存当前章节
    save() {
      editChapter(this.chapter).then(res => {
        this.$message(`第${this.numbers[this.active]}章 保存成功`)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.content-header{
  height: 88px;
  padding: 24px;
  text-align: right;
  .el-button{
    padding: 10px 16px;
    line-height: 20px;
    &.addBtn{
      background: #00C376;
    }
  }
}
.content-body{
  background:#F5F5F5;
  padding: 24px;
  .content-container{
    background: #FFFFFF;
    padding: 24px;
    &-header{
      margin-bottom: 10px;
      line-height: 22px;
    }
    &-main{
      display:flex;
      min-height: calc(100vh - 76px - 88px - 22px - 40px - 48px - 48px - 10px);
      .sidebar{
        width: 144px;
        margin-right: 38px;
        padding: 10px 0;
        border-top: 1px solid #F5F5F5;
        .item{
          font-size:14px;
          margin-bottom: 20px;
          line-height: 20px;
          cursor: pointer;
          &:hover{
            color: #00C376;
          }
          &.active{
            color: #00C376;
          }
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
}
</style>
