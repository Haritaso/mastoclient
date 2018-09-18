import Vue from 'vue'
import ElementUI from 'element-ui'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
const locale = require('element-ui/lib/locale/lang/ja')

Vue.use(ElementUI, { locale })
Vue.component(CollapseTransition.name, CollapseTransition)