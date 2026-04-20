import { MetadataRoute } from "next";

const BASE = "https://maeri.vercel.app";

const routes = [
  "",
  "/services",
  "/services/approvisionnement",
  "/services/raw-material-supply",
  "/services/supplier-networking",
  "/services/professional-training",
  "/services/conseil-informatique",
  "/products/construction-materials",
  "/products/industrial-pipes",
  "/products/specialized-equipment",
  "/training/basic",
  "/training/advanced",
  "/training/specialized",
  "/pricing/small-business",
  "/pricing/medium-business",
  "/pricing/large-business",
  "/about/history",
  "/about/mission",
  "/about/team",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((p) => ({
    url: `${BASE}${p}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
