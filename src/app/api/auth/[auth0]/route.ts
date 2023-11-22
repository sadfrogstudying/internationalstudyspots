// import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
// import { type NextApiRequest, type NextApiResponse } from "next";

// const authOptions = {
//   async callback(req: NextApiRequest, res: NextApiResponse) {
//     try {
//       await handleCallback(req, res);
//     } catch (error) {
//       console.log(error);
//       res.redirect("/");
//     }
//   },
// };

// // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// export const GET = handleAuth(authOptions);

import { handleAuth } from "@auth0/nextjs-auth0";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GET = handleAuth();
