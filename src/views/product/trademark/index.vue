img
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue';
import { reqHasTrademark, reqAddOrUpdataTrademark,reqDeleteTrademark } from '@/api/product/trademark';
import type { Records, TradeMarkResponseData, TradeMark } from '@/api/product/trademark/type';
import useUserStore from '@/stores/modules/user';
import { ElMessage, type UploadProps } from 'element-plus'


//当前页数
let pageNO = ref<number>(1);
//每一页展示的数据条数
let limit = ref<number>(3);
//存储己有品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([]);

//对话框组件的显示与隐藏
let dialogFormVisible = ref<boolean>(false);

//定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
});

//获取el-form组件实例
let formRef = ref<any>();




//获取已有品牌的接口封装为一个函数：在任何情况下向获取数据，调用次函数即可
const getHasTrademark = async (pager = 1) => {
  //当前每一页的数据量发生变化的时候，当前页码归1
  pageNO.value = pager;
  let result: TradeMarkResponseData = await reqHasTrademark(pageNO.value, limit.value)

  if (result.code === 200) {
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }
}
//组件挂载完毕钩子---发一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark();
})

//分页器当前页码发生变化的时候会触发
//对于当前页码发生变化自定义事件，细pagination父组件回传了数据（当前的页码）
// const changPageNo = () => {
//   //当前页码发生变化的时候再次发请求获取对应已有品牌数据展示
//   getHasTrademark();
// }

//添加品牌按钮的回调
const addTrademark = () => {
  //显示对话框
  dialogFormVisible.value = true;
  //每次打开就去清空收集品牌数据
  //id置0是因为编辑框的标题存在bug，比如点击了编辑按钮，再点击添加按钮，id还是之前的id，导致编辑框标题显示错误
  trademarkParams.id = 0;
  trademarkParams.tmName = '';
  trademarkParams.logoUrl = '';

  //清除掉品牌名称和对应图片校验结果
  //第一种写法：ts的问号语法
  // formRef.value.clearValidate('tmName');
  // formRef.value.clearValidate('logoUrl');

  nextTick(() => {
    formRef.value.clearValidate('tmName');
    formRef.value.clearValidate('logoUrl');
  })

}

//编辑品牌按钮的回调,修改当前行数据
//row：row即为当前已有的品牌数据
const updateTrademark = (row: TradeMark) => {

  //清除掉品牌名称和对应图片校验结果
  //第一种写法：ts的问号语法
  // formRef.value.clearValidate('tmName');
  // formRef.value.clearValidate('logoUrl');

  nextTick(() => {
    formRef.value.clearValidate('tmName');
    formRef.value.clearValidate('logoUrl');
  })

  //显示对话框
  dialogFormVisible.value = true;
  //将当前行数据赋值给收集品牌数据
  trademarkParams.id = row.id;
  trademarkParams.tmName = row.tmName;
  trademarkParams.logoUrl = row.logoUrl;

  //ES6语法合并对象,与上述相同
  // Object.assign(trademarkParams,row);
}

//对话框取消按钮的回调
const cancel = () => {
  //隐藏对话框
  dialogFormVisible.value = false;

}

//对话框确定按钮的回调
const confirm = async () => {
  //隐藏对话框
  // dialogFormVisible.value = false;
  //在你发请求之前，要对于整个表单进行校验,validate	对整个表单的内容进行验证,接收一个回调函数，或返回 Promise。
  await formRef.value.validate();
  //发请求添加或修改品牌
  let result: any = await reqAddOrUpdataTrademark(trademarkParams);
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '编辑品牌商品成功' : '添加品牌商品成功'
    })
    //刷新当前页码,获取所有的品牌数据
    //编辑留在当前页，新增跳转到第一页，就是看有无id
    getHasTrademark(trademarkParams.id ? pageNO.value : 1);
    //隐藏对话框
    dialogFormVisible.value = false;

  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '编辑品牌商品失败' : '添加品牌商品失败'
    })
    //隐藏对话框
    dialogFormVisible.value = false;

  }
}

// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发，上传文件之前可以限制用户上传文件的格式和大小
  //要求：上传文件格式png | jpg | gif  4M

  if (rawFile.type === 'image/png' || rawFile.type === 'image/jpg' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: 'error',
        message: '文件大小不能超过4M'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '请上传png | jpg | gif格式图片'
    });
    return false;
  }
}

//上传图片成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  ////response:即为当前这次上传图片post请求服务器返回的数据
  response,
  uploadFile
) => {
  console.log(response, uploadFile);
  //将上传成功的图片地址赋值给logoUrl
  trademarkParams.logoUrl = response.data;
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl');

}
// 品牌自定义校验规则
const validateTmName = (rule: any, value: any, callback: any) => {
  //是当表单元素触发blur时候，会触发此方法
  //自定义校验规则
  if (value.trim().length >= 2) {
    callback();

  } else {
    //校验未通过返回的错误信息
    callback(new Error('品牌名称位数大于等于两位'));
  }
}

//品牌LOGO图片的自定义校验规则
const validateLogoUrl = (rule: any, value: any, callback: any) => {
  //如果图片上传
  if (value) {
    callback();
  } else {
    callback(new Error('请上传品牌LOGO图片'));
  }
}


//表单校验规则
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validateTmName }
  ],
  logoUrl: [
    { required: true, trigger: 'change', validator: validateLogoUrl }
  ],
}


//气泡确认框：删除品牌，确认按钮的回调
const removeTrademark = async(id:number)=>{
  //点击确定按钮删除已有品牌请求
  let result = await reqDeleteTrademark(id);
  if(result.code === 200){
    ElMessage({
      type:'success',
      message: '删除品牌商品成功'
    })
    //刷新当前页码,获取所有的品牌数据
    // getHasTrademark(pageNO.value);
    getHasTrademark(trademarkArr.value.length > 1 ? pageNO.value : pageNO.value-1)

  }else{
    ElMessage({ 
      type: 'error',
      message: '删除品牌商品失败'
    })

  }
}


</script>

<template>
  <div>
    <el-card class="box-card">
      <!-- 卡片顶部添加品牌按钮 -->
      <el-button type="primary" icon="Plus" @click="addTrademark" v-has="`btn.TradeMark.add`">添加商品品牌</el-button>
      <!-- 表格组件：用于展示已有得平台数据 -->
      <el-table style="margin: 10px 0px;" border :data="trademarkArr">
        <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
        <!-- table-column：默认展示数据用div ,,prop：指定展示数据字段名 -->
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌logo">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="width: 100px;height:100px;"></img>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #="{ row, $index }">
            <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"></el-button>

            <el-popconfirm :title="`您确定要删除${row.tmName}这个商品吗?`" width="250px" icon="Delete" @confirm="removeTrademark(row.id)">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表格分页组件 
  pagination
  V-model:current-page：设置分页器当前页码
  V-model:page-size：设置每一个展示数据条数
  page-sizes：用于设置下拉菜单数据
  background：设置分页器按钮的背景颜色
  layout：可以设置分页器六个子组件布局调整
  -->
      <el-pagination @change="getHasTrademark" v-model:current-page="pageNO" v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]" :background="true" layout=" prev, pager, next, jumper,->,total, sizes"
        :total="total" />
    </el-card>

    <!-- 对话框组件：用于添加、编辑商品品牌 -->
    <!-- V-model：属性用户控制对话框的显示与隐藏的true显示false隐藏
     title：设置对话框左上角标题 -->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '编辑商品品牌' : '添加商品品牌'">
      <el-form style="width: 80%;" :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="90px" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="90px" prop="logoUrl">
          <!-- upload组件属性：action图片上传路径书写/api，代理服务器不发送这次post请求
           before-upload 钩子中限制用户上传文件的格式和大小。 -->
          <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :headers="headers"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：用于自定义对话框底部按钮 -->
      <template #footer>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>

</template>


<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>