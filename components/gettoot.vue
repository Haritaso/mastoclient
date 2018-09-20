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
      newscope: '',
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
    console.log(this.newscope)
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
        this.toots.push(d)
      }
      if (this.stream == true) {
        setTimeout(this.connectWs, 3000)
      }
    })
  },
  methods: {
    connectWs () {
      const newscope = this.scope.replace('?',':')
      console.log(newscope)
      const wssurl =
        'wss://' +
        this.$store.getters.getactive[0].url +
        '/api/v1/streaming?access_token=' +
        this.$store.getters.getactive[0].accessToken +
        '&stream=' +
        newscope
      const ws = new WebSocket(wssurl)
      ws.onmessage = function (message) {
        const wssresponse = JSON.parse(message.data)
        const wssreshtml = JSON.parse(wssresponse.payload)
        if (wssresponse.event === "update") {
          setToot(wssreshtml)
        }
      }
      const setToot = (data) => {
        return this.toots.unshift(data)
      }
    }
  },
  components: {
    toot
  }
}
</script>
