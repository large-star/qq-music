import axios from 'axios';

export function http(config){
  const service = axios.create({
    baseURL: 'https://netease-cloud-music-api-ten-mauve.vercel.app',
    withCredentials: true
    // timeout: 5000,
  })

  //请求拦截
  service.interceptors.request.use(config => {

    return config;
  },err => {
    // console.log(err);
    Promise.reject(err);
  })

  //响应拦截
  service.interceptors.response.use(response => {

    return response.data;
  },err => {
    // console.log(err);
    Promise.reject(err);
  })

  //返回实例
  return service(config);

}