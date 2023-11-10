"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import { Separator } from "../ui/separator";

interface Props {
  slug: string;
}

export default function StudySpotDetail({ slug }: Props) {
  const { data } = api.studySpot.bySlug.useQuery(slug, {
    refetchOnWindowFocus: false,
  });

  const ignoredKeys = ["id", "slug", "images", "createdAt", "updatedAt"];

  const list = Object.entries(data ?? {}).filter(
    (entry) => !ignoredKeys.includes(entry[0]),
  );

  return (
    <div className="space-y-12 p-4">
      <div className="text-lg font-bold">{data?.name}</div>
      <div className="grid grid-cols-5 gap-4">
        {data?.images
          .slice(0, 5)
          .map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt={`Image of ${data?.name}`}
              width={image.width}
              height={image.height}
              className="aspect-[3/4] w-full min-w-0 object-cover"
              sizes="(max-width: 1024px) 40vw, 22vw"
            />
          ))}
      </div>

      <div>
        <Separator />
        {data && (
          <>
            <strong>
              {data?.city}, {data?.country}
            </strong>
            <p>{data?.address}</p>
            <h1>{data?.name}</h1>
            <p>{data?.description}</p>
          </>
        )}
      </div>

      <div>
        <Separator />

        <ul className="w-full overflow-hidden">
          {list.map((x, i) => (
            <li key={`detail-row-${i}`} className="flex flex-wrap">
              <div className="w-48 flex-shrink-0 font-bold">{x[0]}</div>
              <div className="w-1/2">{x[1]?.toString()}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Separator />
        <div className="space-y-4">
          <i className="block"> page slug: {slug}</i>
        </div>
      </div>
    </div>
  );
}
