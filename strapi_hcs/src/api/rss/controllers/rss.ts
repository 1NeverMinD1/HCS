export default {
  async generate(ctx: any) {
    const { locale } = ctx.params;

    if (!["ru", "kk", "en"].includes(locale)) {
      return ctx.badRequest("Unsupported locale");
    }

    const xml = await strapi.service("api::rss.rss").generate(locale);

    ctx.set("Content-Type", "application/rss+xml; charset=utf-8");
    ctx.body = xml;
  },
};
