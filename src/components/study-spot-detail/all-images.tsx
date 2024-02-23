"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ImageThatFadesIn } from "@/components/image-that-fades-in";
import { api } from "@/trpc/react";

export default function AllImages({ slug }: { slug: string }) {
  const { data: spot } = api.studySpot.bySlug.useQuery(slug);

  return (
    <div className="grid h-fit grid-cols-3 gap-2 md:grid-cols-5">
      {spot ? (
        spot?.images.slice(0, 15).map((image) => {
          return (
            <div
              className="relative aspect-square bg-neutral-100"
              key={`all-images-item-${image.id}`}
            >
              <ImageThatFadesIn
                src={image.url}
                alt={`Image of ${spot?.name}`}
                className="object-contain p-4"
                fill
                sizes="(max-width: 767px) 33vw, 12.5vw"
                priority={false}
              />
            </div>
          );
        })
      ) : (
        <>
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
          <Skeleton className="aspect-square w-full min-w-0" />
        </>
      )}
    </div>
  );
}
