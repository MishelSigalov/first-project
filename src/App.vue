<!-- eslint-disable prettier/prettier -->
<template>
  <v-app>
    <v-main>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>My App</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn rounded text to="/">Products</v-btn>
      </v-toolbar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
