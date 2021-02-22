<template>
  <div class="users">
    <div class="users-container">
      <div class="table-body">
        <Table
          ref="myTable"
          search-placeholder="标题"
          unit-text="份卡片"
          :url="apiUrl"
          :fields="fields"
          :has-toolbar="true"
          :has-search="true"
          :has-action-column="true"
          :has-action-area="true"
          :action-column-btn-list="actionColumnBtnList"
          @handle-action-click="handleActionClick"
          @toolbarAction="toolbarAction"
          @tab-click="handleClick"
          @row-click="rowClick"
        />
      </div>
    </div>
    <details-page
      :show.sync="show"
      :form="form"
      @close="show = false"
    />
  </div>
</template>

<script>
import { delOneResourcesData } from '@/api/curdHandler'
import DetailsPage from './DetailsPage/index'
import Table from '@/components/Table'

export default {
  components: {
    Table,
    DetailsPage

  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      fields: [
        { name: 'name', label: 'wifi名' },
        { name: 'desc', label: '说明' },
        { name: 'connectCount', label: '连接次数', sort: 'custom' },
        { name: 'createdAt', label: '创建时间', sort: 'custom' },
        { name: 'updatedAt', label: '更新时间', width: '180', sort: 'custom' }
      ],
      apiUrl: 'wifis',
      actionColumnBtnList: [{ name: '删除', color: 'red' }],
      detailDialogVisible: false,
      form: {
      },
      show: false
    }
  },
  created() {
  },
  methods: {
    close(value) {
      this.detailDialogVisible = value
    },
    toolbarAction() {
      this.showDetailsPage()
    },
    showDetailsPage() {
      this.destory = true
      this.detailDialogVisible = true
      this.form = {}
    },
    rowClick(row) {
      this.form = row
      this.show = true
      this.detailDialogVisible = true
    },
    regionShowFormatter(row) {
      if (row.regionShow) {
        return '是'
      }
      return '否'
    },
    handleClick() {},
    handleActionClick(row) {
      this.handleDelete(row)
    },
    handleDelete(row) {
      this.$confirm('是否要删除当前卡片', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delOneResourcesData('/wifis', row._id)
        if (this.$refs.myTable.tableData.length <= 1) {
          this.$refs.myTable.params.page = 1
          this.$refs.myTable.load()
        } else {
          this.$refs.myTable.load()
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.users {
  background-color: #F0F2F5;
  height: 100%;
  width: 100%;
}
</style>
