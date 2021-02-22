// import {
//   getPointsMallGifts,
//   getRedeemRecords,
//   getPointsMallGiftsDetail,
//   updatePointsMallGifts,
//   addPointsMallGifts,
//   updateRedeemRecord
// } from '@/api/corp'

const state = {
  pointsMallGiftsList: [],
  pointsMallGiftsDetail: {},
  pagination: {
    page: 1,
    perPage: 15,
    total: 15
  },
  condition: {
    searchText: ''
  },
  redeemRecordList: [],
  redeemRecordPagination: {
    page: 1,
    perPage: 5,
    total: 5
  }
}

const mutations = {
  SET_REDEEM_RECORD_LIST: (state, list) => {
    state.redeemRecordList = list
  },
  SET_POINTS_MALL_GIFTS_LIST: (state, list) => {
    state.pointsMallGiftsList = list
  },
  SET_POINTS_MALL_GIFTS_DETAIL: (state, detail) => {
    state.pointsMallGiftsDetail = detail
  },
  SET_PAGINATION: (state, pagination) => {
    for (const key in pagination) {
      pagination[key] = parseInt(pagination[key])
    }
    state.pagination = Object.assign({}, state.pagination, pagination)
  },
  SET_REDEEM_RECORD_PAGINATION: (state, pagination) => {
    for (const key in pagination) {
      pagination[key] = parseInt(pagination[key])
    }
    state.redeemRecordPagination = Object.assign({}, state.redeemRecordPagination, pagination)
  },
  SET_CONDITION: (state, condition) => {
    state.condition = condition
  }
}

const actions = {
  // 修改兑换记录领取状态
  updateRedeemRecord({ state, commit }, id) {
    // return new Promise((resolve, reject) => {
    //   updateRedeemRecord(id).then(({ data }) => {
    //     resolve(data)
    //   }).catch(err => reject(err))
    // })
  },
  // 获取个人兑换记录
  getRedeemRecord({ state, commit }, corpId = window.localStorage.getItem('corpId')) {
    // return new Promise((resolve, reject) => {
    //   const params = Object.assign({}, state.redeemRecordPagination, { corpId })
    //   getRedeemRecords(params).then(({ data }) => {
    //     commit('SET_REDEEM_RECORD_PAGINATION', data.pagination)
    //     commit('SET_REDEEM_RECORD_LIST', data.list)
    //     resolve(data)
    //   }).catch(error => { reject(error) })
    // })
  },
  // 获取商城礼品
  getPointsMallGifts({ commit, state }, data) {
    // const params = Object.assign({}, data, state.pagination, { corpId: window.localStorage.getItem('corpId') })
    // return new Promise((resolve, reject) => {
    //   getPointsMallGifts(params).then(({ data: { list, pagination }}) => {
    //     commit('SET_POINTS_MALL_GIFTS_LIST', list)
    //     commit('SET_PAGINATION', pagination)
    //     resolve({ list, pagination })
    //   }).catch(error => { reject(error) })
    // })
  },
  // 获取商城礼品详情
  getPointsMallGiftsDetail({ state, commit }, id) {
    // return new Promise((resolve, reject) => {
    //   getPointsMallGiftsDetail(id).then(({ data }) => {
    //     commit('SET_POINTS_MALL_GIFTS_DETAIL', data)
    //     resolve(data)
    //   }).catch(error => { reject(error) })
    // })
  },
  // 更新商城礼品
  updatePointsMallGifts({ state, commit }, data) {
    // return new Promise((resolve, reject) => {
    //   updatePointsMallGifts(state.pointsMallGiftsDetail._id, data).then(({ data }) => {
    //     commit('SET_POINTS_MALL_GIFTS_DETAIL', data)
    //     resolve(data)
    //   }).catch(error => { reject(error) })
    // })
  },
  // 添加商城礼品
  addPointsMallGifts({ state, commit }, data) {
    // data = Object.assign({}, data, { corpId: window.localStorage.getItem('corpId') })
    // return new Promise((resolve, reject) => {
    //   addPointsMallGifts(data).then(({ data }) => {
    //     resolve(data)
    //   }).catch(error => { reject(error) })
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
