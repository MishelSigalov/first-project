<template>
  <v-container max-width="1000" class="py-8">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold">My Orders</h1>

      <p class="text-body-1 text-medium-emphasis mt-2">
        View your previous purchases and order details.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="50" />
    </div>

    <!-- No orders -->
    <v-card
      v-else-if="orders.length === 0"
      class="pa-12 text-center"
      rounded="xl"
      elevation="2"
    >
      <v-icon icon="mdi-package-variant-closed" size="100" color="grey" />

      <h2 class="text-h5 font-weight-bold mt-6">No Orders Yet</h2>

      <p class="text-body-1 text-medium-emphasis mt-2 mb-6">
        You haven't made any purchases yet.
      </p>

      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        prepend-icon="mdi-store-outline"
        :to="{ name: 'catalog' }"
      >
        Start Shopping
      </v-btn>
    </v-card>

    <!-- Orders -->
    <div v-else>
      <v-card
        v-for="order in orders"
        :key="order.id"
        class="mb-6"
        rounded="xl"
        elevation="3"
      >
        <!-- Order header -->
        <v-card-item class="pa-6">
          <template #prepend>
            <v-avatar color="grey-darken-3" size="50">
              <v-icon color="white"> mdi-receipt </v-icon>
            </v-avatar>
          </template>

          <v-card-title class="text-h6 font-weight-bold">
            Order #{{ order.id }}
          </v-card-title>

          <v-card-subtitle class="mt-1">
            {{ formatDate(order.dateOfPurchase) }}
          </v-card-subtitle>

          <v-spacer />

          <template #append>
            <v-btn
              icon="mdi-trash-can-outline"
              variant="text"
              color="error"
              size="large"
              @click="removeOrder(order.id)"
            />
          </template>
        </v-card-item>

        <v-divider />

        <!-- Products -->
        <v-card-text class="pa-6">
          <div class="text-subtitle-1 font-weight-bold mb-4">Items</div>

          <div
            v-for="product in (order.products || []).filter((p) => p)"
            :key="product.productId"
            class="order-item"
          >
            <!-- Image -->
            <v-avatar size="80" rounded="lg" class="mr-4 bg-grey-lighten-3">
              <v-img
                v-if="product.image"
                :src="product.image"
                alt="Product image"
                cover
              >
                <template #error>
                  <v-icon size="36" color="grey"> mdi-image-off </v-icon>
                </template>
              </v-img>

              <v-icon v-else size="36" color="grey"> mdi-image-off </v-icon>
            </v-avatar>

            <!-- Product info -->
            <div class="flex-grow-1">
              <div class="font-weight-bold">
                {{ product.name }}
              </div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                ${{ Number(product.price).toFixed(2) }}
                ×
                {{ product.amount }}
              </div>
            </div>

            <!-- Item total -->
            <div class="text-right">
              <div class="font-weight-bold">
                ${{ itemTotal(product).toFixed(2) }}
              </div>

              <div class="text-caption text-medium-emphasis">
                {{ product.amount }}
                {{ product.amount === 1 ? "item" : "items" }}
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Order footer -->
        <v-card-text class="pa-6">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-body-2 text-medium-emphasis">Order total</div>

              <div class="text-h5 font-weight-bold mt-1">
                ${{ Number(order.totalPrice).toFixed(2) }}
              </div>
            </div>

            <v-chip
              color="success"
              variant="tonal"
              prepend-icon="mdi-check-circle"
            >
              Purchased
            </v-chip>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
  <!--custom "are you sure?" dialog-->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5"> Delete Order? </v-card-title>

      <v-card-text>
        Are you sure you want to delete
        <strong class="text-red-darken-2">{{ "order " + orderToDelete }}</strong
        >? <br />This action cannot be undone.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn variant="text" @click="deleteDialog = false"> Cancel </v-btn>

        <v-btn color="red" variant="text" @click="confirmDelete">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getOrders, deleteOrder } from "@/db/dbCommunicator.js";

export default {
  name: "OrdersView",

  data() {
    return {
      orders: [],
      loading: true,
      deleteDialog: false,
      orderToDelete: null,
    };
  },

  computed: {
    userID() {
      return this.$store.state.userID;
    },
  },

  async mounted() {
    if (!this.userID) {
      this.loading = false;
      return;
    }

    await this.loadOrders();
  },

  methods: {
    async loadOrders() {
      try {
        this.loading = true;

        this.orders = await getOrders(this.userID);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },

    itemTotal(product) {
      return Number(product.price) * Number(product.amount);
    },

    async removeOrder(orderId) {
      this.orderToDelete = orderId;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      await deleteOrder(this.orderToDelete);
      this.deleteDialog = false;
      this.orders = await getOrders(this.userID);
    },
  },
};
</script>

<style scoped>
.order-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.order-item + .order-item {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
