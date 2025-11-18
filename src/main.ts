import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import '@/styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'
import App from './App.vue'
import router from './router'
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入自定义插件对象:注册整个项目全局组件
import gloalComponent from '@/components'
import pinia from './stores'
//引入自定义指令文件
import {isHasButton} from '@/directive/has'
//引入路由鉴权文件
import '@/permisstion'





const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})

// 注册自定义的SvgIcon组件
app.component('SvgIcon', SvgIcon)



//安装自定义插件
app.use(gloalComponent)

isHasButton(app);

app.mount('#app')
