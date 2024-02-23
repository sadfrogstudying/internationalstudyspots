"use client";

import { Skeleton } from "../ui/skeleton";

import { ImageThatFadesIn } from "@/components/image-that-fades-in";
import { api } from "@/trpc/react";

export default function Hero({ slug }: { slug: string }) {
  const { data: studySpot } = api.studySpot.bySlug.useQuery(slug);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {studySpot ? (
          studySpot?.images
            .filter((x) => x.featured)
            .map((image) => (
              <div className="relative aspect-[3/4]" key={image.id}>
                <ImageThatFadesIn
                  className="object-cover"
                  src={image.url}
                  alt={`Image of ${studySpot?.name}`}
                  sizes="(max-width: 767px) 50vw, 100vw"
                  fill
                  priority
                />
              </div>
            ))
        ) : (
          <>
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
            <Skeleton className="aspect-[3/4] w-full min-w-0" />
          </>
        )}
      </div>
    </>
  );
}
