import { type LegalData } from "./types/configDataTypes";

const legalData = {
  terms: {
    title: "Términos y Condiciones Académicos",
    description: "Términos de uso de la plataforma académica del curso de Sistemas de Información Geográfica.",
    lastUpdated: "2026-08-10",
    intro:
      "Los siguientes términos y condiciones rigen el uso del material académico, guías de laboratorio y recursos proporcionados en esta plataforma del curso de Sistemas de Información Geográfica para la carrera de Ingeniería de Sistemas.",
    sections: [
      {
        heading: "Uso del Material Académico",
        body: [
          "Todo el contenido publicado en este sitio tiene fines estrictamente educativos para los estudiantes del programa de Ingeniería de Sistemas.",
        ],
      },
      {
        heading: "Propiedad Intelectual y Código Libre",
        body: [
          "Los ejemplos de código, guías de SQL/PostGIS y recursos geoespaciales son de libre consulta para los estudiantes matriculados en el curso.",
        ],
      },
      {
        heading: "Uso Responsable de Servicios y APIs Geoespaciales",
        body: [
          "Los estudiantes deben hacer uso responsable de las consultas a servidores WMS/WFS y APIs externas en los laboratorios computacionales.",
        ],
      },
    ],
  },
  privacy: {
    title: "Política de Privacidad y Datos",
    description: "Información sobre el tratamiento de datos y privacidad en la plataforma estudiantil.",
    lastUpdated: "2026-08-10",
    intro:
      "Esta plataforma respeta la privacidad de los estudiantes y no recolecta información personal no autorizada.",
    sections: [
      {
        heading: "Información Académica",
        body: [
          "Los formularios de consulta recopilan únicamente el nombre y correo institucional para responder inquietudes docentes.",
        ],
      },
      {
        heading: "Galletas y Preferencias de Tema",
        body: [
          "El sitio utiliza únicamente almacenamiento local (localStorage) para guardar las preferencias visuales del tema (claro/oscuro).",
        ],
      },
    ],
  },
} satisfies LegalData;

export default legalData;
