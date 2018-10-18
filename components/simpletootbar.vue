<template>
  <div>
    <component v-for="(style, name) in styles" :is="style" :key="name" :name="name">
      <hsc-window
        :title="id + 'で投稿'"
        class="tootbar"
        :closeButton="true"
        :isOpen.sync="isOpenbar"
        :isScrollable="true"
        :resizable="true"
        :minWidth="320"
        :maxWidth="800"
        :minHeight="100"
        :maxHeight="100"
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
            <el-button size="medium" type="info" icon="el-icon-view" circle @click="cwtoggle = !cwtoggle"></el-button>
            <el-button size="medium" type="info" icon="el-icon-picture-outline" circle></el-button>
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
        imageurl: ''
      },
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
  display: inline-block;
  margin: 0 8px 0 8px;
  width: 95%;
}
.optionbtn {
  min-width: 100px;
  max-height: 36px;
  margin: auto 6px auto auto;
  display: inline-flex;
  justify-content: space-around;
}
.tootbar {
  z-index: 100!important;
}
.window {
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
