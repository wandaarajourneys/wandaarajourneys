export const siteConfig = {
  name: "Wandaara Tours and Travel",
  shortName: "Wandaara",
  description:
    "Wandaara Tours and Travel designs unforgettable safaris, beach escapes, and trekking adventures across Kenya and East Africa.",
  url: "https://www.wandaaratours.com",
  email: "wandaarajourneys@gmail.com",
  phone: "+254702229265",
  phoneDisplay: "+254 702 229 265",
  whatsappNumber: "254702229265",
  whatsappDefaultMessage: "Jambo Wandaara Tours! I am interested in planning a safari and would love some more information.",
  social: {
    facebook: "https://facebook.com/wandaaratours",
    instagram: "https://instagram.com/wandaaratours",
    tiktok: "https://tiktok.com/@wandaaratours",
    x: "https://x.com/wandaaratours",
  },
} as const;

export function whatsappLink(message: string = siteConfig.whatsappDefaultMessage) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telLink() {
  return `tel:${siteConfig.phone}`;
}

export function mailtoLink(subject = "Travel Inquiry") {
  const body = `Hello Wandaara Tours team,\n\nI am interested in learning more about your packages. Please let me know the next steps.\n\nThank you!`;
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
