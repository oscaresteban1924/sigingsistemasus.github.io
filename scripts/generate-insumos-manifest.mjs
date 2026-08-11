// scripts/generate-insumos-manifest.mjs
// Build-time inventory generator for INSUMOS_SIG -> public/insumos/ & src/generated/insumos.json

import fs from "node:fs";
import path from "node:path";

const CWD = process.cwd();
const INSUMOS_DIR = path.resolve(CWD, "INSUMOS_SIG");
const PUBLIC_INSUMOS_DIR = path.resolve(CWD, "public/insumos");
const GENERATED_DIR = path.resolve(CWD, "src/generated");
const MANIFEST_PATH = path.resolve(GENERATED_DIR, "insumos.json");

// Whitelist of allowed extensions for public publishing
const ALLOWED_EXTENSIONS = new Set([
  ".pptx",
  ".ppt",
  ".pdf",
  ".ipynb",
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".geojson",
  ".gpkg",
  ".shp",
  ".dbf",
  ".shx",
  ".tif",
  ".tiff",
  ".csv",
  ".json",
  ".py",
  ".sql",
  ".md",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
]);

// Ignored filenames & patterns
const IGNORED_FILES = new Set([".ds_store", "thumbs.db", "desktop.ini", ".gitkeep"]);

function isIgnored(filename) {
  const lower = filename.toLowerCase();
  if (IGNORED_FILES.has(lower)) return true;
  if (lower.startsWith("~$")) return true; // Temporary Office locks
  if (lower.startsWith(".")) return true; // Hidden files
  return false;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val < 10 && i > 0 ? 1 : 0)} ${sizes[i]}`;
}

function detectSemana(filePath, filename) {
  // Check filename and relative directory path for week markers
  const fullString = `${filePath} ${filename}`;
  const semanaMatch =
    fullString.match(/semana[_\s-]*0*(\d+)/i) ||
    fullString.match(/[/_]s0*(\d+)/i) ||
    fullString.match(/^0*(\d+)[_\s-]/);

  if (semanaMatch) {
    const num = parseInt(semanaMatch[1], 10);
    if (!isNaN(num) && num > 0 && num <= 16) {
      return num;
    }
  }
  return 0; // Transversal / Sin clasificar
}

function detectTipoYCategoria(ext, filename) {
  const lowerExt = ext.toLowerCase();
  const lowerName = filename.toLowerCase();

  if (lowerExt === ".pptx" || lowerExt === ".ppt") {
    return { tipo: "PPTX", categoria: "Presentación" };
  }
  if (lowerExt === ".pdf") {
    if (lowerName.includes("guia") || lowerName.includes("taller") || lowerName.includes("lab")) {
      return { tipo: "PDF", categoria: "Guía" };
    }
    return { tipo: "PDF", categoria: "Lectura" };
  }
  if (lowerExt === ".ipynb") {
    return { tipo: "Notebook", categoria: "Notebook" };
  }
  if ([".zip", ".rar", ".7z", ".tar", ".gz"].includes(lowerExt)) {
    if (lowerName.includes("lab") || lowerName.includes("taller")) {
      return { tipo: "ZIP", categoria: "Laboratorio" };
    }
    return { tipo: "ZIP", categoria: "Datos" };
  }
  if ([".geojson", ".gpkg", ".shp", ".dbf", ".shx", ".tif", ".tiff", ".csv"].includes(lowerExt)) {
    return { tipo: "Dataset", categoria: "Datos" };
  }
  if (lowerExt === ".py" || lowerExt === ".sql") {
    return { tipo: "Código", categoria: "Código" };
  }
  if ([".md", ".doc", ".docx"].includes(lowerExt)) {
    return { tipo: "Documento", categoria: "Guía" };
  }

  return { tipo: "Otro", categoria: "Otro" };
}

function generateCleanTitle(filename, ext) {
  const base = filename.slice(0, filename.length - ext.length);
  // Replace underscores and dots with spaces except preserved acronyms
  let title = base.replace(/[_-]/g, " ").trim();
  // If it's like "Semana 1", make it "Presentación de Clase — Semana 1"
  if (/^semana\s*\d+$/i.test(title)) {
    return `Presentación Oficial de Clase — ${title}`;
  }
  if (/^sistemas\.de\.informacion\.geografica$/i.test(base)) {
    return "Texto Guía General — Sistemas de Información Geográfica";
  }
  return title;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function scanDirectory(dirPath, relativeBase = "") {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(relativeBase, entry.name).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
        results = results.concat(scanDirectory(fullPath, relPath));
      }
    } else if (entry.isFile()) {
      if (isIgnored(entry.name)) {
        console.log(`[manifest] Ignorando archivo: ${relPath}`);
        continue;
      }

      const ext = path.extname(entry.name);
      if (!ALLOWED_EXTENSIONS.has(ext.toLowerCase())) {
        console.log(`[manifest] Omitiendo extensión no permitida: ${relPath} (${ext})`);
        continue;
      }

      const stats = fs.statSync(fullPath);
      const semana = detectSemana(relPath, entry.name);
      const { tipo, categoria } = detectTipoYCategoria(ext, entry.name);
      const nombre = generateCleanTitle(entry.name, ext);
      const id = slugify(`${entry.name}-${semana}`);
      const slugSemana = semana > 0 ? `semana-${String(semana).padStart(2, "0")}` : "transversal";
      const publicUrl = `/insumos/${relPath}`;

      results.push({
        id,
        nombre,
        filename: entry.name,
        relativePath: relPath,
        extension: ext.toLowerCase(),
        extensionUpper: ext.replace(".", "").toUpperCase(),
        tipo,
        categoria,
        tamanoBytes: stats.size,
        tamano: formatBytes(stats.size),
        semana,
        slugSemana,
        url: publicUrl,
        mtime: stats.mtime.toISOString(),
        sourcePath: fullPath,
      });
    }
  }

  return results;
}

function syncFilesToPublic(items) {
  if (!fs.existsSync(PUBLIC_INSUMOS_DIR)) {
    fs.mkdirSync(PUBLIC_INSUMOS_DIR, { recursive: true });
  }

  const copiedRelPaths = new Set();

  for (const item of items) {
    const targetPath = path.join(PUBLIC_INSUMOS_DIR, item.relativePath);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    copiedRelPaths.add(item.relativePath);

    // Copy file if not exists or size/mtime differs
    let shouldCopy = true;
    if (fs.existsSync(targetPath)) {
      const targetStat = fs.statSync(targetPath);
      if (targetStat.size === item.tamanoBytes) {
        shouldCopy = false;
      }
    }

    if (shouldCopy) {
      console.log(`[manifest] Sincronizando insumo -> public/insumos/${item.relativePath}`);
      fs.copyFileSync(item.sourcePath, targetPath);
    }
  }

  return copiedRelPaths;
}

function main() {
  console.log("=== GENERANDO MANIFIESTO DE INSUMOS SIG ===");

  if (!fs.existsSync(INSUMOS_DIR)) {
    console.warn(`[WARN] La carpeta INSUMOS_SIG no existe en ${INSUMOS_DIR}`);
    fs.mkdirSync(INSUMOS_DIR, { recursive: true });
  }

  const items = scanDirectory(INSUMOS_DIR);
  console.log(`[manifest] ${items.length} archivo(s) válido(s) inventariado(s).`);

  // Sync files to public/insumos/
  syncFilesToPublic(items);

  // Prepare JSON manifest payload (exclude local sourcePath)
  const manifestData = {
    generatedAt: new Date().toISOString(),
    totalArchivos: items.length,
    totalBytes: items.reduce((acc, cur) => acc + cur.tamanoBytes, 0),
    totalTamanoFormatted: formatBytes(items.reduce((acc, cur) => acc + cur.tamanoBytes, 0)),
    archivos: items.map((item) => {
      const clean = { ...item };
      delete clean.sourcePath;
      return clean;
    }),
  };

  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifestData, null, 2), "utf-8");
  console.log(`[manifest] Manifiesto guardado con éxito en: ${MANIFEST_PATH}`);

  // Summary breakdown
  const porSemana = {};
  for (const item of manifestData.archivos) {
    const k = item.semana > 0 ? `Semana ${item.semana}` : "Transversal";
    porSemana[k] = (porSemana[k] || 0) + 1;
  }

  console.log("[manifest] Resumen por semanas:");
  for (const [sem, count] of Object.entries(porSemana)) {
    console.log(`  - ${sem}: ${count} archivo(s)`);
  }
}

main();
