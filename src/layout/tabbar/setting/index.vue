<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import useLayoutSettingStore from '@/stores/modules/setting';
//获取用户相关的仓库
import useUserStore from '@/stores/modules/user';
import { ref } from 'vue';
import { Moon, MoonNight, Sunny } from '@element-plus/icons-vue';
let LayoutSettingStore = useLayoutSettingStore();
let UserStore = useUserStore();
let $router = useRouter();
let $route = useRoute();
//收集开关的数据
let dark = ref<boolean>(false)
const updateRefsh = () => {
    LayoutSettingStore.refsh = !LayoutSettingStore.refsh;
}

const fullScreen = () => {
    // if(document.fullscreenElement){
    //     document.exitFullscreen();
    // }else{
    //     document.documentElement.requestFullscreen();
    // }
    let full = document.fullscreenElement;
    if (!full) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

const logout = async () => {
    //第一件事情：需要向服务器发请求[退出登录接口]******
    //第二件事情：仓库当中关于用于相关的数据清空[token|username|avatar]
    //第三件事情：跳转到登录页面
    await UserStore.userLogout();
    //跳转到登录页面
    $router.push({ path: '/login', query: { redirect: $route.path } });

}

//颜色组件组件的数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

//switch开关的chang事件进行暗黑模式的切换
const changeDark = () => {
    //获取HTML根节点
    let html = document.documentElement;
    //判断HTML标签是否有类名dark
    dark.value ? html.className = 'dark' : html.className = '';
}

const setColor = () => {
    //通知js修改根节点的样式对象的属性与属性值
    const el = document.documentElement
    // 获取 css 变量
    getComputedStyle(el).getPropertyValue(`--el-color-primary`)

    // 设置 css 变量
    el.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
    name: 'Setting',
}
</script>

<template>
    <el-button size="small" icon="Refresh" circle @click="updateRefsh"></el-button>
    <el-button size="small" icon="FullScreen" circle @click="fullScreen"></el-button>

    <el-popover placement="bottom" title="主题设置" width="300px" trigger="hover">
        <!-- 表单组件 -->
        <el-form>
            <el-form-item label="主题颜色">
                <!-- teleported: 是否将 popover 的下拉列表渲染至 body 下，false的目的是将其渲染只 el-popover 下，防止 el-popover 自动关闭 -->
                <el-color-picker @change="setColor" v-model="color" size="small" show-alpha :predefine="predefineColors"
                    :teleported="false" />
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch @change="changeDark" v-model="dark" size="small" inline-prompt :active-icon="MoonNight"
                    :inactive-icon="Sunny" />
            </el-form-item>
        </el-form>
        <template #reference>
            <el-button size="small" icon="Setting" circle></el-button>
        </template>
    </el-popover>

    <img :src="UserStore.avatar" alt="" style="height: 24px;width: 24px;margin: 0 10px; border-radius: 50%;">

    <el-dropdown>
        <span class="el-dropdown-link">
            {{ UserStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<style lang="scss" scoped></style>
