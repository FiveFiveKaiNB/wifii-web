export const props = {
  // 列表初始化时所需的参数
  myParams: {
    type: String,
    default: ''
  },
  myFilterChange: {
    type: String,
    default: ''
  },
  actionColumnText: {
    type: String,
    default: ''
  },
  // 延迟调用 load()
  notDelay: {
    type: Boolean,
    default: true
  },
  actionColumnAlign: {
    type: String,
    default: 'center'
  },
  cellStyle: {
    type: Function | Object,
    default: () => {}
  },
  cellClassName: {
    type: Function | String,
    default: () => ''
  },
  actionColumnBtnList: {
    type: Array,
    default: () => ([])
  },
  hasActionColumn: {
    type: Boolean,
    default: false
  },
  query: {
    type: Object,
    default: () => ({})
  },
  hasTabs: {
    type: Boolean,
    default: false
  },
  hasToolbar: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: ''
  },
  formatter: {
    type: Function,
    default: (row, column, cellValue) => cellValue
  },
  formatterPrice: {
    type: Function,
    default: (row, column, cellValue) => +(cellValue / 100).toFixed(2)
  },
  showTotal: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => ([])
  },
  fields: {
    type: Array,
    default: () => ([])
  },
  width: {
    type: String,
    default: ''
  },
  sortable: {
    type: String,
    default: ''
  },
  filters: {
    type: String,
    default: ''
  },
  showScope: {
    type: Boolean,
    default: false
  },
  stopIssuing: {
    type: Boolean,
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  confirmation: {
    type: Boolean,
    default: false
  },
  cancel: {
    type: Boolean,
    default: false
  },
  page: {
    default: 1,
    type: Number
  },
  total: {
    default: 0,
    type: Number
  },
  perPage: {
    default: 20,
    type: Number
  },
  unitText: {
    type: String,
    default: ''
  },
  operateBtnText: {
    type: String,
    default: '删除'
  },
  headerSlot: {
    type: String,
    default: ''
  },
  showScopeBtn: {
    type: Boolean,
    default: true
  }
}
