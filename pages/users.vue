<template>
  <div>
    <section v-if="error">
      なんらかの原因によりユーザーデータの取得に失敗しました。
    </section>
    <section v-else>
      <div v-if="loading">loading</div>
      <div v-else>
        <div id="header" class="header">
          <el-tabs v-model="activeName" class="tabbar">
            <el-tab-pane label="トゥート" name="toot">トゥート</el-tab-pane>
            <el-tab-pane label="フォロー" name="following">フォロー</el-tab-pane>
            <el-tab-pane label="フォロワー" name="followers">フォロワー</el-tab-pane>
          </el-tabs>
        </div>
      </div>
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
      error: false,
      activeName: 'トゥート',
    }
  },
  mounted () {
    this.getUrl()
    
  },
  updated () {
    var element = document.getElementById("header")
    element.style.backgroundImage = "url(" + this.userdata.header + ")"
  },
  methods: {
    getUrl () {
      const url= this.$route.query.url
      const id = this.$route.query.id
      this.createUserData(url, id)
    },
    createUserData (url, id) {
      axios({
        method: 'GET',
        url:  'https://' + url + '/api/v1/accounts/' + id,
      })
      .then (res => {
        this.$nextTick (() => {
          this.userdata = res.data
        })
      })
      .catch(error => {
        this.error = true
      })
      .finally(() =>
        this.loading = false
      )
    },
  },
}
</script>

<style scoped>
.header {
  border-radius: 4px 4px 0 0;
  width: 100%;
  height: 200px;
  opacity: 0.5;
  filter: blur(0.5px);
  object-fit: cover;
  overflow: hidden;
}
.smallheader {
  border-radius: 4px 4px 0 0;
  width: 100%;
  height: 200px;
  opacity: 0.5;
  filter: blur(0.5px);
  object-fit: cover;
  overflow: hidden;
}
.tabbar {
  position: relative;
  bottom: 60px;
}
</style>
