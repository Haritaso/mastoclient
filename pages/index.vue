<template>
  <div class="index">
    <span class="logintitle">
      <strong>MastoClient</strong><p>にようこそ!</p>
    </span>
    <el-collapse v-model="active">
      <el-collapse-item title="ログイン" name="1">
        <div class="inputblock">
          <el-input class="grid-content" placeholder="インスタンス名を入力" v-model="input" auto-complete="off" size="medium">
            <template slot="prepend">https://</template>
          </el-input>
        </div>
        <div class="loginbutton">
          <el-button type="warning" @click="reload" size="medium">ローカルストレージの削除</el-button>
          <el-button type="primary" @click="register" size="medium">Login</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
    <router-link to="/home">既に一度ログイン済みの場合</router-link>
  </div>
</template>

<script>
import axios from "axios"
export default {
  layout: 'index',
  data() {
    return {
      input: '',
      accurl: '',
      acctoken: '',
      tokenlogin: false,
      active: ["1"]
    }
  },
  methods: {
    register() {
      this.$store.dispatch('getAppName', {
        url: this.input
      })
    },
    accregister() {
      localStorage.clear()
      this.$store.commit('manuallogin')
      this.$store.dispatch('getTestApp', {
        url: this.accurl,
        token: this.acctoken
      })
      this.acclogin()
    },
    acclogin() {
      if (this.$store.state.manuallogin == true) {
        this.tokenlogin = true
        this.$store.commit("registerUI", {
          index: 0
        })
        setTimeout(this.Userdata, 1)
      }
    },
    Userdata() {
      axios.get("https://" + this.accurl + "/api/v1/accounts/verify_credentials", {
        headers: {
          Authorization:
            "Bearer " + this.acctoken
        }
      })
      .then(response => {
        console.log(response)
        this.$store.commit("update", {
          data: response.data,
          index: 0,
          id:
            "@" +
            response.data.acct +
            "@" +
            this.accurl
        })
        try {
          this.$store.commit('active')
        }
        catch {
        }
      })
    },
    reload() {
      localStorage.clear()
      location.reload()
    }
  }
}

</script>

<style scope>
.logintitle {
  display: flex;
  margin: 1.5em 1em;
  justify-content: center;
}
.loginbutton {
  display: flex;
  justify-content: flex-end;
  margin: 0 1em 1em 1em;
}
.index {
  margin: 55px 0;
  overflow: hidden;
}
.inputblock {
  margin: 0 1em 1em 1em;
}
</style>

