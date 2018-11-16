<template>
  <el-container>
    <el-header>
      <el-menu
        default-active="1"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF"
        >
        <el-menu-item index="1"></el-menu-item>
      </el-menu>
    </el-header>
    <el-main><nuxt/></el-main>
  </el-container>
</template>

<script>
export default {
  props: ['index'],
  methods: {
    handleSelect(key, keyPath) {
    }
  }
}
</script>