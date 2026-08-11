import insumosRaw from "../generated/insumos.json" with { type: "json" };

export interface InsumoItem {
  id: string;
  nombre: string;
  filename: string;
  relativePath: string;
  extension: string;
  extensionUpper: string;
  tipo:
    | "PPTX"
    | "PDF"
    | "Notebook"
    | "Dataset"
    | "ZIP"
    | "Código"
    | "Guía"
    | "Documento"
    | "Otro"
    | string;
  categoria:
    | "Presentación"
    | "Lectura"
    | "Guía"
    | "Laboratorio"
    | "Datos"
    | "Código"
    | "Notebook"
    | "Recurso"
    | "Otro"
    | string;
  tamanoBytes: number;
  tamano: string;
  semana: number;
  slugSemana: string;
  url: string;
  mtime: string;
}

export interface InsumosManifest {
  generatedAt: string;
  totalArchivos: number;
  totalBytes: number;
  totalTamanoFormatted: string;
  archivos: InsumoItem[];
}

const manifest = insumosRaw as InsumosManifest;

/**
 * Return the raw manifest container metadata.
 */
export function getInsumosManifest(): InsumosManifest {
  return manifest;
}

/**
 * Get all inventoried insumo items.
 */
export function getInsumos(): InsumoItem[] {
  return manifest.archivos;
}

/**
 * Get insumo items for a specific week number (1..16).
 */
export function getInsumosBySemana(semanaNumero: number): InsumoItem[] {
  return manifest.archivos.filter((item) => item.semana === semanaNumero);
}

/**
 * Get transversal / unclassified items (semana === 0).
 */
export function getInsumosTransversales(): InsumoItem[] {
  return manifest.archivos.filter((item) => item.semana === 0);
}

/**
 * Get insumo items grouped by category.
 */
export function getInsumosByCategoria(categoria: string): InsumoItem[] {
  return manifest.archivos.filter((item) => item.categoria === categoria);
}
