import type { SiteSettings } from "@/lib/types";

export const siteDetails = {
  name: "Pacha International Food",
  shortName: "Pacha",
  location: "Strandgaten 85, 5004 Bergen, Norway",
  phone: "949 87 665",
  phoneHref: "tel:+4794987665",
  email: "pacha.international.food@gmail.com",
  emailHref: "mailto:pacha.international.food@gmail.com",
  socialHandle: "@pachainternationalfood",
  instagramUrl: "https://www.instagram.com/pachainternationalfood/",
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
