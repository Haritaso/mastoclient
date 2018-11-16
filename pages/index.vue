<template>
  <div class="index">
    <el-input class="grid-content" placeholder="インスタンス名を入力" v-model="input">
      <template slot="prepend">https://</template>
    </el-input>
    <div class="loginbutton">
      <el-button type="primary" @click="register">Login</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
    }
  },
  methods: {
    register() {
      this.$store.dispatch('getAppName', {
        url: this.input
      })
    }
  },
  layout: 'index'
}

</script>

<style>
.loginbutton {
  text-align: right;
}
.index {
  margin: 55px 0;
}
</style>

