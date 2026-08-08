"use strict";

module.exports = {
  async generate(ctx) {
    const { locale } = ctx.params;

    if (!["ru", "kk", "en"].includes(locale)) {
      return ctx.badRequest("Unsupported locale");
    }

    const xml = await strapi.service("api::rss.rss").generate(locale);

    ctx.type = "application/rss+xml";
    ctx.body = xml;
  },
};
