/** Urrao, Antioquia. Coordinates are the municipality's, not any farm's. */
export const URRAO_GEO = { "@type": "GeoCoordinates", latitude: 6.3167, longitude: -76.1333 } as const;

/** Example harvest calendar (months 1-12). TODO(owner): confirm with each producer before launch. */
export const harvestCalendar: number[][] = [
  [4, 5, 6, 7], // main harvest
  [10, 11, 12], // smaller second harvest
];
