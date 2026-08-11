import type { BadgeVariant } from "@components/ui/badge";
import type { CollectionEntry } from "astro:content";

export type LabDificultad = "Principiante" | "Intermedio" | "Avanzado";
export type LabFase =
  | "CONCEPTO"
  | "REPRESENTACIÓN"
  | "ALGORITMO"
  | "CÓDIGO"
  | "RESULTADO"
  | "INTERPRETACIÓN";

/**
 * Map lab dificultad to badge variant & label.
 */
export function dificultadBadgeMeta(dificultad: LabDificultad): {
  label: string;
  variant: BadgeVariant;
} {
  switch (dificultad) {
    case "Principiante":
      return { label: "[Principiante]", variant: "success" };
    case "Intermedio":
      return { label: "[Intermedio]", variant: "warning" };
    case "Avanzado":
      return { label: "[Avanzado]", variant: "secondary" };
    default:
      return { label: `[${dificultad}]`, variant: "primary" };
  }
}

/**
 * Map lab pedagogical phase to retro badge variant & label.
 */
export function faseBadgeMeta(fase: LabFase): { label: string; variant: BadgeVariant } {
  switch (fase) {
    case "CONCEPTO":
      return { label: "1. CONCEPTO", variant: "primary" };
    case "REPRESENTACIÓN":
      return { label: "2. REPRESENTACIÓN", variant: "secondary" };
    case "ALGORITMO":
      return { label: "3. ALGORITMO", variant: "warning" };
    case "CÓDIGO":
      return { label: "4. CÓDIGO", variant: "success" };
    case "RESULTADO":
      return { label: "5. RESULTADO", variant: "info" };
    case "INTERPRETACIÓN":
      return { label: "6. INTERPRETACIÓN", variant: "success" };
    default:
      return { label: fase, variant: "primary" };
  }
}

/**
 * Fetch all `laboratorios` entries sorted by `numero` ascending.
 */
export async function getSortedLaboratorios(): Promise<CollectionEntry<"laboratorios">[]> {
  const { getCollection } = await import("astro:content");
  const all = await getCollection("laboratorios", (entry) => !entry.data.draft);
  return all.sort((a, b) => a.data.numero - b.data.numero);
}

export interface AdjacentLabLink {
  href: string;
  title: string;
  numero: number;
}

/**
 * Prev / next neighbours of a lab.
 */
export function getAdjacentLaboratorios(
  sorted: readonly CollectionEntry<"laboratorios">[],
  id: string,
): { prev?: AdjacentLabLink; next?: AdjacentLabLink } {
  const i = sorted.findIndex((e) => e.id === id);
  if (i === -1) return {};
  const link = (e?: CollectionEntry<"laboratorios">): AdjacentLabLink | undefined =>
    e ? { href: `/laboratorios/${e.id}/`, title: e.data.titulo, numero: e.data.numero } : undefined;
  return { prev: link(sorted[i - 1]), next: link(sorted[i + 1]) };
}
