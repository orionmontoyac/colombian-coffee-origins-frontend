import type { Locale } from "@/app/[lang]/dictionaries";
import type { Verification } from "./lots";

/**
 * EXAMPLE DATA. The three producers come from the design boards. Story texts are
 * generic stubs marked for owner review; nothing here is a claim about the real
 * people. Replace with texts written together with each producer.
 */
export type Producer = {
  slug: string;
  name: string;
  initials: string;
  farm: string;
  town: string;
  altitudeM: number;
  varieties: string[];
  /** null = "[year]" placeholder shown on the profile */
  coffeeSince: number | null;
  verification: Verification;
  /** Short line under the name */
  tagline: Record<Locale, string>;
  /** TODO(owner): replace with a story written with the producer */
  story: Record<Locale, string>;
  lotCodes: string[];
  /** Roasted brand slug in products.ts, when the producer sells roasted coffee */
  brandSlug: string | null;
};

const storyStub = {
  en: "[Producer story placeholder: how the family started growing coffee, how the farm changed over the years, why they planted these varieties, and how they pick, ferment and dry each lot. Written together with the producer.]",
  es: "[Texto de ejemplo: cómo la familia empezó a cultivar café, cómo cambió la finca con los años, por qué sembraron estas variedades y cómo cosechan, fermentan y secan cada lote. Se escribe junto con el productor.]",
};

export const producers: Producer[] = [
  {
    slug: "luz-mery-higuita", name: "Luz Mery Higuita", initials: "LH", farm: "Finca El Mirador",
    town: "Urrao, Antioquia", altitudeM: 2150, varieties: ["Chiroso", "Castillo"], coffeeSince: null,
    verification: "farmVerified",
    tagline: {
      en: "A family farm growing Chiroso and Castillo, selling green lots and her own roasted coffee.",
      es: "Una finca familiar que cultiva Chiroso y Castillo y vende lotes verdes y su propio café tostado.",
    },
    story: storyStub, lotCodes: ["URR-024", "URR-019"], brandSlug: "el-mirador",
  },
  {
    slug: "hernan-dario-restrepo", name: "Hernán Darío Restrepo", initials: "HR", farm: "Finca La Esperanza",
    town: "Urrao, Antioquia", altitudeM: 1950, varieties: ["Castillo"], coffeeSince: null,
    verification: "farmVerified",
    tagline: {
      en: "A family farm in Urrao growing Castillo, with honey-process lots.",
      es: "Una finca familiar en Urrao que cultiva Castillo, con lotes honey.",
    },
    story: storyStub, lotCodes: ["URR-017"], brandSlug: "la-esperanza",
  },
  {
    slug: "jhon-jairo-usuga", name: "Jhon Jairo Úsuga", initials: "JU", farm: "Finca Los Naranjos",
    town: "Urrao, Antioquia", altitudeM: 2050, varieties: ["Pink Bourbon"], coffeeSince: null,
    verification: "registered",
    tagline: {
      en: "A family farm in Urrao growing Pink Bourbon, processed natural.",
      es: "Una finca familiar en Urrao que cultiva Pink Bourbon, procesado natural.",
    },
    story: storyStub, lotCodes: ["URR-031"], brandSlug: "los-naranjos",
  },
];

export const getProducer = (slug: string): Producer | undefined => producers.find((p) => p.slug === slug);
export const producerParams = () => producers.map((p) => ({ slug: p.slug }));
