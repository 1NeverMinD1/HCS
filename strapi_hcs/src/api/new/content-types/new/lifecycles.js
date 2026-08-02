"use strict";

const { optimizeOgImage } = require("../../../../utils/og-image-optimizer");

module.exports = {
  async afterCreate(event) {
    const { result } = event;
    await optimizeOgImage(strapi, "api::new.new", result.documentId, "desc_img");
  },

  async afterUpdate(event) {
    const { result } = event;
    await optimizeOgImage(strapi, "api::new.new", result.documentId, "desc_img");
  },
};
