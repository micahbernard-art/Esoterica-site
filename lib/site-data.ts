export const WHATSAPP_NUMBER = "51919623379";

export const socialLinks = {
  instagram: "https://www.instagram.com/esoterica.cix/",
  tiktok: "https://www.tiktok.com/@esoterica.cix",
};

export const bookLinks = {
  amazon:
    "https://www.amazon.com/dp/B0F2629VPZ?ref=cm_sw_r_ffobk_cp_ud_dp_CDBHWKYGA5N8XW65P788&ref_=cm_sw_r_ffobk_cp_ud_dp_CDBHWKYGA5N8XW65P788&social_share=cm_sw_r_ffobk_cp_ud_dp_CDBHWKYGA5N8XW65P788&bestFormat=true&csmig=1",
  hotmart:
    "https://hotmart.com/es/marketplace/productos/hagsxd-aprende-a-leer-el-tarot-desde-cero-c1ig9/E100963852M",
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  imageScale?: number;
  featured?: boolean;
};

const unsplashImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const featuredCatalog: CatalogItem[] = [
  {
    id: "tarot-celestial",
    name: "Barajas de tarot",
    category: "Tarot",
    description:
      "Consulta por los mazos disponibles y recibe orientación para elegir el más adecuado para ti.",
    image: unsplashImage("photo-1671013033219-c5f37fc92a71"),
    imageAlt: "Cartas de tarot sobre una mesa",
    imagePosition: "60% 50%",
    imageScale: 1.04,
  },
  {
    id: "cristales",
    name: "Cristales seleccionados",
    category: "Cristales",
    description:
      "Pregunta por la selección disponible, sus tamaños y las opciones de entrega.",
    image: unsplashImage("photo-1626470408813-f0059745d58b"),
    imageAlt: "Cristales de amatista en tonos violetas",
  },
  {
    id: "velas",
    name: "Velas y elementos rituales",
    category: "Rituales",
    description:
      "Conoce los elementos disponibles para acompañar tus momentos de intención y reflexión.",
    image: unsplashImage("photo-1641374069464-61371f667a4b"),
    imageAlt: "Velas encendidas en un ambiente tenue",
  },
];

export const tarotCatalog: CatalogItem[] = [
  {
    id: "rider-waite",
    name: "Tarot clásico Rider-Waite",
    category: "Mazo de tarot",
    description:
      "Una opción reconocible para quienes desean comenzar o profundizar su práctica.",
    image: unsplashImage("photo-1671013033219-c5f37fc92a71"),
    imageAlt: "Cartas de tarot de estilo clásico",
    imagePosition: "60% 50%",
    imageScale: 1.04,
    featured: true,
  },
  {
    id: "tarot-lunar",
    name: "Tarot de inspiración lunar",
    category: "Mazo de tarot",
    description:
      "Una alternativa visual para quienes conectan con el simbolismo lunar y celestial.",
    image: unsplashImage("photo-1761706280224-9b7ded86c42d"),
    imageAlt: "Mazo de tarot con detalles de inspiración celestial",
    imagePosition: "50% 50%",
    imageScale: 1.02,
    featured: true,
  },
  {
    id: "oraculo",
    name: "Cartas oráculo",
    category: "Oráculo",
    description:
      "Cartas pensadas para acompañar la reflexión personal y la práctica intuitiva.",
    image: unsplashImage("photo-1637757960303-6b152b77e161"),
    imageAlt: "Cartas oráculo dispuestas para una lectura",
    imagePosition: "70% 52%",
    imageScale: 1.06,
  },
  {
    id: "ediciones-especiales",
    name: "Ediciones especiales",
    category: "Colección",
    description:
      "Consulta por mazos con acabados, ilustraciones y estilos fuera de las ediciones clásicas.",
    image: unsplashImage("photo-1736594533033-13a135f687cf"),
    imageAlt: "Cartas de tarot de edición ilustrada",
    imagePosition: "38% 58%",
    imageScale: 1.02,
  },
  {
    id: "kit-tarot",
    name: "Kits para lectura de tarot",
    category: "Kit",
    description:
      "Pregunta por combinaciones disponibles de mazo y complementos para tu práctica.",
    image: unsplashImage("photo-1761706280230-e2a1067451f3"),
    imageAlt: "Elementos organizados para una lectura de tarot",
    imagePosition: "50% 50%",
    imageScale: 1.02,
  },
  {
    id: "tarot-oscuro",
    name: "Tarot de tonos oscuros",
    category: "Mazo de tarot",
    description:
      "Una propuesta de estética intensa para quienes prefieren una baraja de tonos profundos.",
    image: unsplashImage("photo-1616410080709-f3514d88666a"),
    imageAlt: "Cartas de tarot en una composición de tonos oscuros",
    imagePosition: "50% 45%",
    imageScale: 1.03,
  },
];

export const readingTiers = [
  {
    id: "express",
    name: "Lectura Express",
    description: "Una pregunta específica para orientar una situación puntual.",
    price: 25,
    duration: "30 minutos",
    features: [
      "Una pregunta enfocada",
      "Lectura de 3 cartas",
      "Interpretación directa",
      "Resumen por WhatsApp",
    ],
  },
  {
    id: "completa",
    name: "Lectura Completa",
    description: "Una exploración más amplia de tu situación actual.",
    price: 70,
    duration: "60 minutos",
    featured: true,
    features: [
      "Hasta 3 preguntas",
      "Lectura de Cruz Celta",
      "Análisis detallado",
      "Foto de la tirada",
      "Resumen personalizado",
    ],
  },
  {
    id: "premium",
    name: "Lectura Premium",
    description: "Una sesión extendida para explorar varios aspectos con calma.",
    price: 95,
    duration: "90 minutos",
    features: [
      "Preguntas durante la sesión",
      "Múltiples tiradas según la consulta",
      "Interpretación detallada",
      "Foto de las tiradas",
      "Audio con la interpretación",
      "Seguimiento por 7 días",
    ],
  },
];
