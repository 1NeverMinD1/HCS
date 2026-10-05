import { PREVIEW_TYPES, verifyPreviewToken } from "../../../utils/preview";

export default {
  async findOne(ctx) {
    const { type, documentId } = ctx.params;
    const { token, ...query } = ctx.query as Record<string, any>;

    const uid = PREVIEW_TYPES[type];
    if (!uid) return ctx.notFound();

    if (
      !verifyPreviewToken(token, type, documentId, process.env.PREVIEW_SECRET)
    ) {
      return ctx.unauthorized();
    }

    const schema = strapi.getModel(uid as any);
    const sanitizedQuery: any = await strapi.contentAPI.sanitize.query(
      query,
      schema,
      {},
    );

    const document = await strapi.documents(uid as any).findOne({
      documentId,
      status: "draft",
      populate: sanitizedQuery.populate,
      fields: sanitizedQuery.fields,
    });

    if (!document) return ctx.notFound();

    ctx.set("Cache-Control", "no-store");
    ctx.set("X-Robots-Tag", "noindex, nofollow");
    ctx.body = {
      data: await strapi.contentAPI.sanitize.output(document, schema, {}),
    };
  },
};
