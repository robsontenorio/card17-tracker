import { commonAPI } from '@/api'
import db from '@/datastore'

const state = {
  cartas: [],
  tipos: [],
  arquetipos: [],
  modos: []
}

const getters = {}

const actions = {
  async LOAD_COMMON ({ commit }) {
    const response = await commonAPI.all({locale: db.get('locale')})
    response.data.cards = response.data.cartas // TODO translate backend to english
    commit('SET_COMMON', response.data)
  }
}

const mutations = {
  SET_COMMON (state, dados) {
    state = Object.assign(state, dados)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
