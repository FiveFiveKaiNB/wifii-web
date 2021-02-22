<template>
  <div class="users">
    <div class="users-container">
      <div class="table-body">
        <Table
          ref="myTable"
          search-placeholder="昵称 | Id"
          unit-text="人"
          :url="apiUrl"
          :fields="fields"
          :has-toolbar="true"
          :has-search="true"
          @tab-click="handleClick"
          @row-click="rowClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@/components/Table'

export default {
  components: {
    Table
  },
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      fields: [
        { name: '微信用户', label: '昵称', formatter: this.nickNameFormatter },
        // { name: 'phoneNumber', label: '联系电话' },
        { name: 'wifiCount', label: 'wifi数', sort: 'custom' },
        { name: 'createdAt', label: '创建时间', sort: 'custom' },
        { name: 'updatedAt', label: '更新时间', width: '180', sort: 'custom' }
      ],
      apiUrl: 'users',
      actionColumnBtnList: [{ name: '删除', color: 'red' }]
    }
  },
  created() {
  },
  methods: {
    nickNameFormatter(row) {
      let str = ''
      row.nickName ? str = row.nickName : str = '微信用户'
      return str
    },
    handleClick() {},
    rowClick() {},
    handleClose(tag) {
      this.bookinfo.author.splice(this.bookinfo.author.indexOf(tag), 1)
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
