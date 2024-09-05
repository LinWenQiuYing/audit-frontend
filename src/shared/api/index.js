import store from "@/store";
import { getUserInfo, LocalStorage } from "@/utils/common.js";
import { message } from "ant-design-vue";
import axios from "axios";
import qs from "qs";

const axiosInstance = axios.create({
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

axiosInstance.interceptors.request.use(
  // (config) => config,
  (config) => {
    // do something before request is sent

    if (store.state.rightsOptions.userInfo.token) {
      config.headers["authentication"] = getUserInfo().token;
    }
    // config.headers["authentication"] = "test-token";
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // debugger;
    // location.href = `/cas/login?service=${encodeURIComponent(location.href)}`;
    // return;
    if (response.data.code === 30025 || response.data.message === "登录超时") {
      store.state.rightsOptions.userInfo.token = undefined;
      LocalStorage.removeItem("userInfo");
      message.destroy();
      message.error("登陆超时，请重新登陆！", 2);
      setTimeout(() => {
        // router.replace("/login");
        //gj todo  注释  一期如下
        //window.location.href = "http://10.83.70.241:8081/#/login";
        //gj todo  注释  三期普元提供如下
        window.location.href = "http://10.83.242.185:8081/#/login";
      }, 1000);
      return;
    } else {
      return response.data;
    }
  },
  (error) => {
    let errorMessage = "请求超时";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = "错误请求";
          break;
        case 401:
          /* TODO 待调整 */
          location.href = `${location.protocol}//${location.host}/gateway/user/api/users/login`;
          return;
        case 403:
          errorMessage = "拒绝访问";
          break;
        case 404:
          errorMessage = "请求错误,未找到该资源";
          break;
        case 405:
          errorMessage = "请求方法未允许";
          break;
        case 408:
          errorMessage = "请求超时";
          break;
        case 500:
          errorMessage = "服务器端出错";
          break;
        case 501:
          errorMessage = "网络未实现";
          break;
        case 502:
          errorMessage = "网络错误";
          break;
        case 503:
          errorMessage = "服务不可用";
          break;
        case 504:
          errorMessage = "网络超时";
          break;
        case 505:
          errorMessage = "http版本不支持该请求";
          break;
        default:
          errorMessage = `连接错误${error.response.status}`;
      }
    } else {
      errorMessage = "请求超时";
    }
    message.destroy();
    message.error(errorMessage);
    return Promise.reject(errorMessage);
  }
);

export default axiosInstance;
