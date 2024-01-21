import { type RouterOutputs } from "@/trpc/shared";

type Spot = RouterOutputs["studySpot"]["getAll"][number];

export type MarkerData = Pick<
  Spot,
  | "id"
  | "name"
  | "address"
  | "latitude"
  | "longitude"
  | "slug"
  | "venueType"
  | "wifi"
  | "powerOutlets"
  | "naturalViews"
  | "images"
>;
