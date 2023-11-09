import { z } from "zod";
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

export const createSpotSchemaServer = z.object({
  name: z.string().max(100).min(1, { message: "Required" }),
  description: z.string().max(2000).optional(),
  wifi: z.boolean(),
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
