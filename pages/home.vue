<template>
  <div>
    <div style="margin-bottom: 20px;">
      <div class="subfield" :style="substyle">
        <el-button
          class="subaction1"
          type="primary"
          @click="dialogFormVisible = true"
        >
          <i class="far fa-plus-square"></i>
        </el-button>
        <el-button
          class="subaction2"
          type="primary"
          @click="isOpenbar = !isOpenbar"
        >
          <i class="far fa-comment-alt"></i>
        </el-button>
      </div>
      <no-ssr>
        <tootbar :isOpenbar="isOpenbar"></tootbar>
      </no-ssr>
      <el-dialog title="新しいタイムラインを追加" :visible.sync="dialogFormVisible" :modal="false">
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">キャンセル</el-button>
          <el-button type="primary" @click="addTab(form)">作成</el-button>
        </span>
      </el-dialog>
    </div>
    <div v-if="this.tabcontent.length >= 1">
      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane v-for="item in this.tabcontent"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <gettoot :scope="item.scope" :media="item.media" :stream="item.stream" :detail="item.detail" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import tootbar from '@/components/simpletootbar.vue'
import gettoot from '@/components/gettoot.vue'
import axios from 'axios'
export default {
  data() {
    return {
      editableTabsValue: '0',
      dialogFormVisible: false,
      mediaboolan: false,
      tabIndex: 0,
      tabcontent: [],
      form: {
        title: '',
        name: '',
        scope: null,
        media: false,
        stream: false,
        detail: false,
        mix: false,
      },
      formLabelWidth: '160px',
      activeName: '0',
      taberror: false,
      isOpenbar: false,
      loading: true
    }
  },
  computed: {
    substyle() {
      return {
        'border-color': !this.loading ? this.$store.getters.getactive[0].acolor: "#409EFF"
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.setTL()
    },0)
  },
  methods: {
    addTab(form) {
      if (form.scope == null) {
        this.taberror = true
        this.$message({
          message: 'タブの種類を指定して下さい。',
          type: 'warning'
        })
      } else {
        this.taberror = false
      }
      if (this.taberror == false) {
        this.dialogFormVisible = false
        let newIndex = this.tabIndex + ''
        this.$store.commit('setUserTL', {
          index: this.$store.getters.getactive[0].index,
          TL: {
            title: form.title,
            name: newIndex,
            scope: form.scope,
            media: form.media,
            stream: form.stream,
            detail: form.detail,
          }
        })
        this.tabcontent = this.$store.getters.getactive[0].TL
        this.tabIndex++
        this.editableTabsValue = newIndex
        this.form.title = ''
      }
    },
    removeTab(targetName) {
      let tabs = this.$store.getters.getactive[0].TL
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.editableTabsValue = activeName
      this.tabcontent = tabs.filter(tab => tab.name !== targetName)
      this.$nextTick(function () {
        this.$store.commit('delUserTL', {
          index: this.$store.getters.getactive[0].index,
          TL: this.tabcontent
        })
      })
      this.tabIndex = this.tabcontent.length
    },
    setTL () {
      this.tabcontent = this.$store.getters.getactive[0].TL
      this.tabIndex = this.tabcontent.length
      this.loading = false
    }
  },
  components: {
    gettoot,
    tootbar
  }
}
</script>

<style scoped>
.subfield {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 10px;
  align-content: space-around;
  position: fixed;
  right: 8px;
  top: 80px;
  z-index: 6;
  height: 100px;
}
.subaction1 {
  grid-row: 1 / 2;
}
.subaction2 {
  grid-row: 2 / 3;
}
</style>
