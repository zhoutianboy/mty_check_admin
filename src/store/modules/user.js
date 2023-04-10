import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { endRoutes, resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  role: null,
  menuList: [],
  actionList: [] // 页面按钮权限
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_MENUS: (state, menuList) => {
    state.menuList = menuList
  },
  SET_ACTIONS: (state, auth) => {
    const { menuList } = state
    const menu = menuList.find(item => item.auth === auth)
    if (menu) {
      const childMenu = menuList.filter(item => item.parentId === menu.id)
      state.actionList = [menu, ...childMenu]
    }
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data, msg } = response
        // commit('SET_TOKEN', data.token)
        // setToken(data.token)
        commit('SET_TOKEN', data)
        setToken(data)

        Message.success(msg)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        // commit('SET_ROLES', roles)
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)

        const { role, menuList, username, avatar } = data
        if (!role) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLE', role)
        commit('SET_MENUS', menuList)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(({ msg }) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ROLE', null)
        commit('SET_MENUS', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        Message.success(msg)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_ROLE', null)
      commit('SET_MENUS', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

    accessRoutes.push(...endRoutes)

    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },

  checkActionList: ({ state, dispatch }, authData) => {
    return new Promise(resolve => {
      const keys = Object.keys(authData)
      const data = keys.reduce((total, item) => {
        total[item] = state.actionList.some(itemVal => {
          const auth = authData[item]
          return Array.isArray(auth) ? auth.includes(itemVal.auth) : itemVal.auth === auth
        })
        return total
      }, {})
      resolve(data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
