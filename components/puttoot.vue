<template>
  <el-card key="toot.id" shadow="never">
    <div class="tootstatus">
      <div v-if="toot.reblog == null"></div>
      <div v-else>
        <el-tag type="success" class="fas fa-sync-alt">{{ toot.reblog.display_name + "さんがブースト" }}</el-tag>
      </div>
      <div v-if="toot.visibility == 'public'">
         <el-tag type="Info" class="fas fa-users">公開</el-tag>
      </div>
      <div v-else-if="toot.visibility == 'unlisted'">
        <el-tag type="Info" class="fas fa-user-lock">未収載</el-tag>
      </div>
      <div v-else-if="toot.visibility == 'private'">
        <el-tag type="Info" class="fas fa-user-check">フォロワー限定</el-tag>
      </div>
      <div v-else-if="toot.visibility == 'direct'">
        <el-tag type="danger" class="fas fa-comment-alt">DM</el-tag>
      </div>
      <div v-if="toot.account.locked == true">
        <el-tag type="warning" class="fas fa-lock">承認制アカウント</el-tag>
      </div>
      <div v-if="toot.account.bot == true">
        <el-tag type="info" class="fas fa-robot">Bot</el-tag>
      </div>
    </div>
    <div class="tootcard">
      <div>
        <img class="icon" :src="toot.account.avatar">
      </div>
      <div class="tootcontent">
        <div class="username">
          <router-link class="name" :to=userlink>
            <span>
              <bdi class="displayname">{{ toot.account.display_name }}</bdi>
              <span>{{ userid }}</span>
            </span>
          </router-link>
          <div class="time">
            <time :datatime="this.toot.created_at">{{ time }}</time>
          </div>
        </div>
        <div v-html="toot.content"></div>
        <div class="mediapreview" v-if="mediaoption == true">
          <img v-if="mediastate == 'image'" v-img:group="{ group: tootid }" :class="mediaclass" v-for="(media, i) in toot.media_attachments" :src="media.url" :key="i">
          <vue-plyr v-else-if="mediastate == 'video'" class="videoview">
            <video :poster="videoposter" class="style1">
              <source :src="videosrc" type="video/mp4">
            </video>
          </vue-plyr>
        </div>
        <div>
          <div class="action">
            <el-button class="fas fa-reply size" type="text"></el-button>
            <span v-if="detail == true">{{ reply }}</span>
          </div>
          <div class="action">
            <div v-if="toot.visibility == 'private'">
              <el-button type="text" disabled>
                <i class="fas fa-lock size"></i>
              </el-button>
              <span v-if="detail == true">✖</span>
            </div>
            <div v-else>
              <el-button type="text" @click="reblogaction()">
                <i v-if="reblogtap == false" class="fas fa-sync-alt size"></i>
                <i v-else class="fas fa-sync-alt size reblog"></i>
              </el-button>
              <span v-if="detail == true">{{ reblog }}</span>
            </div>
          </div>
          <div class="action">
            <el-button type="text" @click="favaction()">
              <i v-if="favtap == false" class="fas fa-star size"></i>
              <i v-else class="fas fa-star size fav"></i>
            </el-button>
            <span v-if="detail == true">{{ fav }}</span>
          </div>
          <div class="action">
            <el-button class="fas fa-align-left size" type="text"></el-button>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
import { PlyrVideo } from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

export default {
  name: 'toot',
  props: ['toot', 'detail'],
  data () {
    return {
      reply: this.toot.replies_count,
      reblog: this.toot.reblogs_count,
      fav: this.toot.favourites_count,
      reblogtap: false,
      favtap: false,
      mediaoption: false,
      mediaclass: {},
      userreblog: false,
      nowtime: new Date(),
      watchStime: false,
      watchMtime: false,
      mediastate: '',
      videosrc: '',
      videoposter: ''
    }
  },
  computed: {
    userlink () {
      const url = this.$store.getters.getactive[0].url
      return '/users/' + url + "/" + this.toot.account.id + '/toot'
    },
    rebloglink () {
      const url = this.$store.getters.getactive[0].url
      return '/users/' + url + "/" + this.toot.reblog.account.id + '/toot'
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
        return (a / 3600).toFixed() + '時間前'
      } else if ((a >= (3600 * 24)) && (a <( 3600 * 24 * 7))){
        return Math.floor(a / (3600 * 24)) + '日前'
      } else {
        return date.getMonth()+1 + '月' + date.getDate() + '日'
      }
    },
    tootid () {
      return this.toot.id
    }
  },
  created () {
    if (!!this.toot.media_attachments[0]) {
      this.mediaoption = true
      if ((this.toot.media_attachments[0].type == "video") || (this.toot.media_attachments[0].type == "gifv")) {
        this.mediastate = 'video'
        this.videosrc = this.toot.media_attachments[0].url
        this.videoposter = this.toot.media_attachments[0].preview_url
      } else if (this.toot.media_attachments[0].type == "image") {
        this.mediastate = 'image'
      }
      if (this.toot.media_attachments.length == 1) {
        this.mediaclass = "style1"
      } else if (this.toot.media_attachments.length == 2) {
        this.mediaclass = "style2"
      } else {
        this.mediaclass = "style4"
      }
    } else {
      if (this.toot.reblog == null) {
        this.userreblog = false
      } else {
        this.userreblog = true
      }
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
  },
  methods: {
    reblogaction () {
      if (this.reblogtap == false) {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.toot.id + '/reblog',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.reblogtap = !this.reblogtap
          this.reblog++
        })
      } else {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.toot.id + '/unreblog',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.reblogtap = !this.reblogtap
          this.reblog--
        })
      }
    },
    favaction () {
      if (this.favtap == false) {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.toot.id + '/favourite',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.favtap = !this.favtap
          this.fav++
        })
      } else {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.toot.id + '/unfavourite',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.favtap = !this.favtap
          this.fav--
        })
      }
    },
  },
  components: {
    PlyrVideo: 'vue-plyr'
  }
}
</script>

<style scoped>
.tootcard {
  display: block;
}

.action {
  display: inline-block;
  margin-right: 25px;
  height: 25px;
}
.icon {
  display: block;
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
.size {
  font-size: 20px;
  margin-right: 5px;
  color:rgb(96, 105, 132);
}
.fa-retweet:active {
  transform: rotate(0deg);
}
.tootstatus {
  display: inline-flex;
}
.tootcontent {
  display: block;
  position: relative;
  bottom: 60px;
  margin: 0 12px -60px 65px;
  word-break: break-all;
}
.fav {
  transform: rotate(360deg);
  transition: 0.8s;
  color: #ca8f04;
}
.reblog {
  transform: rotate(360deg);
  transition: 0.8s;
  color: #2b90d9;
}
.mediapreview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 250px;
  width: auto;
  object-fit: cover;
  overflow: hidden;
  border-radius: 5px;
  margin-top: 10px;
  padding: 0 3px 3px 3px;
  grid-gap: 5px;
}
.style1 {
  border: 1px solid #909399;
  border-radius: 5px;
  display: grid;
  grid-row: span 2;
  grid-column: span 2;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
}
.style2 {
  border: 1px solid #909399;
  border-radius: 5px;
  display: grid;
  grid-row: span 2;
  grid-column: span 1;
  height: 100%;
  width: 100%;
  object-position: 50% 50%;
  object-fit: cover;
  overflow: hidden;
}
.style4 {
  border: 1px solid #909399;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
}
.videoview {
  display: grid;
  grid-row: span 2;
  grid-column: span 2;
}
.boost {
  float: right;
}
</style>
