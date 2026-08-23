import { createStore } from "vuex";

export default createStore({
  state: {
    username: localStorage.getItem("username") || "",
    isAdmin: localStorage.getItem("isAdmin") === "true",
  },

  getters: {},

  mutations: {
    setUser(state, user) {
      state.username = user.name;
      state.isAdmin = user.isAdmin;
      localStorage.setItem("username", user.name);
      localStorage.setItem("isAdmin", user.isAdmin);
    },

    logout(state) {
      state.username = "";
      state.isAdmin = false;

      localStorage.removeItem("username");
      localStorage.removeItem("isAdmin");
    },
  },

  actions: {},

  modules: {},
});
