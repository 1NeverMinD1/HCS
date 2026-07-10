import type { Schema, Struct } from '@strapi/strapi';

export interface ContentSeo extends Struct.ComponentSchema {
  collectionName: 'components_content_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    seo_desc_en: Schema.Attribute.String;
    seo_desc_kk: Schema.Attribute.String;
    seo_desc_ru: Schema.Attribute.String;
    seo_image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    seo_title_en: Schema.Attribute.String;
    seo_title_kk: Schema.Attribute.String;
    seo_title_ru: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.seo': ContentSeo;
    }
  }
}
