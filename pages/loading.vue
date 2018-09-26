<template>
  <div>
    <div class="half-circle-spinner">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>
    <div class="back"></div>
  </div>
</template>

<script>
export default {
  name: 'loading',
  mounted: function () {
    setTimeout(this.next, 2000)
  },
  methods: {
    next () {
      this.$router.push("home")
    }
  }
}
</script>

<style scoped>
.half-circle-spinner,
.half-circle-spinner * {
  box-sizing: border-box;
}

.back {
  z-index: 1999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: .5;
  background: #000;
}
.half-circle-spinner {
  z-index: 2000;
  position:relative;
  top:auto;
  bottom:auto;
  right:auto;
  left:auto;
  margin:auto;
  width: 80px;
  height: 80px;
  border-radius: 100%;
}

.half-circle-spinner::after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 0;
  vertical-align: middle;
}
.half-circle-spinner .circle {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
  border-top-color: #1dfbff;
  animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
  border-bottom-color: #1dfbff;
  animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
