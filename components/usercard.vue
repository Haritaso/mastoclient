<template>
  <el-card shadow="never">
    <div class="usercardbody">
      <div id="cardbody" />
      <div class="usericon">
        <img :src="data.avatar" class="usericonstyle">
      </div>
      <div class="username">
        <router-link class="name" :to=userlink>
          <span>
            <bdi class="displayname">{{ data.display_name }}</bdi>
            <bdi class="displayname" v-if="data.display_name == ''">{{ data.username }}</bdi>
            <span>{{ userid }}</span>
          </span>
          </router-link>
      </div>
      <el-button class="followbtn"></el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'usercard',
  props: ['data'],
  updated () {
    setTimeout(() => {
      var element = document.getElementById("cardbody")
      element.style.backgroundImage = "url(" + this.data.header + ")"
    }, 0)
  },
  computed: {
    userlink () {
      const url = this.$store.getters.getactive[0].url
      return '/users?url=' + url + "&id=" + this.data.id
    },
    userid () {
      if (this.data.acct.indexOf('@') == true) {
        return this.data.acct
      } else {
        return '@' + this.data.acct
      }
    }
  }
}
</script>

<style scoped>
.usercardbody {
  display: grid;
  grid-template-columns: 60px auto 60px;
  grid-template-rows: 60px;
}
#cardbody {
  grid-column: 1 / 4;
  border-radius: 4px 4px 0 0;
  background-size: cover;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  filter: blur(0.5px);
  object-fit: cover;
  overflow: hidden;
  z-index: 1;
}
.usericon {
  grid-column: 1 / 2;
  grid-row: 1;
  border: 3px solid #909399;
}
.usericonstyle {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.username {
  grid-column: 2 / 3;
  grid-row: 1;
  margin-left: 0.5em;
  max-width: 100%;
  align-self: center;
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
.followbtn {
  grid-column: 3 / 4;
  grid-row: 1;
}
</style>
