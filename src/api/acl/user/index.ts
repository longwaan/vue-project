//用户管理模块的接口
import request from "@/utils/request";
import type { AllRoleResponseData, SetRoleData, User, UserResponseData } from "./type";

enum API {
    //获取全部已有用户账号信息
    ALLUSER_URL = '/admin/acl/user/',
    //添加一个新的用户账号
    ADDUSER_URL = '/admin/acl/user/save',
    //修改更新一个已有的用户账号
    UPDATEUSER_URL = '/admin/acl/user/update',
    //获取全部职位，当前账号拥有的职位接口
    ALLROLE_URL = '/admin/acl/user/toAssign/',
    //给已有的用户分配角色接口
    SETROLE_URL = '/admin/acl/user/doAssignRole',
    //删除某一个账号
    DELETEUSER_URL = '/admin/acl/user/remove/',
    //批量删除的接口
    DELETRALLUSER_URL = '/admin/acl/user/batchRemove'
}
//获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number,username: string) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}?username=${username}`)
//添加..修改用户账号的接口
export const reqAddOrUpdateUser = (data: User) => {
    //判断是添加还是修改
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}

////获取全部职位，当前账号拥有的职位接口
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId);

//给已有的用户分配角色接口
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_URL, data);


//删除某一个账号
export const reqRemoveUser = (userId: number) => request.delete<any, any>(API.DELETEUSER_URL + userId);

//批量删除的接口
export const reqSelectUser = (idList: number[]) => request.delete<any, any>(API.DELETRALLUSER_URL, { data: idList });





