<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
//获取图形图标的DOM节点
let charts = ref();
onMounted(() => {
  //初始化echarts实例
  let myCharts = echarts.init(charts.value);
  //设置配置项
  myCharts.setOption({
    title: {
      text: '男女比例',
      textStyle: {
        fontSize: 16,
        color: 'skyblue',
      },
      left:"40%",
    },
    xAxis: {
      show: false,
      min: 0,
      max: 100,


    },
    yAxis: {
      show: false,
      type: 'category',


    },
    series: [
      {
        type: 'bar',
        data: [58],
        z: 10,
        barWidth: 20,
        itemStyle: {
          borderRadius: 20,
        },
      },
      {
        type: 'bar',
        data: [100],
        barGap: "-100%",
        barWidth: 20,
        itemStyle: {
          color: "pink",
          borderRadius: 20,
        },
      }
    ],
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
    }
  });

})
</script>

<template>
  <div class="box1">
    <div class="title">
      <p>性别比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="">
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p>男生58%</p>
      <p>女生42%</p>
    </div>
    <div class="charts" ref="charts">

    </div>

  </div>
</template>

<style lang="scss" scoped>
.box1 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .sex {
    display: flex;
    justify-content: center;

    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/man-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url(../../images/woman-bg.png) no-repeat;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    p{
      color: white;
      font-size: 16px;
    }
  }

  .charts {
    height: 100px;
  }

}
</style>
