//封装一个函数：获取一个结果：当前早上|上午|下午|晚上

export const getTime = () => {
    let message = '';
    let hour = new Date().getHours();
    if (hour <= 9) {
        return '早上';
    } else if (hour <= 11) {
        return '上午';
    } else if (hour <= 13) {
        return '中午';
    } else if (hour <= 18) {
        return '下午';
    } else {
        return '晚上';
    }
    return message;
}