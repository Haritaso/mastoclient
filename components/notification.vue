<template>
  <el-card :key="data.id" shadow="never" class="ncard">
    <div v-if="data.type == 'favourite'">
      <div class="el-icon-star-on">{{ data.account.acct + "さんがあなたのトゥートをお気に入り登録しました" }}</div>
    </div>
    <div v-else-if="data.type == 'reblog'">
      <div class="el-icon-refresh">{{ data.account.acct + "さんがあなたのトゥートをブーストしました"}}</div>
    </div>
    <div v-else-if="data.type == 'follow'">
      <div class="el-icon-circle-plus">{{ data.account.acct + "さんにフォローされました"}}</div>
    </div>
    <div v-else>
      <div v-html="data.status.content"></div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'notification',
  props: ['data']
}
</script>

<style scoped>
.el-icon-star-on:before {
  color: #ca8f04;
}
.el-icon-refresh:before {
  color: #2b90d9;
}
.el-icon-circle-plus:before {
  color: #2b90d9;
}
</style>
