"use client";

import { ImageThatFadesIn } from "@/components/image-that-fades-in";
import type { StudySpotWithImage } from "@/types/payloads";

export default function Hero({ spot }: { spot: StudySpotWithImage }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {spot.images
          .filter((x) => x.featured)
          .map((image) => (
            <div className="relative aspect-[3/4]" key={image.id}>
              <ImageThatFadesIn
                className="object-cover"
                src={image.url}
                alt={`Image of ${spot?.name}`}
                sizes="(max-width: 767px) 50vw, 100vw"
                fill
                priority
              />
            </div>
          ))}
      </div>
    </>
  );
}
