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

/** 191 is max length string for Prisma (varchar(191)) */
const stringSchema = string().max(180).optional();

const spotBooleanSchema = z.object({
  powerOutlets: boolean(),
  wifi: boolean(),
  canStudyForLong: boolean().optional(),
  sunlight: boolean().optional(),
  drinks: boolean().optional(),
  food: boolean().optional(),
  naturalViews: boolean().optional(),
});
type SpotBooleanSchema = z.infer<typeof spotBooleanSchema>;

const spotStringSchema = z.object({
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

const imageSchema = z.object({
  images: z
    .string()
    .array()
    .min(1, { message: "At least one image is required." })
    .max(8, { message: "Maximum of 8 images." }),
});

const spotNumberSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

const spotSchema = spotStringSchema
  .merge(imageSchema)
  .merge(spotNumberSchema)
  .merge(spotBooleanSchema);

const createSchema = spotSchema;
type CreateInput = z.infer<typeof createSchema>;

const createSpotSchemaClient = createSchema.extend({
  images: FileListImagesSchema({ minFiles: 1 }),
});

type CreateSpotFormValues = z.infer<typeof createSpotSchemaClient>;

const getAllSchema = z
  .object({
    cursor: z.number().optional(),
    where: spotBooleanSchema.partial().optional(),
    take: z.number().optional(),
  })
  .optional();
type GetAllInput = z.infer<typeof getAllSchema>;

const bySlugSchema = z.string();
type BySlugInput = z.infer<typeof bySlugSchema>;

const getPresignedUrlsSchema = spotSchema.extend({
  images: z
    .object({
      contentLength: z.number(),
      contentType: string(),
    })
    .array()
    .min(1, { message: "At least one image is required." })
    .max(8, { message: "Maximum of 8 images." }),
});
type GetPresignedUrlsInput = z.infer<typeof getPresignedUrlsSchema>;

const deleteSchema = z.object({ id: z.number(), token: z.string() });
type DeleteInput = z.infer<typeof deleteSchema>;

export {
  spotBooleanSchema,
  type SpotBooleanSchema,
  spotStringSchema,
  imageSchema,
  spotNumberSchema,
  spotSchema,
  createSpotSchemaClient,
  type CreateSpotFormValues,

  // Server
  getAllSchema,
  type GetAllInput,
  bySlugSchema,
  type BySlugInput,
  createSchema,
  type CreateInput,
  getPresignedUrlsSchema,
  type GetPresignedUrlsInput,
  deleteSchema,
  type DeleteInput,
};
