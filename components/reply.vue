<template>
  <el-card :key="data.id" shadow="never">
    <div v-if="data.type == 'mention'">
      <div v-html="data.status.content"></div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'reply',
  props: ['data']
}
</script>

<style scoped>
.el-icon-circle-plus:before {
  color: #2b90d9;
}
</style>
