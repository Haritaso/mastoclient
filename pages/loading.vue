<template>
  <div :style="style">
    <div class="atom-spinner">
      <div class="spinner-inner">
        <div class="spinner-line"></div>
        <div class="spinner-line"></div>
        <div class="spinner-line"></div>
        <!--Chrome renders little circles malformed :(-->
        <div class="spinner-circle">
          &#9679;
        </div>
      </div>
    </div>
    <div class="back"></div>
  </div>
</template>

<script>
export default {
  name: "loading",
  layout: "index",
  computed: {
    style() {
      return {
        "--border-top-color": this.$store.getters.getactive[0].acolor,
        "--border-bottom-color": this.$store.getters.getactive[0].acolor
      };
    }
  },
  mounted: function() {
    setTimeout(this.next, 2000);
  },
  methods: {
    next() {
      var query = this.$route.query.url;
      this.$router.push(query);
    }
  }
};
</script>

<style scoped>
.atom-spinner,
.atom-spinner * {
  box-sizing: border-box;
}

.back {
  z-index: 1999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
  background: rgb(0, 0, 0);
}

.atom-spinner {
  z-index: 2000;
  position: relative;
  top: auto;
  bottom: auto;
  right: auto;
  left: auto;
  margin: auto;
  width: 120px;
  height: 120px;
  border-radius: 100%;
}

.atom-spinner .spinner-inner {
  position: relative;
  display: block;
  height: 100%;
  width: 100%;
}

.atom-spinner .spinner-circle {
  display: block;
  position: absolute;
  color: var(--border-top-color);
  font-size: calc(60px * 0.24);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.atom-spinner .spinner-line {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation-duration: 1s;
  border-left-width: calc(60px / 25);
  border-top-width: calc(60px / 25);
  border-left-color: var(--border-bottom-color);
  border-left-style: solid;
  border-top-style: solid;
  border-top-color: transparent;
}

.atom-spinner .spinner-line:nth-child(1) {
  animation: atom-spinner-animation-1 1s linear infinite;
  transform: rotateZ(120deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(2) {
  animation: atom-spinner-animation-2 1s linear infinite;
  transform: rotateZ(240deg) rotateX(66deg) rotateZ(0deg);
}

.atom-spinner .spinner-line:nth-child(3) {
  animation: atom-spinner-animation-3 1s linear infinite;
  transform: rotateZ(360deg) rotateX(66deg) rotateZ(0deg);
}

@keyframes atom-spinner-animation-1 {
  100% {
    transform: rotateZ(120deg) rotateX(66deg) rotateZ(360deg);
  }
}

@keyframes atom-spinner-animation-2 {
  100% {
    transform: rotateZ(240deg) rotateX(66deg) rotateZ(360deg);
  }
}

@keyframes atom-spinner-animation-3 {
  100% {
    transform: rotateZ(360deg) rotateX(66deg) rotateZ(360deg);
  }
}
</style>
