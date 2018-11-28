<template>
  <div>
    <div class="actionbar">
      <div class="action">
        <div  class="actionobj">
          <el-button class="fas fa-reply size" type="text" @click="showreply"></el-button>
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
      <div v-if="cw == true" class="dummyarea cwarea">
        <el-input placeholder="cw" class="inputanime" v-model="form.cwContent"></el-input>
      </div>
      <div v-else class="dummyarea"></div>
    </div>
    <transition mode="out-in" type="transition" appear>
      <div v-if="replyaction == false" class="noreply" />
      <div v-else class="replyaction">
        <el-input
          type="textarea"
          placeholder="今なにしてる？"
          v-model="form.TootContent"
          :autosize="{ minRows: 3, maxRows: 3}"
          class="tootinput"
        >
        </el-input>
        <div :style="tootoptionstyle">
          <div class="tootoption">
            <div class="tootvis">
              <el-upload
                :action="pictureUrl"
                :headers="pictureHeader"
                :show-file-list="false"
                multiple
                :limit="4"
                :on-change="pictureAdd"
                :on-progress="picturePro"
                :on-success="pictureSuc"
                :file-list="form.picture"
                list-type="picture"
              >
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-picture-outline"
                  class="btn"
                ></el-button>
              </el-upload>
              {{ mediacount }}
            </div>
            <div class="tootvis">
              <el-button
                size="mini"
                type="info"
                icon="el-icon-view"
                v-model="cw"
                @click="cw = !cw"
                class="btn"
              >
              </el-button>
              <div v-if="form.cwContent == ''">
                ✖
              </div>
              <div v-else class="textlimit">
                {{ form.cwContent }}
              </div>
            </div>
            <div v-show="nsfw" class="tootvis">
              <el-button
                size="mini"
                type="info"
                :icon="nsfwmode"
                @click="form.sensitive = !form.sensitive"
                class="btn"
              >
              </el-button>
            </div>
            <div class="tootvis">
              <el-dropdown @command="changeVisibility">
                <el-button
                  size="mini"
                  icon="el-icon-tickets"
                  type="info"
                  class="btn"
                >
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command='public'>公開</el-dropdown-item>
                  <el-dropdown-item command='unlisted'>未収載</el-dropdown-item>
                  <el-dropdown-item command='private'>非公開</el-dropdown-item>
                  <el-dropdown-item command='direct'>DM</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="toot">
              <el-button :loading="loading" size="medium" type="primary" @click="tootaction">トゥート!</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
      replyaction: false,
      form: {
        TootContent: "",
        visibility: "public",
        cwContent: "",
        sensitive: false,
        media: [],
      },
      cw: false,
      nsfw: false,
      dialogVisible: false,
      loading: false,
      filelist: [],
      first: false,
      mediacount: 0
    }
  },
  computed: {
    token () {
      return this.first ? this.$store.getters.getactive[0].accessToken : "dummy"
    },
    pictureUrl() {
      return "https://" + this.$store.getters.geturl + "/api/v1/media";
    },
    pictureHeader() {
      return {
        Authorization: "Bearer " + this.token
      }
    },
    nsfwmode () {
      let a = ""
      if (this.form.sensitive == false) {
        a = "el-icon-question"
      } else {
        a = "el-icon-warning"
      }
      return a
    },
    tootoptionstyle () {
      var a = this.loading ? this.$store.getters.getactive[0].bcolor : "#545c64"
      return {
        'background-color':  a,
        'border-radius': '0 0 5px 5px',
        'margin-top': '-1px'
      }
    }
  },
  methods: {
    changeVisibility(command) {
      this.$set(this.form, "visibility", command);
    },
    tootaction() {
      this.$store.dispatch("tootaction", {
        data: this.form
      });
      this.form.TootContent = ""
      this.form.cwContent = ""
      this.form.media = []
      this.filelist = []
      this.nsfw = true
    },
    handlePictureCardPreview(file) {
      this.imageurl = file.url
      this.dialogVisible = true
    },
    pictureAdd(file, filelist) {
      this.filelist = filelist
      this.loading = true
    },
    picturePro (event, file, filelist) {
      console.log(event)
    },
    pictureSuc(response, file, filelist) {
      this.filelist = filelist
      this.form.media.push(filelist[this.mediacount].response.id)
      this.mediacount++
      this.nsfw = true
      this.$nextTick(() => {
        this.loading = false
      })
    },
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
    },
    showreply() {
      this.$nextTick(() => {
        this.replyaction = !this.replyaction
      })
    },
  },
  mounted () {
    this.first = true
    this.loading = false
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
  grid-template-rows: auto 0px;
  padding: 0.5em 0;
}
.replyaction {
  grid-row: 2 / 3;
  grid-column: span 4;
  display: grid;
  height: 116px;
  grid-template-rows: 76px auto;
  transition: all 300ms cubic-bezier(0, 1, 1, 1);
}
.cwarea {
  grid-column: 1 /5;
  z-index: 2;
  bottom: 43px;
  position: relative;
}
.dummyarea {
  grid-row: 2;
  height: 0px;
}
.inputanime {
  height: 40px;
  transition: all 300ms cubic-bezier(0, 1, 1, 1);
}
.toot {
  justify-self: end;
  width: 100px;
}
.tootoption {
  display: grid;
  grid-auto-flow: column;
  height: 40px;
  border-radius: 0 0 5px 5px;
  align-content: center;
}
.noreply {
  grid-row: 2 / 3;
  grid-column: span 4;
  height: 1px;
  transition: all 300ms cubic-bezier(0, 1, 1, 1);
}
.tootvis {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  color: #fff;
  font-size: 0.75em;
}
.textlimit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-inline-size: 4em;
}
.action {
  position: relative;
  align-self: center;
  grid-row: 1;
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
.el-button {
  padding: 0;
}
</style>
