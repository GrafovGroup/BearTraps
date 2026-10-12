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
  "Verified 16 routes, sitemap, robots, 404 and Apache configuration.",
);
