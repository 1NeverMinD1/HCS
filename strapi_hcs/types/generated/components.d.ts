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

export interface ContentSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_content_social_links';
  info: {
    displayName: 'social-link';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      [
        'instagram',
        'telegram',
        'facebook',
        'whatsapp',
        'youtube',
        'website',
        'email',
      ]
    >;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentTable extends Struct.ComponentSchema {
  collectionName: 'components_content_tables';
  info: {
    displayName: 'Table';
  };
  attributes: {};
}

export interface FooterFooterRichText extends Struct.ComponentSchema {
  collectionName: 'components_footer_footer_rich_texts';
  info: {
    displayName: 'FooterRichText';
  };
  attributes: {
    content_en: Schema.Attribute.Blocks;
    content_kk: Schema.Attribute.Blocks;
    content_ru: Schema.Attribute.Blocks;
    OG: Schema.Attribute.Component<'content.og', false>;
    SEO: Schema.Attribute.Component<'content.seo', false>;
  };
}

export interface QandALaw extends Struct.ComponentSchema {
  collectionName: 'components_qand_a_laws';
  info: {
    displayName: 'Law';
  };
  attributes: {
    law_content_en: Schema.Attribute.Blocks;
    law_content_kk: Schema.Attribute.Blocks;
    law_content_ru: Schema.Attribute.Blocks;
  };
}

export interface QandAPractice extends Struct.ComponentSchema {
  collectionName: 'components_qand_a_practices';
  info: {
    displayName: 'Practice';
  };
  attributes: {
    practice_content_en: Schema.Attribute.Blocks;
    practice_content_kk: Schema.Attribute.Blocks;
    practice_content_ru: Schema.Attribute.Blocks;
  };
}

export interface QandAShortAnswer extends Struct.ComponentSchema {
  collectionName: 'components_qand_a_short_answers';
  info: {
    displayName: 'ShortAnswer';
  };
  attributes: {
    shortanswer_content_en: Schema.Attribute.Blocks;
    shortanswer_content_kk: Schema.Attribute.Blocks;
    shortanswer_content_ru: Schema.Attribute.Blocks;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.og': ContentOg;
      'content.seo': ContentSeo;
      'content.social-link': ContentSocialLink;
      'content.table': ContentTable;
      'footer.footer-rich-text': FooterFooterRichText;
      'qand-a.law': QandALaw;
      'qand-a.practice': QandAPractice;
      'qand-a.short-answer': QandAShortAnswer;
    }
  }
}
