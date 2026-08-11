import assert from "node:assert/strict";

import {
  getInsumos,
  getInsumosBySemana,
  getInsumosManifest,
  getInsumosTransversales,
} from "./insumosData.ts";

const manifest = getInsumosManifest();
assert.ok(manifest.totalArchivos >= 4, "Debe haber al menos 4 archivos inventariados");

const all = getInsumos();
assert.equal(all.length, manifest.totalArchivos);

const semana1 = getInsumosBySemana(1);
assert.ok(semana1.length >= 1, "Semana 1 debe tener al menos 1 archivo");
assert.equal(semana1[0].semana, 1);
assert.equal(semana1[0].extensionUpper, "PPTX");

const transversales = getInsumosTransversales();
assert.ok(transversales.length >= 1, "Debe haber al menos 1 archivo transversal");
assert.equal(transversales[0].semana, 0);

console.log("insumosData.test.ts — todas las aserciones pasaron correctamente");
