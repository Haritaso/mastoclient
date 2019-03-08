<template>
  <el-card class="box-card">
    <div slot="header" class="pickerhead">
      <el-input placeholder="検索…" prefix-icon="el-icon-search" v-model="search" clearable></el-input>
    </div>
    <div
      v-if="searchstart"
      v-lazy-container="{ selector: 'img' }"
      class="pickspace"
      v-loading="loading"
      >
      <div>カスタム絵文字</div>
      <el-tooltip v-for="emoji in emojis" :key="emoji.id" :content="':' + emoji.shortcode + ':'" placement="bottom" effect="light" :open-delay="800">
        <img :src="emoji.url" v-lazy="emoji.url" :key="emoji.url" class="tootemoji emojipick" @click="emojitap(emoji.shortcode)"/>
      </el-tooltip>
    </div>
    <div
      v-else
      v-lazy-container="{ selector: 'img' }"
      class="pickspace"
      v-loading="searchstart"
      >
      <div>:{{ search }}:の検索結果</div>
      <el-tooltip v-for="emoji in searchfilter" :key="emoji.id" :content="':' + emoji.shortcode + ':'" placement="bottom" effect="light" :open-delay="800">
        <img :src="emoji.url" v-lazy="emoji.url" :key="emoji.url" class="tootemoji emojipick" @click="emojitap(emoji.shortcode)"/>
      </el-tooltip>
    </div>
    <div>{{ emojiLength }}件の絵文字</div>
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
      search: '',
      preload: false,
      loading: true,
      searchloading: false,
    }
  },
  computed: {
    searchstart() {
      if(this.search == '') {
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
    emojiLength() {
      if(this.searchstart == false) {
        return this.searchfilter.length
      }
      return this.emojis.length
    }
  },
  mounted() {
    this.preload = false
    setTimeout(() => {
      this.getEmoji()
    },1000)
    this.$Lazyload.$once('loaded',() => {
      this.preload = true
    })
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
        this.loading = false
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
  margin: 4px;
}
</style>
