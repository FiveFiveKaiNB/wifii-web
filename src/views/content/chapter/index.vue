<template>
  <div v-if="chapter" class="chapter">
    <el-form ref="form" :model="chapter" label-width="128px">
      <el-form-item label="章节标题:">
        <el-input v-model="chapter.title" maxlength="12" show-word-limit placeholder="类似“第一章：何为欺凌”的样式填写标题" />
      </el-form-item>
      <el-form-item label="正文内容:">
        <el-input v-model="chapter.content" type="textarea" :autosize="{minRows:8}" resize="none" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    chapter: {
      type: Object,
      default: () => ({ title: '', content: '' })
    }
  },
  created() {
    console.log(this.chapter)
  }
}
</script>

<style scoped lang="scss">
.el-form-item{
  width: 778px;
}
</style>
