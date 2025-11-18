//小仓库：layout组件相关配置仓库
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore',{
    state: () => {
        return {
            //是否折叠菜单
            fold: false,
            refsh:false,
        }
    },
})

export default useLayoutSettingStore;