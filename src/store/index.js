import { createStore } from "vuex";

export default createStore({
  state: {
    username: localStorage.getItem("username") || "",
    isAdmin: localStorage.getItem("isAdmin") === "true",
    userID: Number(localStorage.getItem("userID")) || null,
  },

  getters: {},

  mutations: {
    //user functions
    setUser(state, user) {
      state.username = user.name;
      state.isAdmin = user.isAdmin;
      state.userID = user.id;

      localStorage.setItem("username", user.name);
      localStorage.setItem("isAdmin", user.isAdmin);
      localStorage.setItem("userID", user.id);
    },

    logout(state) {
      state.username = "";
      state.isAdmin = false;
      state.userID = null;
      state.cartItems = [];

      localStorage.removeItem("username");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userID");
    },
  },

  actions: {
    async login({ commit, dispatch }, user) {
      commit("setUser", user);

      await dispatch("loadCart", user.id);
    },
  },

  modules: {},
});
