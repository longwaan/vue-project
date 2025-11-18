<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
//获取DOM节点
let charts = ref();
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  let mycharts = echarts.init(charts.value);
  //设置配置项
  mycharts.setOption({
    //标题组件
    title: {
      //主标题
      text: '热门景区排行',
      link: 'https://www.baidu.com',
      //标题的位置
      left: '50%',
      //主标题文字样式
      textStyle: {
        color: '#fff',
        fontSize: 18,
      },
      //子标题
      subtext: '数据来源：景区热度',
      //子标题样式
      subtextStyle: {
        color: 'gray',
        fontSize: 12,
      }
    },
    //x|y轴
    xAxis: {
      type: 'category',//图形图标在x轴均匀分布展示
      data: ['景区1', '景区2', '景区3', '景区4', '景区5'],
    },
    yAxis: {
      //分割线不要
      splitLine: {
        show: false,
      },
      //显示坐标轴线
      axisLine: {
        show: true,
      }
    },
    //布局组件
    grid: {
      left: 30,
      right: 10,
      bottom: 30,
      top: 50,
    },
    //系列：决定显示图形图标是哪一种的
    series: [
      {
        type: 'bar',
        //数据
        data: [15, 20, 15, 10, 20],
        //柱状图的：图形上的文本标签，
        label: {
          show: true,
          //文字的位置
          position: 'insideTop',
          //文字的颜色
          color: '#fff',
          //文字的字体大小
          fontSize: 12,
        },
        //是否显示背景颜色
        showBackground: true,
        //背景颜色
        backgroundStyle: {
          //底部背景的颜色
          color: 'rgba(180, 180, 180, 0.2)'
        },
        //柱条的样式
        itemStyle: {
          borderRadius: [5, 5, 0, 0],//（顺时针左上，右上，右下，左下）
          //柱条颜色：也可函数写法
          // color: function(data:any){
          //   //给每一个柱条这是背景颜色
          //   let arr =['blue','orange','pink','white','green']
          //   return arr[data.dataIndex]
          // }
        }

      },
      {
        type: 'line',
        //数据
        data: [15, 20, 15, 10, 20],
        smooth: true,
      }
    ],
    tooltip: {
      show: true,
    },

  })

})
</script>

<template>
  <div class="box6">
    <div class="top">
      <p class="title">热门景区排行榜</p>
      <p class="bg"></p>
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box6 {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

  }

  .charts {
    height: calc(100% - 30px);

  }
}
</style>
