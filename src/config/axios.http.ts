import axios from "axios"
import {router, uninstallLayoutContentRoute} from "@/router";

export function setupAxios() {
  axios.defaults.withCredentials = true
  axios.defaults.baseURL = import.meta.env.VITE_API_ORIGIN;
  axios.interceptors.response.use(function (response) {
    if (response.data.code === 401) {
      uninstallLayoutContentRoute()
      router.replace({
        name: "login"
      })
    }
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  console.log("VITE_API_ORIGIN", import.meta.env.VITE_API_ORIGIN)
}