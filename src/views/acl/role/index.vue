<script setup lang="ts">
import { reqAddOrUpdateRole, reqAllMenuList, reqAllRoleList, reqRemoveRole, reqSetPermission } from '@/api/acl/role';
import type { MenuList, MenuResponseData, Records, RoleData, RoleResponseData } from '@/api/acl/role/type';
//引入骨架的仓库
import useLayoutSettingStore from '@/stores/modules/setting';
import { Delete, Edit, Plus, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';
//当前页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//搜索职位关键字
let keyword = ref<string>("");
//存储全部已有的职位
let allRole = ref<Records>([]);
//职位总个数
let total = ref<number>(0);
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
    roleName: "",
});

//获取仓库，用于重置
let SettingStore = useLayoutSettingStore();
//弹窗的显示状态
let dialogVisible = ref<boolean>(false);

//获取form组件的实例
let formRef = ref<any>();
//控制抽展显示与隐藏
let drawer = ref<boolean>(false)

//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])

//获取tree组件实例
let tree = ref<any>();


//组件挂载完毕
onMounted(() => {
    //获取职位请求
    getAllRole();
});
//获取全部职位信息
const getAllRole = async (pager = 1) => {
    //修改当前页码
    pageNo.value = pager;
    let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    total.value = result.data.total;
    allRole.value = result.data.records;
}
//搜索
const search = () => {
    getAllRole();
    //清空搜索框
    keyword.value = "";
}
//重置
const reset = () => {
    SettingStore.refsh = !SettingStore.refsh;
}


//自定义校验规则
const validateroleName = (rule: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('职位名称至少输入两位'))
    }
}
//校验规则
const rules = {
    roleName: [
        { required: true, validator: validateroleName, trigger: 'blur' },
    ],
}

//新增职位
const addRole = async () => {
    dialogVisible.value = true;
    Object.assign(RoleParams, {
        id: 0,
        roleName: "",
    });
    //清空上一次表单校验错误结果
    nextTick(() => {
        formRef.value?.clearValidate('roleName');
    })

}

const save = async () => {
    //表单校验通过才能发请求
    await formRef.value?.validate();
    let result: any = await reqAddOrUpdateRole(RoleParams);
    if (result.code === 200) {

        ElMessage({
            type: 'success',
            message: RoleParams.id ? '更新成功' : '新增成功',
        });
        dialogVisible.value = false;
        //刷新当前页
        getAllRole(RoleParams.id ? pageNo.value : 1);
    } else {
        ElMessage({
            type: 'error',
            message: RoleParams.id ? '更新失败' : '新增失败',
        });

    }
}
//编辑/更新职位
const updateRole = (row: RoleData) => {
    dialogVisible.value = true;
    //存储己有的职位---带有ID的
    Object.assign(RoleParams, row);
    //清空上一次表单校验错误结果
    nextTick(() => {
        formRef.value?.clearValidate('roleName');
    })
}

///分配权限按钮的回调
//已有的职位的数据
const setPermisstion = async (row: RoleData) => {
    //打开抽屉
    drawer.value = true;
    //收集当前要分类权限的职位的数据
    Object.assign(RoleParams, row);
    //根据职位获取权限的数据
    let result: MenuResponseData = await reqAllMenuList((RoleParams.id as number))
    if (result.code === 200) {
        menuArr.value = result.data;
        selectArr.value = filterSelectArr(menuArr.value, []);
    }

}

//准备一个数组：数组用于存储勾选的节点的ID（四级的）
let selectArr = ref<number[]>([]);

//树形控件的测试数据
const defaultProps = {
    children: 'children',
    label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id);
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr);
        }
    })

    return initArr;
}
//抽屉确定按钮的回调
const handler = async () => {
    //职位的ID
    const roleId = (RoleParams.id as number);
    let arr = tree.value.getCheckedKeys();
    //半选的ID
    let arr1 = tree.value.getHalfCheckedKeys();
    let permissionId = arr.concat(arr1);
    //下发权限
    let result: any = await reqSetPermission(roleId, permissionId)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '权限分配成功',
        });
        drawer.value = false;
        //页面刷新,修改自身的权限需重新获取
        window.location.reload();
    } else {
        ElMessage({
            type: 'error',
            message: '权限分配失败',
        });
    }
}

//删除已有的职位
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getAllRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败',
        })
    }

}


</script>

<template>
    <div>
        <el-card style="margin: 10px 0;">
            <el-for class="form">
                <el-form-item label="职位搜索">
                    <el-input placeholder="请输入职位名称" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                    <el-button type="primary" @click="reset">重置</el-button>
                </el-form-item>
            </el-for>
        </el-card>
        <el-card>
            <el-button type="primary" :icon="Plus" @click="addRole">添加职位</el-button>

            <el-table border style="margin: 10px 0;" :data="allRole">
                <el-table-column label="#" type="index" align="center"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="职位名称" prop="roleName" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" prop="updateTime" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" width="360px">
                    <template #="{ row, $index }">
                        <el-button type="primary" :icon="User" size="small"
                            @click="setPermisstion(row)">分配权限</el-button>
                        <el-button type="primary" :icon="Edit" size="small" @click="updateRole(row)">编辑</el-button>

                        <el-popconfirm :title="`你确定要删除${row.roleName}吗？`" width="260px" @confirm="removeRole(row.id)">
                            <template #reference>
                                <el-button type="primary" :icon="Delete" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 6, 9, 12]"
                :background="true" layout=" prev, pager, next, jumper,->,total, sizes," :total="total"
                @change="getAllRole" />

        </el-card>
        <!-- 添加职位与更新已有职位的结构：对话框 -->
        <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '新增职位'" width="500">
            <el-form :model="RoleParams" :rules="rules" ref="formRef">
                <el-form-item label="职位名称" prop="roleName">
                    <el-input placeholder="请输入职位名称" v-model="RoleParams.roleName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="save">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 抽展组件：分配职位的菜单权限与按钮的权限 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>分配菜单与按钮的权限</h4>
            </template>
            <template #default>
                <!-- 树形控件 -->
                <el-tree ref="tree" style="max-width: 600px" :data="menuArr" show-checkbox node-key="id"
                    :default-expanded-keys="[2, 3]" :default-checked-keys="selectArr" :props="defaultProps" />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer = false">取消</el-button>
                    <el-button type="primary" @click="handler">确定</el-button>
                </div>
            </template>
        </el-drawer>

    </div>
</template>

<style lang="scss" scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
