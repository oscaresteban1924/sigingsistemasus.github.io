import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, "../dist");
const BASE_PATH = "/sigingsistemasus.github.io";

async function walk(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await walk(filePath));
    } else if (filePath.endsWith(".html")) {
      results.push(filePath);
    }
  }
  return results;
}

async function checkLinks() {
  console.log("🔍 Checking internal links in dist/ directory...");

  let hasErrors = false;
  let totalFiles = 0;
  let totalErrors = 0;

  try {
    const files = await walk(DIST_DIR);

    for (const file of files) {
      totalFiles++;
      const content = await fs.readFile(file, "utf-8");
      const relativeFilePath = path.relative(DIST_DIR, file);

      // Match href="/..." or src="/..." or srcset="/..."
      // We look for attributes that start with a forward slash.
      const regex = /(?:href|src|srcset)=["'](\/[^"']*)["']/g;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const url = match[1];

        // Exclude allowed URLs or URLs that correctly start with BASE_PATH
        if (url.startsWith(BASE_PATH)) {
          continue;
        }

        hasErrors = true;
        totalErrors++;
        console.error(`❌ Error in ${relativeFilePath}:`);
        console.error(`   Found root-relative URL missing base path: ${url}`);
      }
    }

    if (hasErrors) {
      console.error(
        `\n💥 Link check failed! Found ${totalErrors} root-relative URLs missing the '${BASE_PATH}' base path across ${totalFiles} files.`,
      );
      console.error(
        "   Fix these by using the sitePath() helper or wrapping with import.meta.env.BASE_URL.",
      );
      process.exit(1);
    } else {
      console.log(
        `\n✅ All internal links in ${totalFiles} HTML files are correctly prefixed with '${BASE_PATH}'.`,
      );
      process.exit(0);
    }
  } catch (err) {
    console.error("Error during link checking:", err);
    process.exit(1);
  }
}

checkLinks();
