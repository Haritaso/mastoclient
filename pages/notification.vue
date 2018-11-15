<template>
  <el-tabs class="ntab" type="border-card">
    <el-tab-pane label="通知">
      <notification v-for="data in notifications"
        :key="data.id"
        :data="data"
      ></notification>
    </el-tab-pane>
    <el-tab-pane label="@リプライ">
      <reply v-for="data in reply"
        :key="data.id"
        :data="data"
      ></reply>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import notification from '@/components/notification.vue'
import reply from '@/components/reply.vue'
import axios from 'axios'

export default {
  data () {
    return {
      notifications: [],
      reply: []
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
          limit: 15
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          this.notifications.push(d)
          if (d.type == 'mention') {
            this.reply.push(d)
          }
        }
        setTimeout(this.connectWs, 3000)
      })
      .catch(error => {
        console.log(error)
      })
    },
    connectWs () {
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
        console.log(data)
        return this.notifications.unshift(data)
      }
    }
  },
  components: {
    notification,
    reply
  }
}
</script>