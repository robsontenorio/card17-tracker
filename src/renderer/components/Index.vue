<template>
<div>
  <br><br><br><br>
  <div v-if="checking" class="has-text-centered">
    <img src="static/loading.gif" width="100" />
  </div>
  <div v-if="fazendoDownload" class="has-text-centered">
    <img width="80px" src="static/downloading.gif" /> <br><br>
    <small>{{ $t('downloading update') }}</small>
    <br>
    <span class="progresso">{{ progresso }}</span> %
  </div>
</div>
</template>

<script>
export default {
  name: 'index-page',
  data () {
    return {
      ev: null,
      progresso: 0,
      checking: true,
      fazendoDownload: false
    }
  },
  async created () {
    let self = this

    if (process.platform === 'linux' || process.env.NODE_ENV === 'development') {
      setTimeout(function () {
        self.$router.push('/welcome')
      }, 1000)
    }

    this.$electron.ipcRenderer.on('download-progress', (ev, progress) => {
      self.checking = false
      self.fazendoDownload = true
      self.progresso = Math.floor(progress.percent)
    })

    this.$electron.ipcRenderer.on('update-not-available', () => {
      setTimeout(function () {
        self.$router.push('/welcome')
      }, 1000)
    })

    this.$electron.ipcRenderer.on('update-downloaded', () => {
      self.$electron.ipcRenderer.send('install-update')
    })

    this.$electron.ipcRenderer.on('error', (ev, msg) => {
      self.$toast.open({
        message: msg,
        position: 'is-bottom',
        type: 'is-danger',
        duration: 5000
      })
      self.$router.push('/welcome')
    })
  },
  methods: {}
}
</script>

<style scoped>
.progresso {
  font-weight: bold;
  font-size: 30pt;
}
</style>
