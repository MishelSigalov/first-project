<template>
  <v-container class="d-flex justify-center">
    <v-card width="600" class="pa-6" elevation="8" rounded="lg">
      <v-card-title class="text-h4 text-center mb-6">
        {{ isEditing ? "Edit Product" : "Add Product" }}
      </v-card-title>

      <v-form ref="form" @submit.prevent="saveProduct">
        <!-- Product Name -->
        <v-text-field
          v-model="product.name"
          label="Product Name"
          prepend-inner-icon="mdi-tag"
          variant="outlined"
          class="mb-3"
          :rules="[requiredRule]"
        />

        <!-- Description -->
        <v-textarea
          v-model="product.description"
          label="Description"
          prepend-inner-icon="mdi-text"
          variant="outlined"
          rows="3"
          class="mb-3"
          :rules="[requiredRule]"
        />

        <!-- Price -->
        <v-text-field
          v-model.number="product.price"
          label="Price ($)"
          type="number"
          min="0"
          step="0.01"
          prepend-inner-icon="mdi-currency-usd"
          variant="outlined"
          class="mb-3"
          :rules="[requiredRule, numberRule, positiveNumberRule]"
        />

        <!-- Category -->
        <v-select
          v-model="product.category"
          :items="categories"
          label="Category"
          prepend-inner-icon="mdi-shape"
          variant="outlined"
          class="mb-3"
          :rules="[requiredRule]"
        />

        <!-- Stock -->
        <v-text-field
          v-model.number="product.stockAvailability"
          label="Amount in Stock"
          type="number"
          min="0"
          prepend-inner-icon="mdi-package-variant"
          variant="outlined"
          class="mb-3"
          :rules="[requiredRule, numberRule, positiveNumberRule]"
        />

        <!-- Date -->
        <v-text-field
          v-model="product.dateOfCreation"
          label="Date of Creation"
          type="date"
          prepend-inner-icon="mdi-calendar"
          variant="outlined"
          class="mb-5"
          :rules="[requiredRule, dateRule]"
        />

        <!-- Save -->
        <v-btn type="submit" color="primary" size="large" block>
          <v-icon start>
            {{ isEditing ? "mdi-content-save" : "mdi-plus" }}
          </v-icon>

          {{ isEditing ? "Update Product" : "Add Product" }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import {
  addProduct,
  getProductById,
  updateProduct,
} from "@/db/dbCommunicator.js";

export default {
  name: "AddProductView",

  data() {
    return {
      product: {
        name: "",
        description: "",
        price: null,
        category: "",
        stockAvailability: null,
        dateOfCreation: "",
      },

      categories: [
        "electronics",
        "fitness",
        "clothing",
        "books",
        "gaming",
        "home_and_kitchen",
        "office_supplies",
        "outdoor",
      ],
    };
  },

  computed: {
    isEditing() {
      return !!this.$route.query.id;
    },
  },

  async mounted() {
    if (this.isEditing) {
      const productId = Number(this.$route.query.id);

      const existingProduct = await getProductById(productId);

      if (existingProduct) {
        this.product = existingProduct;
      }
    }
  },

  methods: {
    requiredRule(value) {
      return (
        (value !== null && value !== undefined && value !== "") ||
        "This field is required"
      );
    },

    positiveNumberRule(value) {
      if (value === null || value === "") {
        return true;
      }

      return value >= 0 || "Value cannot be below 0";
    },

    numberRule(value) {
      if (value === null || value === "") {
        return true;
      }

      return !isNaN(value) || "Please enter a number";
    },

    dateRule(value) {
      if (!value) {
        return true;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      return selectedDate <= today || "Date cannot be after today";
    },

    async saveProduct() {
      //checking either its an edit product request or a add product
      if (this.isEditing) {
        const productId = Number(this.$route.query.id);

        await updateProduct(productId, this.product);

        alert("Product updated successfully!");
      } else {
        const productToSave = {
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          category: this.product.category,
          stockAvailability: this.product.stockAvailability,
          dateOfCreation: this.product.dateOfCreation,
        };

        await addProduct(productToSave);

        alert("Product added successfully!");
      }

      this.$router.push({ name: "catalog" });
    },
  },
};
</script>
