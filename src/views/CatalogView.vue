<template>
  <v-container>
    <!--List/Grid Displayer-->
    <v-row>
      <v-col>
        <h1>{{ print }}</h1>
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
    <!--Search/ filter Displayer-->
    <vrow>
      <v-card class="pa-4 mb-4" elevation="1" rounded="md">
        <v-row>
          <!-- Search Input -->
          <v-text-field
            v-model="searchQuery"
            label="Search Products"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            clearable
            hide-details
            @input="filterProducts()"
            @click:clear="filterProducts()"
          />
        </v-row>

        <v-row>
          <!-- Category Select -->
          <v-col cols="6" sm="6" md="6">
            <v-select
              v-model="selectedCategory"
              :items="categories"
              label="Category"
              density="compact"
              variant="outlined"
              clearable
              @update:model-value="filterProducts()"
              @click:clear="filterProducts()"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="startDateInput"
              label="Start Date (DD/MM/YYYY)"
              placeholder="DD/MM/YYYY"
              density="compact"
              variant="outlined"
              :rules="[validateDateRule]"
              maxlength="10"
              hide-details="auto"
              clearable
              @input="startDateInput = formatDate(startDateInput)"
            />
          </v-col>

          <v-col cols="12" sm="5">
            <v-text-field
              v-model="endDateInput"
              label="End Date (DD/MM/YYYY)"
              placeholder="DD/MM/YYYY"
              density="compact"
              variant="outlined"
              :rules="[validateDateRule]"
              maxlength="10"
              hide-details="auto"
              clearable
              @input="endDateInput = formatDate(endDateInput)"
            />
          </v-col>

          <v-col cols="12" sm="2">
            <v-btn color="primary" block @click="filterProducts">Search</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </vrow>

    <!--Add product button-->
    <v-row>
      <v-btn
        v-if="$store.state.isAdmin"
        color="primary"
        prepend-icon="mdi-plus-box"
        @click="addProduct"
        >Add Product</v-btn
      >
    </v-row>

    <!--List View-->
    <v-container v-if="currentView == 0">
      <v-data-table-virtual
        :headers="headers"
        :items="products"
        height="500"
        item-value="name"
        fixed-header
        class="elevation-1 rounded-lg"
      >
        <template v-slot:[`item.image`]="{ item }">
          <v-avatar size="64" rounded="lg" class="my-2">
            <v-img :src="item.image" alt="Product image" cover>
              <template #error>
                <v-icon size="32" color="grey"> mdi-image-off </v-icon>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <span class="text-primary font-weight-bold text-body-1">
            {{ item.name }}
          </span>
        </template>

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

        <template v-slot:[`item.dateOfCreation`]="{ item }">
          {{ item.dateOfCreation?.split("-").reverse().join("/") }}
        </template>

        <template v-slot:[`item.price`]="{ item }">
          <span class="font-weight-bold">
            ${{ Number(item.price).toFixed(2) }}
          </span>
        </template>

        <template v-slot:[`item.stockAvailability`]="{ item }">
          <v-chip
            size="small"
            :color="item.stockAvailability > 0 ? 'success' : 'error'"
            variant="tonal"
          >
            {{ item.stockAvailability }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex align-center ga-1">
            <v-btn
              v-if="$store.state.userID"
              prepend-icon="mdi-cart-plus"
              color="primary"
              variant="tonal"
              size="small"
              @click="addToCart(item)"
            >
              Add to cart
            </v-btn>

            <v-btn
              v-if="$store.state.isAdmin"
              icon="mdi-pencil"
              color="primary"
              variant="text"
              size="small"
              @click="editProduct(item.id)"
            ></v-btn>

            <v-btn
              v-if="$store.state.isAdmin"
              icon="mdi-delete"
              color="red"
              variant="text"
              size="small"
              @click="openDeleteDialog(item)"
            ></v-btn>
          </div>
        </template>
      </v-data-table-virtual>
    </v-container>

    <!--Grid View-->
    <v-container v-if="currentView == 1">
      <v-row>
        <v-btn @click="sortByPrice">
          Price
          <v-icon>
            {{ priceAscending ? "mdi-arrow-up" : "mdi-arrow-down" }}
          </v-icon>
        </v-btn>

        <v-btn @click="sortByDate">
          Date
          <v-icon>
            {{ dateAscending ? "mdi-arrow-up" : "mdi-arrow-down" }}
          </v-icon>
        </v-btn>
      </v-row>
      <v-row>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="pa-4" variant="outlined">
            <!-- Product image -->
            <v-img :src="product.image" height="300" cover class="mb-4 rounded">
              <template #error>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="64" color="grey"> mdi-image-off </v-icon>
                </div>
              </template></v-img
            >

            <v-card-title class="text-primary font-weight-bold"
              >{{ product.name }}
            </v-card-title>
            <v-card-subtitle
              >Category:
              {{ product.category?.replace(/_/g, " ") }}</v-card-subtitle
            >
            <v-card-subtitle>{{ product.description }}</v-card-subtitle>
            <v-card-text>
              <p class="text-h6">${{ product.price }}</p>
              <p>Stock: {{ product.stockAvailability }}</p>
              <p>
                Date Added:
                {{ product.dateOfCreation.split("-").reverse().join("/") }}
              </p>
            </v-card-text>

            <!--Delete, edit and add to cart buttons-->
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-cart-plus"
                color="primary"
                variant="text"
                v-if="$store.state.userID"
                @click="addToCart(product)"
              >
                Add to cart
              </v-btn>
              <v-btn
                icon="mdi-pencil"
                color="primary"
                variant="text"
                v-if="$store.state.isAdmin"
                @click="editProduct(product.id)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                color="red"
                variant="text"
                v-if="$store.state.isAdmin"
                @click="openDeleteDialog(product)"
              >
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
  <!--custom "are you sure?" dialog-->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h5"> Delete Product? </v-card-title>

      <v-card-text>
        Are you sure you want to delete
        <strong class="text-red-darken-2">{{ productToDelete?.name }}</strong
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
  <!--custom added to cart dialog-->
  <v-dialog
    v-model="cartDialog"
    max-width="700"
    @keyup.enter="cartDialog = false"
    @keydown.tab="cartDialog = false"
  >
    <v-card>
      <v-card-title class="text-h2 font-weight-bold">
        <strong class="text-primary">{{
          productAddedToCart.name + " "
        }}</strong>
        added to cart!
      </v-card-title>

      <v-img :src="productAddedToCart.image" height="350" contain>
        <template #error>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon size="64" color="grey">mdi-image-off</v-icon>
          </div>
        </template>
      </v-img>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="cartRedirect">
          Go to cart
        </v-btn>

        <v-btn color="primary" variant="text" @click="cartDialog = false">
          Continue shopping
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
