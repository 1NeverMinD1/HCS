// src/api/blog/content-types/blog/lifecycles.js
"use strict";

const { optimizeOgImage } = require("../../../../utils/og-image-optimizer");
const {
  createIndexNowLifecycle,
} = require("../../../../utils/createIndexNowLifecycle");

const indexNowHooks = createIndexNowLifecycle("blog");

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    await optimizeOgImage(
      strapi,
      "api::blog.blog",
      result.documentId,
      "back_img",
    );
    await indexNowHooks.afterCreate(event);
  },

  async afterUpdate(event) {
    const { result } = event;
    await optimizeOgImage(
      strapi,
      "api::blog.blog",
      result.documentId,
      "back_img",
    );
    await indexNowHooks.afterUpdate(event);
  },
};
