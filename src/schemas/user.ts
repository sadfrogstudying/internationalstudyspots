import { object, string, type z } from "zod";
import { FileListImagesSchema } from "./file-list-images";

const payload = object({
  name: string().min(1).max(30),
  username: string().min(1).max(30),
  description: string().max(2000).optional(),
  city: string().max(100).optional(),
  country: string().max(100).optional(),
  interests: string().max(500).optional(),
  occupation: string().max(100).optional(),
  tagline: string().max(100).optional(),
  profileImage: string().url().optional(),
});

const updateUserServerSchema = payload.extend({});
// const updateUserServerSchema = payload.partial();
// const getUserServerSchema = payload.required();
// const deleteUserServerSchema = z.void();

type UpdateUserServer = z.infer<typeof updateUserServerSchema>;
// type UpdateUserServer = z.infer<typeof updateUserServerSchema>;
// type GetUserServer = z.infer<typeof getUserServerSchema>;
// type DeleteUserServer = z.infer<typeof deleteUserServerSchema>;

const updateUserClientSchema = payload.extend({
  profileImage: FileListImagesSchema({ maxFiles: 1 }),
});
// const updateUserClientSchema = payload.partial();
// const getUserClientSchema = payload.required();
// const deleteUserClientSchema = z.void();

type UpdateUserClient = z.infer<typeof updateUserClientSchema> & {
  profileImage: (File & { preview?: string })[];
};
// type UpdateUserClient = z.infer<typeof updateUserClientSchema>;
// type GetUserClient = z.infer<typeof getUserClientSchema>;
// type DeleteUserClient = z.infer<typeof deleteUserClientSchema>;

export {
  // 💾 Server
  updateUserServerSchema,
  // updateUserServerSchema,
  // getUserServerSchema,
  // deleteUserServerSchema,
  type UpdateUserServer,
  // type UpdateUserServer,
  // type GetUserServer,
  // type DeleteUserServer,

  // 🧑‍💻 Client
  updateUserClientSchema,
  // updateUserClientSchema,
  // getUserClientSchema,
  // deleteUserClientSchema,
  type UpdateUserClient,
  // type UpdateUserClient,
  // type GetUserClient,
  // type DeleteUserClient,
};
