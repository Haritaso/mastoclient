<template>
  <div>
    <section v-if="error">
      なんらかの原因によりユーザーデータの取得に失敗しました。
    </section>
    <section v-else class="subbody">
      <div v-if="loading">loading</div>
      <div v-else>
        <div class="headerbase">
          <div id="header" />
          <div class="headercard">
            <img :src="userdata.avatar" class="headericon">
          </div>
          <div class="headertext">
            <div class="headername">{{ userdata.display_name }}</div>
            <div class="headerid">{{ id }}</div>
          </div>
          <div v-if="match == true" class="editbtn">
            <el-button type="primary" class="btnsize" size="medium" @click="gotosetting">
              <i class="fas fa-user-edit editicon"></i>
              プロフィール
            </el-button>
          </div>
          <div v-else class="editbtn">
            <el-button v-if="check.following == false" type="primary" class="btnsize" size="medium">
              <i class="fas fa-user-plus editicon"></i>
              フォロー
            </el-button>
            <el-button  v-else type="primary" class="btnsize" size="medium">
              <i class="fas fa-user-check editicon"></i>
              フォロー中
            </el-button>
          </div>
        </div>
        <el-tabs type="border-card" class="detailetab">
          <el-tab-pane>
            <span slot="label" class="counttab">
              <div>トゥート</div>
              <div>{{ userdata.statuses_count }}</div>
            </span>
            <el-tabs v-model="activeName" :stretch="true" class="tabbar">
              <el-tab-pane label="トゥート" name="toot">
                <div>
                  <puttoot v-for="toot in tootdata"
                    :key="toot.id"
                    :toot="toot"
                    :detail="true"
                    :preid="1"
                  ></puttoot>
                </div>
              </el-tab-pane>
              <el-tab-pane label="リプライ" name="tootreply">
                <puttoot v-for="toot in rdata"
                  :key="toot.id"
                  :toot="toot"
                  :detail="true"
                  :preid="2"
                  ></puttoot>
              </el-tab-pane>
              <el-tab-pane label="メディア" name="media">
                <puttoot v-for="toot in mdata"
                  :key="toot.id"
                  :toot="toot"
                  :detail="true"
                  :preid="3"
                  ></puttoot>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="counttab">
              <div>フォロー</div>
              <div>{{ userdata.following_count }}</div>
            </span>
            <usercard v-for="(data, i) in following"
              :key="i"
              :data="data"
            ></usercard>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="counttab">
              <div>フォロワー</div>
              <div>{{ userdata.followers_count }}</div>
            </span>
            <usercard v-for="(data, i) in followers"
              :key="i"
              :data="data"
            ></usercard>
          </el-tab-pane>
        </el-tabs>
      </div>
    </section>
  </div>
</template>

<script>
import puttoot from '../components/puttoot'
import usercard from '../components/usercard'
import axios from 'axios'
export default {
  data () {
    return {
      userdata: null,
      check: false,
      followstatus: false,
      loading: true,
      error: false,
      activeName: 'toot',
      tootdata: [],
      rdata: [],
      mdata: [],
      following: null,
      followers: null,
      match: false
    }
  },
  watchQuery: true,
  computed: {
    id () {
      if (!this.userdata.acct.match('@')) {
        var userid = '@' + this.userdata.acct + '@' + this.$route.query.url
      } else {
        var userid = '@' + this.userdata.acct
      }
      return userid
    },
    userurl () {
      return this.$store.getters.geturl
    },
    userid () {
      return !this.loading ? this.$store.getters.getactive[0].data.id : null
    }
  },
  mounted () {
    this.getUrl()
    setTimeout(() => {
      const url= this.$route.query.url
      const id = this.$route.query.id
      this.checkUser(id)
      this.getToot(url, id)
      this.getRdata(url, id)
      this.getMdata(url, id)
      this.fingdata(url, id, null)
      this.fersdata(url, id, null)
    },1)
  },
  updated () {
    setTimeout(() => {
      var element = document.getElementById("header")
      element.style.backgroundImage = "url(" + this.userdata.header + ")"
    }, 0)
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
    checkUser (id) {
      axios({
        method: 'GET',
        url:  'https://' + this.userurl + '/api/v1/accounts/relationships',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          id: id
        }
      })
      .then (res => {
        this.check = res.data[0]
        if (this.check.id == this.userid) {
          this.match = true
        }
      })
    },
    getToot (url, id) {
      axios({
        method: 'GET',
        url: 'https://' + url + '/api/v1/accounts/' + id + '/statuses',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          exclude_replies: true,
          limit: 40,
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          if (d.reblog == null) {
            this.tootdata.push(d)
          } else {
            this.tootdata.push(d.reblog)
            this.tootdata[i].reblog = d.account
          }
        }
      })
    },
    getRdata (url, id) {
      axios({
        method: 'GET',
        url: 'https://' + url + '/api/v1/accounts/' + id + '/statuses',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          exclude_replies: false,
          limit: 40,
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          if (d.reblog == null) {
            this.rdata.push(d)
          } else {
            this.rdata.push(d.reblog)
            this.rdata[i].reblog = d.account
          }
        }
      })
    },
    getMdata (url, id) {
      axios({
        method: 'GET',
        url: 'https://' + url + '/api/v1/accounts/' + id + '/statuses',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          only_media: true,
          limit: 40,
        }
      })
      .then (res => {
        for (var i=0,d;d=res.data[i];i++) {
          if (d.reblog == null) {
            this.mdata.push(d)
          } else {
            this.mdata.push(d.reblog)
            this.mdata[i].reblog = d.account
          }
        }
      })
    },
    fingdata (url, id, max_id) {
      axios({
        method: 'GET',
        url: 'https://' + url + '/api/v1/accounts/' + id + '/following',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          max_id: max_id,
          limit: 40,
        }
      })
      .then(res => {
        this.following = res.data
      })
    },
    fersdata (url, id, max_id) {
      axios({
        method: 'GET',
        url: 'https://' + url + '/api/v1/accounts/' + id + '/followers',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          max_id: max_id,
          limit: 40,
        }
      })
      .then(res => {
        this.followers= res.data
      })
    },
    gotosetting () {
      this.$router.push("/loading?url=setting")
    },
  },
  components: {
    puttoot,
    usercard
  }
}
</script>

<style scoped>
.headerbase {
  display: grid;
  position: relative;
  grid-template:
    10px 80px auto 10px / minmax(50px, 100px) minmax(100px, 250px) minmax(
      0px,
      1000px
    )
    minmax(100px, 200px);
  border-bottom-width: 0px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.detailetab {
  border-top-width: 0px;
}
#header {
  grid-row: 1 / 5;
  grid-column: 1 / 5;
  border-radius: 4px 4px 0 0;
  background-size: cover;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  filter: blur(0.5px);
  object-fit: cover;
  overflow: hidden;
  z-index: 1;
}
.headericon {
  width: 100%;
  height: 100%;
  border: 3px solid #909399;
  background-color: #fff;
}
.headercard {
  grid-row: 3 / 4;
  grid-column: 1 / 2;
  justify-self: start;
  align-self: flex-end;
  margin: 10px 10px -4px 10px;
  z-index: 3;
}
.headertext {
  grid-row: 3 / 4;
  grid-column: 2 / 5;
  justify-self: start;
  align-self: end;
  max-width: 100%;
  font-size: calc(100% + 0.4vw);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 3;
}
.headername {
  font-size: 110%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.headerid {
  font-size: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.editbtn {
  grid-row: 2 / 3;
  grid-column: 4 / 5;
  margin: 10px 10px 0 0;
  justify-self: end;
  align-self: start;
  z-index: 3;
}
.btnsize {
  font-size: 0.5em;
}
.counttab {
  display: flex;
  height: 45px;
}
</style>
