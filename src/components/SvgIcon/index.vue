<script setup lang="ts">


//接受父组件传递的prefix参数
defineProps({
    //xlink:href属性值前缀，默认值为#icon-
    prefix:{
        type:String,
        default:'#icon-'
    },
    //提供使用者自定义的图标名字
    name:String,
    //接收父组件传递的图标颜色
    color:{
        type:String,
        default:''
    },

    //接收父组件传递的图标大小
    width:{
        type:String,    
        default:'16px'
    },

    height:{
        type:String,    
        default:'16px'
    }


})
</script>

<template>
  <!--测试SVG图标使用-->
  <!--SVg：图标外层容器节点，内部需要与use标签结合使用--></！--SVg>
  <svg :style={width,height}>
    <!-- xlink：href执行用哪一个图标，属性值务必 与# icon-图标名字 -->
    <!--use标签fill属性可以设置图标的颜色-->
    <use :xlink:href="prefix + name" fill="color"></use>
  </svg>
</template>

<style lang="scss" scoped>

</style>
