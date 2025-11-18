// 路由鉴权：鉴权，项目当中路由能不能被访问的权限设置
import router from './router'
import nprogress from 'nprogress'
import setting from './setting'
//进度条
import 'nprogress/nprogress.css'
// 获取用户小仓库token数据，判断用户是否登录成功
import useUserStore from './stores/modules/user'
import pinia from './stores'
//取消加载动画小圆球
nprogress.configure({ showSpinner: false })
let userStore = useUserStore(pinia)




//全局守卫：项目当中人意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async(to: any, from: any, next: any) => {
    document.title =`${setting.title}`+`${to.meta.title}`
    // to： 目标路由
    // from：源路由
    // next：路由放行函数
    nprogress.start();
    // 获取token，判断用户是否登录
    let token = userStore.token;
    //获取用户名字
    let username = userStore.username
    if (token) {
        // 登录成功，访问login，重定向到首页
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            // 访问其余路由
            // 有用户信息
            if (username) {
                // 放行
                next()
            } else {
                // 获取用户信息后放行
                try {
                    await userStore.userInfo()
                    // 放行
                    // 如果刷新的时候是异步路由，有可能获取到用户信息、异步路由还没有加载完毕，出险空白效果
                    next({...to, replace: true })
                } catch (error) {
                    // token 过期：获取不到用户信息了
                    // 退出登录->用户相关的数据清空
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }


    } else {
        // 未登录，跳转到登录页面
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }

})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done();
    document.title = `${setting.title}-${to.meta.title}`

})

// 第一个问题：任意路由切换实现进度条显示 nprogress
// 第二个问题：路由组件访问权限设置

// 用户未登录：可以访问login，其余路由不能访问（重定向到 login）
// 用户登录成功：访问 login 自动重定向到首页，其余路由可以访问
