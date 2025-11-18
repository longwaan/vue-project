<script setup lang="ts">

//引入请求API
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import type { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
//平台属性
let attrArr = ref<any>([])
//销售属性
let saleArr = ref<any>([])
//图片列表
let imgArr = ref<any>([])
//获取table组件实例
let table = ref<any>()
//收集SKU的参数
let skuParams = reactive<SkuData>(
  {
    // 父组件传递的数据
    category3Id: '', // 三级分类的ID
    spuId: '', // 已有的SPU的ID
    tmId: '', // SPU 品牌ID
    // v-model 收集
    skuName: '', // SKU 名字
    price: '', // SKU 价格
    weight: '', // SKU 重量
    skuDesc: '', // SKU 描述
    skuAttrValueList: [], // 平台属性
    skuSaleAttrValueList: [
      // 销售属性
      {
        saleAttrId: '', // 销售属性ID
        saleAttrValueId: '', // 销售属性值ID
      },
    ],
    skuDefaultImg: '', // 售卖SKU图片地址
  }
)
//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, pramas: '' });
}
//当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  //收集数据
  skuParams.category3Id = spu.category3Id;
  skuParams.spuId = spu.id;
  skuParams.tmId = spu.tmId;
  //获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  //获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  let result2: any = await reqSpuImageList(spu.id)
  //平台属性
  attrArr.value = result.data
  //销售属性
  saleArr.value = result1.data
  //图片列表
  imgArr.value = result2.data



}

//设置默认图片方法回调
const handler = (row: any) => {
  //点击的时候，全部的复选框不勾选
  imgArr.value.forEach((item: any) => {
    table.value.toggleRowSelection(item, false)
  })

  //选中的图片才勾选
  table.value.toggleRowSelection(row, true)
  //收集图片地址
  skuParams.skuDefaultImg = row.imgUrl
}
//保存按钮的方法
const save = async () => {
  //整理参数
  //平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })

    }
    return prev;
  }, []);

  //销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })

    }
    return prev;
  }, []);
  //添加SKU的请求
   let result= await reqAddSku(skuParams)
  if (result.code ===200){
    ElMessage({
      type:'success',
      message: '添加Sku成功'
    })
    //通知父组件切换场景为零
    $emit('changeScene', { flag: 0, pramas: '' });
  }else{
    ElMessage({
      type: 'error',
      message: '添加Sku失败'
    })
  }
}
//对外暴露方法
defineExpose({ initSkuData })
//自定义事件的方法
let $emit = defineEmits(['changeScene'])
</script>

<template>
  <el-form label-width="80px">
    <el-form-item label="sku名称">
      <el-input placeholder="请输入sku名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="请输入价格(元)" type="number" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="请输入重量(克)" type="number" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="sku描述">
      <el-input placeholder="请输入sku描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
          <el-select v-model="item.attrIdAndValueId" style="width: 100px;">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id" :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select v-model="item.saleIdAndValueId" style="width: 100px;">
            <el-option :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" width="80px" align="center"></img>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="warning" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>

</template>

<style lang="scss" scoped></style>
