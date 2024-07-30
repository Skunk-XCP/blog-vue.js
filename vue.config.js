module.exports = {
   configureWebpack: {
      resolve: {
         fallback: {
            events: require.resolve("events/"),
         },
      },
   },
};
