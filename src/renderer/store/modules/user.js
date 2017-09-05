const state = {
  id: null,
  username: null,
  rank: null,
  god: null
}

const getters = {}

const mutations = {
  SET_USER (state, user) {
    Object.assign(state, user)
  }
}

const actions = {
  async SET_USER ({ commit }, user) {
    commit('SET_USER', user)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
