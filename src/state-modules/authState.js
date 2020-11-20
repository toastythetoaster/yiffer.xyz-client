import authApi from '../api/authApi';

const avoidReloadLoginPages = [
  '/advertising', 'suggestcomic', 'feedback', 'join-us'
]

export default {
  state: {
    userData: undefined,
    isAuthenticated: false,
  },

  actions: {
    async login (context, {username, password}) {
      return new Promise( async resolve => {
        let response = await authApi.login(username, password)
        if (response.success) {
          context.dispatch('setUserData', response.result)
          resolve({success: true})
          if (!avoidReloadLoginPages.includes(location.pathname)) {
            // todo terrible - do a smooth fetch of user ratings instead
            setTimeout(() => location.reload(), 200)
          }
        }
        else {
          resolve({success: false, message: response.message})
        }
      })
    },

    async signup (context, {email, username, password, password2}) {
      if (password != password2) {
        return {success: false, message: 'Passwords do not match'}
      }

      return new Promise( async resolve => {
        let response = await authApi.signup(username, email, password)
        if (response.success) {
          context.dispatch('setUserData', response.result)
          resolve({success: true})
        }
        else {
          resolve({success: false, message: response.message})
        }
      })
    },

    async changePassword (context, {oldPassword, newPassword}) {
      return new Promise( async resolve => {
        let response = await authApi.changePassword(oldPassword, newPassword)
        if (response.success) {
          resolve({success: true})
        }
        else {
          resolve({success: false, message: ''})
        }
      })
    },

    async logout ({dispatch}) {
      dispatch('destroyUserData')
      authApi.logout()
      window.location = '/'
    },

    checkAndSetLoginStatus ({commit, dispatch}) {
      return new Promise( async resolve => {
        if ($cookies.isKey('user-data')) {
          commit('setUserData', $cookies.get('user-data'))
          commit('setIsAuthenticated', true)
          dispatch('refreshUserData')
          resolve(true)
        }
        else {
          commit('setIsAuthenticated', false)
          commit('setUserData', undefined)
          resolve(false)
        }
      })
    },

    async refreshUserData ({commit}) {
      let response = await authApi.refreshAuth()
      if (response === null) {
        commit('setIsAuthenticated', false)
        commit('setUserData', undefined)
      }
      else {
        commit('setUserData', response)
        commit('setIsAuthenticated', true)
      }
    },

    setUserData (context, userData) {
      context.commit('setUserData', userData)
      context.commit('setIsAuthenticated', true)
      $cookies.set('user-data', userData)
    },

    destroyUserData (context) {
      context.commit('setUserData', undefined)
      context.commit('setIsAuthenticated', false)
      $cookies.remove('user-data')
    },
  },

  mutations: {
    setUserData (state, userData) {
      state.userData = userData
    },

    setIsAuthenticated (state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    getIsAuthenticated: () => state => state.isAuthenticated,
    userData: state => state.userData
  }
}