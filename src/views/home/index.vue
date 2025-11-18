<script setup lang="ts">
//引入组合式API函数之生命周期函数
import { onMounted } from 'vue';
//获取仓库
import useUserStore from '@/stores/modules/user';
import { getTime } from '@/utils/time';
let userStore = useUserStore();
//目前首页挂载完毕发请求获取用户信息
onMounted(() => {
  userStore.userInfo();

})
</script>

<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="" class="avatar">
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好{{ userStore.username }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>

      </div>


    </el-card>
    <div class="bottom2">
      <svg-icon name="welcome" width="600px" height="500px"></svg-icon>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }

    .subtitle {
      font-style: italic; //斜体
      color: skyblue;
    }
  }
}

.bottom2 {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
