<template>
  <div>
    {{ this.$store.getters.getactive[0] }}
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      data: this.$store.getters.getactive
    }
  },
  updated: function () {
    console.log(this.$store.getters.getactive[0].url)
    axios.post('https://' + this.$store.getters.getactive[0].url + '/oauth/token', {
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/addusers',
      client_id: this.$store.getters.getactive[0].client_id,
      client_secret: this.$store.getters.getactive[0].client_secret,
      code: this.$route.query.code
    })
    .then(response => {
      console.log(response.data.access_token)
      this.$store.commit('addtoken', {
        index: this.$store.getters.getactive[0].index,
        accessToken: response.data.access_token
      })
      setTimeout(this.getUserdata(), 1000)
    })
    .catch(error => {
      console.log(error)
    })
  },
  methods: {
    getUserdata () {
      axios.get('https://' + this.$store.getters.getactive[0].url + '/api/v1/accounts/verify_credentials', {
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken
        }
      })
      .then(response => {
        console.log(response)
        this.$store.commit('update', {
          data: response.data,
          index: this.$store.getters.getactive[0].index,
          id: "@" + response.data.acct + "@" + this.$store.getters.getactive[0].url
        })
        this.$store.commit('registerTL', {
          index: this.$store.getters.getactive[0].index
        })
        this.$router.push('home')
      })
    }
  }
}
</script>
