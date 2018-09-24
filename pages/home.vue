<template>
  <div>
    <div style="margin-bottom: 20px;">
      <el-button
        size="small"
        @click="dialogFormVisible = true"
      >
        add tab
      </el-button>
      <el-dialog title="新しいTLを追加" :visible.sync="dialogFormVisible" :modal="false">
        <el-form :model="form">
          <el-form-item label="TL名" :label-width="formLabelWidth">
            <el-input v-model="form.title" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="TL種類" :label-width="formLabelWidth">
            <el-select v-model="form.scope" placeholder="選択">
              <el-option label="ホーム" value="home"></el-option>
              <el-option label="ローカル" value="public?local"></el-option>
              <el-option label="連合" value="public"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Streamを許可" :label-width="formLabelWidth">
            <el-switch v-model="form.stream">
            </el-switch>
          </el-form-item>
          <el-form-item label="Mediaのみ" :label-width="formLabelWidth">
            <el-switch v-model="form.media">
            </el-switch>
          </el-form-item>
          <el-form-item label="Tootの詳細表示" :label-width="formLabelWidth">
            <el-switch v-model="form.detail">
            </el-switch>
          </el-form-item>
        </el-form>
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="上級者向け" name="1">
            <el-form :model="form">
              <el-form-item label="login中の他のアカウントTLを混ぜる" :label-width="formLabelWidth">
                <el-switch v-model="form.mix">
                </el-switch>
              </el-form-item>
              <el-form-item label="TL種類" v-if="form.mix == true" :label-width="formLabelWidth">
                <el-select v-model="form.scope" placeholder="選択">
                  <el-option label="ホーム" value="home"></el-option>
                  <el-option label="ローカル" value="public?local"></el-option>
                  <el-option label="連合" value="public"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">キャンセル</el-button>
          <el-button type="primary" @click="addTab(form)">作成</el-button>
        </span>
      </el-dialog>
    </div>
    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
      <el-tab-pane v-for="item in editableTabs"
        :key="item.index"
        :label="item.title"
        :name="item.index"
      >
        <gettoot :scope="item.scope" :media="item.media" :stream="item.stream" :detail="item.detail" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import gettoot from '@/components/gettoot.vue'
import axios from 'axios'

export default {
  data() {
    return {
      editableTabsValue: '0',
      dialogFormVisible: false,
      mediaboolan: false,
      editableTabs: [],
      tabIndex: 0,
      form: {
        title: '',
        index: '',
        scope: '',
        media: false,
        stream: false,
        detail: false,
        mix: false,

      },
      formLabelWidth: '160px',
      activeName: '0'
    }
  },
  methods: {
    addTab(form) {
      this.dialogFormVisible = false
      let newIndex = ++this.tabIndex + ''
      this.editableTabs.push({
        title: form.title,
        index: newIndex,
        scope: form.scope,
        media: form.media,
        stream: form.stream,
        detail: form.detail,
      });
      this.editableTabsValue = newIndex
    },
    removeTab(targetName) {
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.index === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.editableTabs = tabs.filter(tab => tab.index !== targetName)
    },
  },
  components: {
    gettoot
  }
}
</script>

