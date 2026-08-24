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

    <!-- Login Error Dialog -->
    <v-dialog
      v-model="errorDialog"
      max-width="500"
      @keyup.enter="errorDialog = false"
    >
      <v-card rounded="xl" elevation="8">
        <!-- Header -->
        <v-card-title class="pa-6 pb-3">
          <div class="d-flex align-center">
            <v-avatar color="error" size="52" class="mr-4">
              <v-icon color="white" size="30"> mdi-alert-circle </v-icon>
            </v-avatar>

            <div>
              <div class="text-h5 font-weight-bold">Login Failed</div>

              <div class="text-body-2 text-medium-emphasis mt-1">
                We couldn't log you in
              </div>
            </div>
          </div>
        </v-card-title>

        <v-divider />

        <!-- Error Message -->
        <v-card-text class="pa-6">
          <v-card color="error" variant="tonal" rounded="lg" class="pa-4">
            <div class="d-flex align-center">
              <v-icon color="error" size="28" class="mr-3">
                mdi-information
              </v-icon>

              <div class="text-body-1">
                {{ errorMessage }}
              </div>
            </div>
          </v-card>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="pa-5">
          <v-spacer />

          <v-btn
            color="error"
            variant="flat"
            rounded="lg"
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
import { getUser } from "@/db/dbCommunicator.js";
import { hashPassword } from "@/db/passwordUtils.js";
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
      // Check empty username first
      if (!this.username) {
        this.errorMessage = "Username can't be empty";
        this.errorDialog = true;
        return;
      }

      // Check empty password
      if (!this.password) {
        this.errorMessage = "Password can't be empty";
        this.errorDialog = true;
        return;
      }

      const user = await getUser(this.username);

      // Check user exists
      if (!user) {
        this.errorMessage = "User doesn't exist";
        this.errorDialog = true;
        return;
      }

      // Client login
      if (this.loginType === "client" && user.isAdmin) {
        this.errorMessage = "User is Admin";
        this.errorDialog = true;
        return;
      }

      // Admin login
      if (this.loginType === "admin" && !user.isAdmin) {
        this.errorMessage = "User isn't Admin";
        this.errorDialog = true;
        return;
      }

      // Hash entered password
      const hashedPassword = await hashPassword(this.password);

      // Compare hashes
      if (user.password !== hashedPassword) {
        this.errorMessage = "Password incorrect";
        this.errorDialog = true;
        return;
      }

      // Login successful
      await this.$store.dispatch("login", user);

      this.$router.push({ name: "catalog" });
    },
  },
};
</script>
