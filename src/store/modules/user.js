import {
  login,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const state = {
  info: null
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password
      }).then(response => {
        const {
          data
        } = response
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  async getInfo({
    commit,
    state
  }) {
    if (state.info) {
      return Promise.resolve(state.info)
    }
    try {
      const response = await getInfo(getToken())
      const {
        data
      } = response
      commit('SET_INFO', data)
      return Promise.resolve(data)
    } catch (e) {
      return Promise.reject(e)
    }
  },

  // user logout
  logout({
    commit,
    state
  }) {
    commit('SET_TOKEN', '')
    commit('SET_USER', null)
    removeToken()
    resetRouter()
    return Promise.resolve()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
