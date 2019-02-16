import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)

Vue.use(VueLazyload, {
  preLoad: 0.6,
  error: '',
  loading: '',
  attempt: 2,
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  },
  listenEvents: ['scroll', 'wheel', 'mousewheel']
})
