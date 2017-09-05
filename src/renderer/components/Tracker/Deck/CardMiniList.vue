<template>
<div>
  <div v-for="card in cards">
    <card-mini :card="card"></card-mini>
  </div>
  <div class="cards-empty" v-if="cards.length == 0">
    ?
  </div>
</div>
</template>

<script>
import CardMini from './CardMini'

export default {
  name: 'card-mini-list',
  props: ['cards'],
  components: {
    CardMini
  }
}
</script>

<style scoped>
.cards-empty {
  /*border: 3px dashed whitesmoke;*/
  text-align: center;
  padding: 20px;
  font-size: 100pt;
  font-weight: bold;
  color: white;
}
</style>
