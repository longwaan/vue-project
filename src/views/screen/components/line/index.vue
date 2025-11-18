<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
//获取图形图标的节点
let charts = ref();
onMounted(() => {
  let mycharts = echarts.init(charts.value);
  //设置配置项
  mycharts.setOption({
    //标题组件
    title: {
      text: '访问量',
      left: 'center',
    },
    //x\y轴
    xAxis: {
      type: 'category',//均匀分布
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //两侧不留白
      boundaryGap: false,
      //分割线不要
      splitLine: {
        show: false,
      }

    },
    yAxis: {
      //分割线不要
      splitLine: {
        show: false,
      },
      //坐标轴线
      axisLine: {
        show: true,
      },
    },
    grid: {
      left: 40,
      right: 20,
      bottom: 20,
      top: 0,
    },
    //系列
    series: [
      {
        type: 'line',
        data: [45, 30, 50, 80, 70, 110, 130],
        //平滑曲线的设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'orange' // 0% 处的颜色
            }, {
              offset: 1, color: 'white' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }

      }
    ],
  })
});


</script>

<template>
  <div class="box5">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt=""></img>
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  // box-sizing: border-box;
  margin: 0 10px;

  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
