<template>
  <div>
    <section v-if="error">
      なんらかの原因により読み込みに失敗しました。
    </section>
    <section v-else>
      <div v-if="loading">loading</div>
      <div
        v-else
        class="userdata"
      >
        <img class="header" :src="userdata.header">
        <div class="main">
          <a class="avatarimg" :href="userdata.url">
            <img class="avatar" :src="userdata.avatar">
          </a>
          <div class="header-bar"></div>
          <div class="header-sub">
            <div class="header-sub-name">
              <span class="display_name">{{ userdata.display_name }}</span>
              <span class="user_id">{{ "@" + userdata.acct }}</span>
            </div>
            <div class="header-sub-tab">
              <el-menu
                default-active="1"
                class="menutab"
                mode="horizontal"
                background-color="#545c64"
                active-text-color="#fff"
                :router="true"
              >
                <el-menu-item index="1" route="toot">
                  <span>トゥート数</span>
                  <span>{{ userdata.statuses_count }}</span>
                </el-menu-item>
                <el-menu-item index="2" route="following">
                  <span>フォロー</span>
                  <span>{{ userdata.following_count }}</span>
                </el-menu-item>
                <el-menu-item index="3" route="followers">
                  <span>フォロワー</span>
                  <span>{{ userdata.followers_count }}</span>
                </el-menu-item>
              </el-menu>
            </div>
          </div>
        </div>
        <nuxt-child />
      </div>
      <div></div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      userdata: null,
      loading: true,
      error: false
    }
  },
  mounted: function () {
    axios({
      method: 'GET',
      url:  'https://' + this.$route.params.url + '/api/v1/accounts/' + this.$route.params.userId,
    })
    .then (res => {
      this.userdata = res.data
    })
    .catch(error => {
      console.log(error)
      this.error = true
    })
    .finally(() => this.loading = false)
  }
}
</script>

<style scoped>
.userdata {
  max-width: 960px;
  min-width: 550px;
  margin: 0 auto;
}
.header {
  border-radius: 4px 4px 0 0;
  width: 100%;
  height: 300px;
  opacity: 0.5;
  filter: blur(0.5px);
  object-fit: cover;
  overflow: hidden;
}
.header-bar {
  border-radius: 0 0 0 4px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 62px;
  z-index: 0;
  background-color: #545c64;
}
.main {
  position: relative;
  margin-top: -110px;
  display: flex;
}
.avatar {
  display: block;
  width: 100px;
  height: 100px;
  border: 3px solid #909399;
  margin-left: 10px;
  position: relative;
  bottom: 10px;
}
.avatarimg {
  z-index: 1;
}
.header-sub {
  display: block;
  width: 100%;
}
.header-sub-name {
  display: block;
  margin: 10px 10px;
  color: #fff;
  background: rgba(0,0,0,.6);
}
.display_name {
  padding: 20px 0 5px 0;
  width: auto;
}
.header-sub-tab {
  display: block;
}
.menutab {
  width: auto;
}
</style>
