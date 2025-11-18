//统一管理咱们项目用户相关的接口
import request from "@/utils/request";

import type { loginFromData,loginResponseData,userInfoResponseData} from "@/api/user/type";
//项目相关的请求地址
enum API{
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
}

//登录接口//loginFromData需要携带的数据//loginResponseData是数据返回的类型
export const reqLogin = (data:loginFromData) =>request.post<any,loginResponseData>(API.LOGIN_URL,data);
//获取用户信息接口//userInfoResponseData是数据返回的类型,用来约束返回的数据类型
export const reqUserInfo = () =>request.get<any,userInfoResponseData>(API.USERINFO_URL);
//退出登录接口
export const reqLogout = () =>request.post<any,any>(API.LOGOUT_URL);