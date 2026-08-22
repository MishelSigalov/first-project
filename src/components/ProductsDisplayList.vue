<!-- eslint-disable no-unused-vars -->
<template>
  <v-data-table-virtual
    :headers="headers"
    :items="products"
    height="500"
    item-value="name"
    fixed-header
  ></v-data-table-virtual>
</template>

<script>
import { getAllProducts } from "@/db/dbCommunicator.js";

export default {
  name: "ProductsDisplayList",

  data() {
    return {
      headers: [
        { title: "Product", align: "start", key: "name" },
        { title: "Category", align: "end", key: "category" },
        { title: "Stock", align: "end", key: "stockAvailability" },
        { title: "Price($)", align: "end", key: "price" },
        { title: "Date Added", align: "end", key: "dateOfCreation" },
      ],
      products: [],
    };
  },

  async mounted() {
    this.products = await getAllProducts();
  },
};
</script>
