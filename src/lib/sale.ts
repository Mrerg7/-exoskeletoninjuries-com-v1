export const DOMAIN = "exoskeletoninjuries.com";
export const PRICE_LABEL = "$100,000";
export const PRICE_VALUE = "100000";
export const SELLER = "Desert Rich";
export const EMAIL = "sales@desertrich.com";
export const SITE = "https://exoskeletoninjuries.com";

export const TITLE = `${DOMAIN} | Premium Domain for Sale | ${SELLER}`;
export const DESCRIPTION = `${DOMAIN} is for sale at ${PRICE_LABEL}. Exact-match .com for injury law, wearable robotics, and workplace safety. Escrow transfer. Inquire at ${EMAIL}.`;

export function mailto(subject: string, body: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const BUY_MAIL = mailto(
  `Buy ${DOMAIN} — ${PRICE_LABEL}`,
  `Hello,\n\nI would like to buy ${DOMAIN} for ${PRICE_LABEL}.\n\nPlease confirm availability and the escrow steps.\n\nName:\nEmail:\nPhone:\n\nThank you.`,
);

export const OFFER_MAIL = mailto(
  `Offer for ${DOMAIN}`,
  `Hello,\n\nI would like to make an offer on ${DOMAIN}.\n\nOffer amount:\nName:\nEmail:\nPhone:\nNote:\n\nThank you.`,
);

export const AGENT_MAIL = mailto(
  `Question about ${DOMAIN}`,
  `Hello,\n\nI have a question about acquiring ${DOMAIN}.\n\nName:\nEmail:\nQuestion:\n\nThank you.`,
);

export function productJsonLd(pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: DOMAIN,
        description: DESCRIPTION,
        inLanguage: "en-US",
        publisher: { "@id": `${SITE}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: SELLER,
        url: `${SITE}/`,
        email: EMAIL,
        description: "Premium domain acquisition.",
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: TITLE,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#domain` },
        inLanguage: "en-US",
      },
      {
        "@type": "Product",
        "@id": `${SITE}/#domain`,
        name: DOMAIN,
        category: "Domain name",
        brand: { "@type": "Brand", name: SELLER },
        description: DESCRIPTION,
        url: `${SITE}/`,
        offers: {
          "@type": "Offer",
          url: `${SITE}/`,
          priceCurrency: "USD",
          price: PRICE_VALUE,
          availability: "https://schema.org/InStock",
          seller: { "@id": `${SITE}/#organization` },
          itemCondition: "https://schema.org/NewCondition",
        },
      },
    ],
  };
}
