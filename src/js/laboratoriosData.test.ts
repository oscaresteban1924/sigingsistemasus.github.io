import assert from "node:assert/strict";
import type { CollectionEntry } from "astro:content";
import {
  dificultadBadgeMeta,
  faseBadgeMeta,
  getAdjacentLaboratorios,
} from "./laboratoriosData.ts";

assert.deepEqual(dificultadBadgeMeta("Principiante"), { label: "[Principiante]", variant: "success" });
assert.deepEqual(dificultadBadgeMeta("Intermedio"), { label: "[Intermedio]", variant: "warning" });
assert.deepEqual(dificultadBadgeMeta("Avanzado"), { label: "[Avanzado]", variant: "secondary" });

assert.deepEqual(faseBadgeMeta("CONCEPTO"), { label: "1. CONCEPTO", variant: "primary" });
assert.deepEqual(faseBadgeMeta("CÓDIGO"), { label: "4. CÓDIGO", variant: "success" });

const mk = (id: string, numero: number): CollectionEntry<"laboratorios"> =>
  ({
    id,
    data: {
      numero,
      titulo: `Lab ${numero}`,
      descripcion: `Desc ${numero}`,
      estado: "Disponible",
    },
  }) as unknown as CollectionEntry<"laboratorios">;

const labs = [mk("lab-01", 1), mk("lab-02", 2), mk("lab-03", 3)];

assert.deepEqual(getAdjacentLaboratorios(labs, "lab-02"), {
  prev: { href: "/laboratorios/lab-01/", title: "Lab 1", numero: 1 },
  next: { href: "/laboratorios/lab-03/", title: "Lab 3", numero: 3 },
});

console.log("laboratoriosData.test.ts — todas las aserciones pasaron correctamente");
