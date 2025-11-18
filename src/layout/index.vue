<script setup lang="ts">
import { useRoute } from 'vue-router';
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
//右侧内容展示区域
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'

import useUserStore from '@/stores/modules/user';

import useLayoutSettingStore from '@/stores/modules/setting';
let useStore = useUserStore();

let $route = useRoute();

let LayoutSettingStore = useLayoutSettingStore();

</script>

<script lang="ts">
export default {
    name: 'Layout',
}
</script>

<template>
    <div class="layout_container">
        <!-- 左侧菜单栏 -->
        <div class="layout_slider" :class="{ fold: LayoutSettingStore.fold ? true : false }">
            <Logo></Logo>
            <!-- 左侧菜单栏内容 -->
            <!-- 滚动组件 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu :collapse="LayoutSettingStore.fold ? true : false"  class="el-menu-vertical-demo" mode="vertical" background-color="#001529" text-color="white"
                    :default-active="$route.path">
                    <Menu :menuList="useStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航栏 -->
        <div class="layout_tabbar" :class="{ fold: LayoutSettingStore.fold ? true : false }">
            <Tabbar></Tabbar>
        </div>
        <!-- 主体内容 -->
        <div class="layout_main" :class="{ fold: LayoutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        color: white;
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        transition: all 0.3s;

        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-1ogo-height);

            .el-menu {
                border-right: none;
            }
        }

        &.fold {
            width: $base-menu-min-width;
        }
    }

    .layout_tabbar {
        position: fixed;
        top: 0px;
        left: $base-menu-width;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;

        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);        
        left: $base-menu-width;
        top: $base-tabbar-height;
        padding: 20px;
        overflow: auto;
        transition: all 0.3s;
        // box-sizing: border-box;

        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

}
</style>
