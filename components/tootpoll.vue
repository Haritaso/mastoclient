<template>
  <el-card shadow="never" class="poll">
    <div v-if="vote == false">
      <el-radio-group v-model="select" size="medium" class="pollradiogroup">
        <el-radio v-for="(data, i) in poll.options" :key="i" :label="data.title" border class="pollradio">{{ data.title }}</el-radio>
      </el-radio-group>
      <div class="buttongroup">
        <el-button type="success" plain :disabled="votebutton" @click="vote_action()">投票</el-button>
      </div>
    </div>
    <div v-else>
      <div v-for="(data, i) in poll.options" :key="i">
        <el-progress
          class="pollprogress"
          :text-inside="true"
          :stroke-width="poll.votes_count"
          :percentage="vote_state(data.votes_count)"
          :color="color(vote_state(data.votes_count))"
        ></el-progress>
        <div class="progresstext">{{ data.title }}</div>
      </div>
      <div class="pollresult">
        <div class="polltext">総投票数: {{ poll.votes_count }}</div>
        <div class="polltext">{{ time }}</div>
        <el-button type="text" class="polltext" @click="refresh">refresh</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
export default {
  name: 'tootpoll',
  props: ['poll'],
  data() {
    return {
      select: '',
      vote: false,
      max: 0,
      watchStime: false,
      watchMtime: false,
    }
  },
  computed: {
    time() {
      const time = new Date
      const date = new Date(this.poll.expires_at)
      const d = date.getTime() - time.getTime()
      const a = Math.floor(d / 1000)
      if (a < 0) {
        return '終了'
      } else if (a <= 60) {
        this.watchStime = true
        return '残り' + a + '秒'
      } else if ((a >= 60) && (a < 3600)) {
        this.watchStime = false
        this.watchMtime = true
        return '残り' + Math.floor(a / 60) + '分'
      } else if ((a >= 3600) && (a < (3600 * 24))) {
        this.watchMtime = false
        return '残り' + Math.floor(a / 3600) + '時間'
      } else if ((a >= (3600 * 24)) && (a <( 3600 * 24 * 7))){
        return '残り' + Math.floor(a / (3600 * 24)) + '日'
      } else {
        return date.getMonth()+1 + '月' + date.getDate() + '日'
      }
    },
    votebutton() {
      if(this.select == '') {
        return true
      }
      return false
    },
    selecti() {
      if(this.votebutton == false) {
        for(const a in this.poll.options) {
          if(this.poll.options[a].title == this.select) {
            const data = new Array
            data[0] = a
            return data
          }
        }
        return same
      }
    }
  },
  created() {
    if(this.poll.voted == true) {
      this.vote = true
    }
    if(this.poll.expired == true) {
      this.vote = true
    }
  },
  mounted() {
    if (this.watchStime == true) {
      setInterval(() => {
        this.nowtime = new Date()
      },5000)
    } else if (this.watchMtime == true) {
      setInterval(() => {
        this.nowtime = new Date()
      },50000)
    }
  },
  methods: {
    vote_state(num) {
      const result = Math.round((num / this.poll.votes_count) * 100)
      if(this.isReallyNaN(result)) {
        return 0
      }
      if(this.max <= result) {
        this.max = result
      }
      return result
    },
    isReallyNaN(x) {
      return x !== x
    },
    color(num) {
      if(num == this.max) {
        return '#409EFF'
      }
      return '#909399'
    },
    vote_action() {
      axios({
        method: 'POST',
        url: 'https://' + this.$store.getters.geturl + '/api/v1/polls/' + this.poll.id + '/votes',
        headers: {Authorization: 'Bearer ' + this.$store.getters.getactive[0].accessToken},
        data: {
          choices: this.selecti
        }
      })
      .then(res => {
        this.vote = true
        this.$emit('set')
      })
    },
    refresh() {
      this.$emit('set')
    }
  }
}
</script>

<style scoped>
.poll {
  margin-top: 0.5em;
}
.pollradiogroup {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr auto;
}
.pollradio {
  grid-column: 1/ 3;
  grid-row: auto;
  margin-bottom: 1em;
}
.buttongroup {
  display: grid;
}
.pollprogress {
  height: 18px
}
.progresstext {
  font-size: 14px;
  color: #fff;
  display: inline;
  position: relative;
  bottom: 1.3em;
  left: 50px;
  word-break: normal;
}
.pollresult {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  align-content: center;
}
.polltext {
  display: grid;
  justify-content: center;
  align-content: center;
}
</style>
