import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken, getTicket } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
});

const request = async(args) => {
  let res = await service(args);
  if (res.code !== 0) {
    const messages = res.messages;
    let message = res.message;
    if (messages) {
      message = "";
      messages.reverse().forEach(element => {
        message += "<p>" + element.error + "</p>";
      });
    }
    // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    if (res.code === 401000) {
      const ticket = getTicket();
      if (ticket) {
        await store.dispatch("user/createOrFlushToken", { ticket });
        res = await service(args);
        return res;
      }
      // to re-login
      MessageBox.confirm("你登录已失效,是否留在当前页面?", "确认登出", {
        confirmButtonText: "重新登录",
        cancelButtonText: "放弃",
        type: "warning"
      }).then(() => {
        store.dispatch("user/logout").then(() => {
          location.reload();
        });
      });
      return;
    }
    Message({
      message: message || "Error",
      type: "error",
      dangerouslyUseHTMLString: true,
      duration: 5 * 1000
    });
    return Promise.reject(new Error(res || "ERROR"));
  } else {
    return res;
  }
};

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;

    return res;
  },
  error => {
    console.error(error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default request;
