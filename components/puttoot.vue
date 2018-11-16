<template>
  <div>
    <section v-if="error">
      error
    </section>
    <section v-else>
      <div v-if="loading">
      </div>
      <div v-else>
        <el-card key="toot.id" shadow="never" class="elcardbody">
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
            <div>
              <a :href=userurllink>
                <el-tag type="info" class="fas fa-at tootstatusobj">{{ userurl }}</el-tag>
              </a>
            </div>
          </div>
          <div class="tootcard">
            <div>
              <img class="icon" :src="toot.account.avatar">
              <div v-if="media == true">
                <el-button v-if="nsfw == false" type="primary" plain class="nsfwbutton" @click="nsfw = true">
                  <i class="fas fa-eye-slash"></i>
                </el-button>
                <el-button v-else type="primary" plain class="nsfwbutton">
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
              <div v-show="nsfw" :style="nsfwscreen" :class="nsfwclass" @click="nsfw = false">
                <div class="cwtext" :style="nsfwtext" v-if="toot.spoiler_text == ''">クリックで表示</div>
                <div class="cwtext" :style="nsfwtext" v-else>{{ toot.spoiler_text }}</div>
              </div>
              <div class="toottext" v-html="toot.content"></div>
              <mediaview :mdata="toot.media_attachments" :preid="preid" />
              <tootaction
                :rp="reply"
                :rb="reblog"
                :fv="fav"
                :rbtap="reblogtap"
                :fvtap="favtap"
                :urbtap="userreblog"
                :visibility="toot.visibility"
                :id="toot.id"
                :detail="detail"
              />
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import mediaview from './mediaview'
import tootaction from './tootaction'

export default {
  name: 'toot',
  props: ['toot', 'detail', 'loading', 'preid'],
  data () {
    return {
      reply: this.toot.replies_count,
      reblog: this.toot.reblogs_count,
      fav: this.toot.favourites_count,
      reblogtap: false,
      favtap: false,
      userreblog: false,
      nowtime: new Date(),
      watchStime: false,
      watchMtime: false,
      error: false,
      nowloading: true,
      media: false,
      nsfw: false,
      nsfwid: '',
      nsfwclass: '',
      nsfwshow: false,
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
      const a = (d / 1000).toFixed()
      if (a < 60) {
        this.watchStime = true
        return a + '秒前'
      } else if ((a >= 60) && (a < 3600)) {
        this.watchStime = false
        this.watchMtime = true
        return (a / 60).toFixed() + '分前'
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
        'background-color' : '#333131'
      }
    },
    nsfwtext () {
      return {
        'color' : 'rgb(0, 250, 100)'
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
      this.nsfw = true
      this.nsfwid = this.toot.id
    }
    if (!!this.toot.media_attachments[0]) {
      this.media = true
      this.nsfwclass = "nsfwmedia"
    } else {
      this.media = false
      this.nsfwclass = "nsfw"
    }
    if (this.toot.reblog == null) {
      this.userreblog = false
    } else {
      this.userreblog = true
    }
    if (this.toot.reblogged == true) {
      this.reblogtap = true
      this.reblog++
    }
    if (this.toot.favourited == true) {
      this.favtap = true
      this.fav++
    }
  },
  created () {
    this.nowloading = this.loading
  },
  components: {
    mediaview,
    tootaction,
  }
}
</script>

<style scoped>
.elcardbody {
  display: grid;
}
.tootcard {
  display: grid;
  grid-template-columns: 60px 1fr;
  margin-bottom: 1em;
}
.icon {
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  margin: 4px 0 auto 0;
  border: 3px solid #909399;
}
.username {
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.toottext {
  padding: 0.5em 0;
  z-index: 4;
}
.name {
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  display: inline-flex;
}
.tootstatusobj {
  line-height: 2;
}
.tootcontent {
  display: grid;
  grid-template-rows: 1.5em auto;
  position: relative;
  word-break: break-all;
}
.boost {
  float: right;
}
.nsfw {
  grid-row: 2 / 3;
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
.nsfwmedia {
  grid-row: 2 / 4;
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
.cwtext {
  justify-self: center;
  align-self: center;
  z-index: 6;
}
.nsfwbutton {
  width: 56px;
}
</style>
