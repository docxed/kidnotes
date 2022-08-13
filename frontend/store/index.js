import { ME_QUERY } from "~/graphql/query"

export const state = () => ({
  isAuthenticated: false,
  me: null,
})

export const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  me: (state) => state.me,
}

export const actions = {
  getMe({ commit }) {
    let client = this.app.apolloProvider.defaultClient
    let hasToken = !!this.app.$apolloHelpers.getToken()
    if (hasToken) {
      client
        .query({
          query: ME_QUERY,
        })
        .then(({ data }) => {
          commit("SET_ME", data.me)
          commit("SET_IS_AUTHENTICATED", true)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    commit("CLEAR_STATE")
  },
}

export const mutations = {
  SET_ME(state, me) {
    let data = {
      userId: me._id,
      email: me.email,
      name: me.name,
    }
    state.me = data
  },
  SET_IS_AUTHENTICATED(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },
  CLEAR_STATE(state) {
    state.isAuthenticated = false
    state.me = null
  },
}
