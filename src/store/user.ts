// initial state
import { StoreOptions } from "vuex";
import accessEnum from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
    },
    token: localStorage.getItem("Authorization") || "",
  }),
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // 从 state 中获取 token
      const token = state.token || localStorage.getItem("token");

      // 从远程请求获取登录信息
      const res = await UserControllerService.getLoginUserUsingGet(token);
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: accessEnum.NOT_LOGIN,
        });
      }
    },
  },
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
