import { object, string, type z } from "zod";
import { FileListImagesSchema } from "./file-list-images";

const payload = object({
  username: string().min(1).max(30),
  description: string().max(2000).optional(),
  city: string().max(100).optional(),
  country: string().max(100).optional(),
  interests: string().max(500).optional(),
  occupation: string().max(100).optional(),
  tagline: string().max(100).optional(),
  profilePicture: string().url().optional(),
});

const createUserServerSchema = payload.extend({});
// const updateUserServerSchema = payload.partial();
// const getUserServerSchema = payload.required();
// const deleteUserServerSchema = z.void();

type CreateUserServer = z.infer<typeof createUserServerSchema>;
// type UpdateUserServer = z.infer<typeof updateUserServerSchema>;
// type GetUserServer = z.infer<typeof getUserServerSchema>;
// type DeleteUserServer = z.infer<typeof deleteUserServerSchema>;

const createUserClientSchema = payload.extend({
  profilePicture: FileListImagesSchema({ maxFiles: 1 }),
});
// const updateUserClientSchema = payload.partial();
// const getUserClientSchema = payload.required();
// const deleteUserClientSchema = z.void();

type CreateUserClient = z.infer<typeof createUserClientSchema>;
// type UpdateUserClient = z.infer<typeof updateUserClientSchema>;
// type GetUserClient = z.infer<typeof getUserClientSchema>;
// type DeleteUserClient = z.infer<typeof deleteUserClientSchema>;

export {
  // 💾 Server
  createUserServerSchema,
  // updateUserServerSchema,
  // getUserServerSchema,
  // deleteUserServerSchema,
  type CreateUserServer,
  // type UpdateUserServer,
  // type GetUserServer,
  // type DeleteUserServer,

  // 🧑‍💻 Client
  createUserClientSchema,
  // updateUserClientSchema,
  // getUserClientSchema,
  // deleteUserClientSchema,
  type CreateUserClient,
  // type UpdateUserClient,
  // type GetUserClient,
  // type DeleteUserClient,
};
