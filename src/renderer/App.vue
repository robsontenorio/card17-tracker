<template>
<div id="app">
  <div class="container">
    <router-view></router-view>
  </div>
  <div class="toolbar has-text-right">
    <i class="fa fa-minus" @click="minimize()"></i><i class="fa fa-times" @click="close()"></i>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import db from '@/datastore'

export default {
  name: 'card17-tracker',
  created () {
    this.LOAD_COMMON()
    this.$i18n.locale = db.get('locale')
  },
  methods: {
    ...mapActions([
      'LOAD_COMMON'
    ]),
    minimize () {
      this.$electron.remote.getCurrentWindow().minimize()
    },
    close () {
      if (confirm(this.$t('Do you really want to quit?'))) {
        this.$electron.remote.getCurrentWindow().close()
      }
    }
  }
}
</script>

<style scoped>
.toolbar {
  width: 50px;
  position: absolute;
  right: 15px;
  top: 3px;
}

.toolbar i {
  margin-left: 8px;
  margin-top: 5px;
  color: white;
  cursor: pointer !important;
  font-size: 11pt;
}

.toolbar i:hover {
  color: gray;
}

.toolbar .fa-times {
  color: #da3030;
}

.toolbar .fa-minus {
  margin-top: 6px;
}
</style>
