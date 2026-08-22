<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="pa-2" color="transparent" rounded="md" elevation="1">
          <v-btn-group
            width="auto"
            variant="outlined"
            density="comfortable"
            class="d-inline-flex"
          >
            <v-btn
              icon="mdi-format-list-bulleted"
              color="primary"
              size="default"
              @click="handleList"
            />

            <v-btn
              icon="mdi-view-grid"
              color="error"
              size="default"
              @click="handleGrid"
            />
          </v-btn-group>
        </v-card>
      </v-col>
    </v-row>
    <vrow>
      <v-card class="pa-4 mb-4" elevation="1" rounded="md">
        <v-row>
          <!-- Search Input -->
          <v-col cols="11">
            <v-text-field
              v-model="searchQuery"
              label="Search Products"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="1">
            <v-btn color="primary" size="default" @click="handleList"
              >Search
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <!-- Category Select -->
          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="selectedCategory"
              :items="categories"
              label="Category"
              density="compact"
              variant="outlined"
              clearable
              hide-details
            />
          </v-col>
          <v-col>
            <v-btn color="primary" size="default" @click="handleList"
              >Search
            </v-btn>
          </v-col>

          <!-- Date Filter (Single or Range) -->
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model="startDate"
              label="Added After Date"
              type="date"
              density="compact"
              variant="outlined"
              clearable
              hide-details
            />
          </v-col>
          <v-col>
            <v-btn color="primary" size="default" @click="handleList"
              >Search
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </vrow>

    <!--List View-->
    <v-container v-if="currentView == 0">
      <v-data-table-virtual
        :headers="headers"
        :items="products"
        height="500"
        item-value="name"
        fixed-header
      ></v-data-table-virtual>
    </v-container>

    <!--Grid View-->
    <v-container v-if="currentView == 1">
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
            <v-card-subtitle>Category: {{ product.category }}</v-card-subtitle>
            <v-card-subtitle>{{ product.description }}</v-card-subtitle>
            <v-card-text>
              <p class="text-h6">${{ product.price }}</p>
              <p>Stock: {{ product.stockAvailability }}</p>
              <p>Date Added: {{ product.dateOfCreation }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

// Components
import { getAllProducts } from "@/db/dbCommunicator.js";
import { getProductsByName } from "@/db/dbCommunicator.js";

export default defineComponent({
  name: "HomeView",

  data() {
    return {
      headers: [
        { title: "Product", align: "start", key: "name" },
        { title: "Category", align: "end", key: "category" },
        { title: "Stock", align: "end", key: "stockAvailability" },
        { title: "Price($)", align: "end", key: "price" },
        { title: "Date Added", align: "end", key: "dateOfCreation" },
      ],
      currentView: 0, // 'list' | 'grid'
      products: [],
    };
  },
  async mounted() {
    this.products = await getAllProducts();
  },

  methods: {
    // --- UI Methods ---
    handleList() {
      this.currentView = 0;
      console.log(this.currentView);
    },

    handleGrid() {
      this.currentView = 1;
      console.log(this.currentView);
    },

    async searchProducts(name) {
      this.products = await getProductsByName(name);
    },
  },
});
</script>
