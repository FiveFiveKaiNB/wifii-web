<template>
  <div>
    <div class="table-title">{{ detailsTable.title }}</div>
    <div class="myTab">
      <el-table
        :header-cell-style="{background:'#FAFAFA'}"
        :data="detailsTable.data"
        style="width: 100%;"
        class="tab"
        @row-click="rowClick"
      >
        <el-table-column
          v-for="(item, index) in detailsTable.fields"
          :key="index"
          :prop="item.name"
          :label="item.label"
          :width="item.width"
          :show-overflow-tooltip="true"
          :formatter="item.formatter || formatter"
          fixed
        />
      </el-table>
    </div>
    <!-- <div v-if="pagination" class="bottom-operator">
      <el-pagination
        class="pagination"
        small
        layout="prev, pager, next"
        :hotel-pagination="hotelPagination"
        :current-page="hotelPagination.page"
        :page-size="hotelPagination.perPage"
        :total="hotelPagination.total"
        @current-change="hotelOrderChange"
      />
    </div> -->
  </div>
</template>

<script>
import DividingLine from '../DividingLine'
export default {
  name: 'DetailsTable',
  components: {
    DividingLine
  },
  props: {
    formatter: {
      type: Function,
      default: (row, column, cellValue) => cellValue
    },
    page: {
      default: 0,
      type: Number
    },
    total: {
      default: 0,
      type: Number
    },
    perPage: {
      default: 0,
      type: Number
    },
    detailsTableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    detailsTableFields: {
      type: Array,
      default: function() {
        return []
      }
    },
    hotelPagination: {
      type: Object,
      default: function() {
        return {}
      }
    },
    pagination: {
      type: Boolean,
      default: false
    },
    detailsTableTitle: {
      type: String,
      default: ''
    },
    detailsTable: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    rowClick(currentForm) {
      this.$emit('row-click', JSON.parse(JSON.stringify(currentForm)))
    },
    hotelOrderChange(page) {
      this.$emit('hotel-order-change', page)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-title {
  margin-bottom: 16px;
  margin-left: 24px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0,0,0,0.85);
}
.myTab {
  padding-left: 23px;
  padding-right: 23px;
  .tab {
    cursor: pointer;
  }
  .bottom-operator {
    margin-top: 20px;
    // height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    .pagination {
        float: right;
      }
}
}

</style>

<style lang="scss">
</style>
