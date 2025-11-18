<script setup lang="ts">
import { reqAddOrUpdateUser, reqUserInfo, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user';
import type { Records, UserResponseData, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type';
import useLayoutSettingStore from '@/stores/modules/setting';
import { Avatar, Delete, Edit, } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref, nextTick } from 'vue';
//默认页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//用户总个数
let total = ref<number>(0);
//存储全部用户的数组
let userArr = ref<Records>([]);
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false);
//控制分配角色抽展显示与隐藏
let drawer1 = ref<boolean>(false);
//收集用户信息的响应式数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: '',
})

//存储全部职位的数据
let allRole = ref<AllRole>([]);
//存储当前用户拥有的角色
let userRole = ref<AllRole>([]);

//定义响应式数据：收集用户输入进来的关键字
let keyword = ref<string>('');

//获取form组件的实例
let formRef = ref<any>();
//获取模板setting仓库
let settingStore = useLayoutSettingStore();

onMounted(() => {
    //发请求获取用户信息
    getHasUser();
});

//获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
    pageNo.value = pager;
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value);
    if (result.code === 200) {
        total.value = result.data.total;
        userArr.value = result.data.records;
    }

}

//添加用户按钮的回调
const addUser = () => {
    drawer.value = true;
    Object.assign(userParams, {
        //解决点完更新再点击新增按钮，id存在的问题，这样标题就可以正常显示
        id: 0,
        username: '',
        name: '',
        password: '',
    })
    //nextTick等 DOM 更完再做事
    //清除上一次的错误的提示信息 
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    })
}

//更新已有的用户按钮的回调
//row：即为已有用户的账号信息
const updateUser = (row: User) => {
    //抽显示出来
    drawer.value = true;
    //存储收集已有的账号信息,合并
    Object.assign(userParams, row);
    //nextTick等 DOM 更完再做事
    //清除上一次的错误的提示信息 
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
    })
}
//保存按钮的回调
const save = async () => {
    //点击保存按钮的时候，务必需要保证表单全部复合条件在去发请求
    await formRef.value.validate()

    //保存按钮：添加新的用户|更新已有的用户账号信息
    //发请求保存用户信息
    let result: any = await reqAddOrUpdateUser(userParams);
    //添加或者更新成功
    if (result.code === 200) {
        //保存成功，关闭抽屉
        drawer.value = false;
        //提示消息
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功'
        })
        //刷新页面,更新留在当前页，添加留在第一页
        getHasUser(userParams.id ? pageNo.value : 1);
        //浏览器自动刷新一次,自己修改自己的用户信息后，刷新页面获取最新的用户信息，使得再走一次请求拦截器
        window.location.reload();
        //浏览器刷新一次，永远回的都是第一页，导致上面的代码失效


    } else {
        //关闭抽屉
        drawer.value = false;
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败'
        })
    }
}
//取消按钮的回调
const cancel = () => {
    //关闭抽屉
    drawer.value = false;
}
//校验用户名字回调函数,rule：校验规则，value：输入的值，callback：回调函数
const validatorUsername = (rule: any, value: string, callback: any) => {
    //用户名字昵称，长度至少五位
    if (value.trim().length >= 5) {
        callback();
    } else {
        callback(new Error('用户名字长度至少五位'));
    }
}
//校验用户昵称回调函数
const validatorname = (rule: any, value: string, callback: any) => {
    //用户名字昵称，长度至少五位
    if (value.trim().length >= 5) {
        callback();
    } else {
        callback(new Error('用户昵称长度至少五位'));
    }
}

//校验用户密码回调函数
const validatorPassword = (rule: any, value: string, callback: any) => {
    //用户名字密码，长度至少六位
    if (value.trim().length >= 6) {
        callback();
    } else {
        callback(new Error('用户密码长度至少六位'));
    }
}
//表单校验的规则对象
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

//分配角色按钮的回调
const setRole = async (row: User) => {

    //存储已有的用户信息
    Object.assign(userParams, row);
    //发请求获取当前用户拥有的角色列表
    let result: AllRoleResponseData = await reqAllRole((userParams.id as number));

    if (result.code === 200) {
        //存储全部的职位
        allRole.value = result.data.allRolesList;
        //存储当前用户已有的职位
        userRole.value = result.data.assignRoles;
        //抽展显示出来
        drawer1.value = true;
    }

}


//收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式,,,就是横杠的样式
const isIndeterminate = ref<boolean>(true)

//顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
    //val：true（全选）|false（没有全选）
    userRole.value = val ? allRole.value : []
    //不确定样式
    isIndeterminate.value = false
}

//底部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
    //顶部复选框的勾选数据
    //代表：勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length
    //不确定样式
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

//确认分配角色按钮的回调
const confirmClick = async () => {
    //收集参数
    let data: SetRoleData = {
        userId: (userParams.id as number),
        roleIdList: userRole.value.map(item => {
            return (item.id as number)
        })
    }

    //分配用户的职位
    let result: any = await reqSetUserRole(data);
    console.log(result)
    if (result.code === 200) {
        //提示消息
        ElMessage({
            type: 'success',
            message: '分配角色成功'
        })
        //关闭抽屉
        drawer1.value = false;

        //刷新页面,更新留在当前页，添加留在第一页
        getHasUser(userParams.id ? pageNo.value : 1);

    } else {
        //关闭抽屉
        drawer1.value = false;
        ElMessage({
            type: 'error',
            message: '分配角色失败'
        })

    }
}

//删除某一个用户
const deleteUser = async (UserId: number) => {
    let result: any = await reqRemoveUser(UserId);
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        //刷新页面,更新留在当前页，添加留在第一页
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    } else {
        ElMessage({
            type: 'error',
            message: '删除失败'
        })
    }
}


//准备一个数组存储批量刑除的用户的ID
let selectIdArr = ref<User[]>([]);
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
    selectIdArr.value = value;
}

//批量删除
const deleteSelectUser = async () => {
    ///整理批量删除的参数
    let idList: any = selectIdArr.value.map(item => {
        return item.id;
    })
    let result: any = await reqSelectUser(idList);
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '批量删除成功'
        })
        //刷新页面,更新留在当前页，添加留在第一页
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
    } else {
        ElMessage({
            type: 'error',
            message: '批量删除失败'
        })
    }
}


//搜索按钮的回调
const search = () => {
    //根据关键字获取相应的用户数据
    getHasUser();
    //清空关键字
    keyword.value = '';

}

const reset = () => {
    settingStore.refsh = !settingStore.refsh;
}



</script>

<template>
    <div>
        <el-card heigth="80px">
            <el-form :inline="true" class="form">
                <el-form-item label="用户名:">
                    <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :disabled="keyword ? false : true" @click="search">搜索</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>

            </el-form>
        </el-card>

        <el-card style="margin: 10px 0;">
            <el-button type="primary" @click="addUser">新增用户</el-button>
            <el-button type="danger" :disabled="selectIdArr.length ? false : true"
                @click="deleteSelectUser">批量删除</el-button>
            <el-table @selection-change="selectChange" border style="margin: 10px 0px;" :data="userArr">
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="#" type="index" width="60px" align="center"></el-table-column>
                <el-table-column label="id" align="center" prop="id"></el-table-column>
                <el-table-column label="用户名字" align="center" prop="username"></el-table-column>
                <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
                <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
                <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
                <el-table-column label="操作" align="center" width="400px">
                    <template #="{ row, $index }">
                        <el-button type="primary" :icon="Avatar" @click="setRole(row)">分配角色</el-button>
                        <el-button type="primary" :icon="Edit" @click="updateUser(row)">编辑</el-button>

                        <el-popconfirm :title="`你确定要删除${row.username}吗？`" width="260px" @confirm="deleteUser(row.id)">
                            <template #reference>
                                <el-button type="primary" :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 6, 9, 12]"
                :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total"
                @change="getHasUser" />

        </el-card>
        <!-- 抽屉结构：完成添加新的用户账号|更新已有的账号信息 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
            </template>
            <template #default>
                <div>
                    <el-form :model="userParams" :rules="rules" ref="formRef">
                        <el-form-item label="用户姓名" prop="username">
                            <el-input plcaeholder="请输入用户姓名" v-model="userParams.username"></el-input>
                        </el-form-item>
                        <el-form-item label="用户昵称" prop="name">
                            <el-input plcaeholder="请输入用户昵称" v-model="userParams.name"></el-input>
                        </el-form-item>
                        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                            <el-input plcaeholder="请输入用户密码" v-model="userParams.password" type="password"
                                show-password></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </div>
            </template>
        </el-drawer>

        <!--抽屉结构：用户某一个已有的账号进行职位分配  -->
        <el-drawer v-model="drawer1">
            <template #header>
                <h4>分配角色(职位)</h4>
            </template>
            <template #default>
                <div>
                    <el-form>
                        <el-form-item label="用户姓名">
                            <el-input v-model="userParams.username" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="角色列表">
                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                                @change="handleCheckAllChange">
                                全选
                            </el-checkbox>
                            <!-- 显示职位的的复选框 -->
                            <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="(role, index) in allRole" :key="role.id" :label="role">
                                    {{ role.roleName }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer1 = false">取消</el-button>
                    <el-button type="primary" @click="confirmClick">确定</el-button>
                </div>
            </template>
        </el-drawer>

    </div>
</template>

<style lang="scss" scoped>
.form {
    display: flex;
    align-items: center;
    justify-content: space-between;

}
</style>
