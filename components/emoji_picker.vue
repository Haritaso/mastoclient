<template>
  <el-card class="box-card">
    <div slot="header" class="pickerhead">
      <span>Emoji Picker</span>
    </div>
    <div v-lazy-container="{ selector: 'img' }" class="pickspace">
      <img v-for="emoji in emojis" :src="emoji.url" v-lazy="emoji.url" :key="emoji.url" class="tootemoji emojipick" @click="emojitap(emoji.shortcode)"/>
    </div>
  </el-card>
</template>

<script>
import VueLazyload from 'vue-lazyload'
import axios from 'axios'

export default {
  name: "emojipicker",
  data() {
    return {
      emojis: [],
    }
  },
  mounted() {
    setTimeout(() => {
      this.getEmoji()
    },1000)
  },
  methods: {
    emojitap(name) {
      this.$emit('tap', name);
    },
    getEmoji() {
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/custom_emojis',
      })
      .then(res => {
        this.emojis = res.data
      })
    },
  },
}
</script>

<style scoped>
.pickerhead {

}
.pickspace {
  height: 400px;
  overflow: scroll;
}
.emojipick {
  margin: 0 6px 6px 0;
}
</style>
