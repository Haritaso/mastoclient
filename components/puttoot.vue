<template>
  <el-card key="toot.id" shadow="never">
    <img class="icon" :src="toot.account.avatar">
    <div>
      <div>
        <router-link :to=userlink>{{ toot.account.display_name }}</router-link>
      </div>
      <div v-html="toot.content"></div>
      <div>
        <el-button class="reply" type="text"></el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'toot',
  props: ['toot'],
  data () {
    return {
    }
  },
  computed: {
    userlink () {
      const url = this.toot.account.url
      const newurl = url.match(/^[httpsfile]+:\/{2,3}([0-9a-zA-Z\.\-:]+?):?[0-9]*?\//)[1]
      return '/users/' + newurl + "/" + this.toot.account.id + "/toot"
    }
  }
}
</script>

<style scoped>
reply:before {
  content: '\F112';
  display: inline-block;
  font-family: FontAwesome;
  font-weight: normal;
  font-size: inherit;
}
</style>
