import axios from 'axios'

export function $axios(config) {
  //1，创建实例
  const instance = axios.create({
    // baseURL: 'http://119.23.53.78:8888/api/private/v1/',
    baseURL: 'http://47.115.124.102:8888/api/private/v1/',
    timeout: 5000
  });
  //2，设置axios拦截器
  //2.1 请求时的拦截器
  instance.interceptors.request.use(config => {
    //为请求头对象添加 token 验证的自定义 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
  }, error => {
    console.log('请求失败', error);
    return error
  });
  //2.2 响应时的拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log('响应失败');
    return error
  });
  //3，发送真正的请求
  return instance(config)
}
