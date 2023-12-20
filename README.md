# Notes

Get TRPC router outputs

```tsx
import { type RouterOutputs } from "@/trpc/shared";
type StudySpotAll = RouterOutputs["studySpot"]["getAll"];
```

Get the type of a prop in a React component in TypeScript

```tsx
import CustomComponent from "component-library";
import type { ComponentProps } from "react";

type PropType = ComponentProps<typeof CustomComponent>["propName"];
```

Get Prisma model type

```tsx
import { type StudySpot } from "@prisma/client";

const studySpots: StudySpot[] = [];
```

Wrapping/Mirroring a HTML Element

```tsx
// implementation
export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  specialProp?: string;
}
export function Button(props: ButtonProps) {
  const { specialProp, ...rest } = props;
  // do something with specialProp
  return <button {...rest} />;
}
```

Infer type from zod schema

```tsx
const spotBooleanSchema = z.object({
  powerOutlets: z.boolean(),
  wifi: z.boolean(),
});

type A = z.infer<typeof spotBooleanSchema>;
```

Prisma - filtering with `where` and `OR`

```ts
const spots = await getManyHandler(ctx.db, {
  ...(cursor && { skip: 1, cursor: { id: cursor } }),
  ...(where && {
    where: {
      where.powerOutlets: true,
      OR: [
        {
          country: {
            equals: "Australia",
          },
        },
        { country: { equals: "Japan" } },
      ],
    },
  }),
});
```

**Infer type from TRPC router** - @trpc/server exports the following helper types to assist with inferring these types from the AppRouter exported by your @trpc/server router ([docs](https://trpc.io/docs/client/vanilla/infer-types)):

inferRouterInputs<TRouter>
inferRouterOutputs<TRouter>

```ts
// @filename: client.ts
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type PostCreateInput = RouterInput["post"]["create"];

type PostCreateInput = {
  title: string;
  text: string;
};
type PostCreateOutput = RouterOutput["post"]["create"];
```

## Useful Links

- [Docs: Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#options)
- [Issue: Full Route Cache as a default](https://github.com/t3-oss/create-t3-app/issues/1663)
