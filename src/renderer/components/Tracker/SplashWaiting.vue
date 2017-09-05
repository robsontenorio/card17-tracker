<template>
<div class="welcome-login drag">
  <div class="has-text-centered">
    <br><br><br><br>
    <img src="static/loading.gif" width="100" />
    <br><br>
    <h2 class="subtitle has-text-centered">{{ $t('Waiting FAERIA') }}</h2>
    <br>
  </div>
  <div class="info">
    <span v-html="$t('The DECK TRACKER should <b>always</b> be started before FAERIA. If the game is running close it and reopen it')"></span>
  </div>
</div>
</template>

<script>
export default {
  name: 'splash-waiting'
}
</script>

<style lang="scss" scoped>
.welcome-login .info {
    min-width: 0;
    color: inherit;
    font-size: 9pt;
    background-color: #000 !important;
    border-top: 1px dotted #c0c0c0;
    padding: 10px;
    // margin: 0 -10px;
    position: fixed;
    bottom: 0;
    left: 0;
}
</style>
