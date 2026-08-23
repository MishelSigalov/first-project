import { createStore } from "vuex";

export default createStore({
  state: {
    username: "",
    isAdmin: false,
  },

  getters: {},

  mutations: {
    setUser(state, user) {
      state.username = user.name;
      state.isAdmin = user.isAdmin;
    },

    logout(state) {
      state.username = "";
      state.isAdmin = false;
    },
  },

  actions: {},

  modules: {},
});
