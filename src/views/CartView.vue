<template>
  <v-container v-if="userID" max-width="1000">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold">Your Cart</h1>
        <p class="text-medium-emphasis mt-2">
          {{ cartCount }} {{ cartCount === 1 ? "item" : "items" }}
        </p>
      </div>

      <v-btn
        v-if="cartItems.length"
        variant="text"
        color="error"
        prepend-icon="mdi-delete-outline"
        @click="clearCart"
      >
        Clear Cart
      </v-btn>
    </div>

    <!-- Empty cart -->
    <v-card
      v-if="cartItems.length === 0"
      class="pa-12 text-center"
      rounded="xl"
      elevation="2"
    >
      <v-icon icon="mdi-cart-outline" size="100" color="grey" />

      <h2 class="text-h5 font-weight-bold mt-6">Your cart is empty</h2>

      <p class="text-medium-emphasis mt-2 mb-6">
        Looks like you haven't added anything yet.
      </p>

      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        prepend-icon="mdi-store-outline"
        :to="{ name: 'catalog' }"
      >
        Continue Shopping
      </v-btn>
    </v-card>

    <!-- Cart -->
    <div v-else>
      <v-row>
        <!-- Products -->
        <v-col cols="12" md="8">
          <v-card
            v-for="item in cartItems"
            :key="item[0]"
            class="mb-4"
            rounded="xl"
            elevation="2"
          >
            <v-card-text class="pa-5">
              <div class="d-flex align-center">
                <!-- Product image 
                <v-avatar size="100" rounded="lg" class="mr-5">
                  <v-img :src="getProduct(item[0])?.image" cover>
                    <template #error>
                      <v-icon size="40"> mdi-image-outline </v-icon>
                    </template>
                  </v-img>
                </v-avatar>-->

                <!-- Product information -->
                <div class="flex-grow-1">
                  <h2 class="text-h6 font-weight-bold">
                    {{ getProduct(item[0])?.name || "Loading..." }}
                  </h2>

                  <p class="text-body-2 text-medium-emphasis mt-1">
                    ${{ getProduct(item[0])?.price }}
                  </p>

                  <!-- Quantity -->
                  <div class="d-flex align-center mt-4">
                    <v-btn
                      icon="mdi-minus"
                      size="small"
                      variant="outlined"
                      @click="decreaseQuantity(item[0])"
                    />

                    <span class="mx-4 font-weight-bold">
                      {{ item[1] }}
                    </span>

                    <v-btn
                      icon="mdi-plus"
                      size="small"
                      variant="outlined"
                      @click="increaseQuantity(item[0])"
                    />
                  </div>
                </div>

                <!-- Price + delete -->
                <div class="text-right">
                  <div class="text-h6 font-weight-bold">
                    ${{ (getProduct(item[0])?.price * item[1]).toFixed(2) }}
                  </div>

                  <v-btn
                    icon="mdi-trash-can-outline"
                    variant="text"
                    color="error"
                    class="mt-3"
                    @click="removeItem(item[0])"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Summary -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="3" class="pa-6">
            <h2 class="text-h5 font-weight-bold mb-6">Order Summary</h2>

            <div class="d-flex justify-space-between mb-3">
              <span class="text-medium-emphasis"> Subtotal </span>

              <span> ${{ subtotal.toFixed(2) }} </span>
            </div>

            <div class="d-flex justify-space-between mb-4">
              <span class="text-medium-emphasis"> Shipping </span>

              <span class="text-success"> Free </span>
            </div>

            <v-divider class="mb-4" />

            <div class="d-flex justify-space-between mb-6">
              <span class="text-h6 font-weight-bold"> Total </span>

              <span class="text-h6 font-weight-bold">
                ${{ subtotal.toFixed(2) }}
              </span>
            </div>

            <v-btn
              block
              color="primary"
              size="large"
              rounded="lg"
              prepend-icon="mdi-credit-card-outline"
              @click="checkout"
            >
              Checkout
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>

  <!-- Not logged in -->
  <v-container v-else class="fill-height d-flex align-center justify-center">
    <v-card
      class="pa-10 text-center"
      max-width="500"
      rounded="xl"
      elevation="3"
    >
      <v-icon icon="mdi-lock-outline" size="80" color="primary" />

      <h1 class="text-h5 font-weight-bold mt-5">Login Required</h1>

      <p class="text-medium-emphasis mt-2 mb-6">
        You need to be logged in to use your shopping cart.
      </p>

      <v-btn color="primary" size="large" rounded="lg" :to="{ name: 'login' }">
        Log In
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { getProductById, getCart, addOrder } from "@/db/dbCommunicator.js";

export default {
  name: "CartView",

  data() {
    return {
      products: {},
    };
  },

  computed: {
    userID() {
      return this.$store.state.userID;
    },

    cartItems() {
      return this.$store.state.cartItems;
    },

    cartCount() {
      return this.cartItems.reduce((total, item) => total + item[1], 0);
    },

    subtotal() {
      return this.cartItems.reduce((total, item) => {
        const product = this.products[item[0]];

        if (!product) return total;

        return total + product.price * item[1];
      }, 0);
    },
  },

  async mounted() {
    await this.loadProducts();
  },

  methods: {
    async loadProducts() {
      for (const item of this.cartItems) {
        const productId = item[0];

        if (!this.products[productId]) {
          const product = await getProductById(productId);

          if (product) {
            this.products[productId] = product;
          }
        }
      }
    },

    getProduct(productId) {
      return this.products[productId];
    },

    async removeItem(productId) {
      await this.$store.dispatch("removeFromCart", {
        productId,
        clientId: this.userID,
      });

      delete this.products[productId];
    },

    async increaseQuantity(productId) {
      await this.$store.dispatch("addToCart", {
        productId,
        clientId: this.userID,
      });
    },

    async decreaseQuantity(productId) {
      const item = this.cartItems.find((item) => item[0] === productId);

      if (!item) return;

      if (item[1] === 1) {
        await this.removeItem(productId);
        return;
      }

      await this.$store.dispatch("decreaseQuantity", {
        productId,
        clientId: this.userID,
      });
    },

    async clearCart() {
      await this.$store.dispatch("clearCart", this.userID);

      this.products = {};
    },

    async checkout() {
      const cart = await getCart(this.userID);

      if (!cart) {
        console.error("Cart not found");
        return;
      }

      await addOrder(cart.id, this.userID, this.subtotal);
      this.clearCart();
    },
  },
};
</script>
