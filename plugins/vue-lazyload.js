import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)

Vue.use(VueLazyload, {
  preLoad: 0.6,
  error: '',
  loading: '',
  attempt: 2,
  observer: true,
  listenEvents: ['scroll', 'wheel', 'mousewheel']
})
