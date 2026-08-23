<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <h1>{{ print }}</h1>
    <div style="width: 400px">
      <!-- Login type navbar -->
      <v-card class="mb-3" elevation="4" rounded="lg">
        <v-tabs v-model="loginType" color="primary" grow>
          <v-tab value="client">
            <v-icon start>mdi-account</v-icon>
            Client
          </v-tab>

          <v-tab value="admin">
            <v-icon start>mdi-shield-account</v-icon>
            Admin
          </v-tab>
        </v-tabs>
      </v-card>

      <!-- Login card -->
      <v-card class="pa-6" elevation="8" rounded="lg">
        <v-card-title class="text-h4 text-center mb-6">
          {{ loginType === "client" ? "Client Login" : "Admin Login" }}
        </v-card-title>

        <v-text-field
          v-model="username"
          label="Username"
          type="text"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          class="mb-3"
        />

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          class="mb-4"
        />

        <v-btn color="primary" size="large" block @click="login"> Login </v-btn>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { getUser } from "@/db/dbCommunicator.js";
export default {
  name: "LoginView",

  data() {
    return {
      print: "",
      loginType: "client",
      username: "",
      password: "",
    };
  },

  methods: {
    async login() {
      const user = await getUser(this.username);

      //check if user exists
      if (!user) {
        alert("User doesn't exist");
        return;
      }

      // client login
      if (this.loginType === "client" && user.isAdmin) {
        alert("User is Admin");
        return;
      }

      // admin login
      if (this.loginType === "admin" && !user.isAdmin) {
        alert("User isn't Admin");
        return;
      }

      // check password
      if (user.password !== this.password) {
        alert("Password incorrect");
        return;
      }

      //all tests passed
      this.$store.commit("setUser", user);

      this.$router.push({ name: "catalog" });
    },
  },
};
</script>
