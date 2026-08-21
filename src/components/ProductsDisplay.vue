<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="pa-4" variant="outlined">
          <v-card-title>{{ product.name }}</v-card-title>
          <v-card-subtitle>ID: {{ product.id }}</v-card-subtitle>
          <v-card-subtitle>Category: {{ product.category }}</v-card-subtitle>
          <v-card-text>
            <p class="text-h6">${{ product.price }}</p>
            <p>Stock: {{ product.stockAvailability }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getAllProducts } from "@/db/dbCommunicator.js";

export default {
  name: "ProductsDisplay",
  data: () => ({
    products: [],
  }),
  async mounted() {
    this.products = await getAllProducts();
  },
};
</script>
