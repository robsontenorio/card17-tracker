<template>
<div>
  <div v-if="!user.id">
    <splash-waiting></splash-waiting>
  </div>
  <div v-if="user.id" class="tracker-container">
    <b-tabs v-model="activeTab" size="is-small">
      <b-tab-item :label="$t('Me')">
        <deck :deck="match.me.deck"></deck>
      </b-tab-item>
      <b-tab-item :label="$t('Opponent')">
        <deck :deck="match.oponnent.deck"></deck>
      </b-tab-item>
      <b-tab-item :label="$t('Decks')">
        <div class="no-selection">
          <decks></decks>
        </div>
      </b-tab-item>
      <b-tab-item label="" icon="gear">
        <config></config>
      </b-tab-item>
    </b-tabs>
  </div>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import SplashWaiting from './Tracker/SplashWaiting'
import Deck from './Tracker/Deck'
import Decks from './Tracker/Decks'
import Config from './Tracker/Config'
import pcap from './Tracker/pcap.js'
import parser from './Tracker/parser.js'
import _ from 'lodash'

export default {
  name: 'tracker',
  components: {
    SplashWaiting,
    Deck,
    Decks,
    Config
  },
  data () {
    return {
      activeTab: 0,
      mergeGoldenCards: false,
      addToHand: 0
    }
  },
  async created () {
    try {
      this.start()
    } catch (e) {
      this.$toast.open({
        message: e.message,
        position: 'is-bottom',
        type: 'is-danger'
      })
    }
  },
  computed: {
    ...mapState([
      'common',
      'user',
      'decks',
      'match'
    ])
  },
  methods: {
    ...mapActions([
      // user
      'SET_USER',
      // decks
      'SET_DECKS',
      'UPDATE_DECK',
      // match
      'SET_MATCH_DECK',
      'SET_MATCH_STATUS',
      'SET_MATCH_PLAYER_INFO',
      'SET_MATCH_PLAYER_NUM',
      'SET_MATCH_PLAYER_TURN',
      'START_MATCH',
      'RESET_MATCH',
      'ADD_MATCH_CARD',
      'UPDATE_MATCH_CARD',
      'UPDATE_MATCH_DECK',
      'ADD_SEQ_CARD'
    ]),
    orderCards (cards) {
      return _.sortBy(cards, [
        function (o) {
          let color = o.metadata.color
          let forest = o.metadata.forest
          let mountain = o.metadata.mountain
          let lake = o.metadata.lake
          let desert = o.metadata.desert

          if (color === 'HUMAN') {
            if (forest || mountain || lake || desert) {
              return 'zzzzz'
            } else {
              return '0'
            }
          } else {
            return color
          }
        },
        'metadata.faeria', 'metadata.mountain', 'metadata.lake', 'metadata.forest', 'metadata.desert', 'nome'
      ])
    },
    resetMatch () {
      this.addToHand = 0
      this.activeTab = 0

      // adjust window
      let win = this.$electron.remote.getCurrentWindow()
      let atualWidth = win.getSize()[0]
      win.setSize(atualWidth, 360)

      // reset match parameters
      this.RESET_MATCH()
    },
    // SELECTED DECK TO PLAY
    setDeck (deckId) {
      // my deck cards on simple format: {id, name, cards: {id, total} }
      let deck = _.cloneDeep(this.decks.list.find(x => x.id === deckId))

      // full detailed card list from card17 online database (name, rarity, colors ...)
      let cards = _.cloneDeep(this.common.cards.filter(x => _.map(deck.cards, 'id').includes(x.id)))

      // filter 'full card list' based on 'my deck' adding total of cards
      cards = cards.map(x => {
        let t = deck.cards.find(y => y.id === x.id).total
        x.total = t
        return x
      })

      deck.cards = this.orderCards(cards)

      this.SET_MATCH_DECK(deck)

      if (this.match.started) {
        this.adjustWindow(deck.cards.length)
      }
    },
    // smart window adjustment based on total of cards from deck
    adjustWindow (totalCards) {
      let height = (totalCards * 26) + 50
      let win = this.$electron.remote.getCurrentWindow()
      let currentHeight = win.getSize()[1]
      if (height > currentHeight) {
        if (height < 470) {
          win.setSize(win.getSize()[0], height)
        } else {
          win.setSize(win.getSize()[0], 470)
        }
      } else {
        win.setSize(win.getSize()[0], 360)
      }
    },
    // start packet listener
    start () {
      try {
        let config = this.$db
        let tcp = pcap.start()

        // packet sent from Faeria?
        tcp.cap.c.on('packet', (nbytes, trunc) => {
          try {
            // prepare initial data buffer until login procedure ends
            let data = pcap.prepare()
            if (data.loggedIn === false || data === '') {
              return
            }

            // do not show lands on console log
            if (data.indexOf('land') === -1) {
              console.log(data)
            }

            // initial data packet containing user info and his decks
            if (data.indexOf('|dr:you') > 0) {
              let user = parser.user(data)
              let decks = parser.decks(data)
              this.SET_USER(user)
              this.SET_DECKS(decks)
              this.SET_MATCH_PLAYER_INFO({ user, who: 'me' })
            }

            // selected deck to play
            if (data.indexOf('|pickedDeckId') > 0) {
              this.setDeck(parser.pickedDeckId(data))
            }

            // update deck`s cards
            if (data.indexOf('|$setQuantity') > 0 && data.indexOf('|dr:you') === -1) {
              let deckId = parser.deckId(data)
              if (deckId !== null) {
                let deck = _.cloneDeep(this.decks.list.find(x => x.id === deckId))

                if (data.indexOf('GOLD_CARD') > 0) {
                  deck.cards = parser.cards(data, deckId, true)
                  this.mergeGoldenCards = true
                } else {
                  if (this.mergeGoldenCards) {
                    deck.cards = parser.mergeCards(parser.cards(data, deckId), deck.cards)
                    this.mergeGoldenCards = false
                  } else {
                    deck.cards = parser.mergeCards(parser.cards(data, deckId), [])
                  }
                }

                this.UPDATE_DECK(deck)
                this.SET_MATCH_DECK(deck)
              }
            }

            // start searching  match
            if (data.indexOf('|$startFindGame') > 0) {
              this.SET_MATCH_STATUS({ prop: 'searching', value: true })
            }

            // stop searching match
            if (data.indexOf('|$stopFindGame') > 0) {
              this.SET_MATCH_STATUS({ prop: 'searching', value: false })
            }

            // indentify player number in this match (0 or 1)
            if (data.indexOf('|~iam') > 0) {
              let iam = parser.playerNum(data)
              this.SET_MATCH_PLAYER_NUM(iam)
            }

            // match started
            if (data.indexOf('|$startGame') > 0) {
              // avoid resume match in case of desconnection
              if (this.match.started === true) {
                // this.match.pesquisando = false
                // this.match.started = false
                // this.match.mulliganConfirmed = false
                // this.activeTab = 0
                throw new Error(this.$t('Connection lost. We will begin tracking in the next match. :('))
              }

              this.setDeck(this.match.pickedDeckId)
              this.START_MATCH()

              if (config.get('notificacoes') === true) {
                let myNotification = new Notification(this.$t('Match started'), {
                  body: this.$t('Good luck :)')
                })
                myNotification.onclick = () => {
                  console.log('Notification clicked')
                }
              }
            }

            // mulligan confirmed by me
            if (data.indexOf('|$mulliganConfirm') > 0) {
              this.SET_MATCH_STATUS({ prop: 'mulliganConfirmed', value: true })
            }

            // identify oponnent
            if (data.indexOf('|dr:gameMembers') > 0 || data.indexOf('|dr:opponent') > 0) {
              let user = parser.oponnent(data)
              if (user !== null) {
                this.SET_MATCH_PLAYER_INFO({ user, who: 'oponnent' })
              }
            }

            // match ended
            if (data.indexOf('END_GAME') > 0) {
              let msg

              if (parser.result(data) === 'VICTORY') {
                msg = this.$t('Win')
              } else {
                msg = this.$t('Loss')
              }

              this.$toast.open({ message: msg, type: 'is-warning', position: 'is-bottom', actionText: null })

              this.resetMatch()
            }

            // counter of generated cards was not on my original deck (Ex: Spellwhirl or Guards generated from Hold the Line).
            // do not count this cards
            // only after mulligan confirmed
            if (data.indexOf('|#AddToHand') > 0 && data.indexOf('|*createGameCard') === -1 && this.match.mulliganConfirmed === true) {
              if (this.match.me.playerNum === parser.addToHandPlayerNum(data)) {
                this.addToHand++
              }
            }

            // identify player turn
            if (data.indexOf('~newTurn') > 0 && this.match.mulliganConfirmed === true && config.get('turnoAutomatico') === true) {
              this.SET_MATCH_PLAYER_TURN(parser.turnPlayerNum(data))
              if (this.match.me.playerNum !== this.match.turnPlayerNum) {
                console.log('-------- OPONNENT`S TURN --------')
                this.activeTab = 1
              }
            }

            // identify player turn
            if (data.indexOf('turnTimerSet') > 0 && this.match.mulliganConfirmed === true && config.get('turnoAutomatico') === true) {
              if (this.match.me.playerNum === this.match.turnPlayerNum) {
                console.log('-------- MY TURN --------')
                this.activeTab = 0
              }
            }

            // listen for cards created on match
            if (data.indexOf('|*createGameCard') > 0 && this.match.mulliganConfirmed === true) {
              let cards = parser.createdCards(data, this.match.seqCards)
              console.log('---- LOOP START ----')
              for (let card of cards) {
                let seq = card.seq.toString() + '-' + card.id.toString()

                // control of AddToHand
                // ignore exlpore
                if ((this.addToHand > 0 && this.match.me.playerNum === card.playerNum) || card.id === 323) {
                  this.addToHand -= 1
                  this.ADD_SEQ_CARD(seq)
                  continue
                }

                // if a card already has been revealed.
                // also ignore creature death events
                if (this.match.seqCards.includes(seq)) {
                  continue
                }

                // supresss oponnent card revelation  (addToHand)
                // When opponent plays, ex, SpellWhirl, do not reveal this cards
                // TODO currently there is a bug on Faeria, it suposed do not reveal opponent`s card ID
                if (card.playerNum === this.match.oponnent.playerNum && data.indexOf(`${card.seq}|outOfGame`) > 0) {
                  continue
                }

                this.ADD_SEQ_CARD(seq)

                let deck
                let who

                if (this.match.me.playerNum === card.playerNum) {
                  deck = this.match.me.deck
                  who = 'me'
                } else {
                  deck = this.match.oponnent.deck
                  who = 'oponnent'
                }

                deck = _.cloneDeep(deck)
                let foundCard = _.cloneDeep(this.common.cards.find(x => x.id === card.id))

                // card exsists on card17 database ? Igore newly released cards from Faeria
                if (foundCard !== undefined) {
                  console.log('SEARCHED CARD --->' + '(' + card.seq + ')' + '(' + foundCard.id + ')' + '(' + card.playerNum + ')' + foundCard.nome)
                  let c = _.cloneDeep(deck.cards.find(x => x.id === card.id))

                  // is it an existent card in mine or oponnent`s deck ?
                  if (c !== undefined) {
                    // this is my card
                    if (this.match.me.playerNum === card.playerNum) {
                      console.log('FOR ME')
                      if (c.total > 0) {
                        c.total -= 1
                        this.UPDATE_MATCH_CARD({ card: c, who })
                      }
                      // oponnent`s card
                    } else {
                      console.log('(EXISTENT) FOR OPONNENT')
                      c.total += 1
                      this.UPDATE_MATCH_CARD({ card: c, who })
                    }
                    // so it belongs to oponnet`s deck
                  } else {
                    if (this.match.oponnent.playerNum === card.playerNum) {
                      console.log('(NEW) FOR OPONNENT')
                      foundCard.total = 1
                      this.ADD_MATCH_CARD(foundCard)
                    }
                  }

                  deck.cards = this.orderCards(deck.cards)
                  this.UPDATE_MATCH_DECK({ deck, who })
                }
              }
              console.log('---- LOOP END ----')
            }
          } catch (e) {
            this.$toast.open({
              message: e.message,
              position: 'is-bottom',
              type: 'is-danger'
            })
          }
        })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style scoped>
</style>
