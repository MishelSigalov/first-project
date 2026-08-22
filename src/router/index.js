import { createRouter, createWebHistory } from "vue-router";
import CatalogView from "../views/CatalogView.vue";
import LoginView from "../views/LoginView.vue";
import ManageProductView from "../views/ManageProductView.vue";

const routes = [
  {
    path: "/",
    name: "catalog",
    component: CatalogView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/ManageProduct",
    name: "manage",
    component: ManageProductView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
