import { z, boolean, string } from "zod";
import { FileListImagesSchema } from "./file-list-images";

const latitudeSchema = z.coerce
  .number()
  .min(-90)
  .max(90)
  .transform((val) => (val === 0 ? undefined : val))
  .optional();

const longitudeSchema = z.coerce
  .number()
  .min(-180)
  .max(180)
  .transform((val) => (val === 0 ? undefined : val))
  .optional();

const stringSchema = string().max(100).optional();

export const spotBooleanSchema = z.object({
  powerOutlets: boolean(),
  wifi: boolean(),
  canStudyForLong: boolean().optional(),
  sunlight: boolean().optional(),
  drinks: boolean().optional(),
  food: boolean().optional(),
  naturalViews: boolean().optional(),
});
export type SpotBooleanSchema = z.infer<typeof spotBooleanSchema>;

export const spotStringSchema = z.object({
  name: stringSchema,
  website: stringSchema,
  description: stringSchema,
  noiseLevel: stringSchema,
  venueType: stringSchema,
  placeId: stringSchema,
  address: stringSchema,
  country: stringSchema,
  city: stringSchema,
  state: stringSchema,
  comfort: stringSchema,
  views: stringSchema,
  temperature: stringSchema,
  music: stringSchema,
  lighting: stringSchema,
  distractions: stringSchema,
  crowdedness: stringSchema,
  proximityToAmenities: stringSchema,
  studyBreakFacilities: stringSchema,
});

export const spotNumberSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

const spotSchema = spotStringSchema
  .merge(spotNumberSchema)
  .merge(spotBooleanSchema);

export const createSpotSchemaServer = z.object({
  name: string().max(100).min(1, { message: "Required" }),
  description: string().max(2000).optional(),
  wifi: boolean(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  images: z
    .string()
    .array()
    .min(1, { message: "At least one image is required." }),
});

export const createSpotSchemaClient = createSpotSchemaServer.extend({
  images: FileListImagesSchema({ minFiles: 1 }),
});
