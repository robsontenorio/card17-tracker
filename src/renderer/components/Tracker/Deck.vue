<template>
<div class="no-selection">
  <div v-if="showYak" class="subtitle has-text-centered">
    <br><br>
    <img class="yak" :src="`static/yaks/yak${yak}.png`" /><br><br> {{ $t('Let`s play?')}}
  </div>
  <div v-if="match.searching" class="subtitle has-text-centered">
    <br><br>
    <img src="static/loading.gif" />
    <br><br> {{ $t('Searching match') }}
  </div>
  <card-mini-list v-if="match.started" :cards="deck.cards"></card-mini-list>
</div>
</template>

<script>
import { mapState } from 'vuex'
import CardMiniList from './Deck/CardMiniList'

export default {
  name: 'deck',
  props: ['deck'],
  components: { CardMiniList },
  data() {
    return {
      yak: this.getYak()
    }
  },
  computed: {
    ...mapState([
      'match'
    ]),
    showYak: state => { return !state.match.searching && !state.match.started }
  },
  methods: {
    // generate a random yak
    getYak() {
      return Math.floor(Math.random() * 10)
    }
  },
  watch: {
    // just give me a random yak when we are not searching for a match or game ended
    'showYak' () {
      this.yak = this.getYak()
    }
  }
}
</script>

<style lang="scss" scoped>
.yak {
    height: 120px;
}
</style>
