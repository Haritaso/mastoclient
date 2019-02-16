<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="all" name="all">all</el-tab-pane>
    <el-tab-pane label="a~e" name="a~e">a~e</el-tab-pane>
    <el-tab-pane label="f~j" name="f~j">f~j</el-tab-pane>
    <el-tab-pane label="k~o" name="k~o">k~o</el-tab-pane>
    <el-tab-pane label="p~t" name="p~t">p~t</el-tab-pane>
    <el-tab-pane label="u~z" name="u~z">u~z</el-tab-pane>
    <el-tab-pane label="others" name="others">他</el-tab-pane>
  </el-tabs>
</template>
