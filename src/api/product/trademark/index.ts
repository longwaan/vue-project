//品牌管理模块接口

import request from "@/utils/request";

import type { TradeMarkResponseData,TradeMark } from "@/api/product/trademark/type";
enum API {
    //获取已有品牌的接口,分页查询
    TRADEMAARK_URL = '/admin/product/baseTrademark/',
    //添加品牌的接口
    ADDTRADEMAARK_URL = '/admin/product/baseTrademark/save',
    //编辑品牌的接口
    UPDATETRADEMAARK_URL = '/admin/product/baseTrademark/update',

    //删除品牌的接口
    DELETE_URL = '/admin/product/baseTrademark/remove/',

}

//获取已有品牌的接口
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMarkResponseData>(API.TRADEMAARK_URL + `${page}/${limit}`);

//添加与修改品牌的接口
export const reqAddOrUpdataTrademark = (data: TradeMark) => {
    if (data.id) {
        return request.put<any,any>(API.UPDATETRADEMAARK_URL, data)

    } else {
        return request.post<any,any>(API.ADDTRADEMAARK_URL, data)

    }

}

//删除品牌的接口
export const reqDeleteTrademark = (id: number) => request.delete<any,any>(API.DELETE_URL + id);