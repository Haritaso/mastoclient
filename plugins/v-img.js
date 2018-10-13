import Vue from 'vue'
import VueImg from 'v-img'

const vueImgConfig = {
  altAsTitle: false,
  sourceButton: false,
  openOn: 'click',
  thumbnails: true,
}

Vue.use(VueImg, vueImgConfig)
