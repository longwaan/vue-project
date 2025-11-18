<script setup lang="ts">
import { watch, ref, reactive, nextTick,onBeforeUnmount } from 'vue'
//引入获取已有属性与属性值接口
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '@/api/product/attr';
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type';
//获取分类的仓库
import useCategoryStore from '@/stores/modules/category';
import { Delete, Edit, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';


let categoryStore = useCategoryStore();
//存储已有的属性与属性值
let attrArr = ref<Attr[]>([]);
//定义card组件内容切换变量
let scene = ref<number>(0);//scene=0，显示table，scene=1，展示添加与修改属性结构
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '',//新增属性名
  attrValueList: [

  ],//新增属性值数组
  categoryId: '',//三级分类id
  categoryLevel: 3,//代表的是三级分类
})

//准备一个数组：将来存储对应的组件实例el-input
let inputArr = ref<any>([]);


//监听仓库三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  //清空上一次查询的属性与属性值
  attrArr.value = [];

  //保证三级分类得有才能发请求
  if (categoryStore.c3Id) {
    //获取分类的ID
    getArrt();
  }

})

//获取已有属性与属性值
const getArrt = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore;
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id);
  if (result.code === 200) {
    attrArr.value = result.data;
  }

}

//添加属性按钮的回调
const attAttr = () => {
  //每一次点击的时候，先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [
    ],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })

  //切换为添加与修改属性的结构
  scene.value = 1;
  //点击这个按钮的时候手机新增属性的三级分类的ID
  // attrParams.categoryId = categoryStore.c3Id;
}

//table表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  //切换为添加与修改属性的结构
  scene.value = 1;
  //将已有的属性对象赋值给attrParams对象即为
  //ES6->object.assign进行对象的合并
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
  //点击这个按钮的时候手机修改属性的三级分类的ID
}

const cancel = () => {
  scene.value = 0;
}

const addAttrValue = () => {
  //点击添加属性值按钮的时候，向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })
  //获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();

  })
}
//保存按钮的回调
const save = async () => {
  //发请求
  let result = await reqAddOrUpdateAttr(attrParams);
  if (result.code === 200) {
    scene.value = 0;
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '新增成功',
    })
    //刷新页面
    getArrt();
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '新增失败',
    })
  }
}

const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1：属性值名称不能为空
  if (row.valueName.trim() == '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能为空',
    })
    return
  }
  //非法情况判断2：属性值名称不能重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName == row.valueName;
    }
  })

  if (repeat) {
    //将重复的属性值从数组当中干掉
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值名称不能重复',
    })
    return;
  }
  //相应的属性值对象flag：变为false，展示div
  row.flag = false;
}

const toEdit = (row: AttrValue, $index: number) => {
  //相应的属性值对象flag：变为true，编辑div
  row.flag = true;
  //nextTick：响应式数据发生变化，获取更新的DoM（组件实例）
  nextTick(() => {
    inputArr.value[$index].focus();

  })
}

//删除某一个已有的属性方法回调
const deleteAttr = async (attrId: number) => {
  //发请求
  let result = await reqRemoveAttr(attrId);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //刷新页面
    getArrt();
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//路由组件销毁的时候，把仓库分类相关的数据清空
onBeforeUnmount(()=>{
  //清空仓库的数据
  categoryStore.$reset();
})





</script>

<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin:10px 0px">
      <div v-show="scene === 0">
        <el-button @click="attAttr" type="primary" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加平台属性</el-button>
        <el-table border style="margin: 10px 0px;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, index }">
              <el-tag style="margin: 5px;" v-for="(item, index) in row.attrValueList" :key="item.id">
                {{ item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template #="{ row, $index }">
              <el-button type="warning" :icon="Edit" @click="updateAttr(row)"></el-button>


              <el-popconfirm :title="`你确定要删除这个${row.attrName}属性吗`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" :icon="Delete"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placehodler="请输入属性名称" v-model="attrParams.attrName"></el-input>

          </el-form-item>
        </el-form>
        <el-button @click="addAttrValue" :disabled="attrParams.attrName ? false : true" type="primary"
          :icon="Plus">添加属性值</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0px;" :data="attrParams.attrValueList">
          <el-table-column width="80px" type="index" align="center" label="序号"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
                placeholder="请输入属性值名称" v-model="row.valueName"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="danger" :icon="Delete" @click="attrParams.attrValueList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="save"
          :disabeld="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped></style>
