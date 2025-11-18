import request from "@/utils/request";
import type { MenuResponseData, RoleData, RoleResponseData } from "./type";

enum API {
    //获取全部职位信息
    ALLROLE_URL = '/admin/acl/role/',
    //添加一个新的职位信息
    ADDROLE_URL = '/admin/acl/role/save',
    //更新一个职位信息
    UPDATEROLE_URL = '/admin/acl/role/update',
    //获取全部的菜单与按钮的数据
    ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
    //给相应的职位分配权限
    SETPERMISSION_URL = '/admin/acl/permission/doAssign?',

    //删除一个职位信息
    REMOVEROLE_URL = '/admin/acl/role/remove/',
}

//获取全部的角色
export const reqAllRoleList = (page: number, limit: number, roleName: string) => request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`);
//添加和更新一个职位信息
export const reqAddOrUpdateRole = (role: RoleData) => {
    if (role.id) {
        return request.put<any, any>(API.UPDATEROLE_URL, role)
    } else {
        return request.post<any, any>(API.ADDROLE_URL, role)
    }
}
//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId);

//给相应的职位下发权限
export const reqSetPermission = (roleId: number, permissionId: number[]) => request.post<any, any>(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`);

//删除己有的职位
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVEROLE_URL + roleId);









