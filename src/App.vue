<template>
  <v-app>
    <v-main>
      <v-toolbar class="my-toolbar px-4" color="primary" elevation="4">
        <!-- Logo / Shop name -->
        <v-toolbar-title class="shop-title">
          <v-icon class="mr-2">mdi-storefront-outline</v-icon>
          Mishel's Shop
        </v-toolbar-title>

        <!-- Main navigation -->
        <div class="nav-links">
          <v-btn
            rounded="lg"
            variant="text"
            :to="{ name: 'catalog' }"
            prepend-icon="mdi-store-outline"
            class="products-btn"
          >
            Products
          </v-btn>

          <v-btn
            v-if="$store.state.isAdmin"
            rounded="lg"
            variant="text"
            :to="{ name: 'manage' }"
            prepend-icon="mdi-cog-outline"
          >
            Product Management
          </v-btn>
        </div>

        <v-spacer />

        <!-- Right side -->
        <div class="nav-actions">
          <!-- Login -->
          <v-btn
            v-if="!$store.state.username"
            rounded="lg"
            variant="outlined"
            prepend-icon="mdi-login"
            :to="{ name: 'login' }"
          >
            Login
          </v-btn>

          <!-- Cart -->
          <v-btn
            icon
            variant="text"
            :to="{ name: 'cart' }"
            class="nav-icon-btn"
          >
            <v-badge
              v-if="cartCount > 0"
              :content="cartCount"
              color="error"
              floating
            >
              <v-icon size="26">mdi-cart-outline</v-icon>
            </v-badge>

            <v-icon v-else size="26"> mdi-cart-outline </v-icon>

            <v-tooltip activator="parent" location="bottom"> Cart </v-tooltip>
          </v-btn>

          <!-- Orders -->
          <v-btn
            v-if="$store.state.username"
            :to="{ name: 'orders' }"
            variant="text"
            rounded="lg"
          >
            <v-icon class="mr-1">mdi-package-variant-closed</v-icon>

            Orders
          </v-btn>

          <!-- User -->
          <v-menu v-if="$store.state.username">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                rounded="lg"
                variant="tonal"
                class="user-btn"
              >
                <v-avatar size="30" class="mr-2">
                  <v-icon :color="$store.state.isAdmin ? 'red' : undefined">
                    mdi-account
                  </v-icon>
                </v-avatar>

                {{ $store.state.username }}

                <v-icon class="ml-1"> mdi-chevron-down </v-icon>
              </v-btn>
            </template>

            <v-list rounded="lg" elevation="4">
              <v-list-item
                prepend-icon="mdi-account-outline"
                :title="$store.state.username"
                :subtitle="$store.state.isAdmin ? 'Administrator' : 'Customer'"
              />

              <v-divider class="my-2" />

              <v-list-item
                prepend-icon="mdi-logout"
                title="Logout"
                @click="logout"
              />
            </v-list>
          </v-menu>
        </div>
      </v-toolbar>

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { getCartCountLive } from "@/db/dbCommunicator.js";

export default {
  name: "App",

  data() {
    return {
      cartCount: 0,
      cartSubscription: null,
    };
  },

  watch: {
    // Start/restart liveQuery when the user logs in/out
    "$store.state.userID"(newUserID) {
      this.loadCartCount(newUserID);
    },
  },

  mounted() {
    this.loadCartCount(this.$store.state.userID);
  },

  beforeUnmount() {
    this.stopCartSubscription();
  },

  methods: {
    loadCartCount(userID) {
      // Stop previous subscription
      this.stopCartSubscription();

      // No user logged in
      if (!userID) {
        this.cartCount = 0;
        return;
      }

      // Start live query
      this.cartSubscription = getCartCountLive(userID).subscribe({
        next: (count) => {
          console.log("Cart count:", count);
          this.cartCount = count;
        },

        error: (error) => {
          console.error("Cart count error:", error);
        },
      });
    },

    stopCartSubscription() {
      if (this.cartSubscription) {
        this.cartSubscription.unsubscribe();
        this.cartSubscription = null;
      }
    },

    logout() {
      this.$store.commit("logout");

      this.cartCount = 0;

      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style>
.my-toolbar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.shop-title {
  display: flex;
  align-items: center;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 35px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-icon-btn {
  transition: transform 0.2s ease;
}

.nav-icon-btn:hover {
  transform: scale(1.08);
}

.user-btn {
  margin-left: 8px;
  font-weight: 700;
}

.my-toolbar .v-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.my-toolbar .v-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.products-btn {
  font-size: 1.1rem;
  padding: 0 20px;
  min-width: 130px;
  height: 44px;
}
</style>
