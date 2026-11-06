import fs from "node:fs";
import path from "node:path";

const images = [
  "IMG-20261106-WA0069.jpg",
  "IMG-20261106-WA0070.jpg",
  "IMG-20261106-WA0071.jpg",
  "IMG-20261106-WA0072.jpg",
  "IMG-20261106-WA0073.jpg",
  "IMG-20261106-WA0074.jpg",
];

const directory = path.join(process.cwd(), "public", "products");
let missing = 0;

for (const image of images) {
  const exists = fs.existsSync(path.join(directory, image));
  if (!exists) missing += 1;
  console.log(`${exists ? "OK     " : "MISSING"}  public/products/${image}`);
}

const handWash = fs.existsSync(path.join(directory, "hand-liquid-wash.svg"));
console.log(`${handWash ? "OK     " : "MISSING"}  public/products/hand-liquid-wash.svg (concept placeholder)`);

if (missing > 0) {
  console.log(
    `\n${missing} official floor-cleaner photograph(s) missing. Add the six uploaded JPG files with the exact names above.`,
  );
  process.exitCode = 1;
} else {
  console.log("\nAll six official floor-cleaner photographs are present.");
}
