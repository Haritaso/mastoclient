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
          <div id="upload">
            <el-button
              size="medium"
              type="info"
              icon="el-icon-picture-outline"
              v-model="form.picture"
              class="btn"
              circle
            ></el-button>
          </div>
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
            <el-button class="tootbtn" size="medium" type="primary" @click="tootaction">トゥート!</el-button>
          </div>
        </div>
      </div>
    </el-form-item>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      form: {
        TootContent: '',
        visibility: 'public',
        cwContent: '',
        sensitive: false,
        media: [],
        imageurl: ''
      },
      cw: false,
      dialogVisible: false
    }
  },
  computed: {
    src: function () {
      return this.$store.getters.geticon
    },
    name: function () {
      return this.$store.getters.getdisplayname
    },
    id: function () {
      return this.$store.getters.getid
    }
  },
  methods: {
    changeVisibility (command) {
      this.$set(this.form, 'visibility', command)
    },
    tootaction () {
      this.$store.dispatch('tootaction', {
        data: this.form
      })
      this.form.TootContent = ''
      this.form.cwContent = ''
      this.form.media = []
    },
    handlePictureCardPreview(file) {
      this.imageurl = file.url;
      this.dialogVisible = true;
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
