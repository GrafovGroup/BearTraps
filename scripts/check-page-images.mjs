import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const images = JSON.parse(await readFile("content/page-images.json", "utf8"));
for (const key of ["id", "sourceSha256", "source"])
  assert.equal(
    new Set(images.map((image) => image[key])).size,
    images.length,
    `Duplicate image ${key}`,
  );
for (const image of images) {
  assert.ok(image.alt && image.source && image.license);
  for (const variant of image.variants) {
    const bytes = await readFile(`public${variant.src}`);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      variant.sha256,
      variant.src,
    );
    assert.equal(bytes.length, variant.bytes);
  }
}
async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}
const placements = [];
for (const path of await htmlFiles("out")) {
  const html = await readFile(path, "utf8");
  for (const match of html.matchAll(/data-photo-id="([^"]+)"/g))
    placements.push({ id: match[1], path });
}
assert.equal(
  placements.length,
  images.length,
  "Each image must appear exactly once in exported HTML",
);
for (const image of images) {
  const found = placements.filter((placement) => placement.id === image.id);
  assert.equal(found.length, 1, `Image reuse: ${image.id}`);
  assert.equal(
    found[0].path,
    `out${image.page}index.html`,
    `Wrong image placement: ${image.id}`,
  );
}
console.log(
  `${images.length} unique images: hashes, source records and single exported placements verified.`,
);
