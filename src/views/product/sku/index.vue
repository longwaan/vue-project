<script setup lang="ts">
import { reqCancelSale, reqSaleSku, reqSkuList, reqSkuInfo, reqRemoveSku } from '@/api/product/sku';
import type { SkuData, SkuInfoData, SkuResponseData } from '@/api/product/sku/type';
import { Delete, Edit, InfoFilled, Top } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

import { ref, onMounted } from 'vue';
//分页器当前页码
let pageNO = ref<number>(1);
//分页器每页显示条数
let pageSize = ref<number>(10);
//分页器总条数
let total = ref<number>(0);
let skuArr = ref<SkuData[]>([]);
//抽屉的显示与隐藏
let drawer = ref<boolean>(false);
let skuInfo = ref<SkuData>();

//分页器总页数
onMounted(() => {
  getHasSku();
});
//获取已有的SKU数据
const getHasSku = async (pager = 1) => {
  //当前分页器的页码
  pageNO.value = pager;
  let result: SkuResponseData = await reqSkuList(pageNO.value, pageSize.value);
  if (result.code === 200) {
    total.value = result.data.total;
    skuArr.value = result.data.records;
  }

}

//商品上架与下架的操作
const updateSale = async (row: SkuData) => {
  //如果当前商品的isSale==1，说明当前商品是上架的额状态->更新为下架
  //否则else情况与上面情况相反

  if (row.isSale == 1) {
    let result = await reqCancelSale((row.id as number))
    if (result.code === 200) { //提示信息
      ElMessage({
        type: 'success',
        message: '下架成功'
      })

    }


    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNO.value);
  } else {
    let result = await reqSaleSku((row.id as number))
    if (result.code === 200) {
      //提示信息
      ElMessage({
        type: 'success',
        message: '上架成功'
      })
    }


    //发请求获取当前更新完毕的全部已有的SKU
    getHasSku(pageNO.value);

  }

}
//更新已有的SKU
const upadtesku = () => {
  ElMessage({
    type: 'success',
    message: '正在开发中'
  })
}

//查看商品详情按钮的回调
const findSku = async (row: SkuData) => {
  //抽展展示出来
  drawer.value = true;
  //发请求获取商品详情
  let result: SkuInfoData = await reqSkuInfo((row.id as number))
  //存储已有的SKU
  skuInfo.value = result.data;

}

//删除已有的SKU
const removeSku = async (row: SkuData) => {
  let result: any = await reqRemoveSku((row.id as number))
  console.log(result)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    //刷新当前页
    getHasSku(skuArr.value.length > 1 ? pageNO.value : pageNO.value-1);
  }else{
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}



</script>

<template>
  <div>
    <el-card>
      <el-table border style="margin: 10px 0;" :data="skuArr">
        <el-table-column label="序号" type="index" align="center" width="60px"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc" show-overflow-tooltip width="250px"></el-table-column>
        <el-table-column label="图片" width="150px">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight" width="150px"></el-table-column>
        <el-table-column label="价格" prop="price" width="150px"></el-table-column>
        <el-table-column label="操作" width="250px" fixed="right">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'" title="上架"
              @click="updateSale(row)"></el-button>
            <el-button type="primary" size="small" :icon="Edit" title="编辑" @click="upadtesku"></el-button>
            <el-button type="primary" size="small" :icon="InfoFilled" title="展示" @click="findSku(row)"></el-button>

            <el-popconfirm :title="`你确定要删除${row.skuName}商品吗`" width="250px" @confirm="removeSku(row)">
              <template #reference>
                <el-button type="danger" size="small" :icon="Delete" title="删除"></el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNO" v-model:page-size="pageSize" :page-sizes="[3, 6, 9, 12]"
        :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total" @change="getHasSku" />
      <!-- 抽屉组件：展示商品详情 -->
      <el-drawer v-model="drawer">
        <template #header>
          <h4>查看商品详情</h4>
        </template>
        <template #default>
          <div>
            <!-- 一行两列 -->
            <el-row style="margin: 10px 0;">
              <el-col :span='6'>名称</el-col>
              <el-col :span="18">{{ skuInfo?.skuName }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
              <el-col :span='6'>描述</el-col>
              <el-col :span="18">{{ skuInfo?.skuDesc }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
              <el-col :span='6'>价格</el-col>
              <el-col :span="18">{{ skuInfo?.price }}</el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
              <el-col :span='6'>平台属性</el-col>
              <el-col :span="18">
                <el-tag style="margin: 5px 5px;" v-for="(item, index) in skuInfo?.skuAttrValueList" :key="item.id">{{
                  item.valueName }}</el-tag>
              </el-col>
            </el-row>
            <el-row style="margin: 10px 0;">
              <el-col :span='6'>销售属性</el-col>
              <el-col :span="18">
                <el-tag style="margin: 5px 5px;" v-for="(item, index) in skuInfo?.skuSaleAttrValueList"
                  :key="item.id">{{
                    item.saleAttrValueName
                  }}</el-tag>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='6'>商品图片</el-col>
              <el-col :span="18">
                <el-carousel :interval="4000" type="card" height="180px">
                  <el-carousel-item v-for="item in
                    skuInfo?.skuImageList" :key="item">
                    <img :src="item.imgUrl" style="width: 100%;height: 100%;">
                  </el-carousel-item>
                </el-carousel>
              </el-col>
            </el-row>
          </div>
        </template>

      </el-drawer>

    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
