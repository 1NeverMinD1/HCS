"use strict";

const { optimizeOgImage } = require("../../../../utils/og-image-optimizer");
const {
  createIndexNowLifecycle,
} = require("../../../../utils/createIndexNowLifecycle");

const indexNowHooks = createIndexNowLifecycle("article");

module.exports = {
  async afterCreate(event) {
    console.log("=== AFTER CREATE ARTICLE ===");

    const { result } = event;
    await optimizeOgImage(
      strapi,
      "api::article.article",
      result.documentId,
      "desc_img",
    );
    await indexNowHooks.afterCreate(event);
  },

  async afterUpdate(event) {
    console.log("=== AFTER UPDATE ARTICLE ===");

    const { result } = event;
    await optimizeOgImage(
      strapi,
      "api::article.article",
      result.documentId,
      "desc_img",
    );
    await indexNowHooks.afterUpdate(event);
  },
};
