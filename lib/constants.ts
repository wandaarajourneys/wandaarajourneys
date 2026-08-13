export const siteConfig = {
  name: "Wandaara Tours and Travel",
  shortName: "Wandaara",
  description:
    "Wandaara Tours and Travel designs unforgettable safaris, beach escapes, and trekking adventures across Kenya and East Africa.",
  url: "https://www.wandaaratours.com",
  email: "info@wandaaratours.com",
  phone: "+254702229265",
  phoneDisplay: "+254 702 229 265",
  whatsappNumber: "254702229265",
  whatsappDefaultMessage: "Hi Wandaara Tours, I'd like to inquire about...",
  address: {
    line1: "Wandaara House, Muthithi Road",
    line2: "Westlands, Nairobi, Kenya",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63755.05!2d36.80!3d-1.2683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a1a1a1a1a1a%3A0x0!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1700000000000",
  },
  social: {
    facebook: "https://facebook.com/wandaaratours",
    instagram: "https://instagram.com/wandaaratours",
    tiktok: "https://tiktok.com/@wandaaratours",
    x: "https://x.com/wandaaratours",
  },
  founded: 2011,
} as const;

export function whatsappLink(message: string = siteConfig.whatsappDefaultMessage) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:${siteConfig.phone}`;
}

export function mailtoLink(subject = "Travel Inquiry") {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`;
}
