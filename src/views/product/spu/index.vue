<script setup lang="ts">
import { Delete, Edit, Plus, View } from '@element-plus/icons-vue';
import { ref, watch, onBeforeUnmount } from 'vue'
//请求方法
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu';
//引入ts的类型
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type';

//引入三级分类的仓库
import useCategoryStore from '@/stores/modules/category';
//引入子组件
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore();
//场景的数据
let scene = ref<number>(0)//0：显示已有SPU 1：添加或者修改已有SPU  2：添加SKU的结构
//分页器默认页码
let pageNo = ref<number>(1)
//分页器每页显示条数
let pageSize = ref<number>(3)
//存储已有的SPU:records数据
let records = ref<Records>([]);
//存储已有SPU总个数
let total = ref<number>(0);
//获取子组件实例SpuForm
let spu = ref<any>();
//获取子组件实例SkuForm
let sku = ref<any>([]);
//存储全部的SKU数据
let skuArr = ref<SkuData[]>([]);
//对话框的状态
let show = ref<boolean>(false);
//监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  if (!categoryStore.c3Id) return;
  getHasSpu();
})
//此方法执行:可以获取某一个三级分类下全部的己有的SPU
const getHasSpu = async (page = 1) => {
  //修改当前页码
  pageNo.value = page;
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)

  if (result.code === 200) {
    records.value = result.data.records;
    total.value = result.data.total;
    // total.value = result.data.records.length;
  }

}
//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1：添加与修改已有SPU结构->SpuForm
  scene.value = 1;
  //点击添加SPU按钮，调用子组件的方法初始化数据
  spu.value.initAddSpu(categoryStore.c3Id);

}

//修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1：添加与修改已有SPU结构->SpuForm
  scene.value = 1;
  //调用子组件实例方法获取完整已有的SPU的数据
  spu.value.initHasSpuData(row);

}


//子组件SpuForm绑定自定义事件：目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  //子组件Spuform点击取消变为场景0：展示已有的SPU
  scene.value = obj.flag;
  if (obj.params == 'update') {
    //再次获取全部的已有SPU数据
    //更新留在当前页
    getHasSpu(pageNo.value);
  } else {
    //添加留在第一页
    getHasSpu();
  }


}
//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //切换为场景2：添加SKU的结构
  scene.value = 2;
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
}

//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList((row.id) as number);
  if (result.code === 200) {
    skuArr.value = result.data;
    show.value = true;
  }
}


// 删除SPU
const deleteSpu = async (row: SpuData) => {
  const result: any = await reqRemoveSpu(row.id as number)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取一次已有的SPU
    getHasSpu(records.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//路由组件销毁前，情况仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})

</script>

<template>
  <div>
    <Category :scene="scene"></Category>

    <el-card style="margin: 10px 0;">
      <div v-show="scene === 0">
        <el-button @click="addSpu" type="primary" :icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加SPU</el-button>
        <!-- 展示已有SPU数据 -->
        <el-table border style="margin: 10px 0;" :data="records">
          <el-table-column label="序号" type="index" align="center" width="60px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" :icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="warning" size="small" :icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="info" size="small" :icon="View" title="查看SPU列表" @click="findSku(row)"></el-button>


              <el-popconfirm :title="`你确定要删除${row.spuName}吗?`" width="200px" @confirm="deleteSpu(row)">
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete" title="删除SPU"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
          :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total" @change="getHasSpu" />

      </div>
      <!-- 添加SPU|修改SPU子组件 -->
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene"></SpuForm>
      <!-- 添加SKU子组件 -->
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene"></SkuForm>
      <!-- dialog对话框：展示已有的sKU数据 -->
      <el-dialog v-model="show" title="sku列表">
        <el-table :data="skuArr">
          <el-table-column label="SKU名称" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg
                " style="width: 50px;height: 50px;"></img>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
