import { type SiteDataProps } from "./types/configDataTypes";

// Site metadata. Edit with your project's details.
const siteData = {
  name: "SIG · SISTEMAS",
  title: "Sistemas de Información Geográfica — Ingeniería de Sistemas",
  description:
    "Plataforma académica oficial del curso Sistemas de Información Geográfica para Ingeniería de Sistemas. Contenidos semanales, laboratorios computacionales, bases de datos espaciales y desarrollo web geoespacial.",

  author: {
    name: "Coordinación Académica SIG",
    email: "docente.sig@institucion.edu.co",
    twitter: "",
  },

  defaultImage: {
    src: "/og.jpg",
    alt: "Sistemas de Información Geográfica — Ingeniería de Sistemas",
  },

  sameAs: [],
} satisfies SiteDataProps;

export default siteData;
