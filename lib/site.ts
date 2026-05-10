import type { SiteSettings } from "@/lib/types";

export const siteDetails = {
  name: "Pasha International Food & Bar",
  shortName: "Pasha",
  displayName: "PASHA",
  descriptor: "International Food & Bar",
  logoPath: "/images/pashalogo.jpg",
  location: "Strandgaten 85, 5004 Bergen, Norway",
  phone: "949 87 665",
  phoneHref: "tel:+4794987665",
  email: "pasha.international.food@gmail.com",
  emailHref: "mailto:pasha.international.food@gmail.com",
  socialHandle: "@pashainternationalfood",
  instagramUrl: "https://www.instagram.com/pashainternationalfood/",
};

export const fallbackSettings: SiteSettings = {
  id: "main",
  hero_headline: siteDetails.name,
  hero_subcopy: "A luxurious culinary journey in Bergen.",
  foodora_url: process.env.NEXT_PUBLIC_FOODORA_URL || "https://www.foodora.no/",
  opening_hours: "Daily 12:00-22:00",
  hero_image_path: "/images/polloalaparrila.jpg",
  og_image_path: "/images/polloalaparrila.jpg",
  created_at: new Date(0).toISOString(),
  updated_at: new Date(0).toISOString(),
};

export function applyCurrentBranding(settings: SiteSettings): SiteSettings {
  const headline = settings.hero_headline.trim();

  if (headline === "Pacha" || headline === "Pacha International Food" || headline === "Pacha International Food & Bar") {
    return { ...settings, hero_headline: siteDetails.name };
  }

  return {
    ...settings,
    hero_headline: settings.hero_headline.replaceAll("Pacha", siteDetails.shortName),
    hero_subcopy: settings.hero_subcopy.replaceAll("Pacha", siteDetails.shortName),
  };
}

export const reservationTimes = [
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];
