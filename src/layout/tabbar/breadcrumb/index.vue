<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import useLayoutSettingStore from '@/stores/modules/setting';
let $route = useRoute();
let LayoutSettingStore = useLayoutSettingStore();
const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold;

}


</script>

<script lang="ts">
export default {
    name: 'Breadcrumb',
}
</script>

<template>
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <!-- 路由面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
        <!-- 面包动态展示路由名字与标题 -->
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <!-- 图标 -->
             <el-icon >
                <component :is="item.meta.icon"></component>
             </el-icon>
            <!-- 面包屑展示匹配路由的标题 -->
            <span style="margin: 0 5px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style lang="scss" scoped></style>
