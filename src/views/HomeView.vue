<template>
  <ProductsDisplay />
</template>

<script>
import { defineComponent } from "vue";

// Components
import ProductsDisplay from "../components/ProductsDisplay.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    ProductsDisplay,
  },
});
</script>
