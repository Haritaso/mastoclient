<template>
  <el-tabs class="ntab" type="border-card">
    <el-tab-pane label="通知">
      <notification v-for="data in notifications"
        :key="data.id"
        :data="data"
      ></notification>
      <el-card shadow="hover" class="reloadcard">
        <el-button
          type="text"
          :loading="oldload"
          class="reloadbtn"
          @click="getoldnotification()"
        >
        さらに読み込む
        </el-button>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="@リプライ">
      <notification v-for="rp in reply"
        :key="rp.id"
        :data="rp"
      ></notification>
      <el-card shadow="hover" class="reloadcard">
        <el-button
          type="text"
          :loading="oldload"
          class="reloadbtn"
          @click="getoldreply()"
        >
        さらに読み込む
        </el-button>
      </el-card>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import notification from '@/components/notification.vue'
import axios from 'axios'

export default {
  data () {
    return {
      notifications: [],
      reply: [],
      oldload: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.notification()
    },0)
  },
  methods: {
    notification () {
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/notifications',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          limit: 30
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          this.notifications.push(d)
        }
        setTimeout(this.connectWs, 1000)
      })
      .catch(error => {
        console.log(error)
      })
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/notifications',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          exclude_types: ["favourite","follow","reblog"]
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          this.reply.push(d)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    connectWs() {
      const wssurl =
        'wss://' +
        this.$store.getters.getactive[0].url +
        '/api/v1/streaming?access_token=' +
        this.$store.getters.getactive[0].accessToken +
        '&stream=' +
        'user'
      const ws = new WebSocket(wssurl)
      ws.onmessage = function (message) {
        const wssresponse = JSON.parse(message.data)
        const wssreshtml = JSON.parse(wssresponse.payload)
        if (wssresponse.event === "notification") {
          setNotification(wssreshtml)
        }
      }
      const setNotification = (data) => {
        return this.notifications.unshift(data)
      }
    },
    getoldnotification() {
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/notifications',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          max_id: this.notifications[this.notifications.length - 1].id
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          this.notifications.push(d)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    getoldreply() {
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/notifications',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          exclude_types: ["favourite","follow","reblog"],
          max_id: this.reply[this.reply.length - 1].id
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          this.reply.push(d)
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  components: {
    notification,
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