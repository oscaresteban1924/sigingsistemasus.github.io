import assert from "node:assert/strict";

import type { CollectionEntry } from "astro:content";

import { estadoBadgeMeta, getAdjacentSemanas } from "./semanasData.ts";

// estadoBadgeMeta assertions
assert.deepEqual(estadoBadgeMeta("Disponible"), { label: "[Disponible]", variant: "success" });
assert.deepEqual(estadoBadgeMeta("Próximamente"), { label: "[Próximamente]", variant: "warning" });
assert.deepEqual(estadoBadgeMeta("En construcción"), {
  label: "[En Construcción]",
  variant: "secondary",
});

// Minimal stub entries
const mk = (id: string, numero: number): CollectionEntry<"semanas"> =>
  ({
    id,
    data: {
      numero,
      titulo: `Semana ${numero}`,
      descripcion: `Desc ${numero}`,
      estado: "Disponible",
    },
  }) as unknown as CollectionEntry<"semanas">;

const semanas = [mk("semana-01", 1), mk("semana-02", 2), mk("semana-03", 3)];

// getAdjacentSemanas assertions
assert.deepEqual(getAdjacentSemanas(semanas, "semana-02"), {
  prev: { href: "/semanas/semana-01/", title: "Semana 1", numero: 1 },
  next: { href: "/semanas/semana-03/", title: "Semana 3", numero: 3 },
});

assert.equal(getAdjacentSemanas(semanas, "semana-01").prev, undefined);
assert.equal(getAdjacentSemanas(semanas, "semana-03").next, undefined);
assert.deepEqual(getAdjacentSemanas(semanas, "missing"), {});

console.log("semanasData.test.ts — all assertions passed");
