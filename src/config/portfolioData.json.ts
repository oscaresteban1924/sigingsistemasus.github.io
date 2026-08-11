import { type PortfolioDataProps } from "./types/configDataTypes";

// Buyer-facing portfolio copy + values — the facts you're expected to make your own: identity,
// biography, the experience/stat numbers, the home intro, and the contact prompt. Presentational
// labels (SYS_SPECS captions, "Role:" / "Yrs:", scoreboard colours) stay in their components; this
// file holds only what a buyer edits. The voice is first-person singular throughout (one developer's
// portfolio) — keep it consistent if you rewrite.
const portfolioData = {
  profile: {
    tagline: "INGENIERÍA DE SISTEMAS",
    heading: "Laboratorio Computacional Geoespacial",
    role: "Ing. de Sistemas",
    years: "16 Semanas",
    bio: [
      "Bienvenido al entorno computacional de Sistemas de Información Geográfica. Esta plataforma académica está diseñada para estudiantes de Ingeniería de Sistemas que abordan el territorio como un sistema de información complejo.",
      "Aprenderás a modelar datos vectoriales y raster, gestionar bases de datos espaciales con PostGIS, implementar algoritmos de geometría computacional y construir servicios web geoespaciales interoperables.",
    ],
    shortBio:
      "Entorno de aprendizaje especializado en geometría computacional, bases de datos espaciales (PostGIS), servicios OGC, análisis geográfico y desarrollo de aplicaciones web geoespaciales.",
    meta: {
      location: "Facultad de Ingeniería",
      role: "Plataforma SIG",
      favorite: "Spatial SQL & PostGIS",
    },
    skills: [
      { label: "Bases de Datos Espaciales", pct: 95 },
      { label: "Desarrollo Web GIS", pct: 90 },
    ],
  },

  stats: {
    home: ["SEMANAS: 16", "LABORATORIOS: 06", "MÓDULOS: 04"],
    profile: ["Programa: Ing. Sistemas", "Curso: SIG", "Créditos: 3", "Horas: 96h"],
  },

  home: {
    tagline: "INGENIERÍA DE SISTEMAS",
    heading: "Sistemas de Información Geográfica",
    intro:
      "Aprende a modelar el territorio como un sistema computacional. Datos espaciales, bases de datos, APIs, interoperabilidad, análisis geográfico y desarrollo de aplicaciones geoespaciales.",
  },

  contact: {
    prompt:
      "¿Tienes dudas sobre los temas del curso, consultas sobre el entorno de desarrollo o inquietudes sobre los laboratorios?",
  },
} satisfies PortfolioDataProps;

export default portfolioData;
