<template>
  <div class="cart">
    <v-container v-if="$store.state.userID">
      <h1>Cart {{ cartItems.length }}</h1>

      <div v-if="cartItems.length === 0">
        <p>Your cart is empty.</p>
      </div>

      <div v-else>
        <div v-for="item in cartItems" :key="item[0]" class="cart-item">
          <p>Product ID: {{ item[0] }}</p>
          <p>Amount: {{ item[1] }}</p>
        </div>
      </div>
    </v-container>
    <v-container v-else>
      <h1>You need to be logged in to use cart!</h1>
    </v-container>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "CartView",

  setup() {
    const store = useStore();

    const cartItems = computed(() => store.state.cartItems);

    return {
      cartItems,
    };
  },
};
</script>
