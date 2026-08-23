<template>
  <v-container v-if="userID" max-width="1100">
    <!-- Header -->
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

    <!-- Empty Cart -->
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
    <v-row v-else align="start">
      <!-- PRODUCTS -->
      <v-col cols="12" md="8">
        <!-- Product Card -->
        <v-card
          v-for="item in cartItems"
          :key="item[0]"
          class="mb-4"
          rounded="xl"
          elevation="2"
        >
          <v-card-text class="pa-5">
            <v-row align="center">
              <!-- Product Information -->
              <v-col cols="12" sm="5">
                <div>
                  <div class="text-h6 font-weight-bold text-primary">
                    {{ getProduct(item[0])?.name || "Loading..." }}
                  </div>

                  <div class="text-body-2 text-medium-emphasis mt-1">
                    $
                    {{ getProduct(item[0])?.price?.toFixed(2) || "0.00" }}
                    each
                  </div>
                </div>
              </v-col>

              <!-- Quantity -->
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

              <!-- Price + Delete -->
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

      <!-- ORDER SUMMARY -->
      <v-col cols="12" md="4">
        <v-card
          rounded="xl"
          elevation="3"
          class="pa-6"
          style="position: sticky; top: 20px"
        >
          <h2 class="text-h5 font-weight-bold mb-6">Order Summary</h2>

          <!-- Items -->
          <div class="d-flex justify-space-between mb-3">
            <span class="text-medium-emphasis"> Items </span>

            <span>
              {{ cartCount }}
            </span>
          </div>

          <!-- Subtotal -->
          <div class="d-flex justify-space-between mb-3">
            <span class="text-medium-emphasis"> Subtotal </span>

            <span> ${{ subtotal.toFixed(2) }} </span>
          </div>

          <!-- Shipping -->
          <div class="d-flex justify-space-between mb-4">
            <span class="text-medium-emphasis"> Shipping </span>

            <span class="text-success"> Free </span>
          </div>

          <v-divider class="mb-4" />

          <!-- Total -->
          <div class="d-flex justify-space-between mb-6">
            <span class="text-h6 font-weight-bold"> Total </span>

            <span class="text-h6 font-weight-bold">
              ${{ subtotal.toFixed(2) }}
            </span>
          </div>

          <!-- Checkout -->
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

  <!-- NOT LOGGED IN -->
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
    <!--order complete-->
  </v-container>
  <v-dialog
    v-model="orderDialog"
    max-width="700"
    @keyup.enter="orderDialog = false"
  >
    <v-card>
      <v-card-title class="text-h2 font-weight-bold">
        <strong class="text-error"> Order Received </strong>
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" variant="text" @click="orderRedirect">
          Go to order
        </v-btn>
        <v-btn color="primary" variant="text" @click="orderDialog = false">
          Close
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
      // The user's cart from IndexedDB
      cart: null,

      // Products indexed by their ID
      products: {},
      orderDialog: false,
    };
  },

  computed: {
    // Logged-in user ID
    userID() {
      return this.$store.state.userID;
    },

    // Products inside the cart
    cartItems() {
      return this.cart?.products || [];
    },

    // Total amount of products
    cartCount() {
      return this.cartItems.reduce((total, item) => total + item[1], 0);
    },

    // Total price
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
      this.$router.push({ name: "orders" });
    },
    // Load the cart directly from IndexedDB
    async loadCart() {
      this.cart = await getCart(this.userID);

      this.products = {};

      if (!this.cart) {
        return;
      }

      await this.loadProducts();
    },

    // Load product information for every product in the cart
    async loadProducts() {
      for (const item of this.cartItems) {
        const productId = item[0];

        const product = await getProductById(productId);

        if (product) {
          this.products[productId] = product;
        }
      }
    },

    // Get product by ID
    getProduct(productId) {
      return this.products[productId];
    },

    // Remove an entire product
    async removeItem(productId) {
      await removeProductFromCart(productId, this.userID);

      await this.loadCart();
    },

    // Increase quantity
    async increaseQuantity(productId) {
      await addProductToCart(productId, this.userID);

      await this.loadCart();
    },

    // Decrease quantity
    async decreaseQuantity(productId) {
      await decreaseQuantityDB(productId, this.userID);

      await this.loadCart();
    },

    // Delete entire cart
    async clearCart() {
      await clearCartDB(this.userID);

      this.cart = null;
      this.products = {};
    },

    // Checkout
    async checkout() {
      if (!this.cart) {
        return;
      }

      try {
        this.orderDialog = true;
        await addOrder(this.cart.id, this.userID, this.subtotal);
        // Cart is deleted by addOrder()
        this.cart = null;
        this.products = {};
      } catch (error) {
        console.error("Checkout failed:", error);
      }
    },
  },
};
</script>
