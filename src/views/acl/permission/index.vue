<script setup lang="ts">
import { reqAddOrUpdataMenu, reqAllPermission, reqRemoveMenu } from '@/api/acl/menu';
import type { MenuParams, Permisstion, PermisstionList, PermisstionResponseData } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
//存储菜单的数据
let PermisstionArr = ref<PermisstionList>([]);
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//携带的参数
let menuData = reactive<MenuParams>({
    code: "",
    name: '',
    level: 0,
    pid: 0,
})



onMounted(() => {
    getHasPermisstion();
})
//获取菜单数据的方法
const getHasPermisstion = async () => {
    let result: PermisstionResponseData = await reqAllPermission();
    if (result.code === 200) {
        PermisstionArr.value = result.data;
    }

}
//添加菜单按钮的回调
const addPermisstion = (row: Permisstion) => {
    //对话框显示出来
    dialogVisible.value = true;
    //收集新增的菜单的level数值
    menuData.level = row.level + 1;
    //将当前菜单的ID赋值给pid
    menuData.pid = row.id;
    //清空表单数据
    Object.assign(menuData, {
        id: 0,
        code: "",
        name: '',
        level: 0,
        pid: 0,
    })


}
//编辑已有的菜单
const updatePermisstion = (row: Permisstion) => {
    //对话框显示出来
    dialogVisible.value = true;
    //收集编辑的菜单数值
    Object.assign(menuData, row);

}

//确定按钮的回调
const save = async () => {
    //提交表单数据
    let result: any = await reqAddOrUpdataMenu(menuData);
    if (result.code === 200) {
        ElMessage({
            type: "success",
            message: menuData.id ? "更新菜单成功" : "添加菜单成功"
        })
        getHasPermisstion();
        //关闭对话框
        dialogVisible.value = false;
    } else {
        ElMessage({
            type: "error",
            message: "添加菜单失败"
        })
    }
}

const removeMenu = async (id: number)=> {
    let result = await reqRemoveMenu(id);
    if (result.code === 200) {
        ElMessage({
            type: "success",
            message: "删除菜单成功"
        })
        getHasPermisstion();
    } else {
        ElMessage({
            type: "error",
            message: "删除菜单失败"
        })
    }
}
</script>

<template>
    <div>
        <el-table :data="PermisstionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="权限值" />
            <el-table-column prop="updateTime" label="修改时间" />
            <el-table-column label="操作">
                <template #="{ row, index }">
                    <el-button @click="addPermisstion(row)" type="primary" size="small"
                        :disabled="row.level === 4 ? true : false">{{ row.level === 3
                            ? '添加功能' : '添加菜单' }}</el-button>
                    <el-button @click="updatePermisstion(row)" type="primary" size="small"
                        :disabled="row.level === 1 ? true : false">编辑</el-button>


                    <el-popconfirm :title="`你确定要删除${row.name}吗？`" width="260px" @confirm="removeMenu(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small"
                                :disabled="row.level === 1 ? true : false">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '新增菜单'">
            <el-form label-width="80px">
                <el-form-item label="名称">
                    <el-input placeholder="请输入名称" v-model="menuData.name"></el-input>
                </el-form-item>
                <el-form-item label="权限值">
                    <el-input placeholder="请输入权限数值" v-model="menuData.code"></el-input>
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
    </div>
</template>

<style lang="scss" scoped></style>
