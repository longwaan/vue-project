<script setup lang="ts">
import setting from '@/setting';  

</script>

<script lang="ts">
export default {
    name: 'Logo',
}
</script>

<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" alt="">
    <p>{{setting.title}}</p>
  </div>
</template>

<style lang="scss" scoped>
.logo{
    width: 100%;
    height: $base-menu-1ogo-height;
    display: flex;
    align-items: center;
    padding: 10px;
    // box-sizing: border-box;
    img{
        height: 40px;
        width: 40px;
    }
    p{
        font-size: $base-logo-title-fontSize;
        margin-left: 10px;
        color: $base-logo-title-color;
    }
}
</style>
