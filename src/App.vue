<template>
  <v-app>
    <v-main>
      <nav>
        <router-link :to="{ name: 'home' }">Main</router-link>
        <router-link :to="{ name: 'about' }">About</router-link>
      </nav>
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

<style>
#app {
  font-family: Georgia, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  background-color: gray;
  font-size: 30px;
}

nav a {
  display: inline-block;
  font-weight: bold;
  color: #2c3e50;
  padding: 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
