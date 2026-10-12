import { existsSync, readFileSync } from "node:fs";
const routes = [
  "",
  "bear-traps",
  "transport-trailers",
  "warning-signage",
  "lures-supplies",
  "bear-resistant-furniture",
  "wildlife-equipment",
  "deterrence-protection",
  "government-procurement",
  "industries",
  "about",
  "contact",
  "request-quote",
  "products",
  "equipment-package",
  "product-compliance",
  "privacy",
  "terms",
];
for (const route of routes) {
  const path = "out/" + (route ? route + "/" : "") + "index.html";
  if (!existsSync(path)) throw new Error("Missing route " + path);
  if (!readFileSync(path, "utf8").includes("<h1"))
    throw new Error("Missing h1 " + path);
}
for (const file of ["sitemap.xml", "robots.txt", "404.html", ".htaccess"])
  if (!existsSync("out/" + file)) throw new Error("Missing " + file);
console.log(
  "Verified 18 routes, sitemap, robots, 404 and Apache configuration.",
);

const home = readFileSync("out/products/index.html", "utf8");
if (
  home.includes("INTERNAL TEST MANUFACTURER") ||
  home.includes("internal-fixture")
)
  throw new Error("Internal fixture leaked into export");

for (const route of routes.filter(r => !["request-quote", "equipment-package"].includes(r))) {
  const html = readFileSync("out/" + (route ? route + "/" : "") + "index.html", "utf8");
  if (/href="[^"#]*(request-quote|equipment-package)/.test(html)) throw new Error("Legacy RFQ link in " + route);
  if (/ADD REQUIREMENT TO RFQ|BUILD YOUR RFQ|PREPARE TENDER RFQ/.test(html)) throw new Error("Legacy workflow in " + route);
}
const sitemap = readFileSync("out/sitemap.xml", "utf8");
if (/request-quote|equipment-package/.test(sitemap)) throw new Error("Retired route in sitemap");
