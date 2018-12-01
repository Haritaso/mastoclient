import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const store = () => new Vuex.Store({
  state: {
    users: [],
    count: 0,
    first: false,
    activedata: false,
    coloroption: false,
    manuallogin: false,
  },
  mutations: {
    count(state, payload) {
      state.users[state.count] = payload
      state.count++
    },
    manuallogin(state) {
      state.manuallogin = true
      state.activedata = false
    },
    active(state) {
      state.activedata = true
    },
    register(state) {
      state.first = true
    },
    addtoken(state, payload) {
      state.users[payload.index].accessToken = payload.accessToken
    },
    addnext(state, payload) {
      state.activedata = false
      state.users[payload.index].active = false
    },
    update(state, payload) {
      state.users[payload.index].data = payload.data
      state.users[payload.index].id = payload.id
      state.activedata = true
    },
    change(state, payload) {
      state.users[payload.index].active = true
      state.activedata = true
    },
    removecount(state) {
      state.count--
    },
    remove(state, payload) {
      if (state.users[payload.index].active == true) {
        state.users[payload.index].active = false
        if (state.count == 0) {
          state.first = false
          state.coloroption = false
          state.activedata = false
          state.users.splice(0, 1)
        } else {
          state.users.splice(payload.index, 1)
          state.users[0].active = true
        }
      } else {
        state.users.splice(payload.index, 1)
      }
    },
    registerUI(state, payload) {
      state.users[payload.index].TL = []
      state.users[payload.index].TLcount = 0
      state.users[payload.index].tcolor = '#fff'
      state.users[payload.index].acolor = '#409EFF'
      state.users[payload.index].bcolor = '#545c64'
      state.users[payload.index].cwBackcolor = '#d9e1e8'
      state.users[payload.index].cwTextcolor = '#000'
      state.users[payload.index].tlalert = true
    },
    setUserTL(state, payload) {
      state.users[payload.index].TL.push(payload.TL)
      state.users[payload.index].TLcount++
    },
    delUserTL(state, payload) {
      state.users[payload.index].TL = payload.TL
      state.users[payload.index].TLcount--
    },
    setGeneral(state, payload) {
      state.coloroption = true
      Vue.set(state.users[payload.index], 'tcolor', payload.tcolor)
      Vue.set(state.users[payload.index], 'acolor', payload.acolor)
      Vue.set(state.users[payload.index], 'bcolor', payload.bcolor)
    },
    setCwcolor(state, payload) {
      Vue.set(state.users[payload.index], 'cwBackcolor', payload.cwBackcolor)
      Vue.set(state.users[payload.index], 'cwTextcolor', payload.cwTextcolor)
    }
  },
  getters: {
    getactive: state => {
      return state.users.filter(data => data.active)
    },
    geturl: (state, getters) => {
      return state.activedata ? getters.getactive[0].url : null
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
    },
  },
  actions: {
    getAppName(context, payload) {
      axios.post('https://' + payload.url + '/api/v1/apps', {
        scopes: 'read write follow',
        client_name: 'MastoClient',
        redirect_uris: process.env.baseUrl + '/addusers'
      })
        .then(response => {
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
            process.env.baseUrl +
            '/addusers' +
            '&scope=read+write+follow&client_id=' +
            this.client_id
          console.log(this.openurl)
          window.open(this.openurl, '_self')
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getTestApp(context, payload) {
      if (context.state.first === true) {
        context.commit('addnext', {
          index: 0
        })
      } else {
        context.commit('register')
      }
      context.commit('count', {
        client_id: '0000000',
        client_secret: '000000',
        url: payload.url,
        index: context.state.count,
        active: true
      })
      context.commit('addtoken', {
        index: 0,
        accessToken: payload.token
      })
    },
    changeActive(context, payload) {
      context.commit('addnext', {
        index: context.getters.getactive[0].index
      })
      context.commit('change', {
        index: payload.index
      })
    },
    removeAccount(context, payload) {
      context.commit('removecount')
      context.commit('remove', {
        index: payload.index
      })
    },
    tootaction(context, payload) {
      axios({
        method: 'POST',
        url: 'https://' + context.getters.getactive[0].url + '/api/v1/statuses',
        headers: { Authorization: 'Bearer ' + context.getters.getactive[0].accessToken },
        data: {
          status: payload.data.TootContent,
          visibility: payload.data.visibility,
          spoiler_text: payload.data.cwContent,
          sensitive: payload.data.sensitive,
          media_ids: payload.data.media,
          in_reply_to_id: payload.data.replyid
        }
      })
    },
    followaction(context, payload) {
      axios({
        method: 'POST',
        url: 'https://' + context.getters.getactive[0].url + '/api/v1/accounts/' + payload.id + payload.type,
        headers: { Authorization: 'Bearer ' + context.getters.getactive[0].accessToken },
      })
        .then(response => {
          console.log(payload.type + '成功')
        })
        .error(response => {
          console.log(payload.type + '失敗')
        })
    }
  }
})

export default store