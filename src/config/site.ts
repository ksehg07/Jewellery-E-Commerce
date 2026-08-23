export const siteConfig = {
  name: "Parth Jewellers",

  description:
    "Timeless jewellery crafted for every celebration.",

  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  navigation: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "About Us",
      href: "/about",
    },
  ],

  contact: {
    phone: "",
    email: "",
    address: "",
  },
} as const;