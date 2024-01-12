import { object, string, number, type z } from "zod";
import { FileListImagesSchema } from "./file-list-images";

const payload = object({
  name: string().min(1).max(30),
  username: string().min(1).max(30).regex(new RegExp("^[a-zA-Z0-9_-]{3,15}$"), {
    message:
      "Invalid username.  Can only contain letters, numbers, underscores (_), and hyphens (-).  Must be between 3 - 16 characters.",
  }),
  description: string().max(2000).optional(),
  city: string().max(100).optional(),
  country: string().max(100).optional(),
  interests: string().max(500).optional(),
  occupation: string().max(100).optional(),
  tagline: string().max(100).optional(),
  profileImage: string().url().optional(),
});

const getSchema = string();
type GetInput = z.infer<typeof getSchema>;

const updateUserServerSchema = payload.extend({});
type UpdateUserServer = z.infer<typeof updateUserServerSchema>;

const getPresignedUrlSchema = updateUserServerSchema.extend({
  profileImage: object({
    contentLength: number(),
    contentType: string(),
  }).optional(),
});
type GetPresignedUrlInput = z.infer<typeof getPresignedUrlSchema>;

/** NextAuth's Prisma Adapter won't pass an initial profileImage, so need to omit */
const createSchema = updateUserServerSchema.omit({ profileImage: true });
type CreateInput = z.infer<typeof createSchema>;

const updateUserClientSchema = payload.extend({
  profileImage: FileListImagesSchema({ maxFiles: 1 }),
});

type UpdateUserClient = z.infer<typeof updateUserClientSchema>;

export {
  // 💾 Server
  getSchema,
  type GetInput,
  updateUserServerSchema,
  type UpdateUserServer,
  getPresignedUrlSchema,
  type GetPresignedUrlInput,
  createSchema,
  type CreateInput,

  // 🧑‍💻 Client
  updateUserClientSchema,
  type UpdateUserClient,
};
