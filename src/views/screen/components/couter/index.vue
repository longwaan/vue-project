<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
//获取DOM节点
let charts = ref();
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  let mycharts = echarts.init(charts.value);
  const nameList = ['一月', '二月', '三月', '四月', '五月']; // 名字
  const valueList = [4, 8, 6, 7, 4, 10]; // 分数,最大值为100
  const valueList2 = [6, 5, 7, 8, 5, 12]; // 分数,最大值为100
  const indicatorList: { name: string; value: number; max: number; }[] = [];
  nameList.forEach((item, index) => {
    indicatorList.push({
      name: item,
      value: valueList[index],
      max: 14,
    });
  });
  let option = {
    title:{
      text: '年度游客量对比',
      left: 'right',
      textStyle: {
        color: '#fff',
      }
    },
    radar: {
      // shape: 'circle',
      radius: '63%',
      indicator: indicatorList,
      name: {
        textStyle: {
          color: '#2b5fb2',
          fontSize: 14,
          fontWeight: 400,
          fontFamily: 'PingFangSC-Regular,PingFang SC',
          fontStyle: 'normal',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#e9eef5',
          width: 1,
        },
      },
    },
    tooltip: {
      show: true, // 弹层数据去掉
    },
    series: [
      {
        name: '重点区域一',
        type: 'radar',
        color: 'rgba(57, 126, 240, 1)',
        label: {
          show: false,
        },
        areaStyle: {
          color: 'rgba(170, 217, 255, 0.35)',
        },
        data: [
          {
            value: valueList,
            name: '重点区域一',
          },
        ],
      },
      {
        name: '重点区域二',
        type: 'radar',
        color: '#5da761',
        label: {
          show: false,
        },
        areaStyle: {
          color: 'rgba(170, 217, 255, 0.35)',
        },
        data: [
          {
            value: valueList2,
            name: '重点区域二',
          },
        ],
      },
    ],
  };
  //设置配置项
  mycharts.setOption(option)

})
</script>

<template>
  <div class="box8">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-rt.png) no-repeat;
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
