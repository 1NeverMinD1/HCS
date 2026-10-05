export default {
  routes: [
    {
      method: "GET",
      path: "/preview/:type/:documentId",
      handler: "preview.findOne",
      config: {
        auth: false,
      },
    },
  ],
};
