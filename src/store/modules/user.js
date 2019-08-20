import {
  login
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
  token: getToken(),
  data: null
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_DATA: (state, data) => {
    console.log(state)
    state.data = data
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
        commit('SET_TOKEN', data.token)
        commit('SET_DATA', data)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUser({
    state
  }) {
    return Promise.resolve(state.data)
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
