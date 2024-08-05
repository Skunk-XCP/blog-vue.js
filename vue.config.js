const path = require("path");

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
};
