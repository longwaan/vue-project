<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
//获取DOM节点
let charts = ref();
onMounted(() => {
  let mycharts = echarts.init(charts.value);
  mycharts.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: '#fff',
      },
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      //分割线不要
      splitLine: {
        show: false,
      },
      //显示坐标轴线
      axisLine: {
        show: true,
      },
    },
    grid: {
      left: 40,
      top: 40,
      right: 20,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [23, 88, 428, 260, 350,190,99,210],
      //标记图形设置
      symbol:'arrow',
      //图文标签
      label:{
        show:true,
        position:'top',
        color:'#fff',
      },
      //散点图标记的颜色
      itemStyle: {
        color:'green'
      },
    },
  });
})
</script>

<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;

  .title {
    // margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
