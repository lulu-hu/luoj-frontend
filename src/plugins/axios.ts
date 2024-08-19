import axios from "axios";
import { RequestOption } from "@arco-design/web-vue";

axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    console.log("响应", response);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
