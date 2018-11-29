<template>
  <div class="base">
    <div class='loader'>
      <moon-loader
        class="load"
        :loading="true"
        :color="Acolor"
        sizeUnit="px"
        :size="120"
      ></moon-loader>
      </div>
    <div class="back"></div>
  </div>
</template>

<script>
import { MoonLoader } from '@saeris/vue-spinners'
export default {
  name: "loading",
  layout: "index",
  data () {
    return {
      setcolor: false,
    }
  },
  computed: {
    Acolor() {
      return this.setcolor ? this.$store.getters.getactive[0].acolor : "#409EFF"
    }
  },
  mounted() {
    setTimeout(this.next, 2000)
  },
  methods: {
    next() {
      if (this.$store.state.count == 0) {
        this.$router.push('/')
      } else {
        this.setcolor = true
        var query = this.$route.query.url
        this.$router.push('/' + query)
      }
    }
  },
  components: {
    MoonLoader
  },
};
</script>

<style scoped>
.back {
  z-index: 2000;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: rgba(0, 0, 0, 0.5);
}
.base .load {
  z-index: 2001;
  display: flex;
  position: relative;
  text-align: -webkit-match-parent;
  margin: 0;
}
.base {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.load {
  text-align: left;
}
.loader {
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  font-size: 18px;
  letter-spacing: 1px;
  position: relative;
  flex: 0 0 auto;
  padding: 20px;
  margin-top: 55px;
  border-width: 0.5px;
  border-image: initial;
  z-index: 2000;
}
</style>