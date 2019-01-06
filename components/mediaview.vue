<template>
  <div class="mediapreview" v-if="mediaoption == true">
    <img v-if="mediastate == 'image'" v-img:group="{ group: tootid }" :class="mediaclass" v-for="(media, i) in mdata" :src="media.url" :key="i">
    <img v-else-if="mediastate == 'video'" :class="mediaclass" :src="mdata[0].preview_url" @click="videowindow = !videowindow">
    <el-dialog
      title=""
      :fullscreen=false
      :modal=false
      :append-to-body=true
      :center=true
      :visible.sync="videowindow"
    >
      <vue-plyr class="videoview">
        <video :poster="videoposter" class="style1">
          <source :src="videosrc" type="video/mp4">
        </video>
      </vue-plyr>
    </el-dialog>
  </div>
</template>

<script>
import { PlyrVideo } from 'vue-plyr'
import VueImg from 'v-img'
import 'vue-plyr/dist/vue-plyr.css'
export default {
  name: 'mediaview',
  props: ['mdata', 'preid'],
  data () {
    return {
      mediaoption: false,
      mediaclass: {},
      mediastate: '',
      videosrc: '',
      videoposter: '',
      videowindow: false,
    }
  },
  computed: {
    tootid () {
      return this.mdata[0].id + this.preid
    }
  },
  created () {
    if (!!this.mdata[0]) {
      this.mediaoption = true
      if ((this.mdata[0].type == "video") || (this.mdata[0].type == "gifv")) {
        this.mediastate = 'video'
        this.videosrc = this.mdata[0].url
        this.videoposter = this.mdata[0].preview_url
      } else if (this.mdata[0].type == "image") {
        this.mediastate = 'image'
      }
      if (this.mdata.length == 1) {
        this.mediaclass = "style1"
      } else if (this.mdata.length == 2) {
        this.mediaclass = "style2"
      } else {
        this.mediaclass = "style4"
      }
    }
  },
  components: {
    PlyrVideo: 'vue-plyr',
  }
}
</script>

<style scoped>
.mediapreview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 250px;
  width: auto;
  object-fit: cover;
  overflow: hidden;
  border-radius: 5px;
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
</style>
