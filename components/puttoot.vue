<template>
  <div>
    <section v-if="error">
      取得エラー
    </section>
    <section v-else>
      <div v-if="loading">
      </div>
      <div v-else>
        <el-card key="toot.id" shadow="never" v-show="deletetoot">
          <div class="elcardbody">
            <div class="tootstatus">
              <div v-if="toot.reblog == null"></div>
              <div v-else>
                <a :href=userrebloglink>
                  <el-tag type="success" class="fas fa-sync-alt tootstatusobj">{{ toot.reblog.display_name + "さんがブースト" }}</el-tag>
                </a>
              </div>
              <div v-if="toot.visibility == 'public'">
                <el-tag type="Info" class="fas fa-users tootstatusobj">公開</el-tag>
              </div>
              <div v-else-if="toot.visibility == 'unlisted'">
                <el-tag type="Info" class="fas fa-user-lock tootstatusobj">未収載</el-tag>
              </div>
              <div v-else-if="toot.visibility == 'private'">
                <el-tag type="Info" class="fas fa-user-check tootstatusobj">フォロワー限定</el-tag>
              </div>
              <div v-else-if="toot.visibility == 'direct'">
                <el-tag type="danger" class="fas fa-comment-alt tootstatusobj">DM</el-tag>
              </div>
              <div v-if="toot.account.locked == true">
                <el-tag type="warning" class="fas fa-lock tootstatusobj">承認制アカウント</el-tag>
              </div>
              <div v-if="toot.account.bot == true">
                <el-tag type="info" class="fas fa-robot tootstatusobj">Bot</el-tag>
              </div>
              <div v-if="toot.poll !== null">
                <div v-if="toot.poll.expired == true">
                  <el-tag type="warning" class="fas fa-poll-h tootstatusobj">投票期限切れ</el-tag>
                </div>
                <div v-if="toot.poll.expired == false">
                  <el-tag type="success" class="fas fa-poll-h tootstatusobj">投票期間中</el-tag>
                </div>
              </div>
              <div>
                <a :href=userurllink>
                  <el-tag type="info" class="fas fa-at tootstatusobj">{{ userurl }}</el-tag>
                </a>
              </div>
            </div>
            <div class="tootcard">
              <div>
                <img class="icon" :src="toot.account.avatar">
                <div v-if="toot.sensitive == true">
                  <el-button v-if="cw == false" type="primary" plain class="nsfwbutton" @click="changesensi">
                    <i class="fas fa-eye-slash"></i>
                  </el-button>
                  <el-button v-else type="primary" plain class="nsfwbutton" @click="changesensi">
                    <i class="fas fa-eye"></i>
                  </el-button>
                </div>
              </div>
              <div class="tootcontent">
                <div class="username">
                  <router-link class="name" :to=userlink>
                    <span>
                      <bdi class="displayname">{{ toot.account.display_name }}</bdi>
                      <bdi class="displayname" v-if="toot.account.display_name == ''">{{ toot.account.username }}</bdi>
                      <span>{{ userid }}</span>
                    </span>
                  </router-link>
                  <div class="time">
                    <time :datatime="this.toot.created_at">{{ time }}</time>
                  </div>
                </div>
                <div v-show="cw" :style="nsfwscreen" class="cw" @click="cw = false">
                  <div class="cwtext" :style="nsfwtext">{{ toot.spoiler_text }}</div>
                </div>
                <div v-show="nsfw" :style="nsfwscreen" class="nsfw" @click="nsfw = false">
                  <div class="cwtext" :style="nsfwtext">閲覧注意</div>
                </div>
                <div class="toottext" v-html="tootcontent"></div>
                <div v-if="toot.poll !== null">
                  <tootpoll :poll="polldata" @set="refreshpoll" />
                </div>
                <mediaview :mdata="toot.media_attachments" :preid="preid" />
                <tootaction
                  :toot="toot"
                  :visibility="toot.visibility"
                  :detail="detail"
                  :url="userurl"
                  :userid="userid"
                  :deletetoot="deletetoot"
                  @set="deleteaction"
                />
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import tootpoll from './tootpoll'
import mediaview from './mediaview'
import tootaction from './tootaction'

export default {
  name: 'toot',
  props: ['toot', 'detail', 'loading', 'preid'],
  data () {
    return {
      nowtime: new Date(),
      watchStime: false,
      watchMtime: false,
      error: false,
      nowloading: true,
      media: false,
      cw: false,
      nsfw: false,
      nsfwid: '',
      nsfwshow: false,
      deletetoot: true,
      polldata: null
    }
  },
  computed: {
    userlink () {
      const url = this.$store.getters.getactive[0].url
      return '/users?url=' + url + "&id=" + this.toot.account.id
    },
    userrebloglink () {
      const url = this.$store.getters.getactive[0].url
      return '/users?url=' + url + "&id=" + this.toot.reblog.id
    },
    userid () {
      if (this.toot.account.acct.indexOf('@') == true) {
        return this.toot.account.acct
      } else {
        return '@' + this.toot.account.acct
      }
    },
    time () {
      const time = this.nowtime
      const date = new Date(this.toot.created_at)
      const d = time.getTime() - date.getTime()
      const a = Math.floor(d / 1000)
      if (a < 60) {
        this.watchStime = true
        return a + '秒前'
      } else if ((a >= 60) && (a < 3600)) {
        this.watchStime = false
        this.watchMtime = true
        return Math.floor(a / 60) + '分前'
      } else if ((a >= 3600) && (a < (3600 * 24))) {
        this.watchMtime = false
        return Math.floor(a / 3600) + '時間前'
      } else if ((a >= (3600 * 24)) && (a <( 3600 * 24 * 7))){
        return Math.floor(a / (3600 * 24)) + '日前'
      } else {
        return date.getMonth()+1 + '月' + date.getDate() + '日'
      }
    },
    userurl () {
      const a = this.toot.url.match('(http|https)://([^/]+).*')
      return a[2]
    },
    userurllink () {
      return this.toot.uri
    },
    nsfwscreen () {
      return {
        'background-color': !this.loading ? this.$store.getters.getactive[0].cwBackcolor : '#d9e1e8'
      }
    },
    nsfwtext () {
      return {
        'color': !this.loading ? this.$store.getters.getactive[0].cwTextcolor : '#000'
      }
    },
    tootcontent () {
      const tootcontent = this.toot.content
      if (this.toot.emojis == '') {
        return tootcontent
      } else {
        let toot = this.toot.content
        for (const emoji in this.toot.emojis) {
          const data = ':' + this.toot.emojis[emoji].shortcode + ':'
          toot = toot.replace(
            RegExp(data, 'g'),
            '<img src=' + this.toot.emojis[emoji].url + ' class="tootemoji">'
          )
        }
        return toot
      }
    }
  },
  mounted () {
    if (this.watchStime == true) {
      setInterval(() => {
        this.nowtime = new Date()
      },5000)
    } else if (this.watchMtime == true) {
      setInterval(() => {
        this.nowtime = new Date()
      },50000)
    }
    if (this.toot.sensitive == true) {
      if (!!this.toot.media_attachments[0]) {
        this.nsfw = true
        this.nsfwid = this.toot.id
      }
      if (!this.toot.spoiler_text == '') {
        this.cw = true
      }
    }
  },
  methods: {
    deleteaction() {
      this.$nextTick(() => {
        this.deletetoot = false
      })
    },
    changesensi() {
      if (!!this.toot.media_attachments[0]) {
        this.nsfw = true
      }
      this.cw = true
    },
    refreshpoll() {
      this.$nextTick(() => {
        axios({
          method: 'GET',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/polls/' + this.toot.poll.id,
        })
        .then(res => {
          this.polldata = res.data
        })
      })
    }
  },
  created () {
    this.nowloading = this.loading
    this.polldata = this.toot.poll
  },
  components: {
    tootpoll,
    mediaview,
    tootaction,
  }
}
</script>

<style scoped>
.elcardbody {
  display: grid;
  grid-template-rows: 26px 1fr;
  grid-template-columns: 100%;
}
.tootcard {
  grid-row: 2 / 3;
  display: grid;
  grid-template-columns: 50px calc(100% - 50px);
}
.icon {
  width: 44px;
  min-width: 44px;
  height: 44px;
  min-height: 44px;
  margin: 4px 0 auto 0;
  border: 3px solid #909399;
}
.username {
  display: grid;
  grid-template-columns: 1fr 4em;
  grid-template-rows: 1.5em;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.toottext {
  padding: 0.5em 0 0 0;
  z-index: 4;
}
.name {
  grid-row: 1 /2;
  grid-column: 1 /2;
  max-width: 100%;
  justify-self: start;
  align-self: center;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.time {
  grid-row: 1 /2;
  grid-column: 2 /3;
  justify-self: end;
  align-self: end;
}
.displayname {
  color: black;
  text-decoration: none;
}
.fa {
  display: block;
  font-weight: normal;
  font-size: inherit;
}
.fa-retweet:active {
  transform: rotate(0deg);
}
.tootstatus {
  grid-row: 1 / 2;
  position: absolute;
  display: inline-flex;
}
.tootstatusobj {
  line-height: 2;
}
.tootcontent {
  display: grid;
  grid-template-rows: 1.5em auto;
  grid-template-columns: 100%;
  position: relative;
  word-break: break-all;
  padding-left: 0.5em;
}
.boost {
  float: right;
}
.toottext {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
}
.mediapreview {
  grid-row: 3 / 4;
  grid-column: 1 / 2;
}
.nsfw {
  grid-row: 3 / 4;
  grid-column: 1 / 2;
  height: 100%;
  width: 100%;
  display: grid;
  background-size: cover;
  overflow: hidden;
  position: absolute;
  border-radius: 5px;
  z-index: 5;
}
.cw {
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  height: 98%;
  width: 100%;
  display: grid;
  background-size: cover;
  overflow: hidden;
  position: absolute;
  border-radius: 5px;
  z-index: 5;
}
.nsfwbutton {
  width: 50px;
  padding: 12px 17px;
}
.cwtext {
  justify-self: center;
  align-self: center;
}
.size {
  padding: 0;
}
</style>
