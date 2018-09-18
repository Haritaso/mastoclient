import Vuex from 'vuex'
import axios from 'axios'

const store = () => new Vuex.Store({
  state: {
    users: [],
    count: 0,
    first: false,
    activedata: false,
  },
  mutations: {
    count (state, payload) {
      state.users[state.count] = payload
      state.count++
    },
    register (state) {
      state.first = true
    },
    addtoken (state, payload) {
      state.users[payload.index].accessToken = payload.accessToken
    },
    addnext (state, payload) {
      state.activedata = false
      state.users[payload.index].active = false
    },
    update (state, payload) {
      state.users[payload.index].data = payload.data
      state.users[payload.index].id = payload.id
      state.activedata = true
    },
    change (state, payload) {
      state.users[payload.index].active = true
      state.activedata = true
    }
  },
  getters: {
    getactive: state => {
      return state.users.filter(data => data.active)
    },
    geticon: (state, getters) => {
      return state.activedata ? getters.getactive[0].data.avatar : null
    },
    getname: (state, getters) => {
      return state.activedata ? getters.getactive[0].data.acct : null
    },
    getdisplayname: (state, getters) => {
      return state.activedata ? getters.getactive[0].data.display_name : null
    },
    getid: (state, getters) => {
      return state.activedata ? getters.getname + "@" + getters.getactive[0].url : null
    }
  },
  actions: {
    getAppName (context, payload) {
      console.log(payload)
      axios.post('https://' + payload.url + '/api/v1/apps', {
        scopes: 'read write follow',
        client_name: 'MastoClient',
        redirect_uris: 'http://localhost:3000/addusers'
      })
      .then(response => {
        console.log(response)
        this.client_id = response.data.client_id
        if (context.state.first === true) {
          context.commit('addnext', {
            index: context.getters.getactive[0].index
          })
        } else {
          context.commit('register')
        }
        context.commit('count', {
          client_id: this.client_id,
          client_secret: response.data.client_secret,
          url: payload.url,
          index: context.state.count,
          active: true
        })
        this.openurl = 'https://' +
                      payload.url +
                      '/oauth/authorize?response_type=code&redirect_uri=' +
                      'http://localhost:3000/addusers' +
                      '&scope=read+write+follow&client_id=' +
                      this.client_id
        console.log(this.openurl)
        window.open(this.openurl, '_self')
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    changeActive (context, payload) {
      context.commit('addnext', {
        index: context.getters.getactive[0].index
      })
      context.commit('change', {
        index: payload.index
      })
    },
    tootaction (context, payload) {
      axios({
        method: 'POST',
        url: 'https://' + context.getters.getactive[0].url + '/api/v1/statuses',
        headers: {Authorization: 'Bearer ' + context.getters.getactive[0].accessToken},
        data: {
          status: payload.data.TootContent,
          visibility: payload.data.visibility,
          spoiler_text: payload.data.cwContent,
          sensitive: payload.data.sensitive,
          media_ids: payload.data.media,
          in_reply_to_id: payload.data.reply
        }
      })
      .then (response => {
        if (response.status == 200) {
          this.$message({
            type: 'success',
            message: 'tootしました。'
          })
        } else {
          this.$message({
            type: 'warning',
            message: 'tootに失敗しました。'
          })
        }
      })
    }
  }
})

export default store