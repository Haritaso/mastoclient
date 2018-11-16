<template>
  <section v-if="error">
    error
  </section>
  <section v-else>
    <div v-if="loading">
      <el-card :key="data.id" shadow="never">
        <ContentLoader :speed="1" :height="95">
          <rect x="0" y="0" rx="4" ry="4" width="200" height="20" />
          <rect x="0" y="22" rx="0" ry="0" width="40" height="40" />
          <rect x="45" y="22" rx="8" ry="8" width="120" height="16" />
          <rect x="45" y="45" rx="8" ry="8" width="300" height="16" />
          <rect x="45" y="68" rx="8" ry="8" width="180" height="16" />
        </ContentLoader>
      </el-card>
    </div>
    <div v-else>
      <el-card :key="data.id" shadow="never">
        <div class="ncard">
          <div class="toottype">
            <div v-if="data.type == 'favourite'">
              <el-tag type="warning" class="fas fa-star status">
                {{ data.account.display_name + "さんがお気に入り登録" }}
              </el-tag>
            </div>
            <div v-else-if="data.type == 'reblog'">
              <el-tag type="success" class="fas fa-sync-alt status">
                {{data.account.display_name + "さんがブースト"}}
              </el-tag>
            </div>
            <div v-else-if="data.type == 'follow'">
              <el-tag type="primary" class="fas fa-user-plus status">
                {{ data.account.display_name + "さんにフォローされました"}}
              </el-tag>
            </div>
            <div v-else-if="data.type == 'mention'">
              <el-tag type="info" class="fas fa-at status">
                {{ data.account.display_name + "さんからのリプライ"}}
              </el-tag>
            </div>
          </div>
          <div class="tootbox">
            <div class="box">
              <div>
                <div class="icons" v-if="data.type == 'favourite'">
                  <img class="undericon" :src="underIcon">
                  <img class="actionicon" :src="data.account.avatar">
                </div>
                <div class="icons" v-else-if="data.type == 'reblog'">
                  <img class="undericon" :src="underIcon">
                  <img class="actionicon" :src="data.account.avatar">
                </div>
                <div class="singleicon" v-else>
                  <img class="icon" :src="data.account.avatar">
                </div>
              </div>
            </div>
            <div class="tootcontent">
              <div class="username">
                <router-link class="name" :to=userlink>
                  <span v-if="data.type == 'favourite'">
                    <bdi class="displayname">{{ data.status.account.display_name }}</bdi>
                    <bdi class="displayname" v-if="data.status.account.display_name == ''">{{ data.status.account.username }}</bdi>
                    <span>{{ userid }}</span>
                  </span>
                  <span v-else-if="data.type == 'reblog'">
                    <bdi class="displayname">{{ data.status.account.display_name }}</bdi>
                    <bdi class="displayname" v-if="data.status.account.display_name == ''">{{ data.status.account.username }}</bdi>
                    <span>{{ userid }}</span>
                  </span>
                  <span v-else>
                    <bdi class="displayname">{{ data.account.display_name }}</bdi>
                    <bdi class="displayname" v-if="data.account.display_name == ''">{{ data.account.username }}</bdi>
                    <span>{{ userid }}</span>
                  </span>
                </router-link>
                <div class="time">
                  <time :datatime="data.created_at">{{ time }}</time>
                </div>
              </div>
              <div class="toot">
                <div v-if="data.type == 'favourite'" class="text">
                  <div v-html="data.status.content"></div>
                  <mediaview :mdata="data.status.media_attachments" />
                </div>
                <div v-else-if="data.type == 'reblog'" class="text">
                  <div v-html="data.status.content"></div>
                  <mediaview :mdata="data.status.media_attachments" />
                </div>
                <div v-else-if="data.type == 'mention'" class="reply text">
                  <div v-html="data.status.content"></div>
                  <mediaview :mdata="data.status.media_attachments" />
                  <tootaction
                    :rp="0"
                    :rb="0"
                    :fv="0"
                    :rbtap="false"
                    :fvtap="false"
                    :urbtap="false"
                    :visibility="data.status.visibility"
                    :id="data.id"
                    :detail="false"
                  />
                </div>
                <div v-else-if="data.type == 'follow'" class="followobj">
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </section>
</template>

<script>
import puttoot from '../components/puttoot'
import { ContentLoader } from 'vue-content-loader'
import mediaview from './mediaview'
import tootaction from './tootaction'
export default {
  name: "notification",
  props: ["data"],
  data() {
    return {
      nowtime: new Date(),
      watchStime: false,
      watchMtime: false,
      loading: true,
      error: false
    };
  },
  computed: {
    userlink() {
      const url = this.$store.getters.getactive[0].url;
      return '/users?url=' + url + "&id=" + this.data.account.id
    },
    underIcon () {
      return !this.loading ? this.data.status.account.avatar : 'dummy'
    },
    userid() {
      if (this.data.account.acct.indexOf("@") == true) {
        if (this.data.type == ("favourite" || "reblog")) {
          return this.data.status.account.acct;
        } else {
          return this.data.account.acct;
        }
      } else {
        if (this.data.type == ("favourite" || "reblog")) {
          return "@" + this.data.status.account.acct;
        } else {
          return "@" + this.data.account.acct;
        }
      }
    },
    time() {
      const time = this.nowtime;
      const date = new Date(this.data.created_at);
      const d = time.getTime() - date.getTime();
      const a = (d / 1000).toFixed();
      if (a < 60) {
        this.watchStime = true;
        return a + "秒前";
      } else if (a >= 60 && a < 3600) {
        this.watchStime = false;
        this.watchMtime = true;
        return (a / 60).toFixed() + "分前";
      } else if (a >= 3600 && a < 3600 * 24) {
        this.watchMtime = false;
        return Math.floor(a / 3600) + "時間前";
      } else if (a >= 3600 * 24 && a < 3600 * 24 * 7) {
        return Math.floor(a / (3600 * 24)) + "日前";
      } else {
        return date.getMonth() + 1 + "月" + date.getDate() + "日";
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.loading = false
    },1000)
    if (this.watchStime == true) {
      setInterval(() => {
        this.nowtime = new Date();
      }, 5000);
    } else if (this.watchMtime == true) {
      setInterval(() => {
        this.nowtime = new Date();
      }, 50000);
    }
  },
  components: {
    puttoot,
    ContentLoader,
    mediaview,
    tootaction
  }
};
</script>

<style scoped>
.status {
  line-height: 2;
}
.ncard {
  display: grid;
  grid-template-rows: 2em 1fr;
}
.tootbox {
  display: grid;
  grid-template-columns: 54px 1fr;
  word-break: break-all;
  margin: 0 0 0.5em 0;
}
.box {
}
.toottype {
  position: relative;
  max-width: 100%;
  display: flex;
  align-items: center;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.typeline {
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.action {
  display: inline-block;
  margin-right: 25px;
  height: 25px;
}
.icons {
  display: grid;
  grid-template-rows: 44px 34px 1fr;
}
.icon {
  display: block;
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  border: 2px solid #909399;
}
.undericon {
  display: block;
  width: 40px;
  min-width: 40px;
  height: 40px;
  min-height: 40px;
  border: 2px solid #909399;
}
.actionicon {
  display: block;
  width: 30px;
  min-width: 30px;
  height: 30px;
  min-height: 30px;
  border: 2px solid #909399;
  justify-self: end;
  position: relative;
  bottom: 20px;
}
.text {
  margin: 0.5em 0;
}
.tootcontent {
  display: inline-grid;
  margin: 0 0.5em;
  grid-template-rows: 1.5em 1fr;
}
.username {
  max-width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.name {
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.displayname {
  color: black;
  text-decoration: none;
}
.followobj {
  display: flex;
  justify-content: space-between;
}
.followdata {
  margin: 0px 0px 10px 0px;
  width: 100%;
  min-width: 85%;
}
.followcount {
  display: flex;
  justify-content: space-around;
}
.followbioobj {
  border: 2px ridge black;
  text-align: center;
}
.followbtn {
  margin: 0 0 auto 12px;
  height: 80px;
}
.toot {
  margin-right: 2px;
  align-self: start;
}
</style>
