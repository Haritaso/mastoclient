<template>
  <el-card class="box-card">
    <div slot="header" class="pickerhead">
      <el-input placeholder="検索…" v-model="search"></el-input>
    </div>
    <div v-if="searchstart" v-lazy-container="{ selector: 'img' }" class="pickspace">
      <img v-for="emoji in emojis" :src="emoji.url" v-lazy="emoji.url" :key="emoji.url" class="tootemoji emojipick" @click="emojitap(emoji.shortcode)"/>
    </div>
    <div v-else v-lazy-container="{ selector: 'img' }" class="pickspace">
      <img v-for="emoji in searchfilter" :src="emoji.url" v-lazy="emoji.url" :key="emoji.url" class="tootemoji emojipick" @click="emojitap(emoji.shortcode)"/>
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
      search: ''
    }
  },
  computed: {
    searchstart() {
      if(this.search === '') {
        return true
      }
      return false
    },
    searchfilter() {
      let emojis = []
      for(const i in this.emojis) {
        let searchdata = this.emojis[i]
        if(searchdata.shortcode.startsWith(this.search)) {
          emojis.push(searchdata)
        }
      }
      return emojis
    },
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
  height: 300px;
  overflow: visible;
  overflow-y: scroll;
}
.pickspace::-webkit-scrollbar{
  width: 10px;
}
.pickspace::-webkit-scrollbar-track{
  background: #ebebeb;
  border: none;
  border-radius: 8px;
}
.pickspace::-webkit-scrollbar-thumb{
  background: #aaa;
  border-radius: 10px;
  box-shadow: none;
}
.emojipick {
  margin: 0 6px 6px 0;
}
</style>
