"use strict";

module.exports = {
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
