/**
 * schema.org structured data for the public pages. Only state what the pages
 * themselves show: no ratings, review counts or customer numbers.
 */
import { SITE, absoluteUrl } from "../config/site";
import { faqs, pricingPlans } from "../pages/landing/pricing-data";

type Schema = Record<string, unknown>;

const ctx = "https://schema.org";
const ORG_ID = `${absoluteUrl("/")}#organization`;
const SITE_ID = `${absoluteUrl("/")}#website`;
const APP_ID = `${absoluteUrl("/")}#software`;

export const SOFTWARE_DESCRIPTION =
  "Gym management software for Nigeria and Africa: member profiles, payment tracking for cash, transfers and cards, and automatic WhatsApp and SMS renewal reminders.";

export function organizationSchema(): Schema {
  return {
    "@context": ctx,
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(SITE.logo),
    email: SITE.email,
    address: { "@type": "PostalAddress", addressLocality: SITE.locality, addressCountry: SITE.countryCode },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: SITE.email,
      availableLanguage: "English",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00:00+01:00",
        closes: "18:00:00+01:00",
      },
    },
  };
}

export function websiteSchema(): Schema {
  return {
    "@context": ctx,
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE.name,
    url: absoluteUrl("/"),
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

export function softwareSchema(): Schema {
  return {
    "@context": ctx,
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SOFTWARE_DESCRIPTION,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Gym management software",
    operatingSystem: "Web",
    image: absoluteUrl(SITE.ogImage),
    publisher: { "@id": ORG_ID },
    offers: pricingPlans.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} plan`,
      description: plan.description,
      price: plan.price.monthly,
      priceCurrency: "NGN",
      url: absoluteUrl("/pricing"),
      ...(plan.price.monthly > 0 && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plan.price.monthly,
          priceCurrency: "NGN",
          unitCode: "MON",
          referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
        },
      }),
    })),
  };
}

export function faqSchema(): Schema {
  return {
    "@context": ctx,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function webPageSchema(type: "AboutPage" | "ContactPage", path: string, name: string): Schema {
  return {
    "@context": ctx,
    "@type": type,
    url: absoluteUrl(path),
    name,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
}
