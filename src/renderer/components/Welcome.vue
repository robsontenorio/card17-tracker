<template>
<div>
  <div v-if="escolherLocale" class="has-text-centered">
    <br>
    <h1>Select your language</h1>
    <br><br>
    <div class="columns is-mobile has-text-centered">
      <div class="column">
        <img src="static/flags/brazil.png" @click="setLocale('br')" />
      </div>
      <div class="column">
        <img src="static/flags/uk.png" @click="setLocale('en')" />
      </div>
      <div class="column">
        <img src="static/flags/spain.png" @click="setLocale('es')" />
      </div>
    </div>
    <div class="columns is-mobile has-text-centered">
      <div class="column is-4">
        <img src="static/flags/korea.png" @click="setLocale('ko')" />
      </div>
      <div class="column">
        <img src="static/flags/germany.png" @click="setLocale('de')" />
      </div>
      <div class="column">
        <img src="static/flags/france.png" @click="setLocale('fr')" />
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'welcome-page',
  data () {
    return {
      escolherLocale: false,
      config: null
    }
  },
  async created () {
    let config = await this.$db
    if (config.get('notificacoes') !== undefined) {
      this.$i18n.locale = config.get('locale')
      this.$router.push('/tracker')
    } else {
      this.escolherLocale = true
    }
  },
  methods: {
    async setLocale (l) {
      this.$i18n.locale = l

      let win = this.$electron.remote.getCurrentWindow()
      let size = win.getSize()
      let pos = win.getPosition()

      let config = await this.$db
      config.set('locale', l)
      config.set('notificacoes', false)
      config.set('turnoAutomatico', false)
      config.set('janela.x', pos[0])
      config.set('janela.y', pos[1])
      config.set('janela.width', size[0])
      config.set('janela.height', size[1])

      this.$router.push('/tracker')
    }
  }
}
</script>

<style scoped>
img {
  width: 50px;
  cursor: pointer;
}
</style>
