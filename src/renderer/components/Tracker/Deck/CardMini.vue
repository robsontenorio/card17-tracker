<template>
<div>

  <div class="card-mini" :style="`background-image: url(${API_URL}/cards/mini/${card.metadata.card_id}_minicard.png)`">
    <div class="card-mini-mask">
      <div class="columns is-mobile is-marginless">
        <div class="column is-paddingless block1">
          <span class="faeria">{{card.metadata.faeria}}</span>
          <span class="lands">
          <span class="land forest" v-if="card.metadata.forest">{{ card.metadata.forest }}</span>
          <span class="land lake" v-if="card.metadata.lake">{{ card.metadata.lake }}</span>
          <span class="land mountain" v-if="card.metadata.mountain">{{ card.metadata.mountain }}</span>
          <span class="land desert" v-if="card.metadata.desert">{{ card.metadata.desert }}</span>
          <span class="land wild" v-if="card.metadata.gold">{{ card.metadata.gold }}</span>
          <span class="card-name">{{ card.nome }}</span>
          </span>
        </div>
        <div class="column is-paddingless is-1 column-total">
          <span class="card-total" :class="{'empty' : card.total === 0 }">{{ card.total}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'card-mini',
  props: ['card']
}
</script>

<style lang="scss" scoped>
@import './src/renderer/scss/variables.scss';

.image {
    display: inline-block;
}

.card-mini-mask {
    background-image: linear-gradient(to right, #000 1px, #1e2e05 40%, rgba(30, 46, 5, 0) 100%);
    // padding-bottom: 5px;
    border-radius: 3px;
    height: 26px;
}

.card-mini {
    background-position: right;
    background-repeat: no-repeat;
    // margin-bottom: 1px;
    border-radius: 3px;
    // cursor: pointer;
}

.card-name {
    color: white;
    font-size: 9pt;
    font-weight: 500;
}

.block1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
    color: white;
}

.card-total {
    color: white;
    background-color: black;
    border-radius: 3px;
    font-size: 9pt;
    padding: 3px;
    font-weight: bold;
}

.card-total.empty {
    background-color: #f56954;
}

.land {
    width: 22px;
    height: 22px;
    display: inline-grid;
    text-align: center;
    margin-left: -5px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: bottom;
    font-weight: bold;
    font-size: 11pt;
    padding-top: 3px;
    background-origin: padding-box;
}
.land:not(:first-child) {
    margin-left: -8px;
}

.forest {
    color: $forest;
    background-image: url("https://card17.com/static/images/lands/card_cost_green.png");
}

.desert {
    background-image: url("https://card17.com/static/images/lands/card_cost_yellow.png");
    color: $desert;
}

.mountain {
    color: $mountain;
    padding-left: 2px;
    background-image: url("https://card17.com/static/images/lands/card_cost_red.png");
}

.lake {
    color: $lake;
    background-image: url("https://card17.com/static/images/lands/card_cost_blue.png");
}

.wild {
    background-image: url("https://card17.com/static/images/lands/card_cost_wild.png");
    color: white;
    background-size: contain;
    font-size: 11pt;
    background-origin: content-box;
    padding-bottom: 0;
    padding-top: 2px;
    padding-left: 2px;
}

.faeria {
    color: black;
    font-weight: 600;
    font-size: 8pt;
    display: inline-block;
    background: url("https://card17.com/static/images/faeria-ball.png") 0 -1px;
    width: 22px;
    height: 22px;
    text-align: center;
    background-size: contain;
    background-repeat: no-repeat;
    padding-top: 3px;
    padding-bottom: 2px;
    line-height: inherit;
    vertical-align: bottom;
}
.column-total {
    // padding-top: 3px !important;
}
</style>
