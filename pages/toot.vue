<template>
  <el-form
    ref="form"
    :model="form"
    label-width="120px"
    label-position=top
  >
    <el-form-item>
      <i class="id">{{ id + "で投稿"}}</i>
      <transition name="cw">
        <el-input v-show="cw" placeholder="cw" v-model="form.cwContent"></el-input>
      </transition>
      <el-input
        type="textarea"
        placeholder="今なにしてる？"
        :autosize="{ minRows: 5, maxRows: 10}"
        v-model="form.TootContent"
        class="tootinput"
      >
      </el-input>
      <div class="buttons">
        <div class="tootoption">
          <el-upload
            class=""
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
              size="medium"
              type="info"
              icon="el-icon-picture-outline"
              class="btn"
              circle
            ></el-button>
          </el-upload>
          <div>
            <el-button
              size="medium"
              type="info"
              icon="el-icon-view"
              v-model="cw"
              circle
              @click="cw = !cw"
              class="btn"
            >
            </el-button>
          </div>
          <div v-show="nsfw">
            <el-button
              size="medium"
              type="info"
              :icon="nsfwmode"
              circle
              @click="form.sensitive = !form.sensitive"
              class="btn"
            >
            </el-button>
          </div>
          <div>
            <el-dropdown @command="changeVisibility">
              <el-button
                size="medium"
                icon="el-icon-tickets"
                circle
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
        </div>
        <div>
          <div class="toot">
            <el-button :loading="loading" class="tootbtn" size="medium" type="primary" @click="tootaction">トゥート!</el-button>
          </div>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
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
    src() {
      return this.$store.getters.geticon;
    },
    name() {
      return this.$store.getters.getdisplayname;
    },
    id() {
      return this.$store.getters.getid;
    },
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
    }
  },
  mounted () {
    setTimeout(() => {
      this.first = true
      this.loading = false
    }, 1)
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
    }
  }
}
</script>

<style scoped>
.cw-enter-active {
  transition-duration: 0.5s;
}
.buttons {
  display: block;
  background-color: #ebebeb;
  position: relative;
  border-radius: 0px 0px 5px 5px;
}
.tootoption {
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
}
.btn {
  margin: 8px 10px 0px 0px;
  height: 36px;
  width: 36px;
}
.toot {
  text-align: right;
  margin-right: 10px;
}
.tootbtn {
  margin-bottom: 8px;
}
</style>
