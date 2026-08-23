import { createRouter, createWebHistory } from "vue-router";
import CatalogView from "../views/CatalogView.vue";
import LoginView from "../views/LoginView.vue";
import ManageProductView from "../views/ManageProductView.vue";
import CartView from "../views/CartView.vue";
import OrdersView from "@/views/OrdersView.vue";

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
  {
    path: "/cart",
    name: "cart",
    component: CartView,
  },
  {
    path: "/orders",
    name: "orders",
    component: OrdersView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
