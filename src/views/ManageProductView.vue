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
          name="product name"
          prepend-inner-icon="mdi-tag"
          variant="outlined"
          class="mb-3"
          :rules="[requiredRule, nameRule]"
        />

        <!-- Description -->
        <v-textarea
          v-model="product.description"
          label="Description"
          name="product description"
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
          name="price"
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
          name="category"
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
          name="stock"
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
          name="date"
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

    <!--Custom dialogs-->
    <!--save dialog-->
    <v-dialog v-model="saveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h2">
          {{ isEditing ? " Edit Successful !" : " Add Successful !" }}
        </v-card-title>

        <v-card-text class="text-h5">
          <strong class="text-primary">{{ product.name }}</strong>
          {{ isEditing ? " updated" : " added" }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" variant="text" @click="closeSaveDialog">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--error dialog-->
    <v-dialog v-model="errorDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h2 text-red font-weight-bold">
          {{ isEditing ? " Edit Failed" : " Adding Failed" }}
        </v-card-title>

        <v-card-text>
          <div v-for="error in submitErrors" :key="error.id" class="mb-2">
            <strong class="error-id">{{ error.id }}:</strong>
            {{ error.errorMessages[0] }}
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" variant="text" @click="errorDialog = false">
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  addProduct,
  getProductById,
  updateProduct,
  doesProductExist,
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

      saveDialog: false,
      errorDialog: false,
      submitErrors: null,
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
    openSaveDialog() {
      this.saveDialog = true;
    },

    //rules
    async nameRule(value) {
      if (!value) return true;

      const existingProduct = await doesProductExist(value);

      // No product with this name exists
      if (!existingProduct) {
        return true;
      }

      // If editing, check if the existing product is the same product
      if (
        this.isEditing &&
        existingProduct.id === Number(this.$route.query.id)
      ) {
        return true;
      }

      return "A product with this name already exists";
    },

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
      const { valid, errors } = await this.$refs.form.validate();

      if (!valid) {
        this.submitErrors = errors;
        this.errorDialog = true;
        return;
      }

      // Only reaches here if ALL rules passed
      //checking either its an edit product request or a add product
      if (this.isEditing) {
        const productId = Number(this.$route.query.id);

        await updateProduct(productId, this.product);

        this.saveDialog = true;
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

        this.saveDialog = true;
      }
    },

    closeSaveDialog() {
      this.saveDialog = false;
      this.$router.push({ name: "catalog" });
    },
  },
};
</script>

<style>
.error-id {
  font-size: 18px !important;
  font-weight: 700;
}
</style>
