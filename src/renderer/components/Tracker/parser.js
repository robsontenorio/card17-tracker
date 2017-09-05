import Vue from 'vue'
import _ from 'lodash/collection'

let parser = {
  // GET USER INFO
  user (data) {
    try {
      let i = data.match(/\|dr:you\|t:ACCOUNT\|id:(.*?)\|/i)[1]
      let username = data.match(/\|userName:(.*?)\|/i)[1]
      let r = data.match(/\|constructedRank:(.*?)\|/i)[1]
      let g = data.match(/\|constructedGodRank:(.*?)\|/i)[1]

      let user = {
        id: parseInt(i),
        rank: parseInt(r),
        god: parseInt(g),
        username
      }

      return user
    } catch (e) {
      throw new Error(Vue.$t('Error fetching user information'))
    }
  },
  // GET USER`S DECK LIST
  decks (data) {
    try {
      let reDecks = /\|dr:decks\|t:DECK\|id:(\d*)\|name:(.*?)\|/g
      let deck
      let decks = []

      // mount array of decks. ignore PANDORA decks
      while ((deck = reDecks.exec(data)) != null) {
        if (deck[2] !== 'ARENA_RUN_DECK_NAME') {
          let cards = this.cards(data, deck[1])
          let cGolden = this.cards(data, deck[1], true)
          cards = this.mergeCards(cards, cGolden)

          decks.push({id: parseInt(deck[1]), nome: deck[2], cards})
        }
      }

      return decks
    } catch (e) {
      throw new Error(Vue.$t('Error getting list of decks'))
    }
  },
  // GET CARDS FROM DECK
  cards (data, deckId, goldenCard = false) {
    try {
      let regex
      if (goldenCard) {
        regex = regex = new RegExp('deck' + deckId + '\\|t:GOLD_CARD\\|(.*?)\\n', 'i')
      } else {
        regex = new RegExp('deck' + deckId + '\\|t:CARD\\|(.*?)\\n', 'i')
      }

      let cards = data.match(regex)

      if (cards === null) {
        return []
      }

      cards = cards[1]

      cards = cards.split('|').map(x => {
        let d = x.split(':')
        return {id: parseInt(d[0]), total: parseInt(d[1])}
      })

      return cards
    } catch (e) {
      throw new Error(Vue.$t('Error retrieving list of cards from one of the decks'))
    }
  },
  // GET DECK ID
  deckId (data) {
    try {
      let id = data.match(/setQuantity\|dr:deck(.*?)\|/i)[1]
      return parseInt(id)
    } catch (e) {
      throw new Error(Vue.$t('Error identifying deck'))
    }
  },
  // GET SELECTED DECK TO PLAY
  pickedDeckId (data) {
    try {
      let id = data.match(/pickedDeckId:(.*?)\|/i)[1]
      return parseInt(id)
    } catch (e) {
      throw new Error(Vue.$t('Error selecting deck'))
    }
  },
  // OPONNENT INFO
  oponnent (data) {
    try {
      // ignore oponnent identifying when match ended
      if (data.indexOf('$remove') > 0) {
        return null
      }

      let id = data.match(/id:(.*?)\|/i)[1]
      let username = data.match(/userName:(.*?)\|/i)[1]

      let oponnent = {
        id: parseInt(id),
        username
      }

      return oponnent
    } catch (e) {
      throw new Error(Vue.$t('Error while identifying opponent'))
    }
  },
  playerNum (data) {
    try {
      let num = data.match(/iam\|(.*?)\n/i)[1]
      return parseInt(num)
    } catch (e) {
      throw new Error(Vue.$t('Error identifying player number (playerNum)'))
    }
  },
  playerNumMulligan (data) {
    try {
      let num = data.match(/mulliganConfirm\|(.*?)\n/i)[1]
      return parseInt(num)
    } catch (e) {
      throw new Error(Vue.$t('Error identifying player number (mulligan)'))
    }
  },
  createdCards (data, seqCards) {
    try {
      let c
      let cards = []
      let rCards = /createGameCard\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(0|1)/g

      while ((c = rCards.exec(data)) != null) {
        // ignore lands and "special card" (?) from beginning of game
        if (c[0].indexOf('land') > 0 || c[0].indexOf('9999') > 0) {
          continue
        }

        let card = {
          seq: parseInt(c[1]),
          id: parseInt(c[2]),
          playerNum: parseInt(c[3])
        }

        // card already used/revealed
        // card not revealed
        // explore
        let seq = card.seq.toString() + '-' + card.id.toString()
        if (seqCards.includes(seq) || card.id === 323 || card.id === 0) {
          continue
        }
        cards.push(card)
      }

      return cards
    } catch (e) {
      throw new Error(Vue.$t('Card not found'))
    }
  },
  result (data) {
    try {
      return data.match(/END_GAME\|message:(.*?)\n/i)[1]
    } catch (e) {
      throw new Error(Vue.$t('Error identifying winner'))
    }
  },
  // it generated in my hand a card was not originally in the deck
  addToHandPlayerNum (data) {
    try {
      let num = data.match(/AddToHand\|(.*?)\|(.*?)\n/i)[2]
      return parseInt(num)
    } catch (e) {
      throw new Error(Vue.$t('Error getting player number (addToHand)'))
    }
  },
  // identifying player turn
  turnPlayerNum (data) {
    try {
      let num = data.match(/~newTurn\|(.*?)\|/i)[1]
      return parseInt(num)
    } catch (e) {
      throw new Error(Vue.$t('Erro ao obter número do jogador (turno)'))
    }
  },
  // merge cards normal and mythic (golden cards)
  mergeCards (normalCards, goldenCards) {
    _.forEach(goldenCards, o => {
      if (_.map(normalCards, 'id').includes(o.id)) {
        let c = normalCards.find(x => x.id === o.id)
        c.total += o.total
      } else {
        normalCards.push(o)
      }
    })

    return normalCards
  }
}

export default parser
