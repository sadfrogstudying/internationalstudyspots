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

const stringSchema = string().max(100).min(1).optional();

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
  name: string().max(100).min(1, { message: "Name is required." }),
  website: stringSchema,
  description: string().max(2000).optional(),
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

export const imageSchema = z.object({
  images: z
    .string()
    .array()
    .min(1, { message: "At least one image is required." }),
});

export const spotNumberSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

const spotSchema = spotStringSchema
  .merge(imageSchema)
  .merge(spotNumberSchema)
  .merge(spotBooleanSchema);

export const createSpotSchemaServer = spotSchema;

export const createSpotSchemaClient = createSpotSchemaServer.extend({
  images: FileListImagesSchema({ minFiles: 1 }),
});
