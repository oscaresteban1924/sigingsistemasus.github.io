import type { BadgeVariant } from "@components/ui/badge";
import type { CollectionEntry } from "astro:content";

export type SemanaEstado = "Disponible" | "Próximamente" | "En construcción";

/**
 * Map academic estado to retro UI badge variant & label.
 */
export function estadoBadgeMeta(estado: SemanaEstado): { label: string; variant: BadgeVariant } {
  switch (estado) {
    case "Disponible":
      return { label: "[Disponible]", variant: "success" };
    case "Próximamente":
      return { label: "[Próximamente]", variant: "warning" };
    case "En construcción":
      return { label: "[En Construcción]", variant: "secondary" };
    default:
      return { label: `[${estado}]`, variant: "primary" };
  }
}

/**
 * Fetch all `semanas` entries sorted by `numero` ascending (Semana 1 -> Semana 16).
 */
export async function getSortedSemanas(): Promise<CollectionEntry<"semanas">[]> {
  const { getCollection } = await import("astro:content");
  const all = await getCollection("semanas", (entry) => !entry.data.draft);
  return all.sort((a, b) => a.data.numero - b.data.numero);
}

export interface AdjacentSemanaLink {
  href: string;
  title: string;
  numero: number;
}

/**
 * Prev (earlier) / next (later) neighbours of a week.
 */
export function getAdjacentSemanas(
  sorted: readonly CollectionEntry<"semanas">[],
  id: string,
): { prev?: AdjacentSemanaLink; next?: AdjacentSemanaLink } {
  const i = sorted.findIndex((e) => e.id === id);
  if (i === -1) return {};
  const link = (e?: CollectionEntry<"semanas">): AdjacentSemanaLink | undefined =>
    e ? { href: `/semanas/${e.id}/`, title: e.data.titulo, numero: e.data.numero } : undefined;
  return { prev: link(sorted[i - 1]), next: link(sorted[i + 1]) };
}
