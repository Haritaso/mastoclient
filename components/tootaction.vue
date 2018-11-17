<template>
  <div class="actionbar">
    <div class="action">
      <div  class="actionobj">
        <el-button class="fas fa-reply size" type="text"></el-button>
        <div v-if="detail == true" class="actionobj">{{ reply }}</div>
      </div>
    </div>
    <div class="action">
      <div v-if="visibility == 'private'" class="actionobj">
        <el-button type="text" disabled>
          <i class="fas fa-lock size"></i>
        </el-button>
        <div v-if="detail == true" class="actionobj">✖</div>
      </div>
      <div v-else class="actionobj">
        <el-button type="text" @click="reblogaction()">
          <i v-if="reblogtap == false" class="fas fa-sync-alt size"></i>
          <i v-else class="fas fa-sync-alt size reblog"></i>
        </el-button>
        <div v-if="detail == true" class="actionobj">{{ reblog }}</div>
      </div>
    </div>
    <div class="action">
      <div class="actionobj">
        <el-button type="text" @click="favaction()">
          <i v-if="favtap == false" class="fas fa-star size"></i>
          <i v-else class="fas fa-star size fav"></i>
        </el-button>
        <div v-if="detail == true" class="actionobj">{{ fav }}</div>
      </div>
    </div>
    <div class="action">
      <el-button class="fas fa-align-left size" type="text"></el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'tootaction',
  props: ['rp', 'rb', 'fv', 'rbtap', ' fvtap', 'urbtap', 'visibility', 'id' ,'detail'],
  data () {
    return {
      reply: 0,
      reblog: 0,
      fav: 0,
      reblogtap: false,
      favtap: false,
      userreblog: false,
    }
  },
  methods: {
    reblogaction () {
      if (this.reblogtap == false) {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.id + '/reblog',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.reblogtap = !this.reblogtap
          this.reblog++
        })
      } else {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.id + '/unreblog',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.reblogtap = !this.reblogtap
          this.reblog--
        })
      }
    },
    favaction () {
      if (this.favtap == false) {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.id + '/favourite',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.favtap = !this.favtap
          this.fav++
        })
      } else {
        axios({
          method: 'POST',
          url: 'https://' + this.$store.getters.geturl + '/api/v1/statuses/' + this.id + '/unfavourite',
          headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        })
        .then (res => {
          this.favtap = !this.favtap
          this.fav--
        })
      }
    }
  },
  mounted () {
    this.reply = this.rp
    this.reblog = this.rb
    this.fav = this.fv
    this.userreblog = this.urbtap
    if (this.rbtap == true) {
      this.reblogtap = true
      this.reblog++
    }
    if (this.fvtap == true) {
      this.favtap = true
      this.fav++
    }
  },
}
</script>

<style scoped>
.actionbar {
  display: grid;
  grid-auto-flow: column;
}
.action {
  position: relative;
  min-width: 4em;
  max-height: 24px;
  align-self: center;
  display: inline-block;
}
.actionobj {
  display: flex;
  align-items: center;
}
.size {
  font-size: 20px;
  margin-right: 5px;
  color: rgb(96, 105, 132);
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
</style>
