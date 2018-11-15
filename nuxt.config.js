module.exports = {
  head: {
    title: 'mastoclient',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Mastodon Client' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#3B8070' },
  build: {
    vendor: [
      'element-ui',
      'vuex',
      'axios',
      'VuePlyr',
      'vue-window',
      'StyleFactory',
      'vue-content-loader',
    ],
  },
  plugins: [
    '~plugins/element-ui',
    { src: '~plugins/persistedstate.js', ssr: false },
    '~plugins/v-img.js',
    '~plugins/plyrvideo.js',
    { src: '~plugins/vuewindow.js', ssr: false },
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'src/reset.css',
    '@fortawesome/fontawesome-free-webfonts',
    '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css',
    '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css',
  ],
  router: {
    //middleware: 'auth'
  },
  build: {
    extend(config) {
      if (process.server && process.browser) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
}

