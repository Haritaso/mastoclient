<template>
  <el-collapse v-model="activeNames" accordion>
    <el-collapse-item title="一般" name="1">
      <el-form
        :label-position="top"
        label-width="100px"
        :model="setting"
      >
        <el-form-item label="ヘッダー色">
          <el-color-picker v-model="headercolor" show-alpha></el-color-picker>
        </el-form-item>
        <el-form-item label="ヘッダー文字色">
          <el-color-picker v-model="headercharacter" show-alpha></el-color-picker>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item title="ユーザー設定" name="2">
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['1'],
      headercolor: null,
      headercharacter: null
    }
  }
}
</script>