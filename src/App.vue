<template>
  <v-app>
    <v-main>
      <v-toolbar class="my-toolbar" color="primary" dark>
        <v-toolbar-title class="text-black"> Mishel's Shop </v-toolbar-title>

        <v-btn rounded text :to="{ name: 'catalog' }"> Products </v-btn>
        <v-btn
          v-if="$store.state.isAdmin"
          rounded
          text
          :to="{ name: 'manage' }"
        >
          Product Management
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn
          v-if="!$store.state.username"
          rounded
          text
          :to="{ name: 'login' }"
        >
          Login
        </v-btn>

        <!--cart-->
        <v-btn icon :to="{ name: 'cart' }">
          <v-badge
            v-if="cartCount > 0"
            :content="cartCount"
            color="red"
            floating
          >
            <v-icon>mdi-cart</v-icon>
          </v-badge>

          <v-icon v-else>mdi-cart</v-icon>
        </v-btn>

        <!--orders-->
        <v-btn
          v-if="$store.state.username"
          :to="{ name: 'orders' }"
          variant="text"
          prepend-icon="mdi-package-check-outline"
        >
          Orders
        </v-btn>

        <!--username and logout-->
        <v-chip
          v-if="$store.state.username"
          class="ml-3 mr-4"
          color="white"
          variant="outlined"
        >
          <v-icon :color="$store.state.isAdmin ? 'red' : undefined" start
            >mdi-account</v-icon
          >
          Logged in: {{ $store.state.username }}
        </v-chip>

        <v-btn
          v-if="$store.state.username"
          color="red"
          variant="text"
          @click="logout"
        >
          logout
        </v-btn>
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
.my-toolbar * {
  font-weight: bold;
}
</style>
