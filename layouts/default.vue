<template>
  <el-container class="aside">
    <transition name="tran">
      <div v-show="drawer">
      <el-aside>
        <el-menu
          :router="true"
          :background-color="Bcolor"
          :text-color="Tcolor"
          :active-text-color="Acolor"
          class="useraside"
          @select="handleSelect"
        >
          <el-menu-item index="1" :route="userpage" class="usertab">
            <img class="icon" :src=src>
            <span class="name">{{ name }}</span>
            <span class="id">{{ id }}</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">
              <span>アカウント切り替え</span>
            </template>
            <el-menu-item-group title="既存のアカウントに切り替え">
              <el-menu-item
                default-active="2-0"
                v-for="(item, i) in $store.state.users"
                :key="item.index"
                :index="'2-'+ i"
                route="/home"
              >
                <div class="username">
                  <div @click="change(item.index)">{{ item.id }}</div>
                  <el-button
                    @click="remove(item.index)"
                    type="danger"
                    size="mini"
                    class="removebtn"
                    plain
                  >
                    <i class="fas fa-user-minus"></i>
                  </el-button>
                </div>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="新しいアカウントを追加">
              <el-menu-item index="2-99" route='/home' type="text" @click="openDialog1">
                インスタンス名から追加
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3" route='/home' @click="closetab">
            <i class="el-icon-document" />
            <span>ホーム</span>
          </el-menu-item>
          <el-menu-item index="4" route='/toot' @click="closetab">
            <i class="el-icon-edit" />
            <span>トゥート！</span>
          </el-menu-item>
          <el-menu-item index="5" route='/notification' @click="closetab">
            <i class="el-icon-bell" />
            <span>通知</span>
          </el-menu-item>
          <el-menu-item index="6" route='/favorite' @click="closetab">
            <i class="el-icon-star-off" />
            <span>お気に入り一覧</span>
          </el-menu-item>
          <el-menu-item index="7" route='/direct_message' @click="closetab">
            <i class="el-icon-message" />
            <span>DM</span>
          </el-menu-item>
          <el-menu-item index="8" route='/setting' @click="closetab">
            <i class="el-icon-more-outline" />
            <span>設定</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      </div>
    </transition>
    <el-container>
      <el-header :style="headerstyle">
        <el-menu
          class="header"
          :default-active="nowindex"
          mode="horizontal"
          :background-color="Bcolor"
          :text-color="Tcolor"
          :active-text-color="Acolor"
          @select="handleSelect"
        >
          <el-menu-item index="1" @click="drawer = !drawer" v-show="drawer == false">
            <i class="el-icon-menu"></i>
          </el-menu-item>
          <el-menu-item index="2">{{ logo }}</el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main">
        <nuxt :nuxt-child-key="$route.fullPath" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      nowindex: "1",
      setcolor: false,
      drawer: false,
      setup: false
    };
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
    userpage () {
      return this.setup ? '/users?url=' + this.$store.getters.geturl + "&id=" + this.$store.getters.getactive[0].data.id : '/home';
    },
    Tcolor() {
      return this.setcolor ? this.$store.getters.getactive[0].tcolor : "#fff";
    },
    Acolor() {
      return this.setcolor
        ? this.$store.getters.getactive[0].acolor
        : "#409EFF";
    },
    Bcolor() {
      return this.setcolor
        ? this.$store.getters.getactive[0].bcolor
        : "#545c64";
    },
    logo () {
      if (this.drawer == false) {
        var a = 'MastoClient'
      } else {
        var a = '<戻る'
      }
      return a
    },
    headerstyle() {
      if (this.drawer == true) {
        var a = '-260px'
      }
      return {
        'right': a
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.getcolor()
      this.setup = true
    }, 1);
  },
  methods: {
    change(index) {
      this.$store.dispatch('changeActive', {
        index: index
      });
      this.drawer = false
      this.$router.push("/loading?url=home")
    },
    remove(index) {
      this.setup = false
      this.setcolor = false
      this.$store.dispatch('removeAccount', {
        index: index
      })
      this.$router.push("/loading?url=home")
    },
    closetab() {
      this.drawer = false;
    },
    openDialog1() {
      this.$prompt("(例)knzk.me", "インスタンス名を入力", {
        confirmButtonText: "Ok",
        cancelButtonText: "Cancel",
        inputPattern: /([A-Za-z0-9][A-Za-z0-9\-]{1,61}[A-Za-z0-9]\.)+[A-Za-z]+/,
        inputErrorMessage: "URLが不正です"
      })
        .then(value => {
          this.$message({
            type: "success",
            message: value.value + "を確認中"
          });
          this.$store.dispatch("getAppName", {
            url: value.value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "入力をキャンセルしました。"
          });
        });
    },
    handleSelect(key, keyPath) {
      this.drawer = false
    },
    getcolor() {
      if (this.$store.state.coloroption >= 1) {
        this.setcolor = true;
      }
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
}
.useraside {
  height: 100%;
  width: calc(270px + 13px);
  padding-right: 2px;
  overflow-y: auto;
  margin-left: -5px;
}
.removebtn {
  position: absolute;
  left: 200px;
  top: 10px;
  bottom: 10px;
}
.username {
  display: flex;
  justify-content: space-between;
}
.main {
  z-index: 2;
  max-width: 640px;
  width: 100%;
  margin: 55px auto;
}
.usertab .name {
  position: absolute;
  bottom: 12px;
  left: 100px;
}
.usertab .id {
  position: absolute;
  bottom: -7px;
  left: 100px;
  color: #909399;
}
.usertab .accunt {
  position: absolute;
  bottom: 10px;
  left: 100px;
}
.icon {
  width: 70px;
  min-width: 70px;
  height: 70px;
  min-height: 70px;
  margin: 12px auto;
  border: 3px solid #909399;
}
.tran-enter-active {
  z-index: 6;
  transition-duration: 0s;
}
.tran-enter,
.tran-leave-to {
  opacity: 0;
}
</style>
