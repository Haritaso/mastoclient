<template>
  <el-card key="toot.id" shadow="never">
    <div class="tootcard">
      <img class="icon" :src="toot.account.avatar">
      <div class="tootcontent">
        <div>
          <router-link :to=userlink>{{ toot.account.display_name }}</router-link>
        </div>
        <div v-html="toot.content"></div>
        <div class="mediapreview" v-if="mediaoption == true">
          <img :class="mediaclass" v-for="(media, i) in toot.media_attachments" :src="media.preview_url" :key="i" @click="mediaClick(i)">
          <vue-gallery-slideshow :images="mediaurl" :index="mediaindex" @close="mediaindex = null"></vue-gallery-slideshow>
        </div>
        <div>
          <div class="action">
            <el-button class="fas fa-reply size" type="text"></el-button>
            <span v-if="detail == true">{{ reply }}</span>
          </div>
          <div class="action">
            <el-button type="text" @click="reblogaction()">
              <i v-if="reblogtap == false" class="fas fa-sync-alt size"></i>
              <i v-else class="fas fa-sync-alt size reblog"></i>
            </el-button>
            <span v-if="detail == true">{{ reblog }}</span>
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
      mediaclass: {}
    }
  },
  computed: {
    userlink () {
      const url = this.$store.getters.getactive[0].url
      return '/users/' + url + "/" + this.toot.account.id + "/toot"
    },
  },
  created () {
    if ( !!this.toot.media_attachments[0] ) {
      this.mediaoption = true
    } else {
      this.mediaoption = false
    }
    if (this.toot.media_attachments.length == 1) {
      this.mediaclass = "style1"
    } else if (this.toot.media_attachments.length == 2) {
      this.mediaclass = "style2"
    } else {
      this.mediaclass = "style4"
    }
  },
  methods: {
    reblogaction () {
      if (this.reblogtap == false) {
        this.reblogtap = !this.reblogtap
        this.reblog++
      } else {
        this.reblogtap = !this.reblogtap
        this.reblog--
      }
    },
    favaction () {
      if (this.favtap == false) {
        this.favtap = !this.favtap
        this.fav++
      } else {
        this.favtap = !this.favtap
        this.fav--
      }
    },
    mediaClick(i) {
      console.log()
      if (this.mediainit === false) {
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
  display: inline-flex;
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
.fa {
  display: inline-block;
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
  margin: 0 12px 0 12px;
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
  display: inline-block;
  height: 200px;
  object-fit: cover;
  overflow: hidden;
  border-radius: 5px;
  margin-top: 10px;
}
.style1 {
  display: inline-block;
  position: relative;
  height: 100%;
  width: 100%;
  object-position: 50% 50%;
  object-fit: cover;
  overflow: hidden;
}
.style2 {
  display: inline-block;
  position: relative;
  border-radius: 4px;
  height: 100%;
  width: 50%;
  object-position: 50% 50%;
  object-fit: cover;
  overflow: hidden;
}
.style4 {
  display: inline-block;
  position: relative;
  border-radius: 4px;
  right: 2px;
  height: 50%;
  width: 50%;
  object-fit: cover;
  overflow: hidden;
}
</style>
