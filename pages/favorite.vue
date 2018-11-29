<template>
  <section v-if="loading">
  </section>
  <section v-else>
    <el-tabs type="border-card">
      <el-tab-pane label="お気に入り">
        <toot v-for="toot in toots"
          :key="toot.id"
          :toot="toot"
          :detail="true"
          :loading="loading"
        ></toot>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>


<script>
import toot from '@/components/puttoot'
import axios from 'axios'
export default {
  data() {
    return {
      loading: true,
      toots: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.getfavdata()
    },0)
  },
  methods: {
    getfavdata() {
      axios({
        method: 'GET',
        url: 'https://' + this.$store.getters.getactive[0].url + '/api/v1/favourites',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        params: {
          limit: 40
        }
      })
      .then(res => {
        for (var i=0,d;d=res.data[i];i++) {
          this.toots.push(d)
        }
        this.loading = false
      })
    }
  },
  components: {
    toot
  }
}
</script>
