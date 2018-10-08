<template>
  <div>
    <toot v-for="toot in toots"
      :key="toot.id"
      :toot="toot"
      :detail="detail"
    ></toot>
  </div>
</template>

<script>
import toot from '@/components/puttoot.vue'
import axios from 'axios'

export default {
  data () {
    return {
      toots: [],
      newdata: [],
      newscope: '',
      wsscope: '',
    }
  },
  watch: {
    toots () {
      if (this.toots.length == 51) {
        this.toots.pop()
      }
    }
  },
  props: ['scope', 'media', 'stream', 'detail'],
  created: function () {
    this.newscope = this.scope
    if (this.scope == 'public?local') {
      this.newscope = this.scope + '=true'
    }
    axios({
      method: 'GET',
      url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/timelines/' + this.newscope,
      headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
      params: {
        only_media: this.media,
        limit: 40
      }
    })
    .then (res => {
      for (var i=0,d;d=res.data[i];i++) {
        if (d.reblog == null) {
          this.toots.push(d)
        } else {
          this.toots.push(d.reblog)
          this.toots[i].reblog = d.account
        }
      }
      if (this.stream == true) {
        setTimeout(this.connectWs, 3000)
      }
    })
  },
  methods: {
    connectWs () {
      this.wsscope = this.scope.replace('?',':')
      if (this.scope == 'home') {
        this.wsscope = 'user'
      }
      console.log(this.wsscope)
      const wssurl =
        'wss://' +
        this.$store.getters.getactive[0].url +
        '/api/v1/streaming?access_token=' +
        this.$store.getters.getactive[0].accessToken +
        '&stream=' +
        this.wsscope
      const ws = new WebSocket(wssurl)
      ws.onmessage = function (message) {
        const wssresponse = JSON.parse(message.data)
        const wssreshtml = JSON.parse(wssresponse.payload)
        if (wssresponse.event === "update") {
          setToot(wssreshtml)
        } else if (wssresponse.event === "delete") {
          deletetoot(wssreshtml)
        }
      }
      const setToot = (data) => {
        if (data.reblog == null) {
          this.newdata = data
        } else {
          this.newdata = data.reblog
          this.newdata.reblog = data.account
        }
        return this.toots.unshift(this.newdata)
      }
      const deletetoot = (deleteid) => {
        for (var i=0,d;d=this.toots[i];i++) {
          if (d.id == deleteid) {
            console.log(this.toots[i])
            this.toots.splice(i, 1)
          }
        }
      }
    }
  },
  components: {
    toot
  }
}
</script>
