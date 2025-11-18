import request from "@/utils/request";
import type { CategoryResponseData,AttrResponseData ,Attr} from "./type";
enum API{
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    //获取分类下已有的属性与属性值
    ATTR_URL = '/admin/product/attrInfoList/',
    //添加或者修改已有的属性的接口
    ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
    //删除已有的属性的接口
    DELETEATTR_URL = '/admin/product/deleteAttr/',
} 

export const reqC1 = () => request.get<any,CategoryResponseData>(API.C1_URL)
export const reqC2 = (category1Id:number|string) => request.get<any,CategoryResponseData>(API.C2_URL+category1Id)
export const reqC3 = (category2Id:number|string) => request.get<any,CategoryResponseData>(API.C3_URL+category2Id)
//获取分类下已有的属性与属性值
export const reqAttr = (category1Id:number|string,category2Id:number|string,category3Id:number|string) => request.get<any,AttrResponseData>(API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`)
//添加或者修改已有的属性的接口
export const reqAddOrUpdateAttr = (data:Attr) => request.post<any,any>(API.ADDORUPDATEATTR_URL,data)
//删除已有的属性的接口
export const reqRemoveAttr = (attrId:number) => request.delete<any,any>(API.DELETEATTR_URL+attrId)