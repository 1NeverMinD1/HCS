import type { Schema, Struct } from '@strapi/strapi';

export interface ContentOg extends Struct.ComponentSchema {
  collectionName: 'components_content_ogs';
  info: {
    displayName: 'OG';
  };
  attributes: {
    og_desc_en: Schema.Attribute.Text;
    og_desc_kk: Schema.Attribute.Text;
    og_desc_ru: Schema.Attribute.Text;
    og_image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    og_title_en: Schema.Attribute.String;
    og_title_kk: Schema.Attribute.String;
    og_title_ru: Schema.Attribute.String;
  };
}

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
    seo_keywords_en: Schema.Attribute.Text;
    seo_keywords_kk: Schema.Attribute.Text;
    seo_keywords_ru: Schema.Attribute.Text;
    seo_title_en: Schema.Attribute.String;
    seo_title_kk: Schema.Attribute.String;
    seo_title_ru: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.og': ContentOg;
      'content.seo': ContentSeo;
    }
  }
}
