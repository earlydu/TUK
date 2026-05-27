import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
    "https://tuk.co.uk";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-otp"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
