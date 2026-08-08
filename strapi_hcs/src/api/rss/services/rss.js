"use strict";

const BASE_URL = "https://zhkh24.kz";
const LIMIT = 30;

const CONTENT_TYPES = [
  {
    uid: "api::new.new",
    route: "news",
    dateField: "publishDate",
    titleField: (locale) => `title_${locale}`,
    descriptionField: (locale) => `desc_${locale}`,
    imageField: "desc_img",
    categoryField: "header_cats",
  },
  {
    uid: "api::article.article",
    route: "articles",
    dateField: "publishDate",
    titleField: (locale) => `title_${locale}`,
    descriptionField: (locale) => `desc_${locale}`,
    imageField: "desc_img",
    categoryField: "categories",
  },
  {
    uid: "api::blog.blog",
    route: "blogs",
    dateField: "publishDate",
    titleField: (locale) => `title_${locale}`,
    descriptionField: (locale) => `desc_${locale}`,
    imageField: "back_img",
    categoryField: "categories",
  },
  {
    uid: "api::event.event",
    route: "events",
    dateField: "createdAt",
    titleField: (locale) => `title_${locale}`,
    descriptionField: (locale) => `desc_${locale}`,
    imageField: "desc_img",
    fallbackImageField: "cover_img",
    categoryField: "categories",
  },
  {
    uid: "api::q-and-a.q-and-a",
    route: "qna",
    dateField: "publishDate",
    titleField: (locale) => `title_${locale}`,
    descriptionField: null,
    imageField: null,
    categoryField: "categories",
    useOgImage: true,
  },
];

function escapeXml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getMediaUrl(media) {
  if (!media?.url) {
    return null;
  }

  if (media.url.startsWith("http://") || media.url.startsWith("https://")) {
    return media.url;
  }

  return `${BASE_URL}${media.url}`;
}

function getMediaType(media) {
  return media?.mime || "image/jpeg";
}

function getCategory(item, config, locale) {
  const categories = item[config.categoryField];

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const category = categories[0];

  return category?.[`name_${locale}`] || null;
}

function getImage(item, config) {
  if (config.imageField && item[config.imageField]) {
    return item[config.imageField];
  }

  if (config.fallbackImageField && item[config.fallbackImageField]) {
    return item[config.fallbackImageField];
  }

  if (config.useOgImage && item.OG?.og_image) {
    return item.OG.og_image;
  }

  if (config.useOgImage && item.SEO?.seo_image) {
    return item.SEO.seo_image;
  }

  return null;
}

function getItemUrl(config, locale, slug) {
  return `${BASE_URL}/${locale}/${config.route}/${encodeURIComponent(slug)}`;
}

function buildItem(item, config, locale) {
  const title = item[config.titleField(locale)];
  const description = config.descriptionField
    ? item[config.descriptionField(locale)]
    : null;

  const date = item[config.dateField];

  if (!title || !item.slug || !date) {
    return null;
  }

  const url = getItemUrl(config, locale, item.slug);
  const category = getCategory(item, config, locale);
  const image = getImage(item, config);

  let xml = `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
  `;

  if (description) {
    xml += `
      <description>${escapeXml(description)}</description>
    `;
  }

  if (category) {
    xml += `
      <category>${escapeXml(category)}</category>
    `;
  }

  if (image) {
    const imageUrl = getMediaUrl(image);

    if (imageUrl) {
      xml += `
      <enclosure
        url="${escapeXml(imageUrl)}"
        type="${escapeXml(getMediaType(image))}"
      />
      `;
    }
  }

  xml += `
    </item>
  `;

  return xml;
}

module.exports = {
  async generate(locale) {
    const allItems = [];

    for (const config of CONTENT_TYPES) {
      const fields = [config.titleField(locale), "slug", config.dateField];

      if (config.descriptionField) {
        fields.push(config.descriptionField(locale));
      }

      const populate = {};

      if (config.imageField) {
        populate[config.imageField] = true;
      }

      if (config.fallbackImageField) {
        populate[config.fallbackImageField] = true;
      }

      if (config.categoryField) {
        populate[config.categoryField] = {
          fields: [`name_${locale}`],
        };
      }

      if (config.useOgImage) {
        populate.OG = {
          populate: {
            og_image: true,
          },
        };

        populate.SEO = {
          populate: {
            seo_image: true,
          },
        };
      }

      const items = await strapi.documents(config.uid).findMany({
        status: "published",
        fields,
        populate,
        sort: [`${config.dateField}:desc`],
        limit: LIMIT,
      });

      for (const item of items) {
        const xml = buildItem(item, config, locale);

        if (!xml) {
          continue;
        }

        allItems.push({
          date: new Date(item[config.dateField]).getTime(),
          xml,
        });
      }
    }

    allItems.sort((a, b) => b.date - a.date);

    const itemsXml = allItems
      .slice(0, LIMIT)
      .map((item) => item.xml)
      .join("\n");

    const channelData = {
      ru: {
        title: "ЖКХ24 — последние публикации",
        description: "Последние публикации портала ЖКХ24",
      },
      kk: {
        title: "ЖКХ24 — соңғы жарияланымдар",
        description: "ЖКХ24 порталының соңғы жарияланымдары",
      },
      en: {
        title: "ZHKH24 — Latest Publications",
        description: "Latest publications from ZHKH24",
      },
    };

    const data = channelData[locale];

    const siteUrl = `${BASE_URL}/${locale}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(data.title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(data.description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

    ${itemsXml}
  </channel>
</rss>`;
  },
};
