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

        <!-- Image -->
        <div class="mb-5">
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <div class="d-flex align-center">
              <v-avatar size="80" rounded="lg" class="mr-4 bg-grey-lighten-3">
                <v-img v-if="imagePreview" :src="imagePreview" contain />

                <v-icon v-else size="40" color="grey">
                  mdi-image-outline
                </v-icon>
              </v-avatar>

              <div class="flex-grow-1">
                <div class="text-subtitle-1 font-weight-bold">
                  Product Image
                </div>

                <div
                  v-if="product.image"
                  class="text-body-2 text-medium-emphasis mb-2"
                >
                  {{ product.image }}
                </div>

                <div v-else class="text-body-2 text-medium-emphasis mb-2">
                  No image selected
                </div>

                <v-btn
                  color="primary"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-upload"
                  @click="$refs.imageInput.click()"
                >
                  Choose Image
                </v-btn>

                <input
                  ref="imageInput"
                  type="file"
                  accept="image/png"
                  hidden
                  @change="handleImageUpload"
                />
              </div>
            </div>
          </v-card>
        </div>

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
    <!-- Save dialog -->
    <v-dialog
      v-model="saveDialog"
      max-width="500"
      @keyup.enter="saveDialog = false"
      @keydown.tab="saveDialog = false"
    >
      <v-card rounded="xl" elevation="8">
        <!-- Header -->
        <v-card-title class="pa-6 pb-3">
          <div class="d-flex align-center">
            <v-avatar color="success" size="48" class="mr-4">
              <v-icon color="white" size="26"> mdi-check </v-icon>
            </v-avatar>

            <div>
              <div class="text-h5 font-weight-bold">
                {{ isEditing ? "Edit Successful!" : "Add Successful!" }}
              </div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                {{
                  isEditing
                    ? "Product updated successfully"
                    : "Product added successfully"
                }}
              </div>
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <!-- Product -->
        <v-card-text class="pa-6">
          <v-card variant="tonal" color="success" rounded="lg" class="pa-4">
            <div class="text-body-1">
              <strong class="text-success">
                {{ product.name }}
              </strong>

              {{ isEditing ? "has been updated." : "has been added." }}
            </div>
          </v-card>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            @click="closeSaveDialog"
          >
            Okay
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--error dialog-->
    <!-- Error dialog -->
    <v-dialog v-model="errorDialog" max-width="600">
      <v-card rounded="xl" elevation="8">
        <!-- Header -->
        <v-card-title class="pa-6 pb-3">
          <div class="d-flex align-center">
            <v-avatar color="error" size="48" class="mr-4">
              <v-icon color="white" size="26"> mdi-alert </v-icon>
            </v-avatar>

            <div>
              <div class="text-h5 font-weight-bold">
                {{ isEditing ? "Edit Failed" : "Adding Failed" }}
              </div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                Please fix the following errors
              </div>
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <!-- Errors -->
        <v-card-text class="pa-6">
          <v-card variant="tonal" color="error" rounded="lg" class="pa-4">
            <div v-for="error in submitErrors" :key="error.id" class="mb-3">
              <strong class="error-id text-error"> {{ error.id }}: </strong>

              {{ error.errorMessages[0] }}
            </div>
          </v-card>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="pa-5">
          <v-spacer></v-spacer>

          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            @keyup.enter="errorDialog = false"
            @click="errorDialog = false"
          >
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
        image: null,
        imagePreview: null,
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

    closeSaveDialog() {
      this.saveDialog = false;
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
          image: this.product.image,
        };
        await addProduct(productToSave);

        this.saveDialog = true;
      }
    },

    previewImage(file) {
      if (!file) {
        this.imagePreview = null;
        return;
      }

      this.imagePreview = URL.createObjectURL(file);
    },

    handleImageUpload(event) {
      const file = event.target.files[0];

      if (!file) return;

      this.image = file;
      this.imagePreview = URL.createObjectURL(file);

      this.product.image = `/pictures/${file.name}`;
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
