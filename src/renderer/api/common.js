import Vue from 'vue'

export default {
  all (filters) {
    return Vue.http.get('/comum', { params: filters })
  }
}
