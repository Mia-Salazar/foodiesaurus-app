export const SEARCH_PROVINCES = ["Barcelona", "Madrid", "Sevilla"] as const;

export type SearchProvince = (typeof SEARCH_PROVINCES)[number];

export const DEFAULT_SEARCH_PROVINCE: SearchProvince = "Madrid";
