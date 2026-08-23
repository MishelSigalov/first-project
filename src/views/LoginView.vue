<template>
  <v-container
    @keyup.enter="login"
    fluid
    class="fill-height d-flex align-center justify-center"
  >
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

    <!--error dialog-->
    <v-dialog
      v-model="errorDialog"
      max-width="300"
      @keyup.enter="errorDialog = false"
    >
      <v-card>
        <v-card-title class="text-h2 text-red font-weight-bold">
          Login Failed
        </v-card-title>

        <v-card-text>
          {{ errorMessage }}
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
import { getUser } from "@/db/dbCommunicator.js";
export default {
  name: "LoginView",

  data() {
    return {
      print: "",
      loginType: "client",
      username: "",
      password: "",
      errorDialog: false,
      errorMessage: "",
    };
  },

  methods: {
    async login() {
      const user = await getUser(this.username);
      this.print = user.id;
      //check if there is an empry field
      if (!this.username) {
        this.errorMessage = "User cant be empty";
        this.errorDialog = true;
        return;
      }

      if (!this.password) {
        this.errorMessage = "Password cant be empty";
        this.errorDialog = true;
        return;
      }

      //check if user exists
      if (!user) {
        this.errorMessage = "User doesn't exist";
        this.errorDialog = true;
        return;
      }

      // client login
      if (this.loginType === "client" && user.isAdmin) {
        this.errorMessage = "User is Admin";
        this.errorDialog = true;
        return;
      }

      // admin login
      if (this.loginType === "admin" && !user.isAdmin) {
        this.errorMessage = "User isn't Admin";
        this.errorDialog = true;
        return;
      }

      // check password
      if (user.password !== this.password) {
        this.errorMessage = "Password incorrect";
        this.errorDialog = true;
        return;
      }

      //all tests passed
      await this.$store.dispatch("login", user);

      this.$router.push({ name: "catalog" });
    },
  },
};
</script>
