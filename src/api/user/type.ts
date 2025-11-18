//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface loginFromData{
    username:string,
    password:string
}

//定义全部接口返回数据都拥有ts类型
export interface ResponseData{
    code:number,
    message:string,
    ok:boolean
}

//定义登录接口返回数据类型，继承自ResponseData
export interface loginResponseData extends ResponseData{
    data:string
}

//定义用户信息接口返回数据类型，继承自ResponseData
export interface userInfoResponseData extends ResponseData{
    data:{
        routes:string[],
        buttons:string[],
        role:string[],
        name:string,
        avatar:string
    }
}