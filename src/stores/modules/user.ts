
import { defineStore } from "pinia";
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from "@/api/user";
import type { loginFromData, loginResponseData, userInfoResponseData } from "@/api/user/type";
import type { UserState } from "./types/type";
//引入操作本地存储的工具方法
import { SET_ToKEN, GET_ToKEN, REMOVE_ToKEN } from "@/utils/token";
//引入路由（常量路由）
import { constantRoutes, asyncRoutes, anyRoutes } from "@/router/routes";
import router from "@/router";
//引入深拷贝方法
import cloneDeep from "lodash/cloneDeep";
////用于过滤当前用户需要展示的异步路由
//过滤异步路由
function filterAsyncRoute(asyncRoutes: any, routes: any) {
  return asyncRoutes.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}


//创建用户小仓库
let useUserStore = defineStore("user", {
  state: (): UserState => {
    return {
      // token: localStorage.getItem("TOKEN"),//使用本地存储token
      token: GET_ToKEN(),//使用本地存储token
      menuRoutes: constantRoutes,//仓库存储生成菜单需要数组（路由)
      username: "",//用户名
      avatar: "",//头像
      //存储当前用户是否包含某一个按钮
      buttons: [],//按钮权限

    };
  },
  actions: {
    //登录
    async userLogin(data: loginFromData) {
      let result: loginResponseData = await reqLogin(data);

      if (result.code === 200) {
        //登录成功
        //pinia仓库存储一下token
        //由于pinialvuex存储数据其实利用js对象
        this.token = (result.data as string);
        //本地存储持久化存储一份token
        // localStorage.setItem("TOKEN",(result.data.token as string));
        SET_ToKEN((result.data as string));
        return 'ok';
      } else {
        //登录失败
        return Promise.reject(new Error(result.message));
      }
    },
    //获取用户信息
    async userInfo() {

      //获取用户信息
      let result: userInfoResponseData = await reqUserInfo();

      if (result.code === 200) {
        //获取成功
        //pinia仓库存储一下用户信息
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        //计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoutes), result.data.routes);
        //菜单需要的据整理完毕
        this.menuRoutes = [...constantRoutes, ...userAsyncRoute, ...anyRoutes];
        //目前路由器管理的只有常量路由：用户计算完毕异步路由、任意路由动态追加
        [...userAsyncRoute, ...anyRoutes].forEach((route: any) => {
          router.addRoute(route);
        })

        return 'ok';
      } else {
        //获取失败
        return Promise.reject(new Error(result.message));
      }


    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout();

      //退出成功
      if (result.code === 200) {
        //清空pinia仓库的token
        this.token = '';
        this.username = '';
        this.avatar = '';
        // 重置菜单路由为初始的常量路由（避免菜单残留动态路由）
        this.menuRoutes = constantRoutes;
        // 核心：删除所有动态添加的路由（asyncRoutes + anyRoutes）
        // 思路：遍历动态路由源数据，通过路由的 `name` 移除已添加的路由
        const dynamicRoutes = [...asyncRoutes, ...anyRoutes]; // 所有动态路由的集合
        dynamicRoutes.forEach(route => {
          // 先判断该路由是否已添加到路由器中（避免重复移除报错）
          const existingRoute = router.getRoutes().find(item => item.name === route.name);
          if (existingRoute) {
            router.removeRoute(route.name); // 通过路由名移除路由（最可靠的方式）
          }
        });
        //清空本地存储的token
        REMOVE_ToKEN();
        return 'ok';

      } else {
        return Promise.reject(new Error(result.message));
      }


    }

  },
  getters: {

  }
});

export default useUserStore;