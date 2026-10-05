import type { Core } from '@strapi/strapi';
import { PREVIEW_TYPES, createPreviewToken } from '../src/utils/preview';

const SITE_PATHS: Record<string, string> = {
  article: 'articles',
  news: 'news',
  blog: 'blogs',
  event: 'events',
  qna: 'q-and-as',
};

const getPreviewType = (uid: string) =>
  Object.keys(PREVIEW_TYPES).find((key) => PREVIEW_TYPES[key] === uid);

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL')],
      async handler(uid, { documentId, status }) {
        const type = getPreviewType(uid);
        const clientUrl = env('CLIENT_URL');
        const secret = env('PREVIEW_SECRET');

        if (!type || !documentId || !clientUrl || !secret) return null;

        if (status === 'published') {
          const published: any = await strapi.documents(uid as any).findOne({
            documentId,
            status: 'published',
            fields: ['slug'] as any,
          });
          if (published?.slug) {
            return `${clientUrl}/ru/${SITE_PATHS[type]}/${published.slug}`;
          }
        }

        const token = createPreviewToken(type, documentId, secret);
        return `${clientUrl}/ru/preview/${type}/${documentId}?token=${token}`;
      },
    },
  },
});

export default config;