<template>
  <el-card key="toot.id" shadow="never">
    <div class="tootcard">
      <img class="icon" :src="toot.account.avatar">
      <div class="tootcontent">
        <div>
          <router-link :to=userlink>{{ toot.account.display_name }}</router-link>
        </div>
        <div v-html="toot.content"></div>
        <div>
          <div class="action">
            <el-button class="fas fa-reply size" type="text"></el-button>
            <span v-if="detail == true">{{ reply }}</span>
          </div>
          <div class="action">
            <el-button type="text" @click="reblogaction()">
              <i v-if="reblogtap == false" class="fas fa-retweet size "></i>
              <i v-else class="fas fa-retweet size reblog"></i>
            </el-button>
            <span v-if="detail == true">{{ reblog }}</span>
          </div>
          <div class="action">
            <el-button type="text" @click="favaction()">
              <i v-if="favtap == false" class="fas fa-star size"></i>
              <i v-else class="fas fa-star size fav"></i>
            </el-button>
            <span v-if="detail == true">{{ fav }}</span>
          </div>
          <div class="action">
            <el-button class="fas fa-align-left size" type="text"></el-button>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'toot',
  props: ['toot', 'detail'],
  data () {
    return {
      reply: this.toot.replies_count,
      reblog: this.toot.reblogs_count,
      fav: this.toot.favourites_count,
      reblogtap: false,
      favtap: false
    }
  },
  computed: {
    userlink () {
      const url = this.$store.getters.getactive[0].url
      return '/users/' + url + "/" + this.toot.account.id + "/toot"
    }
  },
  methods: {
    reblogaction () {
      if (this.reblogtap == false) {
        this.reblogtap = !this.reblogtap
        this.reblog++
      } else {
        this.reblogtap = !this.reblogtap
        this.reblog--
      }
    },
    favaction () {
      if (this.favtap == false) {
        this.favtap = !this.favtap
        this.fav++
      } else {
        this.favtap = !this.favtap
        this.fav--
      }
    }
  }
}
</script>

<style scoped>
.tootcard {
  display: inline-flex;
}
.action {
  display: inline-block;
  margin-right: 25px;
  height: 30px;
}
.icon {
  display: block;
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  margin: 4px 0 auto 0;
  border: 3px solid #909399;
}
.fa {
  display: inline-block;
  font-weight: normal;
  font-size: inherit;
}
.size {
  font-size: 20px;
  margin-right: 5px;
  color:rgb(96, 105, 132);
}
.fa-retweet:active {
  transform: rotate(0deg);
}
.tootcontent {
  display: block;
  margin: 0 12px 0 12px;
  word-break: break-all;
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
