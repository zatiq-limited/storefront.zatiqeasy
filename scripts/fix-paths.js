import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixImagePaths(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // Pattern 1: import something from '../../assets/image/...'
  content = content.replace(
    /import\s+(\w+)\s+from\s+['"]\.\.\/\.\.\/assets\/image\/([^'"]+)['"]/g,
    "const $1 = '/assets/$2'"
  );

  // Pattern 2: import something from '../../assets/...'
  content = content.replace(
    /import\s+(\w+)\s+from\s+['"]\.\.\/\.\.\/assets\/([^'"]+)['"]/g,
    "const $1 = '/assets/$2'"
  );

  // Pattern 3: Fix malformed imports like: from '/assets/...'
  content = content.replace(
    /import\s+(\w+)\s+from\s+['"]\/assets\/([^'"]+)['"]/g,
    "const $1 = '/assets/$2'"
  );

  // Pattern 4: Direct string paths
  content = content.replace(
    /['"]\.\.\/\.\.\/assets\/image\/([^'"]+)['"]/g,
    "'/assets/$1'"
  );

  content = content.replace(
    /['"]\.\.\/\.\.\/assets\/([^'"]+)['"]/g,
    "'/assets/$1'"
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let fixed = 0;
  let total = 0;

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const result = walkDir(filePath);
      fixed += result.fixed;
      total += result.total;
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      total++;
      if (fixImagePaths(filePath)) {
        fixed++;
        console.log(`✅ Fixed: ${filePath.replace(/\\/g, "/")}`);
      }
    }
  });

  return { fixed, total };
}

console.log("🔧 Fixing image paths in components...\n");

const result = walkDir("src/components/zatiq");

console.log(`\n📊 Summary:`);
console.log(`   Total files: ${result.total}`);
console.log(`   Fixed files: ${result.fixed}`);
console.log(`   Unchanged: ${result.total - result.fixed}`);
console.log("\n✨ Done! Restart dev server to see changes.");
