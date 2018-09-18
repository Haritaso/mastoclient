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
      'axios'
    ],
  },
  plugins: [
    '~plugins/element-ui',
    { src: "~plugins/persistedstate.js", ssr: false }
  ],
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'src/reset.css'
  ],
  router: {
    //middleware: 'auth'
  },
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
  },
}

