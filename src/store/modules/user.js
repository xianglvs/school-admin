import { login, createOrFlushToken, getInfo } from "@/api/user";
import { getToken, setToken, removeToken, setTicket } from "@/utils/auth";
import { resetRouter } from "@/router";
import Vue from "vue";

const state = {
  info: null
};

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info;
    Vue.set(state, "info", info);
  }
};

const actions = {
  // user login
  async login({ commit }, userInfo) {
    try {
      const { username, password } = userInfo;
      const res = await login({
        username: username.trim(),
        password: password
      });
      setTicket(res.data.ticket);
      const { data } = await actions.createOrFlushToken({ commit }, { ticket: res.data.ticket });
      return data;
    } catch (e) {
      console.error(e);
    }
  },

  async createOrFlushToken({ commit }, params) {
    const { data } = await createOrFlushToken({ ticket: params.ticket });
    setToken(data.token);
    return data;
  },

  // get user info
  async getInfo({ commit, state }) {
    if (state.info) {
      return Promise.resolve(state.info);
    }
    try {
      const response = await getInfo(getToken());
      const { data } = response;
      commit("SET_INFO", data);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  // user logout
  logout({ commit, state }) {
    commit("SET_INFO", null);
    removeToken();
    resetRouter();
    return Promise.resolve();
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
