<template>
  <div>
    <div v-for="(dummy, i) in 40"
      :key="i"
    >
      <div v-if="loading">
        <el-card shadow="never">
          <content-loader :speed="3" :height="100">
            <rect x="0" y="0" rx="4" ry="4" width="55" height="18" />
            <rect x="56" y="0" rx="4" ry="4" width="120" height="18" />
            <rect x="0" y="22" rx="0" ry="0" width="40" height="40" />
            <rect x="45" y="22" rx="8" ry="8" width="120" height="16" />
            <rect x="45" y="45" rx="8" ry="8" width="350" height="16" />
            <rect x="45" y="68" rx="8" ry="8" width="180" height="16" />
          </content-loader>
        </el-card>
      </div>
    </div>
    <toot v-for="toot in toots"
      :key="toot.id"
      :toot="toot"
      :detail="detail"
      :loading="loading"
    ></toot>
    <el-card shadow="hover" class="reloadcard">
      <el-button
        type="text"
        :loading="oldload"
        class="reloadbtn"
        @click="getoldload()"
      >
      さらに読み込む</el-button>
    </el-card>
  </div>
</template>

<script>
import toot from '@/components/puttoot.vue'
import { ContentLoader } from 'vue-content-loader'
import axios from 'axios'

export default {
  data () {
    return {
      toots: [],
      newdata: [],
      newscope: '',
      wsscope: '',
      oldload: false,
      loading: true
    }
  },
  props: ['scope', 'tagscope', 'media', 'stream', 'detail'],
  created () {
    this.newscope = this.scope
    if (this.scope == 'public?local') {
      this.newscope = this.scope + '=true'
    }
    if (this.scope == 'tag') {
      this.newscope = this.scope + '/'
    }
    axios({
      method: 'GET',
      url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/timelines/' + this.newscope + this.tagscope,
      headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
      params: {
        only_media: this.media,
        limit: 40
      }
    })
    .then(res => {
      for (var i=0,d;d=res.data[i];i++) {
        if (d.reblog == null) {
          this.toots.push(d)
        } else {
          this.toots.push(d.reblog)
          this.toots[i].reblog = d.account
        }
      }
      if (this.stream == true) {
        setTimeout(this.connectWs, 1000)
      }
    })
    .finally(() =>
      this.loading = false
    )
  },
  methods: {
    connectWs () {
      this.wsscope = this.scope.replace('?',':')
      this.newtagscope = ''
      if (this.scope == 'home') {
        this.wsscope = 'user'
      }
      if (this.scope == 'tag') {
        this.wsscope = 'hashtag'
        this.newtagscope = '&tag=' + this.tagscope
      }
      const wssurl =
        'wss://' +
        this.$store.getters.getactive[0].url +
        '/api/v1/streaming?access_token=' +
        this.$store.getters.getactive[0].accessToken +
        '&stream=' +
        this.wsscope +
        this.newtagscope
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
            this.toots.splice(i, 1)
          }
        }
      }
    },
    getoldload() {
      this.load = true
      this.newscope = this.scope
      if (this.scope == 'public?local') {
        this.newscope = this.scope + '=true'
      }
      if (this.scope == 'tag') {
        this.newscope = this.scope + '/'
      }
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/timelines/' + this.newscope + this.tagscope,
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          only_media: this.media,
          max_id: this.toots[this.toots.length - 1].id
        }
      })
      .then(res => {
        for (var i=0,d;d=res.data[i];i++) {
          if (d.reblog == null) {
            this.toots.push(d)
          } else {
            this.toots.push(d.reblog)
          }
        }
      })
      .finally(res => {
        this.load = false
      })
    },
  },
  components: {
    toot,
    ContentLoader
  }
}
</script>

<style scoped>
.reloadcard {
  margin-top: 0.5em;
  display: flex;
  justify-content: center;
}
</style>
