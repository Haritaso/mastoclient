<template>
  <div>
    <component v-for="(style, name) in styles" :is="style" :key="name" :name="name">
      <hsc-window
        :title="id + 'で投稿'"
        class="tootbar"
        :closeButton="true"
        :isOpen.sync="isOpenbar"
        :resizable="true"
        :minWidth="320"
        :maxWidth="800"
        :minHeight="98"
        :maxHeight="110"
        positionHint="20 / 50"
      >
        <div class="postmenu">
          <el-input placeholder="今なにしてる？" v-model="toot.TootContent">
            <el-select v-model="toot.visibility" slot="prepend" placeholder="Select">
              <el-option label="公開" value="public"></el-option>
              <el-option label="未収載" value="unlisted"></el-option>
              <el-option label="非公開" value="private"></el-option>
              <el-option label="DM" value="direct"></el-option>
            </el-select>
          </el-input>
          <el-button class="tootbtn" size="medium" type="primary" @click="tootaction">トゥート!</el-button>
        </div>
        <el-popover
          placement="top-start"
          width="300"
          trigger="click"
        >
          <el-input class="cwinput" v-show="cwtoggle" placeholder="cw" size="medium" v-model="toot.cwContent"></el-input>
          <div class="optionbtn">
            <div class="optionbtn1">
              <div><el-button size="medium" type="info" icon="el-icon-view" circle @click="cwtoggle = !cwtoggle"></el-button></div>
              <el-upload
                class=""
                :action="pictureUrl"
                :headers="pictureHeader"
                :show-file-list="false"
                multiple
                :limit="4"
                :on-change="pictureAdd"
                :on-success="pictureSuc"
                :file-list="toot.picture"
                list-type="picture"
              >
                <el-button
                  :loading="loading"
                  size="medium"
                  type="info"
                  icon="el-icon-picture-outline"
                  class="btn"
                  circle
                ></el-button>
              </el-upload>
              <div v-show="nsfw">
                <el-button
                  size="medium"
                  type="info"
                  :icon="nsfwmode"
                  circle
                  @click="toot.sensitive = !toot.sensitive"
                  class="btn"
                >
                </el-button>
              </div>
            </div>
            <div class="preimg">
              <img
                v-if="mediacount > 0"
                class="tootbarpre"
                v-for="(item, i) in filelist"
                :key="i"
                :src="item.url"
              >
            </div>
          </div>
          <el-button class="option" type="mini" slot="reference">Option</el-button>
        </el-popover>
      </hsc-window>
    </component>
  </div>
</template>

<script>
let StyleUser
if (process.browser) {
  const {StyleFactory, StyleMetal} = require('@hscmap/vue-window')
  StyleUser = StyleFactory({
    button: {
      color: 'white'
    },
    buttonActive: {
      color: 'white'
    },
    buttonHover: {
      backgroundColor: 'rgba(255, 0, 0, 0.8)'
    },
    content: {
      backgroundColor: 'rgba(84, 92, 100, 0.8)'
    },
    titlebar: {
      background: 'rgba(84, 92, 100, 1)'
    },
    window: {
      border: '1px solid #000',
      color: 'white',
    },
  })
}
const styles = { StyleUser }
export default {
  name: 'tootbar',
  props: ['isOpenbar'],
  data () {
    return {
      toot: {
        TootContent: '',
        visibility: 'public',
        cwContent: '',
        sensitive: false,
        media: [],
      },
      cwtoggle: false,
      nsfw: false,
      loading: false,
      filelist: [],
      first: false,
      mediacount: 0,
      styles
    }
  },
  computed: {
    id () {
      return this.$store.getters.getid
    },
    token () {
      return this.first ? this.$store.getters.getactive[0].accessToken : "dummy"
    },
    pictureUrl() {
      return "https://" + this.$store.getters.geturl + "/api/v1/media"
    },
    pictureHeader() {
      return {
        Authorization: "Bearer " + this.token
      }
    },
    nsfwmode () {
      let a = ""
      if (this.toot.sensitive == false) {
        a = "el-icon-question"
      } else {
        a = "el-icon-warning"
      }
      return a
    }
  },
  mounted () {
    setTimeout(() => {
      this.first = true
      this.loading = false
    }, 1)
  },
  methods: {
    tootaction () {
      this.$store.dispatch('tootaction', {
        data: this.toot
      })
      this.toot.TootContent = ''
      this.toot.cwContent = ''
      this.toot.media = []
      this.filelist = []
      this.nsfw = true
    },
    pictureAdd(file, filelist) {
      this.filelist = filelist
      this.loading = true
    },
    pictureSuc(response, file, filelist) {
      this.filelist = filelist
      this.toot.media.push(filelist[this.mediacount].response.id)
      this.mediacount++
      this.nsfw = true
      this.$nextTick(() => {
        this.loading = false
        this.toot.media = this.toot.media
      })
    }
  }
}
</script>

<style scope>
.tootbarpre {
  width: 36px;
  height: 36px;
  display: block;
  border-radius: 50%;
}
.preimg {
  float: right;
  display: inline-flex;
}
.el-select .el-input {
  width: 95px;
}
.postmenu {
  display: inline-flex;
  text-align: center;
  margin: auto 8px auto 8px;
}
.content {
  display: inline-grid;
}
.tootbtn {
  text-align: right;
  margin: 0 12px 0 8px;
  max-height: 40px;
}
.cwinput {
  display: inline-flex;
  margin: auto 0 auto 0;
}
.option {
  display: inline-flex;
  margin: auto 20px auto 8px;
  width: -webkit-fill-available;
}
.optionbtn {
  max-height: 36px;
  display: block;
}
.optionbtn1 {
  display: inline-flex;
  float: left;
}
.tootbar {
  z-index: 100 !important;
  max-height: 130px;
  min-height: 120px;
  margin-right: 15px;
}
.window {
  border-radius: 4px !important;
  position: fixed !important;
}
.window .titlebar {
  border-radius: 0px !important;
}
.title {
  font-size: 12px;
}
</style>
