export const dynamic = "force-static";
import { siteUrl } from "@/lib/catalog";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: siteUrl + "/sitemap.xml",
  };
}
