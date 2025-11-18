//封装本地存储存储数据与读取数据方法
//存储数据
export const SET_ToKEN = (token: string) => {
    localStorage.setItem("ToKEN", token);
}
//本地存储读取数据
export const GET_ToKEN = () => {
    return localStorage.getItem("ToKEN");
}

//本地存储删除数据方法
export const REMOVE_ToKEN = () => {
    localStorage.removeItem("TOKEN");
}
