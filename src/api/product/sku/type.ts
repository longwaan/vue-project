//服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,

}
// SKU 平台属性
export interface SkuAttrValue {
    attrId: string | number // 平台属性ID
    valueId: string | number // 属性值ID
    attrName: string
    id?: number
    skuId: number
    valueName: string
}
// SKU 图片
export interface SkuImg {
    id: number
    skuId: number
    imgName: string
    imgUrl: string
    spuImgId: number
    isDefault: string
}
// SKU 销售属性
export interface SkuSaleAttrValue {
    id?: number
    saleAttrId: string | number // 销售属性ID
    saleAttrValueId: string | number // 销售属性值ID
    saleAttrValueName: string // 销售属性值名称

    saleAttrName: string
    skuId: number
}
//SKU数据的ts类型
export interface SkuData {
    category3Id?: string | number // 三级分类的ID
    spuId?: string | number // 已有的SPU的ID
    tmId?: string | number // SPU 品牌ID
    skuName?: string // SKU 名字
    price?: string | number // SKU 价格
    weight?: string | number // SKU 重量
    skuDesc?: string // SKU 描述
    skuAttrValueList?: SkuAttrValue[] // 平台属性
    skuSaleAttrValueList?: SkuSaleAttrValue[] // 销售属性
    skuImageList: SkuImg[] // SKU 图片
    skuDefaultImg?: string // 售卖SKU图片地址
    isSale?: number //控制商品的上架与下架
    id?: number //SKU的ID
}

//获取SKU数据接口的ts类型
export interface SkuResponseData extends ResponseData {
    data: {

        records: SkuData[],
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number,

    }
}

//获取SKU商品详情接口ts类型
export interface SkuInfoData extends ResponseData {
    data: SkuData
}