const path = require("path");
const fs = require("fs");

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        dompurify: path.resolve(__dirname, "node_modules", "dompurify"),
      },
      fallback: {
        events: require.resolve("events/"),
      },
    },
  },
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "blog-vue-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "blog-vue.pem")),
    },
    host: "blog-vue",
    port: 8080,
  },
};
