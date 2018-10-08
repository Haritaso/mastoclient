<template>
  <el-card key="toot.id" shadow="never">
    <div class="tootstatus">
      <div v-if="toot.reblog == null"></div>
      <div v-else>
        <el-tag type="success" class="fas fa-sync-alt">{{ toot.reblog.display_name + "さんがブースト" }}</el-tag>
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
            <time :datatime=time>-日</time>
          </div>
        </div>
        <div v-html="toot.content"></div>
        <div class="mediapreview" v-if="mediaoption == true">
          <img v-if="userreblog == false" :class="mediaclass" v-for="(media, i) in toot.media_attachments" :src="media.preview_url" :key="i" @click="mediaClick(i)">
          <img v-else-if="userreblog == true" :class="mediaclass" v-for="(media, i) in toot.reblog.media_attachments" :src="media.preview_url" :key="i" @click="mediaClick(i)">
          <vue-gallery-slideshow :images="mediaurl" :index="mediaindex" @close="mediaindex = null"></vue-gallery-slideshow>
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
import VueGallerySlideshow from 'vue-gallery-slideshow'
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
      mediaindex: null,
      mediaurl: [],
      mediainit: false,
      mediaclass: {},
      userreblog: false
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
      return this.toot.created_at
    }
  },
  created () {
    if (!!this.toot.media_attachments[0]) {
      this.mediaoption = true
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
    /* メモ
    const start = new Date()
    const date = new Date(this.toot.created_at)
    const d = start - date
    const a = (Math.floor(d)/ 1000).toString()
    */
  },
  methods: {
    reblogaction () {
      if (this.reblogtap == false) {
        axios({
          method: 'POST',
          url: this.toot.uri.replace('users/' + this.toot.account.acct, 'api/v1') + '/reblog',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.reblogtap = !this.reblogtap
          this.reblog++
        })
      } else {
        axios({
          method: 'POST',
          url: this.toot.uri.replace('users/' + this.toot.account.acct, 'api/v1') + '/unreblog',
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
          url: this.toot.uri.replace('users/' + this.toot.account.acct, 'api/v1') + '/favourite',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.favtap = !this.favtap
          this.fav++
        })
      } else {
        axios({
          method: 'POST',
          url: this.toot.uri.replace('users/' + this.toot.account.acct, 'api/v1') + '/unfavourite',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.favtap = !this.favtap
          this.fav--
        })
      }
    },
    mediaClick(i) {
      if (this.mediainit == false) {
        for (var media in this.toot.media_attachments) {
          this.mediaurl.push(this.toot.media_attachments[media].url)
        }
      }
      this.mediaindex = i
      this.mediainit = true
    }
  },
  components: {
    VueGallerySlideshow
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
  height: 30px;
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
.name {
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.displayname {
  color: black;
  text-decoration: none;
}
.time {
  position: absolute;
  right: 0px;
  top: 0px;
  float: right;
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
  height: 200px;
  width: auto;
  object-fit: cover;
  overflow: hidden;
  border-radius: 5px;
  margin-top: 10px;
  grid-gap: 5px;
}
.style1 {
  display: grid;
  grid-column: 1/3;
  grid-row: 1/3;
  object-fit: cover;
  overflow: hidden;
}
.style2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  width: 50%;
  object-position: 50% 50%;
  object-fit: cover;
  overflow: hidden;
}
.style4 {
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  border-radius: 5px;
}
.boost {
  float: right;
}
</style>
