const state = {
  list: [],
  drafting: {}
}

const getters = {}

const mutations = {
  SET_DECKS (state, decks) {
    Object.assign(state.list, decks)
  },
  UPDATE_DECK (state, deck) {
    let index = state.list.findIndex(x => x.id === deck.id)
    state.list[index] = deck
  }
}

const actions = {
  // set user`s deck list
  async SET_DECKS ({ commit }, decks) {
    commit('SET_DECKS', decks)
  },
  //  update user deck (and it cards)
  async UPDATE_DECK ({ commit }, deck) {
    commit('UPDATE_DECK', deck)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
