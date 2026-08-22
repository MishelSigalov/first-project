<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="pa-6" elevation="8" rounded="lg">
      <v-card-title class="text-h4 text-center mb-6"> Login </v-card-title>

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
  </v-container>
</template>

<script>
export default {
  name: "LoginView",

  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    login() {},
  },
};
</script>
