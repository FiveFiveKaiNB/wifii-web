<template>
  <div>
    <ToolBar
      v-if="hasToolbar"
      ref="toolBar"
      v-bind="$attrs"
      v-on="$listeners"
      @input="conditionChange($event)"
      @clear="clear"
      @onSearch="search"
    >
      <template slot="toolbarSlot">
        <slot name="toolbarSlot" />
      </template>
    </ToolBar>
    <Tabs
      v-if="hasTabs"
      style="margin: 0 24px;"
      v-bind="$attrs"
      v-on="$listeners"
    />
    <div class="tab">
      <el-table
        :data="url ? tableData : data"
        style="min-width: 100%; overflow: hidden;"
        :header-cell-style="{background:'#FAFAFA'}"
        :cell-class-name="cellClassName"
        :cell-style="cellStyle"
        @row-click="rowClick"
        @sort-change="sortChange"
        @filter-change="handleFilterChange"
        @header-click="headerClick"
        @cell-click="handleCellClick"
      >
        <!-- column-key 是当使用 filter-change 事件时，需要此属性标识是哪个列的筛选条件。（这个属性将作为 filter 的 key） -->
        <el-table-column
          v-for="(item, index) in fields"
          :key="index"
          :prop="item.name"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :sortable="item.sort"
          :column-key="item.key"
          :filters="item.filter"
          :show-overflow-tooltip="true"
          :filter-multiple="false"
          :align="item.align || 'left'"
          :formatter="item.formatter || (item.isPrice ? formatterPrice : formatter)"
        >
          <template v-if="item.includeOthers || item.slotName" v-slot="scope">
            <slot :name="item.slotName" :scope="{row: scope.row, index: scope.$index}" />
            {{ item.formatter && item.formatter(scope.row) }}
            <span v-if="item.includeOthers && item.includeOthers.length" class="include-others">
              <span
                v-for="(othersItem, othersIndex) in item.includeOthers"
                :key="othersItem.name"
                :style="{ color: othersItem.color === 'red' ? 'rgba(255,75,100,1)' : '#009C9C' }"
                class="edit-row"
                @click.stop="handleOthersClick(othersItem, othersIndex, scope.row, scope.$index)"
              >
                {{ othersItem.name }}
              </span>
            </span>
          </template>

          <template v-if="item.isTip" slot="header">
            {{ item.label }}
            <el-tooltip class="some-tip" effect="dark" placement="top-start">
              <div slot="content" class="some-tip__content">
                {{ item.tipContent || '请输入提示内容！' }}
              </div>
              <img :src="tipIcon" class="tipIcon">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          v-if="actionColumnText || hasActionColumn"
          :label="actionColumnText || '操作'"
          :align="actionColumnAlign"
          :width="typeof actionColumnBtnList[actionColumnBtnList.length - 1] === 'number'
            ? actionColumnBtnList[actionColumnBtnList.length - 1] + 'px'
            : 'auto'"
        >
          <template v-slot="scope">
            <span
              v-for="(item, btnIndex) in actionColumnBtnList"
              :key="item.name"
              :style="{ color: item.color === 'red' ? 'rgba(255,75,100,1)' : '#009C9C' }"
              class="edit-row"
              @click.stop="handleActionClick(scope.row, item.name, btnIndex, scope.$index)"
            >
              {{ item.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column v-if="showScope" label="操作" width="110px">
          <template v-slot="scope">
            <div v-if="showScopeBtn">
              <el-button v-if="scope.row.status !== 2" type="danger" style="min-width: 60px;" size="small" @click.stop="handleDelete(scope.$index, scope.row)">{{ operateBtnText }}</el-button>
            </div>
          </template>
        </el-table-column>
        <template v-if="unitText" slot="append">
          <div class="append-container">
            <div class="total-members">
              共计{{ (params.total || total) + unitText }}
            </div>
            <div class="bottom-operator">
              <el-pagination
                class="pagination"
                small
                layout="prev, pager, next"
                :current-page="url ? params.page : page"
                :page-size="url ? params.perPage : perPage"
                :total="url ? params.total : total"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </template>
      </el-table>
      <!-- 底部分页 -->
      <div v-if="!unitText && params.total" class="bottom-pagination">
        <el-pagination
          class="pagination"
          small
          layout="prev, pager, next"
          :current-page="url ? params.page : page"
          :page-size="url ? params.perPage : perPage"
          :total="url ? params.total : total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
const tipIcon = require('@/assets/tip/tip.png')
import request from '@/utils/request'
import ToolBar from '@/components/ToolBar'
import Tabs from '@/components/Tabs'
import { props } from './props'

export default {
  name: 'Table',
  components: {
    ToolBar,
    Tabs
  },
  props: {
    ...props
  },
  data() {
    return {
      tipIcon,
      value: '地址',
      checkList: [],
      tableData: null,
      pagination: {},
      params: {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        searchText: '',
        page: 1,
        perPage: 15,
        total: 0
      }
    }
  },
  computed: {
    baseUrl() {
      return process.env.VUE_APP_BASE_API
    }
  },
  async created() {
    if (this.url) {
      this.notDelay && this.load()
    }
  },
  methods: {
    // 获取表格数据方法
    async load() {
      const url = this.baseUrl + `/${this.url}`
      // 提示：因为 query 在最后面，因此父组件传参到 query 中最好不要有 params 中的属性，否则相同的属性会被后面的覆盖
      this.params = Object.assign({}, this.params, this.myParams, this.query)
      const { data } = await request({ url, params: this.params })
      const { list, pagination } = data
      if (pagination) {
        this.params.page = pagination.page
        this.params.perPage = pagination.perPage
        this.params.total = pagination.total
        this.pagination = pagination
      } else {
        console.warn('Table中的 pagination 值为假')
      }
      this.tableData = list || data
    },
    rowClick(row, column, event) {
      this.$emit('row-click', JSON.parse(JSON.stringify(row)), column, event)
    },
    handleActionClick(row, index) {
      this.$emit('handle-action-click', row, index)
    },
    handleOthersClick(item, itemIndex, row, index) {
      this.$emit('handle-others-click', item, itemIndex, row, index)
    },
    sortChange(condition) {
      if (this.url) {
        this.params.page = 1
        this.params.sortBy = condition.prop
        this.params.sortOrder = condition.order === 'ascending' ? 'asc' : 'desc'
        this.load()
      } else {
        this.$emit('sort-change', condition)
      }
    },
    async handleFilterChange(filter) {
      if (this.url) {
        this.params.page = 1
        const couponType = Object.values(filter)[0][0]
        const key = Object.keys(filter)[0]
        this.params = Object.assign({}, this.params, { [key]: couponType })
        this.$emit('filter-change', filter)
        this.load()
      } else {
        this.$emit('filter-change', filter)
      }
    },
    handleDelete(index, row) {
      this.$emit('handleDelete', index, row)
    },
    headerClick(col, event) {
      this.$emit('header-click', col, event)
    },
    handleCellClick(row, col, cell, event) {
      this.$emit('cell-click', col, row, cell, event)
    },
    handlePageChange(page) {
      if (this.url) {
        this.params.page = page
        this.load()
      } else {
        this.$emit('current-change', page)
      }
    },
    handleEdit(index, row) {
      this.$emit('handleEdit', index, row)
    },
    conditionChange(value) {
      if (this.url) {
        this.params.searchText = value
      } else {
        this.$emit('input', value)
      }
    },
    clear(value) {
      this.params.searchText = value
      this.load()
    },
    search() {
      if (this.url) {
        this.params.page = 1
        this.load()
      } else {
        this.$emit('onSearch')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.include-others {
  display: inline-block;
  margin-left: 10px;
}
.tab {
  margin: 24px;
  margin-top: 0;
  border-radius: 6px;
}
.delete-row, .edit-row {
  font-size:14px;
  font-weight:400;
  color:rgba(255,75,100,1);
  cursor: pointer;
}
.edit-row {
  color: #009C9C;
  margin-right: 5px;
}
.tab {
  cursor: pointer;
  background-color: #fff;
  padding: 15px 24px 15px 24px;
}
.append-container {
  display: flex;
  justify-content: space-between;
  .total-members {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    margin-left: 10px;
    display: inline-block;
    max-width: 500px;
  }
  .bottom-operator {
    display: flex;
    align-items: center;
  }
}
.bottom-pagination {
  margin-top: 10px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
}

</style>

<style rel="stylesheet/scss" lang="scss">
.tab {

.el-table thead {
  color: #606266 !important;
  font-weight: 600;
}
.el-table tr {
  font-weight: normal;
}
.tipIcon {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 50%;
  transform: translate(30%, -50%);
}
.some-tip {
  &__content {
    max-width: 500px;
  }
}
.el-pagination li.active {
  color: #F76262 !important;
}
.el-pagination li:hover {
  color: #F76262 !important;
}

.el-menu-item.is-active {
  background-color: #263445 !important;
}
.el-table--medium td {
  padding: 17px 0;
}
}
.checkbox--style {
  display: block!important;
}

</style>
