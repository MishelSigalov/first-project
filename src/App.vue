<template>
  <v-app>
    <v-main>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>Mishel's Shop</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn rounded text :to="{ name: 'catalog' }"> Products </v-btn>
        <v-btn rounded text :to="{ name: 'login' }"> Login </v-btn>
        <v-btn rounded text :to="{ name: 'manage' }"> Manage Product </v-btn>
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
