<template>
  <div class="base">
    <div class='loader'>
      <moon-loader
        class="load"
        :loading="loading"
        :color="color"
        :sizeUnit="px"
        :size="120"
      ></moon-loader>
      </div>
    <div class="back"></div>
  </div>
</template>

<script>
import axios from "axios"
import { MoonLoader } from '@saeris/vue-spinners'
export default {
  layout: 'index',
  data () {
    return {
      loading: true,
      color: "#fff"
    }
  },
  computed: {
    userdata () {
      return this.$store.getters.getactive[0]
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.register()
    },1000)
  },
  methods: {
    register() {
      axios
        .post(
          "https://" + this.$store.getters.getactive[0].url + "/oauth/token",
          {
            grant_type: "authorization_code",
            redirect_uri: process.env.baseUrl + "/addusers",
            client_id: this.$store.getters.getactive[0].client_id,
            client_secret: this.$store.getters.getactive[0].client_secret,
            code: this.$route.query.code
          }
        )
        .then(response => {
          this.$store.commit("addtoken", {
            index: this.$store.getters.getactive[0].index,
            accessToken: response.data.access_token
          });
          this.$store.commit("registerUI", {
            index: this.$store.getters.getactive[0].index
          })
          setTimeout(this.getUserdata, 1000)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getUserdata() {
      axios
        .get(
          "https://" +
            this.$store.getters.getactive[0].url +
            "/api/v1/accounts/verify_credentials",
          {
            headers: {
              Authorization:
                "Bearer " + this.$store.getters.getactive[0].accessToken
            }
          }
        )
        .then(response => {
          console.log(response)
          this.$store.commit("update", {
            data: response.data,
            index: this.$store.getters.getactive[0].index,
            id:
              "@" +
              response.data.acct +
              "@" +
              this.$store.getters.getactive[0].url
          })
          this.$router.push("/home")
        })
    }
  },
  components: {
    MoonLoader
  },
};
</script>

<style scoped>
.back {
  z-index: 2000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
  background: rgba(0, 0, 0, 0.5);
}
.base .load {
  z-index: 2001;
  display: flex;
  position: relative;
  text-align: -webkit-match-parent;
  margin: 0;
}
.base {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.load {
  text-align: left;
}
.loader {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  font-size: 18px;
  letter-spacing: 1px;
  position: relative;
  flex: 0 0 auto;
  padding: 20px;
  margin-top: 55px;
  border-width: 0.5px;
  border-image: initial;
  z-index: 2000;
}
</style>
