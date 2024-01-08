import { z, boolean, string } from "zod";
import { MAX_FEATURED_IMAGES } from "@/lib/constants";

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

const spotNumberSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

const baseSpotSchema = spotStringSchema
  .merge(spotNumberSchema)
  .merge(spotBooleanSchema);

const createSchema = baseSpotSchema.extend({
  images: z
    .object({
      url: string(),
      featured: boolean(),
    })
    .array()
    .min(1, { message: "At least one image is required." })
    .max(8, { message: "Maximum of 8 images." }),
});
type CreateInput = z.infer<typeof createSchema>;

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

const getPresignedUrlsSchema = baseSpotSchema.extend({
  images: z
    .object({
      contentLength: z.number(),
      contentType: string(),
    })
    .array()
    .max(8, { message: "Maximum of 8 images." }),
  id: z.number().optional(),
});
type GetPresignedUrlsInput = z.infer<typeof getPresignedUrlsSchema>;

const deleteSchema = z.object({ id: z.number(), token: z.string() });
type DeleteInput = z.infer<typeof deleteSchema>;

const updateSchemaBase = baseSpotSchema.extend({
  id: z.number(),
  images: z
    .object({
      newImages: z
        .array(
          z.object({
            url: z.string(),
            featured: z.boolean(),
          }),
        )
        .optional(),
      existingImages: z
        .array(
          z.object({
            url: z.string(),
            featured: z.boolean(),
            delete: z.boolean().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});
const updateSchema = updateSchemaBase.transform((val) => {
  return {
    ...val,
    canStudyForLong: val.canStudyForLong,
    sunlight: val.sunlight,
    drinks: val.drinks,
    food: val.food,
    naturalViews: val.naturalViews,
  };
});
type UpdateInput = z.infer<typeof updateSchema>;

const existingImagePayloadSchema = z.object({
  url: z.string(),
  featured: z.boolean(),
  delete: z.boolean().default(false),
});
type ExistingImagePayload = z.infer<typeof existingImagePayloadSchema>;

const newImagePayloadSchema = z.object({
  file: z.instanceof(Blob),
  featured: z.boolean(),
});
type NewImagePayload = z.infer<typeof newImagePayloadSchema>;

const imagePayloadSchema = z
  .object({
    newImages: z.array(newImagePayloadSchema).default([]),
    existingImages: z.array(existingImagePayloadSchema).default([]),
  })
  .refine(
    ({ newImages, existingImages }) => {
      return (
        [...newImages, ...existingImages].filter((image) => image.featured)
          .length <= MAX_FEATURED_IMAGES
      );
    },
    {
      message: `You can't have more than ${MAX_FEATURED_IMAGES} featured images.`,
      path: ["newImages"],
    },
  )
  .refine(
    ({ newImages }) => {
      return [...newImages].length <= 8;
    },
    {
      message: "You can't add more than 8 images.",
      path: ["newImages"],
    },
  )
  .refine(
    ({ newImages, existingImages }) => {
      const existingCount = [...existingImages].length;
      const deleteCount = [...existingImages].filter(
        (image) => image.delete,
      ).length;
      const addCount = [...newImages].length;

      return addCount - deleteCount + existingCount > 0;
    },
    {
      message: "The spot needs at least one image.",
      path: ["newImages"],
    },
  );

const createUpdateFormSchema = baseSpotSchema.extend({
  images: imagePayloadSchema,
  canStudyForLong: z.boolean().optional(),
  sunlight: z.boolean().optional(),
  drinks: z.boolean().optional(),
  food: z.boolean().optional(),
  naturalViews: z.boolean().optional(),
});
type CreateUpdateFormValues = z.infer<typeof createUpdateFormSchema>;

export {
  // Misc
  spotBooleanSchema,
  type SpotBooleanSchema,
  type ExistingImagePayload,
  type NewImagePayload,

  // Client
  createUpdateFormSchema,
  type CreateUpdateFormValues,

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
  updateSchema,
  type UpdateInput,
};
