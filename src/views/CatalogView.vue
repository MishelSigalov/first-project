<template>
  <v-container max-width="1300">
    <!-- ====================================================== -->
    <!-- HEADER / LIST-GRID SWITCH -->
    <!-- ====================================================== -->

    <v-row align="center" class="mb-6">
      <v-col>
        <div>
          <h1 class="text-h3 font-weight-bold">Product Catalog</h1>

          <p class="text-body-1 text-medium-emphasis mt-2">
            Browse, search and manage your products
          </p>
        </div>
      </v-col>

      <v-col cols="auto">
        <v-card class="pa-1" rounded="lg" elevation="2">
          <v-btn-group variant="text" density="comfortable">
            <v-btn
              icon="mdi-format-list-bulleted"
              :color="currentView === 0 ? 'primary' : undefined"
              @click="handleList"
            />

            <v-btn
              icon="mdi-view-grid"
              :color="currentView === 1 ? 'error' : undefined"
              @click="handleGrid"
            />
          </v-btn-group>
        </v-card>
      </v-col>
    </v-row>

    <!-- ====================================================== -->
    <!-- SEARCH / FILTERS -->
    <!-- ====================================================== -->

    <v-card class="pa-6 mb-6" rounded="xl" elevation="3">
      <div class="d-flex align-center mb-5">
        <v-avatar color="primary" size="42" class="mr-3">
          <v-icon color="white"> mdi-filter-variant </v-icon>
        </v-avatar>

        <div>
          <div class="text-h6 font-weight-bold">Find Products</div>

          <div class="text-body-2 text-medium-emphasis">
            Search and filter the catalog
          </div>
        </div>
      </div>

      <!-- Search -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="searchQuery"
            label="Search Products"
            placeholder="Search by product name..."
            prepend-inner-icon="mdi-magnify"
            density="comfortable"
            variant="outlined"
            clearable
            hide-details
            @input="filterProducts()"
            @click:clear="filterProducts()"
          />
        </v-col>

        <!-- Category -->
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedCategory"
            :items="categories"
            label="Category"
            prepend-inner-icon="mdi-shape-outline"
            density="comfortable"
            variant="outlined"
            clearable
            @update:model-value="filterProducts()"
            @click:clear="filterProducts()"
          />
        </v-col>
      </v-row>

      <!-- Dates -->
      <v-row align="center">
        <v-col cols="12" md="4">
          <v-text-field
            v-model="startDateInput"
            label="Start Date"
            placeholder="DD/MM/YYYY"
            prepend-inner-icon="mdi-calendar-start"
            density="comfortable"
            variant="outlined"
            :rules="[validateDateRule]"
            maxlength="10"
            hide-details="auto"
            clearable
            @input="startDateInput = formatDate(startDateInput)"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="endDateInput"
            label="End Date"
            placeholder="DD/MM/YYYY"
            prepend-inner-icon="mdi-calendar-end"
            density="comfortable"
            variant="outlined"
            :rules="[validateDateRule]"
            maxlength="10"
            hide-details="auto"
            clearable
            @input="endDateInput = formatDate(endDateInput)"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-btn
            block
            color="primary"
            size="large"
            rounded="lg"
            prepend-icon="mdi-magnify"
            @click="filterProducts"
          >
            Search Products
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- ====================================================== -->
    <!-- ADD PRODUCT -->
    <!-- ====================================================== -->

    <div v-if="$store.state.isAdmin" class="d-flex justify-end mb-5">
      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        elevation="2"
        prepend-icon="mdi-plus-box"
        @click="addProduct"
      >
        Add Product
      </v-btn>
    </div>

    <!-- ====================================================== -->
    <!-- LIST VIEW -->
    <!-- ====================================================== -->

    <v-container v-if="currentView == 0" class="pa-0">
      <v-data-table-virtual
        :headers="headers"
        :items="products"
        height="550"
        item-value="name"
        fixed-header
        class="elevation-3 rounded-xl"
      >
        <!-- IMAGE -->
        <template v-slot:[`item.image`]="{ item }">
          <v-avatar size="64" rounded="lg" class="my-2 bg-grey-lighten-4">
            <v-img :src="item.image" alt="Product image" cover>
              <template #error>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="32" color="grey"> mdi-image-off </v-icon>
                </div>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <!-- PRODUCT NAME -->
        <template v-slot:[`item.name`]="{ item }">
          <div class="font-weight-bold text-primary">
            {{ item.name }}
          </div>

          <div class="text-caption text-medium-emphasis">
            {{ item.description }}
          </div>
        </template>

        <!-- CATEGORY -->
        <template v-slot:[`item.category`]="{ item }">
          <v-chip
            size="small"
            color="primary"
            variant="tonal"
            class="text-capitalize"
          >
            {{ item.category?.replace(/_/g, " ") }}
          </v-chip>
        </template>

        <!-- DATE -->
        <template v-slot:[`item.dateOfCreation`]="{ item }">
          <span class="text-body-2">
            {{ item.dateOfCreation?.split("-").reverse().join("/") }}
          </span>
        </template>

        <!-- PRICE -->
        <template v-slot:[`item.price`]="{ item }">
          <span class="font-weight-bold">
            ${{ Number(item.price).toFixed(2) }}
          </span>
        </template>

        <!-- ================================================= -->
        <!-- STOCK -->
        <!-- ================================================= -->

        <template v-slot:[`item.stockAvailability`]="{ item }">
          <!-- In Stock -->
          <v-chip
            v-if="item.stockAvailability > 0"
            size="small"
            color="success"
            variant="tonal"
            prepend-icon="mdi-check-circle"
          >
            {{ item.stockAvailability }} in stock
          </v-chip>

          <!-- Out Of Stock -->
          <v-chip
            v-else
            size="small"
            color="error"
            variant="tonal"
            prepend-icon="mdi-alert-circle"
          >
            Out of Stock
          </v-chip>
        </template>

        <!-- ================================================= -->
        <!-- ACTIONS -->
        <!-- ================================================= -->

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex align-center ga-1">
            <!-- Add To Cart -->
            <v-btn
              v-if="$store.state.userID"
              color="primary"
              variant="tonal"
              size="small"
              rounded="lg"
              prepend-icon="mdi-cart-plus"
              :disabled="item.stockAvailability <= 0"
              @click="addToCart(item)"
            >
              {{ item.stockAvailability > 0 ? "Add to cart" : "Out of stock" }}
            </v-btn>

            <!-- Edit -->
            <v-btn
              v-if="$store.state.isAdmin"
              icon="mdi-pencil"
              color="primary"
              variant="text"
              size="small"
              @click="editProduct(item.id)"
            />

            <!-- Delete -->
            <v-btn
              v-if="$store.state.isAdmin"
              icon="mdi-delete"
              color="error"
              variant="text"
              size="small"
              @click="openDeleteDialog(item)"
            />
          </div>
        </template>
      </v-data-table-virtual>
    </v-container>

    <!-- ====================================================== -->
    <!-- GRID VIEW -->
    <!-- ====================================================== -->

    <v-container v-if="currentView == 1" class="pa-0">
      <!-- SORTING -->
      <div class="d-flex ga-3 mb-6">
        <v-btn
          color="primary"
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-currency-usd"
          @click="sortByPrice"
        >
          Price

          <v-icon class="ml-2">
            {{ priceAscending ? "mdi-arrow-up" : "mdi-arrow-down" }}
          </v-icon>
        </v-btn>

        <v-btn
          color="primary"
          variant="tonal"
          rounded="lg"
          prepend-icon="mdi-calendar"
          @click="sortByDate"
        >
          Date

          <v-icon class="ml-2">
            {{ dateAscending ? "mdi-arrow-up" : "mdi-arrow-down" }}
          </v-icon>
        </v-btn>
      </div>

      <!-- PRODUCTS -->
      <v-row>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="h-100 d-flex flex-column"
            rounded="xl"
            elevation="3"
            variant="outlined"
          >
            <!-- PRODUCT IMAGE -->

            <div class="position-relative">
              <v-img
                :src="product.image"
                height="280"
                cover
                class="rounded-t-xl"
              >
                <template #error>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon size="64" color="grey"> mdi-image-off </v-icon>
                  </div>
                </template>
              </v-img>

              <!-- OUT OF STOCK OVERLAY -->

              <div
                v-if="product.stockAvailability <= 0"
                class="position-absolute top-0 left-0 right-0 bottom-0 d-flex align-center justify-center"
                style="background: rgba(0, 0, 0, 0.45)"
              >
                <v-chip
                  color="error"
                  size="large"
                  variant="flat"
                  prepend-icon="mdi-alert-circle"
                  class="font-weight-bold"
                >
                  OUT OF STOCK
                </v-chip>
              </div>
            </div>

            <!-- PRODUCT CONTENT -->

            <v-card-text class="pa-5 flex-grow-1">
              <!-- Name -->
              <div class="text-h5 font-weight-bold text-primary mb-2">
                {{ product.name }}
              </div>

              <!-- Category -->
              <v-chip
                size="small"
                color="primary"
                variant="tonal"
                class="text-capitalize mb-4"
              >
                {{ product.category?.replace(/_/g, " ") }}
              </v-chip>

              <!-- Description -->
              <div class="text-body-2 text-medium-emphasis mb-5">
                {{ product.description }}
              </div>

              <!-- Price -->
              <div class="text-h5 font-weight-bold mb-4">
                ${{ Number(product.price).toFixed(2) }}
              </div>

              <!-- STOCK -->

              <div class="mb-4">
                <!-- Available -->
                <v-chip
                  v-if="product.stockAvailability > 0"
                  color="success"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-check-circle"
                >
                  {{ product.stockAvailability }} in stock
                </v-chip>

                <!-- Empty -->
                <v-chip
                  v-else
                  color="error"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-alert-circle"
                >
                  Out of Stock
                </v-chip>
              </div>

              <!-- Date -->
              <div class="text-body-2 text-medium-emphasis">
                <v-icon size="18" class="mr-1"> mdi-calendar-outline </v-icon>

                Added:
                {{ product.dateOfCreation.split("-").reverse().join("/") }}
              </div>
            </v-card-text>

            <!-- ================================================= -->
            <!-- CARD ACTIONS -->
            <!-- ================================================= -->

            <v-divider />

            <v-card-actions class="pa-4">
              <!-- Add Cart -->

              <v-btn
                v-if="$store.state.userID"
                color="primary"
                variant="tonal"
                rounded="lg"
                prepend-icon="mdi-cart-plus"
                :disabled="product.stockAvailability <= 0"
                @click="addToCart(product)"
              >
                {{
                  product.stockAvailability > 0 ? "Add to cart" : "Out of stock"
                }}
              </v-btn>

              <v-spacer />

              <!-- Edit -->

              <v-btn
                v-if="$store.state.isAdmin"
                icon="mdi-pencil"
                color="primary"
                variant="text"
                @click="editProduct(product.id)"
              />

              <!-- Delete -->

              <v-btn
                v-if="$store.state.isAdmin"
                icon="mdi-delete"
                color="error"
                variant="text"
                @click="openDeleteDialog(product)"
              />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- ====================================================== -->
    <!-- DELETE PRODUCT DIALOG -->
    <!-- ====================================================== -->

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card rounded="xl" elevation="8">
        <!-- Header -->

        <v-card-title class="pa-6 pb-3">
          <div class="d-flex align-center">
            <v-avatar color="error" size="50" class="mr-4">
              <v-icon color="white" size="27"> mdi-trash-can-outline </v-icon>
            </v-avatar>

            <div>
              <div class="text-h5 font-weight-bold">Delete Product?</div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                This action cannot be undone
              </div>
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <!-- Content -->

        <v-card-text class="pa-6">
          <v-card variant="tonal" color="error" rounded="lg" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="error" size="28" class="mr-3">
                mdi-alert-outline
              </v-icon>

              <div class="text-body-1">
                Are you sure you want to delete

                <strong class="text-error">
                  {{ productToDelete?.name }}
                </strong>

                ?
              </div>
            </div>
          </v-card>
        </v-card-text>

        <v-divider />

        <!-- Actions -->

        <v-card-actions class="pa-5">
          <v-spacer />

          <v-btn variant="text" @click="deleteDialog = false"> Cancel </v-btn>

          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
            prepend-icon="mdi-trash-can-outline"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ====================================================== -->
    <!-- ADDED TO CART DIALOG -->
    <!-- ====================================================== -->

    <v-dialog
      v-model="cartDialog"
      max-width="600"
      @keyup.enter="cartDialog = false"
      @keydown.tab="cartDialog = false"
    >
      <v-card rounded="xl" elevation="8">
        <!-- Header -->

        <v-card-title class="pa-6 pb-3">
          <div class="d-flex align-center">
            <v-avatar color="success" size="50" class="mr-4">
              <v-icon color="white" size="28"> mdi-cart-check </v-icon>
            </v-avatar>

            <div>
              <div class="text-h5 font-weight-bold">Added to Cart</div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                Your item has been added successfully
              </div>
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <!-- PRODUCT -->

        <v-card-text class="pa-6">
          <v-card variant="tonal" rounded="xl" class="pa-4">
            <div class="d-flex align-center">
              <!-- Image -->

              <v-avatar size="110" rounded="lg" class="mr-5 bg-grey-lighten-4">
                <v-img
                  :src="productAddedToCart.image"
                  alt="Product image"
                  cover
                >
                  <template #error>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="45" color="grey"> mdi-image-off </v-icon>
                    </div>
                  </template>
                </v-img>
              </v-avatar>

              <!-- Details -->

              <div class="flex-grow-1">
                <div class="text-h6 font-weight-bold text-primary">
                  {{ productAddedToCart.name }}
                </div>

                <div class="text-body-2 text-medium-emphasis mt-2">
                  Added successfully to your shopping cart
                </div>

                <div class="text-h6 font-weight-bold mt-3">
                  ${{ Number(productAddedToCart.price).toFixed(2) }}
                </div>
              </div>
            </div>
          </v-card>
        </v-card-text>

        <v-divider />

        <!-- Actions -->

        <v-card-actions class="pa-5">
          <v-spacer />

          <v-btn color="primary" variant="text" @click="cartDialog = false">
            Continue Shopping
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            prepend-icon="mdi-cart-outline"
            @click="cartRedirect"
          >
            Go to Cart
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

// Components
import {
  getAllProducts,
  getProductsByCategory,
  getProductsByName,
  getProductsByDateRange,
  deleteProduct,
  addProductToCart,
} from "@/db/dbCommunicator.js";

export default defineComponent({
  name: "CatalogView",

  data() {
    return {
      priceAscending: true,
      dateAscending: true,
      deleteDialog: false,
      cartDialog: false,
      productToDelete: null,
      print: "",
      searchQuery: "",
      startDateInput: "",
      endDateInput: "",
      selectedCategory: null,
      productAddedToCart: null,
      headers: [
        {
          title: "Image",
          key: "image",
          sortable: false,
          width: 90,
        },
        { title: "Product", align: "start", key: "name" },
        { title: "Category", align: "end", key: "category" },
        { title: "Stock", align: "end", key: "stockAvailability" },
        { title: "Price($)", align: "end", key: "price" },
        { title: "Date Added", align: "end", key: "dateOfCreation" },
        { title: "", key: "actions", sortable: false },
      ],
      categories: [
        "Electronics",
        "Fitness",
        "Clothing",
        "Books",
        "Gaming",
        "Home & Kitchen",
        "Office Supplies",
        "Outdoor",
      ],
      currentView: 0, // 'list' | 'grid'
      products: [],
    };
  },
  async mounted() {
    this.products = await getAllProducts();
  },
  watch: {
    async $route() {
      this.products = await getAllProducts();
    },

    startDateInput(newVal) {
      if (!newVal) {
        // Triggers when the 'x' clear button is clicked or text is deleted
        this.filterProducts();
      }
    },
    endDateInput(newVal) {
      if (!newVal) {
        this.filterProducts();
      }
    },
  },

  methods: {
    cartRedirect() {
      this.cartDialog = false;
      this.$router.push({ name: "cart" });
    },

    async addToCart(product) {
      if (product.stockAvailability <= 0) {
        this.outOfStockDialog = true;
        return;
      }

      this.productAddedToCart = product;
      this.cartDialog = true;

      await addProductToCart(product.id, this.$store.state.userID);
    },

    openDeleteDialog(product) {
      this.productToDelete = product;
      this.deleteDialog = true;
    },

    async confirmDelete() {
      if (!this.productToDelete) return;

      await this.deleteProduct();

      this.deleteDialog = false;
      this.productToDelete = null;
    },
    isValidDate(dateStr) {
      if (!dateStr) return true; // Empty string is valid for optional inputs
      if (dateStr.length !== 10) return false;

      const [dayStr, monthStr, yearStr] = dateStr.split("/");
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      // Basic month and year boundaries
      if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
      if (month < 1 || month > 12 || year < 1900 || year > 2100) return false;

      // Days allowed per month (accounting for leap years in Feb)
      const daysInMonth = [
        31,
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];

      return day >= 1 && day <= daysInMonth[month - 1];
    },

    // Vuetify rule for UI error messages
    validateDateRule(value) {
      if (!value) return true;
      return this.isValidDate(value) || "Enter a valid date (DD/MM/YYYY)";
    },

    handleList() {
      this.currentView = 0;
    },

    handleGrid() {
      this.currentView = 1;
    },

    async filterProducts() {
      const activeResults = [];

      if (this.searchQuery) {
        activeResults.push(await getProductsByName(this.searchQuery));
      }

      if (this.selectedCategory) {
        activeResults.push(await getProductsByCategory(this.selectedCategory));
      }

      if (this.startDateInput && this.endDateInput) {
        activeResults.push(
          await getProductsByDateRange(this.startDateInput, this.endDateInput)
        );
      }

      if (activeResults.length === 0) {
        this.products = await getAllProducts();
        return;
      }
      const firstList = activeResults[0];

      this.products = firstList.filter((product) => {
        return activeResults.every((list) =>
          list.some((item) => item.name === product.name)
        );
      });
    },

    editProduct(id) {
      this.$router.push({
        name: "manage",
        query: {
          id: id,
        },
      });
    },

    addProduct() {
      this.$router.push({ name: "manage" });
    },

    async deleteProduct() {
      await deleteProduct(this.productToDelete.id);
      this.products = await getAllProducts();
    },

    sortByPrice() {
      this.priceAscending = !this.priceAscending;

      this.products.sort((a, b) => {
        return this.priceAscending ? a.price - b.price : b.price - a.price;
      });
    },

    sortByDate() {
      this.dateAscending = !this.dateAscending;

      this.products.sort((a, b) => {
        return this.dateAscending
          ? a.dateOfCreation.localeCompare(b.dateOfCreation)
          : b.dateOfCreation.localeCompare(a.dateOfCreation);
      });
    },

    formatDate(value) {
      // Remove anything that isn't a number
      let numbers = value.replace(/\D/g, "");

      // Maximum 8 digits: DDMMYYYY
      numbers = numbers.substring(0, 8);

      if (numbers.length > 4) {
        return (
          numbers.substring(0, 2) +
          "/" +
          numbers.substring(2, 4) +
          "/" +
          numbers.substring(4)
        );
      }

      if (numbers.length > 2) {
        return numbers.substring(0, 2) + "/" + numbers.substring(2);
      }

      return numbers;
    },

    //old functions: combined them into one
    /*async searchProductsByName() {
      this.products = await getProductsByName(this.searchQuery);
    },

    async searchProductsByCategory() {
      this.products = await getProductsByCategory(this.selectedCategory);
    },

    async filterProductsByDateRange() {
      this.products = await getProductsByDateRange(
        this.startDateInput,
        this.endDateInput
      );
    },*/
  },
});
</script>

<style>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}
</style>
