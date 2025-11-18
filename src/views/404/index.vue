<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="box">
        <button @click="goHome">返回首页</button>
        <img src="../../assets/images/error_images/404.png" alt="">
    </div>
</template>

<style lang="scss" scoped>
.box {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
