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
