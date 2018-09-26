<template>
  <div>
    <div class="half-circle-spinner">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
    <div class="back"></div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  computed: {
    userdata: function() {
      return this.$store.getters.getactive[0];
    }
  },
  mounted: function() {
    setTimeout(this.register, 1000);
  },
  methods: {
    async register() {
      await console.log(this.$store.getters.getactive[0]);
      axios
        .post(
          "https://" + this.$store.getters.getactive[0].url + "/oauth/token",
          {
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:3000/addusers",
            client_id: this.$store.getters.getactive[0].client_id,
            client_secret: this.$store.getters.getactive[0].client_secret,
            code: this.$route.query.code
          }
        )
        .then(response => {
          console.log(response.data.access_token);
          this.$store.commit("addtoken", {
            index: this.$store.getters.getactive[0].index,
            accessToken: response.data.access_token
          });
          setTimeout(this.getUserdata, 1000);
        })
        .catch(error => {
          console.log(error);
        });
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
          console.log(response);
          this.$store.commit("update", {
            data: response.data,
            index: this.$store.getters.getactive[0].index,
            id:
              "@" +
              response.data.acct +
              "@" +
              this.$store.getters.getactive[0].url
          });
          this.$store.commit("registerTL", {
            index: this.$store.getters.getactive[0].index
          });
          this.$router.replace("home");
        });
    }
  }
};
</script>

<style scoped>
.half-circle-spinner,
.half-circle-spinner * {
  box-sizing: border-box;
}

.back {
  z-index: 1999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  background: #000;
}
.half-circle-spinner {
  z-index: 2000;
  position:relative;
  top:auto;
  bottom:auto;
  right:auto;
  left:auto;
  margin:auto;
  width: 80px;
  height: 80px;
  border-radius: 100%;
}

.half-circle-spinner::after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: middle;
}
.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: #1dfbff;
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: #1dfbff;
  animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

