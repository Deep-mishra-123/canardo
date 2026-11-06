import fs from "node:fs";
import path from "node:path";

const forbidden = ["CAR", "NARDO"].join("");
const roots = ["app", "components", "lib", "data", "scripts", "public", "supabase"];
const extensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".css",
  ".sql",
  ".svg",
  ".md",
  ".json",
]);
let matches = 0;

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!extensions.has(path.extname(entry.name).toLowerCase())) continue;
    const content = fs.readFileSync(fullPath, "utf8");
    if (content.includes(forbidden)) {
      console.log(`Found incorrect brand spelling in ${fullPath}`);
      matches += 1;
    }
  }
}

for (const root of roots) {
  const directory = path.join(process.cwd(), root);
  if (fs.existsSync(directory)) walk(directory);
}

if (matches > 0) {
  process.exitCode = 1;
} else {
  console.log("Brand check passed: CANARDO is used consistently.");
}
