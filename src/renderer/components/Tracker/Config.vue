<template>
<div v-if="config">
  <div class="config-content">
    <div class="columns is-mobile">
      <div class="column">
        {{ $t('Notifications') }}
      </div>
      <div class="column is-5">
        <b-switch type="primary" :checked="config.notificacoes" v-model="config.notificacoes" size="small"></b-switch>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        {{ $t('Automatic turn') }}
      </div>
      <div class="column is-5">
        <b-switch type="primary" :checked="config.turnoAutomatico" v-model="config.turnoAutomatico" size="small"></b-switch>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        {{ $t('Language') }}
      </div>
      <div class="column is-5">
        <span class="select is-small">
            <select @change="setLocale()" v-model="config.locale">
                <option>en</option>
                <option>es</option>
                <option>fr</option>
                <option>de</option>
                <option>br</option>
                <option>ko</option>
              </select>
            </span>
      </div>
    </div>
    <div class="columns is-mobile">
      <div class="column">
        {{ $t('Window height') }}
      </div>
      <div class="column is-5">
        <div class="field has-addons">
          <p class="control">
            <button class="button is-small" @click="setHeight('less')"><b-icon size="is-small" icon="minus"></b-icon></button>
          </p>
          <p class="control">
            <button class="button is-small" @click="setHeight('more')"><b-icon size="is-small" icon="plus"></b-icon></button>
          </p>
        </div>
      </div>
    </div>
    <div class="drag has-text-centered">
      <i class="fa fa-arrows drag"></i>
      <div>
        <small>{{ $t('click and drag') }}</small>
      </div>
    </div>
  </div>
  <div id="status">
    {{ $electron.remote.app.getVersion() }}</span> | www.card17.com/tracker
  </div>
</div>
</template>

<script>
export default {
  name: 'config-page',
  data () {
    return {
      config: null
    }
  },
  async created () {
    this.config = await this.$db.get()
  },
  watch: {
    'config.notificacoes' () {
      let config = this.$db
      config.set('notificacoes', this.config.notificacoes)
    },
    'config.turnoAutomatico' () {
      let config = this.$db
      config.set('turnoAutomatico', this.config.turnoAutomatico)
    }
  },
  methods: {
    async setHeight (tipo) {
      let win = this.$electron.remote.getCurrentWindow()
      let size = win.getSize()
      let inc = (tipo === 'more') ? 10 : -10
      let height = size[1] + inc

      win.setSize(size[0], height)
      let config = this.$db
      config.set('janela.height', height)
    },
    async setLocale () {
      this.$i18n.locale = this.config.locale
      let config = this.$db
      config.set('locale', this.config.locale)

      this.$toast.open({
        message: this.$t('You must restart the DECK TRACKER for the translation to take effect in the cards'),
        position: 'is-bottom',
        type: 'is-warning'
      })
    }
  }
}
</script>

<style scoped>
.config-content {
  margin-bottom: 20px;
  margin-top: 10px;
  font-size: 10pt;
  color: smokewhite;
}

.fa-arrows {
  font-size: 30pt;
  margin-bottom: 5px;
}

.column {
  padding-bottom: 5px;
}

#status {
  font-size: 8pt;
}
</style>
