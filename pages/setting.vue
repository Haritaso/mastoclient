<template>
  <div class="settingframe">
    <el-collapse v-model="activeNames" accordion>
      <el-collapse-item title="ユーザー設定" name="1" class="titletab">
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
              <a :href="'https://' + url + '/settings/profile'">
                公式クライアントで詳細な設定を行う
              </a>
            </el-button>
          </el-form-item>
          <el-form-item class="space">
            <el-button type="primary" @click="updateuserdata" class="settingbutton height">設定を適用</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="タブ" name="2" class="titletab">
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
      <el-collapse-item title="タイムライン" name="3" class="titletab">
        <el-form
          label-position="left"
        >
          <el-form-item label="NSFW投稿のマスキングカラー" class="title">
            <el-color-picker v-model="timeline.backcolor" show-alpha class="pickers"></el-color-picker>
          </el-form-item>
          <el-form-item label="CWテキストカラー" class="title">
            <el-color-picker v-model="timeline.textcolor" show-alpha class="pickers"></el-color-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="cwcolorsetting" class="settingbutton">設定を適用</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      activeNames: ['1'],
      general: {
        textColor: null,
        activetextColor: null,
        backgroundColor: null
      },
      user: {
        displayname: '',
        bio: '',
        icon: [],
        header: [],
        lock: true
      },
      timeline: {
        backcolor: '',
        textcolor: ''
      },
      url: ''
    };
  },
  mounted () {
    setTimeout(() => {
      this.getcolor()
      this.getacountdata()
      this.url = this.$store.getters.getactive[0].url
    }, 1)
  },
  methods: {
    getcolor() {
      this.general.textColor = this.$store.getters.getactive[0].tcolor
      this.general.activetextColor = this.$store.getters.getactive[0].acolor
      this.general.backgroundColor = this.$store.getters.getactive[0].bcolor
      this.timeline.backcolor = this.$store.getters.getactive[0].cwBackcolor
      this.timeline.textcolor = this.$store.getters.getactive[0].cwTextcolor
    },
    generalsetting() {
      this.$store.commit("setGeneral", {
        index: this.$store.getters.getactive[0].index,
        tcolor: this.general.textColor,
        acolor: this.general.activetextColor,
        bcolor: this.general.backgroundColor
      });
      this.$router.push("loading?url=setting")
    },
    cwcolorsetting() {
      this.$store.commit("setCwcolor", {
        index: this.$store.getters.getactive[0].index,
        cwBackcolor: this.timeline.backcolor,
        cwTextcolor: this.timeline.textcolor,
      });
      this.$router.push("loading?url=setting")
    },
    getacountdata() {
      axios({
        methods: "GET",
        url:
          "https://" +
          this.$store.getters.getactive[0].url +
          "/api/v1/accounts/verify_credentials",
        headers: {
          Authorization:
            "Bearer " + this.$store.getters.getactive[0].accessToken
        }
      }).then(res => {
        this.user.displayname = res.data.display_name;
        this.user.bio = res.data.source.note;
        this.user.lock = res.data.locked;
        this.user.bot = res.data.bot;
      })
    },
    updateuserdata() {
      axios({
        method: "PATCH",
        url:
          "https://" +
          this.$store.getters.getactive[0].url +
          "/api/v1/accounts/update_credentials",
        headers: {
          Authorization:
            "Bearer " + this.$store.getters.getactive[0].accessToken
        },
        data: {
          display_name: this.user.displayname,
          note: this.user.bio,
          locked: this.user.lock
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
.titletab {
  margin-left: 1em;
}
.usertitle {
  margin: 0 3em 0 2em;
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
.space {
  margin-bottom: -44px;
}
.settingframe {
  border-radius: 4px;
  border: 2px solid #dcdfe6;
}
</style>
