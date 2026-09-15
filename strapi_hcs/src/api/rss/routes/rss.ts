export default {
  routes: [
    {
      method: "GET",
      path: "/rss/:locale",
      handler: "rss.generate",
      config: {
        auth: false,
      },
    },
  ],
};
