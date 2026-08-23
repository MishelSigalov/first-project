<template>
  <v-container v-if="userID" max-width="1100">
    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold">Your Cart</h1>

        <p class="text-medium-emphasis mt-2">
          {{ cartCount }}
          {{ cartCount === 1 ? "item" : "items" }}
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

    <v-row v-else align="start">
      <v-col cols="12" md="8">
        <v-card
          v-for="item in cartItems"
          :key="item[0]"
          class="mb-4"
          rounded="xl"
          elevation="2"
        >
          <v-card-text class="pa-5">
            <v-row align="center">
              <v-col cols="12" sm="5">
                <div class="d-flex align-center">
                  <v-avatar
                    size="80"
                    rounded="lg"
                    class="mr-4 bg-grey-lighten-3"
                  >
                    <v-img
                      :src="getProduct(item[0])?.image"
                      alt="Product image"
                      cover
                    >
                      <template #error>
                        <v-icon size="36" color="grey"> mdi-image-off </v-icon>
                      </template>
                    </v-img>
                  </v-avatar>

                  <div>
                    <div class="text-h6 font-weight-bold text-primary">
                      {{ getProduct(item[0])?.name || "Loading..." }}
                    </div>

                    <div class="text-body-2 text-medium-emphasis mt-1">
                      ${{ getProduct(item[0])?.price?.toFixed(2) || "0.00" }}
                      each
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="d-flex align-center justify-center">
                  <v-btn
                    icon="mdi-minus"
                    size="small"
                    variant="outlined"
                    @click="decreaseQuantity(item[0])"
                  />

                  <span
                    class="mx-5 text-h6 font-weight-bold"
                    style="min-width: 25px; text-align: center"
                  >
                    {{ item[1] }}
                  </span>

                  <v-btn
                    icon="mdi-plus"
                    size="small"
                    variant="outlined"
                    @click="increaseQuantity(item[0])"
                  />
                </div>
              </v-col>

              <v-col cols="12" sm="3">
                <div class="d-flex align-center justify-end">
                  <div class="text-h6 font-weight-bold mr-3">
                    $
                    {{
                      ((getProduct(item[0])?.price || 0) * item[1]).toFixed(2)
                    }}
                  </div>

                  <v-btn
                    icon="mdi-trash-can-outline"
                    variant="text"
                    color="error"
                    @click="removeItem(item[0])"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card
          rounded="xl"
          elevation="3"
          class="pa-6"
          style="position: sticky; top: 20px"
        >
          <h2 class="text-h5 font-weight-bold mb-6">Order Summary</h2>

          <div class="d-flex justify-space-between mb-3">
            <span class="text-medium-emphasis">Items</span>

            <span>{{ cartCount }}</span>
          </div>

          <div class="d-flex justify-space-between mb-3">
            <span class="text-medium-emphasis">Subtotal</span>

            <span>${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="d-flex justify-space-between mb-4">
            <span class="text-medium-emphasis">Shipping</span>

            <span class="text-success">Free</span>
          </div>

          <v-divider class="mb-4" />

          <div class="d-flex justify-space-between mb-6">
            <span class="text-h6 font-weight-bold">Total</span>

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
  </v-container>

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

  <v-dialog
    v-model="orderDialog"
    max-width="550"
    @keyup.enter="orderDialog = false"
  >
    <v-card rounded="xl" elevation="8">
      <!-- Header -->
      <v-card-title class="pa-6 pb-3">
        <div class="d-flex align-center">
          <v-avatar color="success" size="52" class="mr-4">
            <v-icon color="white" size="30"> mdi-shopping </v-icon>
          </v-avatar>

          <div>
            <div class="text-h5 font-weight-bold">Order Received</div>

            <div class="text-body-2 text-medium-emphasis mt-1">
              Your order has been placed successfully
            </div>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <!-- Message -->
      <v-card-text class="pa-6">
        <v-card variant="tonal" color="success" rounded="lg" class="pa-4">
          <div class="d-flex align-center">
            <v-icon color="success" size="28" class="mr-3">
              mdi-truck-check
            </v-icon>

            <div>
              <div class="font-weight-bold">Thank you for your purchase!</div>

              <div class="text-body-2 mt-1">
                Your order has been successfully processed.
              </div>
            </div>
          </div>
        </v-card>
      </v-card-text>

      <v-divider />

      <!-- Actions -->
      <v-card-actions class="pa-5">
        <v-spacer></v-spacer>

        <v-btn variant="text" @click="orderDialog = false"> Close </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-receipt"
          @click="orderRedirect"
        >
          Go to Orders
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  getProductById,
  getCart,
  addProductToCart,
  removeProductFromCart,
  decreaseQuantity as decreaseQuantityDB,
  clearCart as clearCartDB,
  addOrder,
} from "@/db/dbCommunicator.js";

export default {
  name: "CartView",

  data() {
    return {
      cart: null,
      products: {},
      orderDialog: false,
    };
  },

  computed: {
    userID() {
      return this.$store.state.userID;
    },

    cartItems() {
      return (this.cart?.products || []).filter(
        (item) => Array.isArray(item) && item.length >= 2
      );
    },

    cartCount() {
      return this.cartItems.reduce((total, item) => total + item[1], 0);
    },

    subtotal() {
      return this.cartItems.reduce((total, item) => {
        const product = this.products[item[0]];

        if (!product) {
          return total;
        }

        return total + product.price * item[1];
      }, 0);
    },
  },

  async mounted() {
    if (this.userID) {
      await this.loadCart();
    }
  },

  methods: {
    orderRedirect() {
      this.orderDialog = false;
      this.$router.push({ name: "orders" });
    },

    async loadCart() {
      this.cart = await getCart(this.userID);

      this.products = {};

      if (!this.cart) {
        return;
      }

      await this.loadProducts();
    },

    async loadProducts() {
      for (const item of this.cartItems) {
        const productId = item[0];

        if (productId === undefined || productId === null) {
          continue;
        }

        const product = await getProductById(productId);

        if (product) {
          this.products[productId] = product;
        }
      }
    },

    getProduct(productId) {
      return this.products[productId];
    },

    async removeItem(productId) {
      await removeProductFromCart(productId, this.userID);
      await this.loadCart();
    },

    async increaseQuantity(productId) {
      await addProductToCart(productId, this.userID);
      await this.loadCart();
    },

    async decreaseQuantity(productId) {
      await decreaseQuantityDB(productId, this.userID);
      await this.loadCart();
    },

    async clearCart() {
      await clearCartDB(this.userID);

      this.cart = null;
      this.products = {};
    },

    async checkout() {
      if (!this.cart) {
        return;
      }

      try {
        await addOrder(this.cart.id, this.userID, this.subtotal);

        this.orderDialog = true;

        this.cart = null;
        this.products = {};
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    },
  },
};
</script>
