import store from '@/store'
const TokenKey = 'TokenKey'

export default {
  // token
  getToken() {
    try {
      return sessionStorage.getItem(TokenKey)
    } catch (error) {
      return false;
    }
  },
  setToken(token) {
    try {
      return sessionStorage.setItem(TokenKey, token)
    } catch (error) {
      return false;
    }
  },
  removeToken() {
    try {
      return sessionStorage.removeItem(TokenKey)
    } catch (error) {
      return false;
    }
  },
  // 用户信息
  setUserInfo(info) {
    try {
      store.commit('setUserInfo', info)
      return sessionStorage.setItem('userInfo', info)
    } catch (error) {
      return false;
    }
  },
  getUserInfo() {
    try {
      return sessionStorage.getItem('userInfo')
    } catch (error) {
      return false;
    }
  },
}