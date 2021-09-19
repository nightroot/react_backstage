import axios from "axios";
import { message } from 'antd';
import { persistor, store } from '@/redux/index'
// const { persistor, store } = configureStore();

// axios的实例及拦截器配置
const request = axios.create({
    // baseURL: 'http://47.107.37.6:3000/mock/13/api', //mock+环境
    // baseURL: 'http://47.107.37.6:3000/mock/11', //联调环境
    baseURL: 'http://47.107.37.6:5915/api', //开发环境
    headers: { 'Content-Type': 'application/json;charset=utf-8' }

});

//请求拦截器
request.interceptors.request.use(function (config) {

    let token = ""
    const state = store.getState()
    // // 判断所属系统 - 附加登录凭证
    if (config.url.startsWith("/backstage")) { token = state.backstageuser.token }
    if (config.url.startsWith("/landlord")) { token = state.landlorduser.token }
    if (config.url.startsWith("/tenant")) { token = state.tenantuser.token }
    if (token) {
        config.headers.Authorization = `token ${token}`
    }
    return config
}, function (error) {
    return Promise.reject(error);
})

//响应拦截器
request.interceptors.response.use(
    res => res.data,
    err => {
        console.log(err, "网络错误");
    }
);


const post = (path, params) => {
    // 打印请求参数-开发
    console.log(params)
    return request({
        url: path,
        method: 'post',
        data: params
    }).then((res) => {
        // 打印返回数据-开发
        console.log(res)
        if(res===undefined){
            message.error("后端服务未开启");
            return Promise.reject("err")
        }
        // 返回数据校验 - 开发时取消校验
        if(res.code!==200){
            message.error(res.msg);
            return Promise.reject(res)
        }
        return Promise.resolve(res.data)
    })
}

export default post;