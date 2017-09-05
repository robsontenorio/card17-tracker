const state = {
  searching: false,
  started: false,
  mulliganConfirmed: false,
  turnPlayerNum: null,
  seqCards: [], // card stack  with "sequencial ids", in order to avoid double card counting
  pickedDeckId: null,
  me: {
    id: null,
    username: null,
    playerNum: 0,
    deck: {
      id: null,
      cards: []
    }
  },
  oponnent: {
    id: null,
    username: null,
    playerNum: 0,
    deck: {
      cards: []
    }
  }
}

const getters = {}

const mutations = {
  // set selected deck for the current match
  SET_MATCH_DECK (state, deck) {
    Object.assign(state.me.deck, deck)
    state.pickedDeckId = deck.id
  },
  // set match status: searching , mulligan confirmed ...
  SET_MATCH_STATUS (state, status) {
    // TODO let p = state.`${status.prop}` ??
    if (status.prop === 'searching') {
      state.searching = status.value
    } else if (status.prop === 'mulliganConfirmed') {
      state.mulliganConfirmed = status.value
    }
  },
  // set basic player info
  SET_MATCH_PLAYER_INFO (state, player) {
    if (player.who === 'me') {
      state.me.id = player.user.id
      state.me.username = player.user.username
    } else {
      state.oponnent.id = player.user.id
      state.oponnent.username = player.user.username
    }
  },
  // set player number (0 or 1)
  SET_MATCH_PLAYER_NUM (state, iam) {
    state.me.playerNum = iam
    state.oponnent.playerNum = (iam === 1) ? 0 : 1
  },
  // is this my turn?
  SET_MATCH_PLAYER_TURN (state, num) {
    state.turnPlayerNum = num
  },
  // begin!
  START_MATCH (state) {
    state.started = true
    state.searching = false
  },
  //  let`s play again?
  RESET_MATCH (state) {
    state.started = false
    state.mulliganConfirmed = false
    state.seqCards = []
    state.turnPlayerNum = null
    state.me.playerNum = 0
    state.oponnent = {
      id: null,
      username: null,
      playerNum: 0,
      deck: {
        cards: []
      }
    }
  },
  // add card always to oponnent`s decks. because we dont know what deck is playing
  ADD_MATCH_CARD (state, card) {
    state.oponnent.deck.cards.push(card)
  },
  // update an existent card on deck from this match
  UPDATE_MATCH_CARD (state, item) {
    let deck
    if (item.who === 'me') {
      deck = state.me.deck
    } else {
      deck = state.oponnent.deck
    }

    let index = deck.cards.findIndex(x => x.id === item.card.id)

    deck.cards.splice(index, 1, item.card)
  },
  // fully update a deck list from this match. generally for ordering cards
  UPDATE_MATCH_DECK (state, item) {
    let deck
    if (item.who === 'me') {
      deck = state.me.deck
    } else {
      deck = state.oponnent.deck
    }

    // TODO deck never used error?
    if (deck) { deck = item.deck }
  },
  ADD_SEQ_CARD (state, seq) {
    state.seqCards.push(seq)
  }
}

const actions = {
  async SET_MATCH_DECK ({ commit }, deck) {
    commit('SET_MATCH_DECK', deck)
  },
  async SET_MATCH_STATUS ({ commit }, status) {
    commit('SET_MATCH_STATUS', status)
  },
  async START_MATCH ({ commit }) {
    commit('START_MATCH')
  },
  async RESET_MATCH ({ commit }) {
    commit('RESET_MATCH')
  },
  async SET_MATCH_PLAYER_INFO ({ commit }, player) {
    commit('SET_MATCH_PLAYER_INFO', player)
  },
  async SET_MATCH_PLAYER_NUM ({ commit }, iam) {
    commit('SET_MATCH_PLAYER_NUM', iam)
  },
  async SET_MATCH_PLAYER_TURN ({ commit }, num) {
    commit('SET_MATCH_PLAYER_TURN', num)
  },
  async ADD_MATCH_CARD ({ commit }, card) {
    commit('ADD_MATCH_CARD', card)
  },
  async UPDATE_MATCH_CARD ({ commit }, item) {
    commit('UPDATE_MATCH_CARD', item)
  },
  async UPDATE_MATCH_DECK ({ commit }, item) {
    commit('UPDATE_MATCH_DECK', item)
  },
  async ADD_SEQ_CARD ({ commit }, seq) {
    commit('ADD_SEQ_CARD', seq)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
