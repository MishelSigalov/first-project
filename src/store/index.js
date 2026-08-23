import { createStore } from "vuex";
import {
  addProductToCart,
  removeProductFromCart,
  clearCart,
  getCart,
  decreaseQuantity,
} from "@/db/dbCommunicator.js";

export default createStore({
  state: {
    username: localStorage.getItem("username") || "",
    isAdmin: localStorage.getItem("isAdmin") === "true",
    userID: Number(localStorage.getItem("userID")) || null,
    cartItems: [],
  },

  getters: {
    //card total items, not length
    cartCount(state) {
      return state.cartItems.reduce((total, item) => total + item[1], 0);
    },
  },

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

    //cart functions
    setCart(state, cart) {
      state.cartItems = cart ? cart.products : [];
    },
  },

  actions: {
    async login({ commit, dispatch }, user) {
      commit("setUser", user);

      await dispatch("loadCart", user.id);
    },

    async addToCart({ commit }, { productId, clientId }) {
      const cart = await addProductToCart(productId, clientId);

      commit("setCart", cart);
    },

    async decreaseQuantity({ commit }, { productId, clientId }) {
      const cart = await decreaseQuantity(productId, clientId);
      commit("setCart", cart);
    },

    async removeFromCart({ commit }, { productId, clientId }) {
      const cart = await removeProductFromCart(productId, clientId);

      commit("setCart", cart);
    },

    async clearCart({ commit }, clientId) {
      await clearCart(clientId);

      commit("setCart", null);
    },

    async loadCart({ commit }, clientId) {
      const cart = await getCart(clientId);

      commit("setCart", cart);
    },
  },

  modules: {},
});
