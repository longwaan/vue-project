<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Top from './components/top/index.vue';
import Tourist from './components/tourist/index.vue';
import Age from './components/age/index.vue';
import Sex from './components/sex/index.vue';
import Map from './components/map/index.vue';
import Line from './components/line/index.vue';
import Rank from './components/rank/index.vue';
import Couter from './components/couter/index.vue';
import Year from './components/year/index.vue';
//获取数据大屏展示内容盒子的DOM元素
let screen = ref();
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
})
//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
  // return Math.min(ww, wh);
}
//监听视口变化
window.onresize = function () {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
}
</script>

<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />

        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Couter class="couter" />

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  // 原稿多大就写多大
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    left: 50%;
    top: 50%;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 20px;

        .rank {
          flex: 1.2;
        }

        .year {
          flex: 1;
        }

        .couter {
          flex: 1;
        }
      }

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;

        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
        }
      }

    }
  }
}
</style>
