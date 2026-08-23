const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {},
  },

  css: {
    extract: true,
  },

  configureWebpack: {
    optimization: {
      minimize: false,
    },
  },
});
