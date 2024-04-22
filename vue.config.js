const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // host: '127.0.0.1',
    host: '0.0.0.0',
    port: 8080
    // public: '0.0.0.0:8080',
  },
  configureWebpack: {
    devtool: "source-map",
    plugins: [
      new NodePolyfillPlugin()
    ]
  }
})
