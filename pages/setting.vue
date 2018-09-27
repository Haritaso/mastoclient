<template>
  <el-collapse v-model="activeNames" accordion>
    <el-collapse-item title="一般" name="1">
      <el-form
        label-position="left"
      >
        <el-form-item label="文字色" class="title">
          <el-color-picker v-model="general.textColor" show-alpha class="pickers"></el-color-picker>
        </el-form-item>
        <el-form-item label="アクティブ文字色" class="title">
          <el-color-picker v-model="general.activetextColor" show-alpha class="pickers"></el-color-picker>
        </el-form-item>
        <el-form-item label="タブ背景色" class="title">
          <el-color-picker v-model="general.backgroundColor" show-alpha class="pickers"></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generalsetting" class="settingbutton">設定を適用</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="ユーザー設定" name="2">
      <el-form
        label-position="left"
      >
        <el-form-item label="ユーザー名" class="usertitle">
          <el-input v-model="user.displayname"></el-input>
        </el-form-item>
        <el-form-item label="プロフィール" class="usertitle">
          <el-input type="textarea" v-model="user.bio"></el-input>
        </el-form-item>
        <el-form-item label="承認制アカウントにする" class="usertitle">
          <el-switch v-model="user.lock"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="text" class="usertitle">
            <a :href="officialsetting">
              公式クライアントで詳細な設定を行う
            </a>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateuserdata" class="settingbutton height">設定を適用</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      activeNames: ['1'],
      general: {
        textColor: null,
        activetextColor: null,
        backgroundColor: null,
      },
      user: {
        displayname: '',
        bio: '',
        icon: [],
        header: [],
        lock: Boolean,
      },
    }
  },
  created: function () {
    this.general.textColor = this.$store.getters.getactive[0].tcolor
    this.general.activetextColor = this.$store.getters.getactive[0].acolor
    this.general.backgroundColor = this.$store.getters.getactive[0].backcolor
    this.getacountdata()
  },
  computed: {
    officialsetting () {
      return 'https://' + this.$store.getters.getactive[0].url + '/settings/profile'
    }
  },
  methods: {
    generalsetting () {
      this.$store.commit('setGeneral', {
        index: this.$store.getters.getactive[0].index,
        tcolor: this.general.textColor,
        acolor: this.general.activetextColor,
        bcolor: this.general.backgroundColor
      })
      this.$router.push("loading?url=setting")
    },
    getacountdata () {
      axios({
        methods:'GET',
        url: "https://" + this.$store.getters.getactive[0].url + "/api/v1/accounts/verify_credentials",
        headers: { Authorization: "Bearer " + this.$store.getters.getactive[0].accessToken},
      })
      .then(res => {
        this.user.displayname = res.data.display_name
        this.user.bio = res.data.source.note
        this.user.lock = res.data.locked
        this.user.bot = res.data.bot
      })
    },
    updateuserdata () {
      axios({
        method: 'PATCH',
        url: "https://" + this.$store.getters.getactive[0].url + "/api/v1/accounts/update_credentials",
        headers: { Authorization: "Bearer " + this.$store.getters.getactive[0].accessToken},
        data: {
          display_name: this.user.displayname,
          note: this.user.bio,
          locked: this.user.lock,
        }
      })
    }
  }
}
</script>

<style scoped>
.title {
  margin-left: 30px;
  text-align: left;
}
.usertitle {
  margin: 0 30px 0 40px;
}
.pickers {
  float: right;
  margin-right: 40px;
}
.settingbutton {
  float: right;
  margin-right: 40px;
}
.height {
  position: relative;
  bottom: 70px;
}
</style>
