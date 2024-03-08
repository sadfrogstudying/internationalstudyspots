export const MAX_FEATURED_IMAGES = 4;

export const spotBooleanFilters = [
  { readable: "Power Outlets", name: "powerOutlets" },
  { readable: "Wifi", name: "wifi" },
  { readable: "Natural Views", name: "naturalViews" },
  { readable: "Can Study For Long", name: "canStudyForLong" },
  { readable: "Sunlight", name: "sunlight" },
  { readable: "Drinks", name: "drinks" },
  { readable: "Food", name: "food" },
] as const;

export const filterKeys = [
  "naturalViews",
  "powerOutlets",
  "wifi",
  "canStudyForLong",
  "sunlight",
  "drinks",
  "food",
  "country",
];
