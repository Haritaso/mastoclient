<template>
  <div>
    <component v-for="(style, name) in styles" :is="style" :key="name" :name="name">
      <hsc-window id="target" :title="id + 'で投稿'" class="tootbar" :top.sync="top" :closeButton="true" :isOpen.sync="isOpen" :isScrollable="true">
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
        <div class="option">
          <el-input class="cwinput" v-show="cwtoggle" placeholder="cw" size="medium" v-model="toot.cwContent"></el-input>
          <div class="optionbtn">
            <el-button size="medium" type="info" icon="el-icon-view" circle @click="cwtoggle = !cwtoggle"></el-button>
            <el-button size="medium" type="info" icon="el-icon-picture-outline" circle></el-button>
          </div>
        </div>
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
  props: ['isOpen'],
  data () {
    return {
      toot: {
        TootContent: '',
        visibility: 'public',
        cwContent: '',
        sensitive: false,
        media: [],
        imageurl: ''
      },
      top: 0,
      scrolly: 0,
      cwtoggle: false,
      styles
    }
  },
  computed: {
    id () {
      return this.$store.getters.getid
    }
  },
  methods: {
    tootaction () {
      this.$store.dispatch('tootaction', {
        data: this.toot
      })
      this.toot.TootContent = ''
      this.toot.cwContent = ''
      this.toot.media = []
    },
    handlePictureCardPreview(file) {
      this.imageurl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style scope>
.el-select .el-input {
  width: 95px;
}
.postmenu {
  display: inline-flex;
}
.option {
  display: inline-flex;
  margin-top: 8px;
}
.optionbtn {
  min-width: 98px;
  margin-left: auto;
  text-align: center;
}
.cwinput {
  float:left;
  max-width: 230px;
}
.content {
  display: inline-grid;
}
.tootbtn {
  text-align: right;
  margin-left: 8px;
}
.tootbar {
  z-index: 100!important;
}
.window {
  max-width: 377px;
  min-width: 377px;
  border-radius: 4px!important;
  position: fixed!important;
}
.window .titlebar{
  border-radius: 0px!important;
}
.title {
  font-size: 12px;
}
</style>
