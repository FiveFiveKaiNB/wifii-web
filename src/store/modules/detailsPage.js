const state = {
  visible: false,
  type: ''
}

const mutations = {
  SET_VISIBLE: (state, visible) => {
    state.visible = visible
  },
  SET_TYPE: (state, type) => {
    state.type = type
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
