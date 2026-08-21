<template>
  <v-app>
    <div class="about">
      <v-card class="pa-4" max-width="500">
        <v-card-title>About</v-card-title>
        <v-card-text>
          <v-form>
            <!-- Note: Use v-model instead of slot text for inputs -->
            <v-text-field label="Username" v-model="username" />
            <v-text-field label="Email" v-model="email" />
            <v-btn color="primary">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AboutView",
  data() {
    return {
      username: "",
      email: "",
    };
  },
  methods: {
    submitForm() {
      // Handle form submission
      console.log("Form submitted:", this.username, this.email);
    },
  },
});
</script>
