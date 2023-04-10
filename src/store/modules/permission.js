import { asyncRoutes, constantRoutes } from '@/router'

// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }
/**
 * Use meta.role to determine if the current user has permission
 * @param menuList
 * @param route
 */
function hasPermission(menuList, route) {
  // if (route.meta && route.meta.roles) {
  //   return true
  // }

  if (route.meta && route.meta.auth) {
    return menuList.some(menu => {
      const metaAuth = route.meta.auth
      return Array.isArray(metaAuth) ? metaAuth.includes(menu.auth) : metaAuth === menu.auth
    })
  } else {
    return false
  }
}

// /**
//  * Filter asynchronous routing tables by recursion
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(routes, roles) {
//   const res = []
//
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRoutes(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param menuList
 */
export function filterAsyncRoutes(routes, menuList) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menuList, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, menuList)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // }
  generateRoutes({ commit }, menuList) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, menuList)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
