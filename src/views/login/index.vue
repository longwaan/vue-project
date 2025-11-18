<script setup lang="ts">
import {User,Lock, Loading} from '@element-plus/icons-vue';
import { reactive,ref } from 'vue';
import useUserStore from '@/stores/modules/user';
import { useRouter,useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
import { getTime } from '@/utils/time';

let userStore = useUserStore();
let loginForm =reactive({
    username: 'admin',
    password: '111111',
})
let $router = useRouter();
let $route = useRoute();
let loading = ref(false);
let loginForms = ref();

const login = async () => {
    await loginForms.value.validate();

    loading.value = true;
    try {
        await userStore.userLogin(loginForm);
        window.location.reload(); //刷新页面
        //判断登录的时候，路由路径当中是否有guery参如果有就往query参数挑战，没有跳转到首页
        let redirect:any = $route.query.redirect;
        $router.push({path:redirect||'/'});
        ElNotification({
            type:'success',
            message: '欢迎回来哦',
            title:`Hi,${getTime()}好`
        });
        loading.value = false;
    }catch(error){
        loading.value = false;
        ElNotification({
            type: 'error',
            message: (error as Error).message,
        })
    }
}

const validatorUserName = (rule:any, value:any, callback:any) => {
    //rule：即为校验规则对象
    // //value：即为表单元素文本内容
    // //函数：如果符合条件cal1Back放行通过即为
    // //如果不符合条件callBack方法，注入错误提示信息
    if (value.length >= 5) {
        callback();
    } else {
        callback(new Error('账号长度至少五位'));
    }
}

const validatorPasswowrd = (rule:any, value:any, callback:any) => {
    if (value.length >= 6) {
        callback();
    } else {
        callback(new Error('密码长度至少六位'));
    }
}

const rules ={
    //规则对象属性：
    //required，代表这个字段务必要校验的
    //min：文本长度至少多少位
    //max：文本长度最多多少位
    //message：错误的提示信息
    //trigger：触发校验表单的时机change->文本发生变化触发校验，blur：失去焦点的时候触发校验规则
    username: [
        // {required:true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
        {trigger: 'change',validator:validatorUserName}
    ],
    password: [
        // { required:true,min: 6, max: 15, message: '密码长度至少六位', trigger: 'change' }
        {trigger:'change',validator:validatorPasswowrd}
    ]
}

</script>

<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"  placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password  placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" type="primary" size="default" class="login_btn" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
    
}

.login_form{
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1{
        color: white;
        font-size: 40px;
    }
    h2{
        color: white;
        font-size: 20px;
        margin: 20px 0;
    }

    .login_btn{
        width: 100%;
    }

}
</style>
