<template>
  <v-app>
    <v-main>
      <v-toolbar class="my-toolbar" color="primary" dark>
        <v-toolbar-title class="text-black"> Mishel's Shop </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn rounded text :to="{ name: 'catalog' }"> Products </v-btn>

        <v-btn
          v-if="!$store.state.username"
          rounded
          text
          :to="{ name: 'login' }"
        >
          Login
        </v-btn>

        <v-btn
          v-if="$store.state.isAdmin"
          rounded
          text
          :to="{ name: 'manage' }"
        >
          Product Management
        </v-btn>

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
export default {
  name: "App",
  methods: {
    logout() {
      this.$store.commit("logout");

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
