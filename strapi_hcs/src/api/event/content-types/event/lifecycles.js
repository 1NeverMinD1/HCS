"use strict";

const { optimizeOgImage } = require("../../../../utils/og-image-optimizer");
const {
  createIndexNowLifecycle,
} = require("../../../../utils/createIndexNowLifecycle");

const indexNowHooks = createIndexNowLifecycle("event");

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    await optimizeOgImage(
      strapi,
      "api::event.event",
      result.documentId,
      "desc_img",
    );
    await indexNowHooks.afterCreate(event);
  },

  async afterUpdate(event) {
    const { result } = event;
    await optimizeOgImage(
      strapi,
      "api::event.event",
      result.documentId,
      "desc_img",
    );
    await indexNowHooks.afterUpdate(event);
  },
};
